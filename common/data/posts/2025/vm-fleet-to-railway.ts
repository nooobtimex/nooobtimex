import type { PostDef } from '../../../interfaces'

/** Sources: the looklook-pet 2025-11-07 milestone + project description in common/data/projects.ts, and the jasmine-tech entry in common/data/experiences.ts. */
export const vmFleetToRailway: PostDef = {
	id: 'vm-fleet-to-railway',
	title: 'Retiring self-managed VMs and CircleCI + SSH for Railway across a fleet',
	happenedAt: '2025-11-07',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'scale',
	series: { id: 'looklook', part: 2 },
	category: 'infrastructure',
	description:
		'Moving a fleet of 15+ services off self-managed VMs and CircleCI + SSH onto Railway, and what config-as-code changes about who owns a host.',
	tldr: "On 7 November 2025 we retired the self-managed [[skill:tencent-cloud]] VMs behind a 15+ service platform, along with their CircleCI and SSH deploy pipelines, and moved every service to [[skill:railway]] built from its own Dockerfile. The real change was not the hosting bill — it was that the definition of a running service moved from a long-lived machine's accumulated state into a file in the repo. An SSH pipeline deploys **to** a host you maintain; config-as-code rebuilds the host from the commit.",
	skills: ['railway', 'docker', 'tencent-cloud', 'circleci', 'nest-js'],
	relatedProjectIds: ['looklook-pet'],
	relatedExperienceIds: ['jasmine-tech'],
	relatedEntityIds: ['jasmine-technology-solution'],
	body: [
		{
			kind: 'p',
			text: 'Eight days after [taking the message bus out of the internal request path](/blog/replaced-nats-with-http), we changed where all of it ran. On 7 November 2025 the [[project:looklook-pet]] fleet came off self-managed Tencent Cloud VMs and their CircleCI plus SSH deploy pipelines, and onto Railway, with every service built from a Dockerfile as config-as-code.'
		},
		{
			kind: 'p',
			text: 'The VMs were not a bad decision. Self-managed instances in a nearby region give you full control of the kernel, the runtime, the disk and the bill, and they were carrying a real product. But we had more than fifteen services and a small team, and the scarce resource on that team was attention, not CPU.'
		},
		{ kind: 'h2', text: 'What an SSH pipeline actually is' },
		{
			kind: 'p',
			text: 'The shape is familiar to anyone who has shipped this way. CI checks out the commit, installs, builds, produces an artifact, then opens an SSH session to a known host and does the last mile there: pull, install, restart the process manager, maybe reload a reverse proxy. It works. It is also, quietly, two different systems pretending to be one.'
		},
		{
			kind: 'p',
			text: "The repository describes how to build the code. The host describes how to run it — and the host's description exists only on the host. Nothing in the commit says which Node version is installed, which environment variables were exported last March, which service is bound to which port, or that someone once installed a system package by hand at two in the morning to unblock a release."
		},
		{
			kind: 'list',
			items: [
				'**Hosts drift.** Two machines provisioned from the same runbook six months apart are not the same machine, and the difference surfaces at the worst moment.',
				'**Rollback is a re-run, not a revert.** Going back a version means re-running an older pipeline against the same mutable box and hoping it lands the same way.',
				'**Credentials live in two places.** CI needs deploy keys to reach the host; the host holds the environment file. Rotating either is a manual errand nobody schedules.',
				'**The pipeline is a script, not a contract.** It encodes assumptions about the host it targets, so "add a service" means "copy the script and edit the parts that matter", which is how fleets grow inconsistencies.'
			]
		},
		{ kind: 'h2', text: 'Config as code, one service at a time' },
		{
			kind: 'p',
			text: 'The move was deliberately boring: give every service a Dockerfile, point the platform at the repository, and [let the build be the deploy](https://docs.railway.com/builds/dockerfiles). The Dockerfile becomes the single description of the runtime — base image, install, build, the command that starts the process — and it is reviewed like any other file, in the same pull request as the code that depends on it.'
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption:
				'Illustrative — the shape of a per-service Dockerfile: build in one stage, run a slim image in the next.',
			code: 'FROM node:22-slim AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-slim\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nCOPY --from=build /app/node_modules ./node_modules\nCMD ["node", "dist/main.js"]'
		},
		{
			kind: 'p',
			text: 'The second half is the platform config living in the repo too, next to that Dockerfile — the builder, the health check path, the restart policy. Committing it is what makes the setting reviewable and, more importantly, reproducible: a service redeployed from the same commit gets the same configuration, because the configuration is part of the commit rather than a form someone filled in once.'
		},
		{
			kind: 'code',
			lang: 'toml',
			caption: 'Illustrative — per-service platform config kept in the repository rather than in a dashboard.',
			code: '[build]\nbuilder = "dockerfile"\ndockerfilePath = "Dockerfile"\n\n[deploy]\nhealthcheckPath = "/health"\nrestartPolicyType = "on_failure"\nrestartPolicyMaxRetries = 3'
		},
		{
			kind: 'p',
			text: 'Doing this a week after the transport change turned out to matter more than I expected. When every internal call goes through a shared message bus, moving one service means the bus has to be reachable from wherever that service now lives, so the fleet wants to move as a unit. Once the internal calls were plain HTTP between named services, each one only needed a URL for its dependencies — which meant the migration could go service by service, with the two worlds talking to each other across the gap while it happened.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The port is injected, not chosen',
			text: 'The one habit that does not survive the move is hard-coding a port. A managed platform injects `PORT` and health-checks the address it injected, so a service that binds its own number looks dead even when it is running perfectly. Read the environment, fall back to a default only for local development, and never let a committed env file shadow the injected value.'
		},
		{
			kind: 'stat',
			value: '15+',
			label: 'services moved from self-managed VMs to per-service Dockerfile deploys',
			source: 'LOOKLOOK PET project record, nooobtimex.me'
		},
		{ kind: 'h2', text: 'What we gave up' },
		{
			kind: 'p',
			text: 'This is not a free trade, and I would rather name the costs than pretend the decision was obvious. You give up the root shell. When something misbehaves you can no longer log into the box, read a file, strace a process and see for yourself; you get logs, metrics and a redeploy. You give up predictable cost shape — a VM is a flat monthly line, while a per-service platform is a usage curve that has to be watched. You take on a dependency you do not control, and image builds land in the deploy path, so a slow build is now a slow release.'
		},
		{
			kind: 'p',
			text: 'You also accept a real migration cost. Every service needs its Dockerfile written and its environment re-declared, and the fleet spends a window in two worlds at once. None of that is glamorous, and none of it is optional.'
		},
		{
			kind: 'p',
			text: 'What decided it was the failure mode we kept having versus the one we would have instead. Self-managed hosts fail as drift — invisible, cumulative, and discovered during an incident. Config-as-code fails as a build error, which is loud, immediate, and attached to a commit and an author. I will take a loud failure over a quiet one nearly every time, and on a fleet that size the arithmetic is not close.'
		},
		{
			kind: 'p',
			text: 'The other thing it bought was permission to add services without ceremony. A month later that mattered: standing up a [[skill:medusa]] multi-vendor marketplace alongside the existing platform was a new repo and a new service rather than a new host to provision, which is the next post in this series.'
		}
	],
	lessons: [
		'I stopped treating deployment config as ops trivia. If a setting decides whether the service runs, it belongs in the repository, in the same pull request as the code that needs it.',
		'The value of a managed platform is not that it is cheaper — often it is not. It is that it converts slow, invisible host drift into fast, visible build failures, and a small team can only afford to debug the visible kind.',
		'I would write the Dockerfiles before the migration window rather than during it. The transport change the week before was reversible in an afternoon; a half-migrated fleet is not, and I underestimated how much of the work was mechanical rather than clever.'
	],
	faqs: [
		{
			q: 'Why move from self-managed VMs to a managed platform like Railway?',
			a: 'Because the definition of a running service moves from a long-lived machine into the repository. With a Dockerfile and a committed platform config, any deploy of a given commit reproduces the same runtime, and configuration changes get code review. The trade is losing shell access and a flat monthly cost line in exchange for eliminating host drift.'
		},
		{
			q: 'What is wrong with CircleCI plus SSH deployments?',
			a: "Nothing, until the fleet grows. An SSH pipeline builds an artifact and then mutates a host you maintain separately, so the runtime's real definition lives on the machine rather than in the commit. That makes rollbacks a pipeline re-run instead of a revert, spreads credentials across CI and the host, and lets identically provisioned machines drift apart over months."
		},
		{
			q: 'Do I need a Dockerfile per service to deploy on Railway?',
			a: 'No — buildpack-style detection will get most Node or Python services running with no Dockerfile at all. A Dockerfile is worth writing when you want the runtime pinned explicitly, need system packages, or want the same image to build identically on a laptop and in CI. For a fleet of similar services, one reviewed Dockerfile pattern is easier to keep consistent than a detected build.'
		},
		{
			q: 'How do you avoid the healthcheck hanging after a migration?',
			a: "Bind to the injected `PORT` environment variable rather than a hard-coded number, and make sure no committed environment file overrides it — an env file baked into the image will shadow the platform's injected value and the health check will never find the process. Expose a cheap health endpoint that does not depend on downstream services, or a slow dependency will fail your own deploy."
		}
	],
	sources: [
		{
			title: 'Railway — Deploying with Dockerfiles',
			url: 'https://docs.railway.com/builds/dockerfiles'
		},
		{
			title: 'Docker — Multi-stage builds',
			url: 'https://docs.docker.com/build/building/multi-stage/'
		}
	]
}
