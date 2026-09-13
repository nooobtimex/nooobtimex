import type { PostDef } from '../../../interfaces'

/** Sources: the online-poker-game timeline in common/data/projects.ts (2025-06-09 kickoff, 2025-06-11 "Realtime — Rooms over Server-Sent Events", 2026-02-03 scale-out), the project description, and common/data/experiences.ts for the dates around it. Transport tradeoffs are general knowledge. */
export const sseGameRoomsNotWebsockets: PostDef = {
	id: 'sse-game-rooms-not-websockets',
	title: 'Server-Sent Events for realtime game rooms — why not WebSockets',
	happenedAt: '2025-06-11',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'nextjs',
	description:
		'Why I streamed poker room state over Server-Sent Events instead of WebSockets: one-way push, reconnects for free, and the costs I accepted.',
	tldr: 'A poker table pushes far more than it receives, so I streamed room state to every player over **Server-Sent Events** and left player actions as ordinary HTTP POSTs. `EventSource` gives you automatic reconnection, plain `text/event-stream` over HTTP, and no upgrade handshake to babysit. The cost is real: one direction only, a per-origin connection cap on HTTP/1.1, and a long-lived connection whose fan-out lives in one process — which is exactly the limit I had to re-architect around later.',
	skills: ['sse', 'next-js', 'typescript', 'react'],
	relatedProjectIds: ['online-poker-game'],
	relatedExperienceIds: ['freelance'],
	body: [
		{
			kind: 'p',
			text: "On 11 June 2025, two milestones landed on [[project:online-poker-game]] on the same day. One was the hand evaluator, which I wrote test-first and covered in [test-driving a poker hand evaluator](/blog/tdd-poker-hand-evaluator). The other was realtime: streaming live room state to every player at the table. I had started the project on 1 March and kicked the Texas Hold'em build off two days earlier, on 9 June. My days at that point belonged to my family's trophy factory, where I had just moved from part-time to full-time; the poker build was freelance work in the hours around it."
		},
		{
			kind: 'p',
			text: 'The default answer to realtime multiplayer is WebSockets. I did not take it. Before picking a transport I wrote down what actually crosses the wire at a poker table, and the traffic turned out to be extremely lopsided.'
		},
		{ kind: 'h2', text: 'The traffic is not symmetric' },
		{
			kind: 'p',
			text: 'Everything interesting at a table is the server telling you something changed. The client, meanwhile, speaks rarely: a few discrete decisions per hand, each one a thing the player deliberately clicked.'
		},
		{
			kind: 'list',
			items: [
				'**Server to client, constantly:** whose turn it is, the current bet, chips moving, community cards, timers, players joining or sitting out, the showdown.',
				'**Client to server, rarely:** fold, check, call, bet, raise, sit down, sit out. Under a dozen messages in a whole hand.',
				'**Each client action needs a reply anyway:** was it legal, did it land, whose turn is it now.'
			]
		},
		{
			kind: 'p',
			text: 'That last point is what settled it. A player action is a request with a result, not a fire-and-forget message. Sending it as an HTTP `POST` to a route handler gives me a status code, a response body, a normal error path, and idempotency handling for the double-click — all things I would have had to rebuild inside a socket protocol. So writes stay HTTP, and the only thing that needs a persistent channel is the one-way state push.'
		},
		{
			kind: 'p',
			text: '[Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) is exactly that shape: a one-way stream of text events over an ordinary HTTP response that never ends.'
		},
		{ kind: 'h2', text: 'What SSE gives you for free' },
		{
			kind: 'list',
			items: [
				'**Automatic reconnection.** The browser owns the retry loop. A dropped connection reconnects without a line of my code, and the server can tune the delay by sending a `retry:` field.',
				'**Resumption is built into the protocol.** Each event may carry an `id:`, and the browser sends it back as `Last-Event-ID` when it reconnects.',
				'**It is just HTTP.** No upgrade handshake, no separate server, no protocol that intermediaries treat as exotic. Cookies, redirects, and status codes all behave normally.',
				'**The payload is human-readable.** `curl` shows you the exact stream a player is receiving, which made debugging a mis-projected table state a two-second check.'
			]
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the shape of an SSE route handler in the App Router.',
			code: 'const enc = new TextEncoder()\n\nexport function GET(req: Request) {\n\tconst stream = new ReadableStream({\n\t\tstart(c) {\n\t\t\tconst send = (event: string, data: unknown) =>\n\t\t\t\tc.enqueue(enc.encode(`event: ${event}\\ndata: ${JSON.stringify(data)}\\n\\n`))\n\n\t\t\tsend("snapshot", snapshotFor(seat))\n\t\t\tconst stop = room.subscribe(s => send("state", stateFor(seat, s)))\n\t\t\treq.signal.addEventListener("abort", stop)\n\t\t}\n\t})\n\treturn new Response(stream, { headers: { "content-type": "text/event-stream" } })\n}'
		},
		{
			kind: 'p',
			text: 'The first thing the stream sends is a full snapshot, not a delta. A poker table holds a handful of seats, a board of at most five cards, and a pot — small enough that sending the whole thing on every connect is cheaper to reason about than maintaining a replay log the client can rejoin. Reconnection then stops being a special case: a returning player gets the same snapshot a new one does, and the only state the client keeps is what the server just told it.'
		},
		{ kind: 'h2', text: 'The costs I signed up for' },
		{
			kind: 'p',
			text: 'This is where I have to argue against my own choice, because SSE is not free and the limits are structural rather than cosmetic.'
		},
		{
			kind: 'list',
			items: [
				'**One direction, always.** Anything the client sends needs a second mechanism. That is fine when writes are rare and want a response; it would be miserable for high-frequency input.',
				'**The per-origin connection cap.** Over HTTP/1.1 browsers allow roughly six concurrent connections per origin, and an open stream holds one of them for as long as the tab lives. Over HTTP/2 the stream multiplexes and the problem mostly evaporates — but that means the transport quietly depends on how the app is served.',
				'**Text only.** No binary frames. For JSON table state that is a non-issue, and it would be a real one for anything media-shaped.',
				'**Long-lived connections need a host that tolerates them.** A stream that never ends is the opposite of what request-scoped serverless billing and idle timeouts are designed for.'
			]
		},
		{
			kind: 'p',
			text: 'The deepest cost is not in the protocol at all. `room.subscribe` in that handler is an in-memory fan-out: the set of open streams lives in one Node process, so every player at a table has to be connected to the same instance. That is perfectly fine for one box and a fatal assumption the moment there are two. In February 2026 I re-architected the project around exactly that — containerized deploy, a [[skill:bullmq]] job queue, persisted game logs, and [[skill:redis]]-backed realtime with retries. The transport survived that change unaltered. The naive fan-out did not.'
		},
		{ kind: 'h2', text: 'When I would still reach for WebSockets' },
		{
			kind: 'p',
			text: "If the client had needed to send at anything like the rate the server sends — live typing indicators, dragging chips, cursor positions, voice — the second channel would have been the wrong shape and I would have wanted one socket carrying both directions. The same goes for binary payloads and for protocols where the client drives the conversation. My rule after this build is narrow and I would defend it: if the client's writes are discrete decisions that each deserve a response, keep them on HTTP and let [[skill:sse]] carry the push."
		},
		{
			kind: 'p',
			text: 'One thing the transport choice decided for me, which I did not appreciate on 11 June: a native `EventSource` cannot send custom headers, so a bearer token cannot ride the stream. Cookies can. That constraint is most of the reason the auth I added two months later came out the way it did, which is its own post.'
		}
	],
	lessons: [
		'I now pick a transport from the shape of the traffic, not from the category of the app. "Realtime multiplayer" implies WebSockets only if the traffic is actually bidirectional.',
		'Free reconnection was worth more than raw latency. Most of the failure modes in a long-lived connection are reconnect bugs, and SSE hands that loop to the browser.',
		'The transport was never the scaling limit — my in-memory subscriber set was. I should have named that assumption in a comment on day one instead of discovering it when I containerized the thing.'
	],
	faqs: [
		{
			q: 'Is SSE good enough for a realtime multiplayer game?',
			a: 'It depends entirely on the direction of the traffic. For a turn-based game like poker, where the server pushes constantly and the client sends a handful of deliberate actions per hand, SSE carries the push and plain HTTP requests carry the actions. For games with continuous client input — movement, dragging, voice — a bidirectional WebSocket is the right shape.'
		},
		{
			q: 'What does SSE give you that WebSockets do not?',
			a: 'Automatic reconnection handled by the browser, event resumption via the `Last-Event-ID` header, and the fact that it is ordinary HTTP — so cookies, proxies, status codes, and `curl` all keep working. A WebSocket requires an upgrade handshake and leaves the reconnect and resume logic to you.'
		},
		{
			q: 'How do you authenticate a Server-Sent Events stream?',
			a: "With cookies. The browser's native `EventSource` cannot set custom headers, so an `Authorization: Bearer` token cannot be attached to the connection. A session cookie rides along automatically, which is why cookie-backed sessions are the natural fit for an SSE-based app."
		},
		{
			q: 'What is the browser connection limit for Server-Sent Events?',
			a: 'Over HTTP/1.1, browsers allow roughly six concurrent connections per origin, and each open stream occupies one for the lifetime of the tab — so a few tabs of the same app can starve each other. Over HTTP/2 the streams are multiplexed on one connection and the cap is far higher, so how the app is served matters as much as the client code.'
		}
	],
	sources: [
		{
			title: 'MDN — Using server-sent events',
			url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events'
		},
		{
			title: 'WHATWG HTML Standard — Server-sent events',
			url: 'https://html.spec.whatwg.org/multipage/server-sent-events.html'
		}
	]
}
