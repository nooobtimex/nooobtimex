import type { PostDef } from '../../../interfaces'

// Sources: railway.toml, Dockerfile (runner stage + the package.json start shim),
// .dockerignore, CLAUDE.md (Deployment), and commit d8e4d46
// "feat(railway): deploy via Dockerfile with bun build, node runtime".
export const railwayStartCommandThreePlaces: PostDef = {
	id: 'railway-start-command-three-places',
	title: 'Three places a Railway container can get its start command',
	happenedAt: '2026-07-30',
	publishedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'infrastructure',
	series: { id: 'container-diet', part: 5 },
	description:
		'railway.toml, the Dockerfile CMD, and package.json can each supply a start command. Making all three agree is cheaper than finding out which one won.',
	tldr: "A [[skill:railway]] service deployed from a Dockerfile can resolve its start command from `railway.toml`'s `startCommand`, from the image's `CMD`, or from a `start` script in `package.json`. I made all three say `node server.js` rather than reason about precedence, including a build step that writes the script into the image. The two settings that actually decide whether the deploy succeeds are separate: `HOSTNAME=0.0.0.0`, so the server does not bind to loopback inside the container, and leaving the injected `$PORT` alone so the healthcheck can find it. Everything else in the file is about not rebuilding when nothing changed.",
	skills: ['railway', 'docker', 'node-js'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'When I moved [[project:portfolio]] onto [[skill:railway]] on 30 July 2026, the deploy configuration went into the repository as `railway.toml` rather than into the dashboard. That part was easy to decide: [config-as-code overrides the dashboard](https://docs.railway.com/guides/config-as-code), so there is exactly one place to look and it is in the diff.'
		},
		{
			kind: 'p',
			text: 'What took longer was a smaller question with an embarrassing answer. Something has to tell the platform how to start the container, and I could name three separate places that might. I never established which one wins.'
		},
		{ kind: 'h2', text: 'Three sources, one string' },
		{
			kind: 'table',
			head: ['Source', 'Where it lives', 'When it applies'],
			rows: [
				['`startCommand`', '`railway.toml`, `[deploy]` section', 'Config-as-code; overrides the dashboard field'],
				['`CMD`', 'The image, last line of the Dockerfile', 'What the container does if nothing overrides it'],
				['`start` script', '`package.json` inside the image', 'If the platform resolves a command from the manifest']
			]
		},
		{
			kind: 'p',
			text: 'The correct engineering answer is to read the precedence rules and rely on one. The answer I actually shipped was to make all three identical, so precedence stops being a question I need to have answered correctly.'
		},
		{
			kind: 'code',
			lang: 'toml',
			caption: 'railway.toml — the deploy section. No port flag here, unlike the local scripts.',
			code: '[deploy]\nstartCommand = "node server.js"\nrestartPolicyType = "ON_FAILURE"\nrestartPolicyMaxRetries = 10'
		},
		{
			kind: 'p',
			text: 'The Dockerfile ends with the same command, so an image run anywhere — locally, or by a platform that ignores the toml entirely — behaves the same way.'
		},
		{
			kind: 'p',
			text: "The third one is the awkward one. Next's standalone output ships its own `package.json`, and it does not necessarily carry a `start` script. So the image build writes one in."
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption:
				'Dockerfile, runner stage — condensed. A build step that edits a manifest inside the image it is building.',
			code: "RUN node -e \"const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); pkg.scripts = pkg.scripts || {}; pkg.scripts.start = 'node server.js'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));\""
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'I do not think this line is good',
			text: 'A `RUN node -e` that rewrites a manifest inside the image is defensive programming against a behaviour I never confirmed happens. It is insurance bought without reading the policy. I kept it because the failure it guards against is a container that starts the wrong process on a platform I cannot attach a debugger to — but the honest version of this decision is "I did not want to find out", not "I determined this was necessary".'
		},
		{ kind: 'h2', text: 'The two lines that decide whether the deploy is reachable' },
		{
			kind: 'p',
			text: 'Getting the start command right still leaves the container able to run perfectly while the platform concludes it is dead. Two separate settings decide that, and neither is about the command.'
		},
		{
			kind: 'p',
			text: 'The first is the interface it binds to. A server that binds to loopback is reachable from inside the container and from nowhere else, which produces a healthy process, an empty log, and a healthcheck that times out. `HOSTNAME=0.0.0.0` in the runner stage is what makes the standalone server listen on an address the platform can reach.'
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption: 'Dockerfile — the last two lines of the runtime stage.',
			code: 'ENV HOSTNAME="0.0.0.0"\n\nCMD ["node", "server.js"]'
		},
		{
			kind: 'p',
			text: "The second is the port, and the rule there is to do nothing. Railway injects `$PORT` and the standalone server reads it on its own, which is why `startCommand` carries no port flag — unlike this repo's local `dev` and `start` scripts, which pin port 1000 for convenience. The interesting failure is the one where something else supplies a `PORT` first: a `.env` file copied into the standalone output shadows the injected value, and the deploy hangs with a healthy process bound to a port nobody is checking. That story is [part 1 of this series](/blog/bun-builds-node-serves), and it is why `.dockerignore` excludes `.env` with a comment explaining why."
		},
		{ kind: 'h2', text: 'watchPatterns is an allowlist, and that cuts both ways' },
		{
			kind: 'p',
			text: 'The rest of the file is about not rebuilding. This repository has a scheduled workflow that regenerates SVG assets for the README and commits them, which under the default behaviour is a full site rebuild and redeploy in response to a file the site never reads.'
		},
		{
			kind: 'code',
			lang: 'toml',
			caption: 'railway.toml — an allowlist, so an unrelated commit does not trigger a deploy.',
			code: 'watchPatterns = [\n\t"app/**",\n\t"common/**",\n\t"components/**",\n\t"lib/**",\n\t"public/**",\n\t"next.config.ts",\n\t"package.json",\n\t"bun.lock",\n\t"Dockerfile",\n\t"railway.toml"\n]'
		},
		{
			kind: 'callout',
			tone: 'danger',
			title: 'The failure mode is a deploy that never happens',
			text: "Because this is an allowlist rather than a denylist, anything the build reads has to be listed. Add a new top-level config file the build depends on, forget to add it here, and commits that change it produce no deploy at all — no error, no warning, just a site that is quietly running last week's behaviour. A denylist would fail in the noisy direction instead. I chose the quiet one, so the list has to be maintained deliberately."
		},
		{ kind: 'h2', text: 'The build context, which is not negotiable' },
		{
			kind: 'p',
			text: 'One dashboard setting is load-bearing and lives outside the file: the service Root Directory has to stay `/`. The Dockerfile copies from the repository root and the toml sets `builder = "DOCKERFILE"` with `dockerfilePath = "Dockerfile"`, so pointing the service at a subdirectory hands Docker a build context missing most of what the build reads. This is written as a comment in `railway.toml` rather than only in a runbook, because the person who breaks it will be looking at the toml.'
		},
		{ kind: 'h2', text: 'How to know any of this is true' },
		{
			kind: 'p',
			text: 'Everything above is a claim about how the container behaves when the platform runs it, and none of it is verified by a green build. The check that means something reproduces the two conditions that matter — a port injected from outside, and no local env file present.'
		},
		{
			kind: 'code',
			lang: 'bash',
			caption:
				'The local check. If this binds and answers, the start command, the interface and the port contract are all correct.',
			code: 'docker build -t nooobtimex . && docker run --rm -e PORT=7788 -p 7788:7788 nooobtimex'
		},
		{
			kind: 'p',
			text: 'It is a small command and it catches an entire category. Every failure in this post presents identically from the outside — the deploy hangs, the healthcheck never passes, and the logs show a process that started cleanly and is waiting for traffic that cannot reach it. Running the image the way the platform runs it is the only cheap way to tell those apart before the platform does.'
		}
	],
	lessons: [
		'When several layers can supply the same value, making them agree is cheaper than learning the precedence. It costs a duplicated string and removes a class of question you would otherwise answer under deployment pressure.',
		'Say out loud which parts are insurance. The `package.json` start shim guards against something I never confirmed happens, and labelling it as caution rather than analysis is the difference between a note and a myth.',
		'Binding and starting are separate failures with one symptom. A correct start command still hangs the deploy if the server binds to loopback or to a port the platform did not inject.',
		'An allowlist fails quietly. `watchPatterns` stops pointless rebuilds and, in exchange, will silently skip a needed one when someone adds a file and forgets the list — so the trade has to be a decision, not a default.',
		'Verify at the boundary the platform actually uses. A green build proves the code compiles; only running the image with an injected port and no local env proves the container is reachable.'
	],
	faqs: [
		{
			q: 'Where does Railway get the start command for a Dockerfile deploy?',
			a: "It can come from `startCommand` in the `[deploy]` section of `railway.toml`, from the image's own `CMD`, or from a `start` script in the `package.json` inside the image. Rather than depend on the precedence between them, the simplest thing is to make all three the same string — in my case `node server.js`. Config-as-code in `railway.toml` does override the dashboard field, so at least those two are unambiguous."
		},
		{
			q: 'Why does my Railway healthcheck time out when the container starts fine?',
			a: 'Almost always the server is listening somewhere the platform is not looking. The two common causes are binding to loopback instead of all interfaces — fixed with `HOSTNAME=0.0.0.0` for a Next standalone server — and a `PORT` value from inside the image shadowing the one the platform injects. Both produce a healthy process, a clean log and a healthcheck that never succeeds.'
		},
		{
			q: 'Should I set a port flag in the Railway start command?',
			a: 'No, if your server already reads `$PORT` from the environment, which the Next standalone server does. Passing an explicit port pins the container to a value the platform did not choose and reintroduces exactly the shadowing problem you are trying to avoid. Local scripts are a different case — pinning a fixed port for development is fine, it just must not travel into the image.'
		},
		{
			q: 'What does watchPatterns do in railway.toml?',
			a: 'It restricts which changed paths trigger a rebuild and redeploy. I use it so a scheduled workflow that regenerates README assets does not redeploy the site for files it never reads. The important consequence is that it is an allowlist: anything the build genuinely depends on must be listed, or commits touching it will produce no deploy and no error.'
		},
		{
			q: 'How do you test a Railway Dockerfile deploy locally?',
			a: 'Build the real image and run it the way the platform does — with an injected port and without any local env file, since `.dockerignore` should be excluding `.env` anyway. `docker build -t app . && docker run --rm -e PORT=7788 -p 7788:7788 app` reproduces the conditions that cause most hung deploys, and if the server binds and answers on that port the start command, bind address and port contract are all correct.'
		}
	],
	sources: [
		{
			title: 'Railway docs — config as code (railway.toml)',
			url: 'https://docs.railway.com/guides/config-as-code'
		},
		{
			title: 'Railway docs — healthchecks and restart policy',
			url: 'https://docs.railway.com/guides/healthchecks'
		}
	]
}
