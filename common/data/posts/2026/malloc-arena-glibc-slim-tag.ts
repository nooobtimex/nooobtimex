import type { PostDef } from '../../../interfaces'

// Sources: Dockerfile (runner stage), CLAUDE.md (Deployment), and commits
// d8c7f3c "chore(deploy): serve on node:26-slim, declare engines >=26",
// 0514b1c "perf: cut container RSS 402→126 MB", a06a957 "Update Dockerfile".
export const mallocArenaGlibcSlimTag: PostDef = {
	id: 'malloc-arena-glibc-slim-tag',
	title: 'MALLOC_ARENA_MAX across a glibc bump hiding in an unsuffixed -slim tag',
	happenedAt: '2026-07-31',
	publishedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'infrastructure',
	series: { id: 'container-diet', part: 3 },
	description:
		'Moving node:24-slim to node:26-slim also crossed Debian stable, glibc 2.36 to 2.41 — the layer MALLOC_ARENA_MAX acts on. So I measured it.',
	tldr: '`MALLOC_ARENA_MAX=2` is one line of [[skill:docker]] config that holds down resident memory on my [[skill:railway]] container, and I nearly shipped a base-image bump without noticing it changed the library that knob talks to. glibc hands every thread its own malloc arena — up to 8 × ncores — and those free lists are rarely returned to the OS, so on a many-core host they are tens of MB the heap profiler cannot see. Moving the runtime from `node:24-slim` to `node:26-slim` also crossed Debian stable, bookworm to trixie, glibc 2.36 to 2.41. Measured afterwards, container RSS came in at 71–75 MiB against a 126 MB baseline.',
	skills: ['docker', 'railway', 'node-js'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'On 31 July 2026 I changed one word in the [[project:portfolio]] Dockerfile: the runtime stage went from `node:24-slim` to `node:26-slim`. It is the kind of diff you approve without reading — a minor version bump on a base image, the sort of thing a bot usually opens for you.'
		},
		{
			kind: 'p',
			text: 'It was not a minor version bump. It replaced the C library underneath the process, and the container already carried a tuning flag whose entire job is to change how that library behaves.'
		},
		{ kind: 'h2', text: 'What the tag does not tell you' },
		{
			kind: 'p',
			text: 'An unsuffixed `-slim` tag on the official Node images does not name a Debian release. It points at whichever release the maintainers consider current for that Node line, and different Node lines can point at different ones at the same time. The tag is stable in name and moving underneath.'
		},
		{
			kind: 'table',
			head: ['Runtime tag', 'Debian base it shared a digest with', 'glibc'],
			rows: [
				['`node:24-slim`', '`node:24-bookworm-slim`', '2.36'],
				['`node:26-slim`', '`node:26-trixie-slim`', '2.41']
			]
		},
		{
			kind: 'p',
			text: 'So the diff that reads as "Node 24 to Node 26" is really two changes stacked: the JavaScript runtime moved to 26.5.1, and the operating system underneath it moved a whole Debian stable release. Nothing in the Dockerfile says so, because the thing that changed is not written in the Dockerfile.'
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption: 'The entire diff. The word that changed is `24`; the thing that changed is Debian bookworm to trixie.',
			code: '-FROM node:24-slim AS runner\n+FROM node:26-slim AS runner'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The version you pinned is not the version you got',
			text: 'Pinning `node:26-slim` pins a Node line and nothing else. If any of your configuration is tuned against libc, the kernel interface or the package set, that configuration is tuned against a base you did not pin and cannot see in the diff. Either suffix the tag — `26-trixie-slim` — or accept that the base can move and say so where the tuning lives.'
		},
		{ kind: 'h2', text: 'What MALLOC_ARENA_MAX actually does' },
		{
			kind: 'p',
			text: 'glibc does not keep one heap. To stop threads fighting over a single lock on every allocation, it hands out [additional arenas](https://www.gnu.org/software/libc/manual/html_node/Memory-Allocation-Tunables.html) — separate heaps with their own locks — and the default ceiling is generous: up to eight arenas per CPU core. Each arena keeps its own free list, and glibc is reluctant to hand those pages back to the operating system once it has them.'
		},
		{
			kind: 'p',
			text: 'That reluctance is the whole problem in a container. The pages are free as far as your program is concerned and resident as far as the platform is concerned, and the platform is the one deciding whether to kill you. It is also the reason the numbers never reconcile: a heap snapshot shows a small, healthy JavaScript heap while the memory graph shows something much larger, because the gap is not in the heap at all.'
		},
		{
			kind: 'p',
			text: "The core count makes it worse than it sounds, because the count that matters is the host's. A container scheduled onto a large shared machine sees that machine's CPUs, not its own cgroup quota, so the arena ceiling is set by hardware you do not own and did not choose."
		},
		{
			kind: 'code',
			lang: 'dockerfile',
			caption: 'Dockerfile, runner stage. Two lines, both about memory the profiler will not show you.',
			code: 'ENV MALLOC_ARENA_MAX=2\nENV NODE_OPTIONS=--max-old-space-size=512'
		},
		{
			kind: 'p',
			text: 'Two arenas is not a tuned number, it is an "ample" one. This container runs a single Next standalone server; there is no thread pool competing for allocations and nothing here that would benefit from sixteen heaps. The setting trades allocator contention I do not have for resident memory I am billed for.'
		},
		{ kind: 'h2', text: 'The companion knob, and why it is on the same line of thinking' },
		{
			kind: 'p',
			text: "The heap cap next to it exists for a related reason. V8 sizes its old-space budget from `os.totalmem()`, and inside a container that usually reports the **host's** memory rather than the limit the container is actually held to. Left alone, V8 concludes it has plenty of room and lets the heap drift for hundreds of megabytes before it bothers with a major collection — which is correct behaviour against the wrong number."
		},
		{
			kind: 'p',
			text: 'The working rule is 0.6–0.75 × the service memory limit. The value here is 512, and the reasoning is boring on purpose: what this site serves is prerendered HTML, and the live JavaScript heap sits well under 100 MB. The cap is there to stop drift, not to squeeze anything.'
		},
		{
			kind: 'callout',
			tone: 'info',
			title: 'Runner stage only',
			text: 'Both variables are set in the runtime stage and deliberately not in the builder. The build genuinely needs the headroom — Turbopack plus a hundred-odd prerendered pages is heap-hungry — while the server does not. A heap cap inherited by the builder turns a green deploy into an out-of-memory build for no benefit at all.'
		},
		{ kind: 'h2', text: 'What I measured' },
		{
			kind: 'p',
			text: 'Because the base image moved the library the flag acts on, the honest response was to re-measure rather than assume the previous tuning still held. Two runs of the built image under an injected port, no local env file.'
		},
		{
			kind: 'stat',
			value: '71–75 MiB',
			label: 'container RSS on node:26-slim across two runs, against the 126 MB baseline from the previous pass',
			source: 'commit d8c7f3c, 2026-07-31'
		},
		{
			kind: 'p',
			text: 'That is comfortably under the baseline, and it was enough to ship. It is not enough to explain.'
		},
		{ kind: 'h2', text: 'Arguing against my own number' },
		{
			kind: 'p',
			text: 'Two things are wrong with treating 71–75 MiB as a result. The first I wrote down at the time: it is a **fresh container**, not a load-soaked steady state. Allocator behaviour is precisely the thing that diverges between minute one and day three, so a boot-time reading is the least interesting moment to sample it. The long-run curve is a platform metrics question, and only the platform can answer it.'
		},
		{
			kind: 'p',
			text: 'The second is worse, and I did not write it down. That measurement moved **three variables at once** — Node 24 to 26, glibc 2.36 to 2.41, and whatever the arena cap was already doing. I cannot attribute the improvement to any one of them, and I should not imply otherwise. What the number honestly supports is "the bump did not regress memory". Anything stronger would need the base pinned and one variable moved at a time, which I did not do.'
		},
		{ kind: 'h2', text: 'The part that actually went wrong' },
		{
			kind: 'p',
			text: 'A week later, on 6 August, a commit titled "Update Dockerfile" with an empty message deleted every comment quoted in this post. The arena explanation, the note about libvips reading the host rather than the cgroup, the reason the heap cap exists and how to size it — all of it went, in a tidy-up.'
		},
		{
			kind: 'p',
			text: 'The two `ENV` lines survived. They are still correct and still doing their job. But a reader arriving at that file now sees two magic numbers with no argument attached, and the only thing standing between them and a reasonable-looking cleanup is that the reasoning happened to be duplicated into a commit message and the repo instructions. That is luck, not design.'
		},
		{
			kind: 'callout',
			tone: 'danger',
			title: 'Config without its argument is config waiting to be deleted',
			text: 'Every line in this post describes a setting whose failure mode is silent. Nobody is warned when `MALLOC_ARENA_MAX` disappears; RSS simply drifts up over weeks on a host nobody is watching. A comment is not documentation here — it is the only thing that makes the setting survive contact with a future reader who is trying to be helpful.'
		}
	],
	lessons: [
		'An unsuffixed base tag is a floating dependency. `node:26-slim` pins a Node line and lets the operating system underneath move a whole Debian release; suffix it, or write down that the base can change and what depends on it.',
		'A measurement that moves three variables at once gives you a direction, not a cause. Mine supports "no regression" and nothing stronger, and it is better to say so than to let a number imply an attribution it cannot carry.',
		'Sample the metric where it actually goes wrong. Allocator growth is a steady-state behaviour, so a fresh-container reading is close to the least informative moment available.',
		'Put tuning in the runtime stage only. The builder wants headroom and the server wants a ceiling, and a heap cap that leaks upward into the build turns a working deploy into an out-of-memory failure with no obvious cause.',
		'The reason has to live where the setting lives. Two `ENV` lines with no comment survived a cleanup that removed everything explaining them, and the argument only exists today because it was accidentally written down somewhere else.'
	],
	faqs: [
		{
			q: 'What does MALLOC_ARENA_MAX do in a Docker container?',
			a: 'It caps how many separate heaps glibc will create. By default glibc allocates up to eight arenas per CPU core so threads do not contend on one lock, and each arena holds onto its own free list rather than returning pages to the operating system. In a container that shows up as resident memory your heap profiler cannot account for. Setting it to a small number — 2 for a single-process server — trades allocator concurrency you probably are not using for RSS you are billed for.'
		},
		{
			q: 'Does node:26-slim use a different Debian version than node:24-slim?',
			a: 'Yes. The unsuffixed `-slim` tag does not pin a Debian release, and different Node lines can sit on different ones. When I bumped my runtime, `24-slim` shared a digest with `24-bookworm-slim` (glibc 2.36) and `26-slim` shared one with `26-trixie-slim` (glibc 2.41). If anything in your setup is tuned against libc, use the suffixed tag so the base is visible in the diff.'
		},
		{
			q: 'Why is my Node container using more memory than the heap snapshot shows?',
			a: 'Because a heap snapshot only describes the JavaScript heap, and much of the gap usually is not in it. Native allocations, glibc arena free lists that were never returned to the operating system, and native libraries loaded at require time all count toward RSS and appear nowhere in a V8 snapshot. Start by comparing RSS against heap total; a large, stable difference points at the allocator or a native dependency rather than at your code.'
		},
		{
			q: 'Should you set --max-old-space-size in a container?',
			a: 'Usually yes, because V8 sizes its old-space budget from `os.totalmem()`, which inside a container commonly reports the host machine rather than the container limit. Without a cap the heap can grow for hundreds of megabytes before a major collection, against a limit V8 does not know about. A working rule is 0.6–0.75 of the service memory limit, and set it in the runtime stage only — the build usually needs the headroom.'
		},
		{
			q: 'Is it safe to pin an unsuffixed -slim Docker tag?',
			a: 'It is safe for reproducing a Node version and unsafe for reproducing an environment. The tag guarantees the language runtime line and nothing about the distribution, package set or C library beneath it, so a base can move a full Debian release without changing a character of your Dockerfile. If any configuration depends on the base — allocator tuning, native builds, a system package — pin the suffixed tag instead.'
		}
	],
	sources: [
		{
			title: 'GNU C Library manual — Memory Allocation Tunables (glibc.malloc.arena_max)',
			url: 'https://www.gnu.org/software/libc/manual/html_node/Memory-Allocation-Tunables.html'
		},
		{
			title: 'nodejs/docker-node — image variants and their Debian bases',
			url: 'https://github.com/nodejs/docker-node'
		},
		{
			title: 'Debian 13 "trixie" release information',
			url: 'https://www.debian.org/releases/trixie/'
		}
	]
}
