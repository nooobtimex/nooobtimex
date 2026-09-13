import type { PostDef } from '../../../interfaces'

// Sources: Dockerfile, .dockerignore, railway.toml, next.config.ts, CLAUDE.md (Deployment),
// and commit d8e4d46 "feat(railway): deploy via Dockerfile with bun build, node runtime".
export const bunBuildsNodeServes: PostDef = {
	id: 'bun-builds-node-serves',
	title: 'Build with Bun, serve with Node: dodging a standalone RSS leak',
	happenedAt: '2026-07-30',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'infrastructure',
	series: { id: 'container-diet', part: 1 },
	description:
		'I use Bun everywhere in this repo except the one place that matters most: serving. Why the runtime stage of my Dockerfile is plain node:26-slim.',
	tldr: "I install with [[skill:bun-js]] and serve with [[skill:node-js]], on purpose. The Next standalone server leaks resident memory under Bun's Node-compat HTTP layer (oven-sh/bun#27514), and on a long-lived container that does not look like a leak — it looks like a slow, unexplained OOM days after deploy. So stage 1 installs on `oven/bun:1-slim`, stages 2 and 3 run on `node:26-slim`, and the process that actually answers requests is `node server.js`. The build keeps Bun's speed; the runtime keeps Node's boring memory behaviour.",
	skills: ['bun-js', 'node-js', 'docker', 'railway', 'next-js'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'This repo is a Bun repo. The lockfile is `bun.lock`, every script runs through `bun run`, and the build scripts are TypeScript executed directly by Bun with no compile step. So when I moved [[project:portfolio]] onto [[skill:railway]] behind a Dockerfile on 2026-07-30, the obvious move was to run the whole thing on Bun — install, build, serve.'
		},
		{
			kind: 'p',
			text: 'I did not do that, and the reason is the only part of this post worth remembering: **the failure it avoids is invisible for days.**'
		},
		{ kind: 'h2', text: 'The bug that does not look like a bug' },
		{
			kind: 'p',
			text: "Next's `output: 'standalone'` emits a small `server.js` plus a traced subset of `node_modules`. It is a Node program. Running a Node program on Bun is normally fine — that is what the Node-compat layer is for — but the standalone server sits on the HTTP path, handling every request for the life of the container, and under Bun's compat layer it leaks resident memory ([oven-sh/bun#27514](https://github.com/oven-sh/bun/issues/27514))."
		},
		{
			kind: 'p',
			text: 'On a laptop you never see it. You start the server, click around, memory looks normal, and you ship. The leak needs a long-lived process and real traffic to show itself. What you get in production is a container whose RSS climbs slowly over days until the platform kills it — no stack trace, no bad request, nothing in the logs that points at a cause. It reads as a mysterious OOM, and you will go looking for it in your own code first.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'Why this is worth a whole decision',
			text: 'A crash with a stack trace is cheap. A slow resource leak with no signal is expensive, because the debugging starts in the wrong place. Given a choice between the two, pay whatever it costs to avoid the second one.'
		},
		{ kind: 'h2', text: 'Three stages, two runtimes' },
		{
			kind: 'p',
			text: 'So the Dockerfile splits the job. Bun does what Bun is good at and never touches a request. The header comment states the arrangement in one line so nobody has to reconstruct it: **Bun installs dependencies; Node builds and serves.**'
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption:
				'Dockerfile — stage 1 installs on Bun; the manifests-only copy keeps this layer cached until dependencies actually change.',
			code: 'FROM oven/bun:1-slim AS installer\nWORKDIR /app\n\nCOPY package.json bun.lock ./\n\nRUN bun install --frozen-lockfile'
		},
		{
			kind: 'p',
			text: 'Stage 2 builds on Node, but still needs Bun available — the build script runs `icons:check`, a TypeScript file Bun executes directly. Rather than reinstall Bun, the builder copies the single binary across from the installer stage.'
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption:
				'Dockerfile — stage 2. One binary copied in, so a Bun-run check and a Node-run build coexist in the same layer.',
			code: 'FROM node:26-slim AS builder\nWORKDIR /app\n\nCOPY --from=installer /usr/local/bin/bun /usr/local/bin/bun\nCOPY --from=installer /app/node_modules ./node_modules\nCOPY . .\n\nRUN bun run icons:check && npx next build'
		},
		{
			kind: 'p',
			text: "Stage 3 is the point of the whole exercise. It is a bare `node:26-slim` that copies in the standalone output, the static assets and `public/`, and runs `node server.js`. There is no install step in the runtime image at all — that is what `output: 'standalone'` buys, and it is why the final stage can be this small."
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption: 'Dockerfile — stage 3. No package manager, no install, no Bun. Just Node and the traced output.',
			code: 'FROM node:26-slim AS runner\nWORKDIR /app\n\nENV NODE_ENV=production\nENV MALLOC_ARENA_MAX=2\nENV NODE_OPTIONS=--max-old-space-size=512\n\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\nCOPY --from=builder /app/public ./public\n\nENV HOSTNAME="0.0.0.0"\nCMD ["node", "server.js"]'
		},
		{ kind: 'h2', text: 'The other thing that hangs a deploy' },
		{
			kind: 'p',
			text: 'While wiring this up I hit a second failure with the same character — silent, and nothing to do with my application code. Next copies `.env` into `.next/standalone/` when it builds. If that file contains a `PORT`, it ships inside the image and shadows the port the platform injects at runtime. The server then binds somewhere nobody is looking, the healthcheck never gets an answer, and the deploy hangs with a perfectly healthy process inside it.'
		},
		{
			kind: 'code',
			lang: 'gitignore',
			caption: '.dockerignore — the comment is there because the failure gives you no clue on its own.',
			code: '# Never ship local env into the image — a committed PORT would shadow the one\n# Railway injects and the healthcheck would never find the server.\n**/.env\n**/.env.local'
		},
		{
			kind: 'p',
			text: 'The verification for both of these has to happen the way the platform actually runs it — injected port, no local env file. One command reproduces production closely enough to catch the class:'
		},
		{
			kind: 'code',
			lang: 'bash',
			caption:
				'The local check. Build the real image, run it with an injected port, and confirm the server binds and answers.',
			code: 'docker build -t nooobtimex . && docker run --rm -e PORT=7788 -p 7788:7788 nooobtimex'
		},
		{ kind: 'h2', text: 'What this costs' },
		{
			kind: 'p',
			text: 'I should be honest that this is not free. The image carries two runtimes across its stages, the Dockerfile is harder to explain than "run everything on one thing", and I am deliberately not using Bun for the workload where its HTTP performance would actually show up. If the upstream issue is fixed, the right move is to re-measure under sustained load and collapse the stages — not to assume the split is permanent.'
		},
		{
			kind: 'p',
			text: 'What I am buying is that the serving process behaves the way a decade of Node deployments have taught people to expect. For a site that has to sit there for months without anyone watching it, that predictability is worth more than the benchmark.'
		}
	],
	lessons: [
		'Choose your runtime per stage, not per repo. "We are a Bun shop" is a preference; "this process handles every request for weeks" is a constraint, and constraints win.',
		'Rank bugs by how loudly they fail, not by how bad they sound. A slow RSS leak with no signal costs more debugging time than a crash that names its own cause.',
		'Write the reason next to the config. Both decisions here — the Node runtime stage and the ignored `.env` — look arbitrary six months later, and both produce silent failures if someone "simplifies" them.'
	],
	faqs: [
		{
			q: 'Can you run a Next.js standalone server on Bun in production?',
			a: "It starts and serves, but as of oven-sh/bun#27514 the standalone server leaks resident memory under Bun's Node-compat HTTP layer. On a short-lived process you will not notice; on a long-running container it presents as a slow OOM with no stack trace. I build with Bun and serve with Node specifically to avoid that failure mode."
		},
		{
			q: 'How do you use Bun and Node in the same Dockerfile?',
			a: 'Install on a Bun image, then copy the single Bun binary into the Node build stage with `COPY --from=installer /usr/local/bin/bun /usr/local/bin/bun`. That lets Bun-run scripts and a Node-run build share one layer without installing Bun again. The runtime stage stays a plain Node image with neither the binary nor a package manager in it.'
		},
		{
			q: 'Why does my Railway healthcheck hang even though the container starts fine?',
			a: 'Check whether a `.env` file got into the image. Next copies `.env` into `.next/standalone/` at build time, and a `PORT` inside it overrides the port the platform injects — so the server binds to the wrong port and the healthcheck never finds it. Excluding `.env` in `.dockerignore` fixes it. Reproduce locally with `docker run --rm -e PORT=7788 -p 7788:7788 <image>`.'
		},
		{
			q: "What does Next's output: 'standalone' actually give you?",
			a: 'It emits a self-contained `server.js` plus only the traced subset of `node_modules` the app really uses. That is what makes an install-free runtime stage possible: the final image copies the output in and runs `node server.js`, with no package manager and no dependency resolution at container start.'
		}
	],
	sources: [
		{
			title: 'oven-sh/bun#27514 — Next.js standalone RSS growth under Bun',
			url: 'https://github.com/oven-sh/bun/issues/27514'
		},
		{
			title: "Next.js docs — output: 'standalone'",
			url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/output'
		}
	]
}
