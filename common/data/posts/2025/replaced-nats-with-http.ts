import type { PostDef } from '../../../interfaces'

/** Sources: the looklook-pet 2025-10-30 milestone + project description in common/data/projects.ts, and the jasmine-tech entry in common/data/experiences.ts. */
export const replacedNatsWithHttp: PostDef = {
	id: 'replaced-nats-with-http',
	title: 'We replaced a NATS message bus with plain HTTP calls',
	happenedAt: '2025-10-30',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'scale',
	series: { id: 'looklook', part: 1 },
	category: 'engineering',
	description:
		'Why 15+ NestJS services dropped a NATS bus for direct HTTP on the internal request path, and what a message bus really charges you.',
	tldr: "On 30 October 2025 we took the [[skill:nats]] / JetStream message bus out of the internal BFF-to-service path on a platform of 15+ NestJS services and replaced it with direct HTTP calls. Almost all of that traffic was request/reply — one caller, one responder, an answer needed now — which is an RPC wearing an event's clothes. HTTP handed that traffic back its status codes, per-endpoint timeouts and a URL you can `curl`. The genuinely asynchronous work did not move; it already lived on a job queue.",
	skills: ['nest-js', 'nats', 'node-js', 'bullmq'],
	relatedProjectIds: ['looklook-pet'],
	relatedExperienceIds: ['jasmine-tech'],
	relatedEntityIds: ['jasmine-technology-solution'],
	body: [
		{
			kind: 'p',
			text: 'I joined Jasmine Technology Solution on 16 July 2025 as lead full-stack developer on [[project:looklook-pet]] — a pet-parent community and B2B2C multi-vendor marketplace, with a Next.js storefront, a B2B partner console, a Flutter customer app, and more than fifteen NestJS services behind all of them. The services addressed each other over a NATS message bus with JetStream. On 30 October, a hundred and six days in, we pulled the bus out of the internal request path and put direct HTTP calls there instead.'
		},
		{
			kind: 'p',
			text: 'This post is not a verdict on NATS. [NATS](https://docs.nats.io/learn/core-nats/) is very good at the thing it is for. It is a note on the question I did not ask carefully enough when the architecture was drawn: what shape is the traffic actually going to be?'
		},
		{ kind: 'h2', text: 'What the bus was really carrying' },
		{
			kind: 'p',
			text: 'A message bus buys you a specific set of properties. Publishers do not know their subscribers, so you can fan one event out to many services and add a new listener without redeploying the publisher. With JetStream on top you also get persistence, replay and at-least-once delivery, so a consumer that was down during a burst can catch up afterwards. Those are real, and they are hard to rebuild by hand.'
		},
		{
			kind: 'p',
			text: 'The problem was that our internal traffic barely used any of it. Overwhelmingly it looked like this: the backend-for-frontend needed one record from one service, right now, to finish rendering a response a human was waiting on. One caller. One responder. A synchronous answer. That is a remote procedure call, and NATS request/reply will carry it — but carrying it is not the same as being the right shape for it.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the same lookup as a bus request/reply and as a direct HTTP call.',
			code: "// Over the bus: the contract is a subject string.\nconst place = await firstValueFrom(this.client.send('places.findOne', { id }))\n\n// Over HTTP: the contract is a URL, a verb and a status code.\nconst place = await firstValueFrom(\n\tthis.http.get(`${PLACES_URL}/places/${id}`).pipe(map(r => r.data))\n)"
		},
		{ kind: 'h2', text: 'The bill a bus sends you' },
		{
			kind: 'p',
			text: 'The two lines above look equivalent. They are not, and the difference is almost entirely in what happens when something goes wrong.'
		},
		{
			kind: 'list',
			items: [
				'**The contract is a string.** `places.findOne` is not a type, a route or a compile-time anything. Rename it on one side and nothing fails until runtime — and then it fails as a timeout, not as an error that names itself.',
				'**Failure arrives blurred.** HTTP tells you 404 versus 500 versus connection-refused. A request/reply timeout tells you that nobody answered, and leaves you to work out whether the responder was down, wrong, slow, or listening on a subject nobody publishes to.',
				'**You cannot `curl` a subject.** Reproducing one internal call meant a client, credentials and a script, which pushes debugging toward reading logs rather than poking the thing directly.',
				'**Everything sits behind one dependency.** Every internal call in the platform shared a single piece of infrastructure. That is fine when the bus is healthy and total when it is not.',
				'**Two servers per service.** Each NestJS service booted an HTTP server for its own health and a microservice listener for the bus, so every service had two front doors, two failure modes and two things to configure.'
			]
		},
		{
			kind: 'stat',
			value: '15+',
			label: 'NestJS services on the platform — all of them previously reachable only through the bus',
			source: 'LOOKLOOK PET project record, nooobtimex.me'
		},
		{ kind: 'h2', text: 'What direct HTTP gave back' },
		{
			kind: 'p',
			text: 'Moving the request path to HTTP was, in the end, unglamorous. Each service already ran an HTTP server. Each already had a health endpoint. The work was expressing the existing subjects as routes, giving each caller a base URL, and deleting the microservice bootstrap.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — a NestJS service bootstrap before and after the transport change.',
			code: '// Before: an HTTP server for health, plus a bus listener for the real work.\napp.connectMicroservice({ transport: Transport.NATS, options: { servers: [NATS_URL] } })\nawait app.startAllMicroservices()\nawait app.listen(process.env.PORT ?? 3000)\n\n// After: one server, one protocol, one thing to health-check.\nawait app.listen(process.env.PORT ?? 3000)'
		},
		{
			kind: 'p',
			text: 'What that bought was ordinary and useful. Status codes that distinguish a missing record from a broken service. Timeouts and retries set per call site rather than globally, so a slow analytics lookup cannot be given the same patience as a checkout read. Requests that reproduce in one terminal line. And tracing, logging and error reporting that work out of the box, because every tool in the ecosystem already understands HTTP.'
		},
		{
			kind: 'callout',
			tone: 'info',
			title: 'The transport is not the architecture',
			text: 'Nothing about this change merged services, moved code between them, or altered a single boundary. The services stayed exactly as separate as they were. Only the wire between them changed — which is worth saying out loud, because "we removed the message bus" gets heard as "we went back to a monolith", and it is not the same sentence.'
		},
		{ kind: 'h2', text: 'The case against my own change' },
		{
			kind: 'p',
			text: 'Direct HTTP calls couple caller to callee at the network level. The caller now needs to know where the responder lives, and it will feel the responder being slow. Add a sixteenth service that wants to react to an existing event and there is no bus to subscribe to — you edit the publisher. Lose an in-flight call and it is lost, because there is no stream to replay it from. Every one of those is a genuine cost, and on a platform with heavy fan-out or long-running sagas they would have outweighed the benefit.'
		},
		{
			kind: 'p',
			text: 'The reason they did not outweigh it here is that the asynchronous work was never on the bus in the first place. Background jobs, retries and deferred processing already ran on [[skill:bullmq]] over Redis, where the queue is inspectable and a failed job is a row you can look at. The bus was doing double duty: a job queue for work that already had a job queue, and an RPC layer for work that wanted to be RPC. Removing it did not remove a capability. It removed a second, less specific copy of one we were already using.'
		},
		{
			kind: 'p',
			text: 'The honest summary is that we adopted a technology for the system we might become and paid for it in the system we actually had. If real event fan-out arrives later, a bus comes back — for events, alongside HTTP, not underneath every internal call. Eight days after this change we retired the self-managed VMs the whole fleet ran on, which is [the next post in this series](/blog/vm-fleet-to-railway).'
		}
	],
	lessons: [
		"I now pick a transport from the traffic's shape, not the architecture diagram's. Request/reply over a bus is an RPC with the debugging tools removed, and the shape is knowable early if you ask.",
		'Removing a dependency is a feature. One less piece of infrastructure meant one less thing to run, secure, upgrade and explain to whoever is on call — and that value never shows up in a benchmark.',
		'Stringly-typed contracts are the part I would fix first next time. Whether the wire is a bus or HTTP, a subject or a path that only exists as a string literal on both sides will eventually drift apart in silence.'
	],
	faqs: [
		{
			q: 'When should microservices use a message bus instead of HTTP?',
			a: "Use a bus when the traffic is genuinely event-shaped: one publisher, several interested consumers, no caller waiting on the result, and value in persistence or replay. Use direct HTTP when a single caller needs a single answer synchronously. If most of your bus traffic is request/reply, you are paying a bus's operational cost for an RPC's semantics."
		},
		{
			q: 'What do you lose by replacing NATS request/reply with HTTP calls?',
			a: "You lose location transparency, fan-out to new subscribers without touching the publisher, and any persistence or replay the streaming layer provided. You also couple the caller to the callee's availability and latency. In exchange you get status codes, per-call timeouts, standard tracing, and requests you can reproduce with `curl`."
		},
		{
			q: 'Does dropping the message bus mean going back to a monolith?',
			a: 'No. Changing the transport between services does not merge them. The service boundaries, deployments and data ownership stay exactly where they were; only the wire protocol changes. A monolith is a decision about code and deployment units, not about whether calls travel over a bus or over HTTP.'
		},
		{
			q: 'How do you handle background jobs after removing the message bus?',
			a: 'Put them on a real job queue rather than a general-purpose bus. On this platform the asynchronous work already ran on BullMQ over Redis, so removing the bus took nothing away — a queue gives you inspectable jobs, explicit retry and backoff policies, and a dead-letter path, all of which are easier to reason about than a stream consumer for the same purpose.'
		}
	],
	sources: [
		{
			title: 'NestJS — NATS transporter',
			url: 'https://docs.nestjs.com/microservices/nats'
		},
		{
			title: 'NATS — Core NATS',
			url: 'https://docs.nats.io/learn/core-nats/'
		}
	]
}
