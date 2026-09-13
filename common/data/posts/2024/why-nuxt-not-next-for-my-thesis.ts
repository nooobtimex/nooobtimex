import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (qrFood def, highlightSkills comment + the 2024-03-15 Phase 1 milestone), common/data/skills.ts (nuxt-js, vue, next-js descriptions), common/data/experiences.ts (thammasat-bs-cs, freelance). */
export const whyNuxtNotNextForMyThesis: PostDef = {
	id: 'why-nuxt-not-next-for-my-thesis',
	title: 'Why I built my thesis on Nuxt 3 instead of Next.js',
	happenedAt: '2024-03-15',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'student',
	category: 'engineering',
	description:
		'Choosing Nuxt 3 over Next.js for a solo senior thesis in 2024: what auto-imports, Nitro and Vue reactivity gave me, and why I never chose it again.',
	tldr: 'I built my senior thesis, [[project:qr-food]], on [[skill:nuxt-js]] 3 while every other line of code I shipped was React. The defensible reason is that in early 2024 Nuxt 3 had a settled mental model and the [[skill:next-js]] App Router was still redrawing what a component was — and a solo project with a fixed defense date is worth more with a stable framework than a fashionable one. The honest reason is that I wanted to learn a second ecosystem somewhere the only stakeholder was a grading committee. It worked, and I have not chosen Nuxt since.',
	skills: ['nuxt-js', 'vue', 'next-js', 'tailwind-css', 'vercel'],
	relatedProjectIds: ['qr-food'],
	relatedExperienceIds: ['thammasat-bs-cs'],
	body: [
		{
			kind: 'p',
			text: 'On 15 March 2024 the first genuinely working version of [[project:qr-food]] existed: a Nuxt 3 application with table QR scanning, live menu rendering, staff authentication, order management, and a sales dashboard. That was Phase 1 of the senior thesis I had [scoped seven months earlier](/blog/replacing-pos-hardware-with-qr-ordering) at [[career:thammasat-bs-cs]] — and the first point at which the framework choice stopped being a plan and started being a thing I had to live inside.'
		},
		{
			kind: 'p',
			text: 'The choice is still the most identifying decision in my portfolio. Every other project I have shipped, before or since, is React. [[project:qr-food]] is the one that is not, which means it is also the only place I can compare the two full-stack frameworks from the inside rather than from a blog post.'
		},
		{ kind: 'h2', text: 'The two frameworks answer the same question' },
		{
			kind: 'p',
			text: 'Nuxt is to Vue what Next is to React: [file-based routing](https://nuxt.com/docs/guide/directory-structure/pages), server rendering, a data-fetching story, and a single deployable artifact that contains both the pages and the endpoints. At the level a thesis operates on, the feature lists rhyme. So the choice was never about capability. It was about which mental model I would be debugging at 1am the week before a demo.'
		},
		{
			kind: 'p',
			text: 'In early 2024 those models were in very different places. Nuxt 3 had been stable since late 2022 and had spent a year settling; the conventions you found in the docs were the conventions you found in real projects. The Next.js App Router had been marked stable much more recently, React Server Components were actively changing what a component even meant, and a large share of the React answers online were still written for the previous router. For a solo build with a fixed defense date, a settled model beats a better one, because the cost you cannot afford is not a slower framework — it is an afternoon spent working out whether the advice you just read applies to the version you are running.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'That argument is partly retrospective tidying',
			text: 'I did not run a version-stability analysis in 2023. I wanted to learn a second ecosystem properly, and a thesis was the cheapest place to do it. The stability argument is real, and it is also the reason I can defend a decision I made for a softer one. Both things are true and it would be dishonest to publish only the first.'
		},
		{ kind: 'h2', text: 'Three things Nuxt actually gave me' },
		{
			kind: 'list',
			items: [
				'**Auto-imports.** Components, composables and utilities resolve without an import line. On a project where I was writing every file myself, that removed a whole category of friction. It also removed the ability to answer where does this come from by reading the top of the file — a trade that is fine solo and much less fine on a team.',
				'**Nitro server routes next to the pages.** `server/api` gave me endpoints in the same repo, the same TypeScript config and the same deploy as the UI. The 38-endpoint surface I eventually defended was a directory tree, not an architecture diagram.',
				'**Reactivity instead of dependency arrays.** A live cart is derived state — line totals, add-on prices, the running bill. Vue computes derived state from what the expression touched, so I never wrote a dependency list and never debugged a stale one.'
			]
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the Nitro route shape that made the endpoint surface a directory tree.',
			code: "// server/api/tables/[token].get.ts\nexport default defineEventHandler(async event => {\n\tconst token = getRouterParam(event, 'token')\n\tconst table = await prisma.table.findUnique({\n\t\twhere: { qrToken: token },\n\t\tinclude: { branch: true }\n\t})\n\tif (!table) throw createError({ statusCode: 404 })\n\treturn table\n})"
		},
		{
			kind: 'p',
			text: 'The third point is the one I would defend hardest, because it is the only one that changed how I think rather than how fast I typed. A cart total is not a value you set; it is a value that follows from the cart. Vue makes that literal. Writing it that way for a year made me noticeably better at spotting the same shape in React, where the language does not push you towards it.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — derived cart state, the pattern the customer flow leaned on hardest.',
			code: 'const cart = ref<CartLine[]>([])\n\nconst total = computed(() =>\n\tcart.value.reduce(\n\t\t(sum, line) =>\n\t\t\tsum + line.quantity * (line.price + line.addOns.reduce((a, x) => a + x.price, 0)),\n\t\t0\n\t)\n)'
		},
		{ kind: 'h2', text: 'What it cost, stated plainly' },
		{
			kind: 'p',
			text: 'The bill came in two parts. The first was the ecosystem gap. Every unusual problem I hit — a mapping between an ORM client and a server route, a component behaving differently under server rendering, an obscure build error — had an answer written for React, and turning it into a Vue answer was work I did before I could start the actual work. That tax is invisible on a feature list and completely real on a Tuesday night.'
		},
		{
			kind: 'p',
			text: 'The second cost is bigger and slower: nothing I built became inventory. Components, form patterns, table abstractions, the small library of things you accumulate and reuse — all of it stayed on the Vue side of a wall I never crossed again. My [[career:freelance]] work converged hard on [[skill:next-js]] and TypeScript, for reasons I have [written about elsewhere](/blog/starting-to-freelance-in-third-year), and none of the thesis code came with me.'
		},
		{
			kind: 'table',
			head: ['', 'What the thesis needed', 'What a client project needs'],
			rows: [
				['Framework churn', 'Punishing — one fixed defense date', 'Absorbable — releases can wait'],
				['Ecosystem depth', 'Nice to have; I had time to translate', 'Load-bearing; someone is paying for the hours'],
				['Reusable inventory', 'Worthless — the project ends at the defense', 'The whole point across engagements'],
				['Learning value', 'The actual objective', 'A bonus, never the reason']
			]
		},
		{ kind: 'h2', text: 'The version I would defend today' },
		{
			kind: 'p',
			text: 'Nuxt 3 was a good choice for that project and would be a bad choice for most of my later ones — and the difference is not technical. A thesis is the rare build with no client, no production users, no on-call, and a hard end date after which nobody maintains it. That is a laboratory. Learning costs are cheap in a laboratory and expensive everywhere else.'
		},
		{
			kind: 'stat',
			value: '16 months',
			label:
				'from the first Prisma schema in August 2023 to the final defense on 24 December 2024, all of it on the same framework bet',
			source: 'QR Food project timeline'
		},
		{
			kind: 'p',
			text: 'If someone asked me which to pick for a restaurant ordering app today, my answer would be boring: pick the one your team already argues fluently in, and spend the saved attention on the schema. Almost nothing that made [[project:qr-food]] work was framework-shaped. What the QR token means, what a branch owns, and where availability lives were the decisions that mattered, and every one of them would have been identical in React.'
		}
	],
	lessons: [
		'Pick the framework whose model has stopped moving when the deadline cannot move. Framework churn is not a taste question on a project with one immovable date on it.',
		'Learning a second ecosystem made me better at the first one. Vue reactivity taught me to see derived state as derived, and I have written better React ever since — that was the real return, not the thesis itself.',
		'Nothing I wrote in Nuxt became reusable inventory, and I underrated that at the time. A stack you will not choose again produces code you will not carry forward, however good it is.',
		'The framework was the loudest decision and the least important one. The schema, the QR token and the availability model would have been the same work in either ecosystem — and they were where the project was actually won.'
	],
	faqs: [
		{
			q: 'Is Nuxt 3 or Next.js better for a solo full-stack project?',
			a: 'Both cover the same ground — file-based routing, server rendering, colocated API routes and a single deploy — so capability is rarely the deciding factor. For a solo build the better question is which mental model you can debug fastest under pressure, and which ecosystem has answers written for the version you are actually running. I chose Nuxt 3 for a senior thesis in 2023 and shipped a 38-endpoint system on it, but my client work runs on Next.js.'
		},
		{
			q: 'What are the real downsides of choosing Nuxt when you already know React?',
			a: 'Two show up quickly. Answers to unusual problems are overwhelmingly written for React, so you spend time translating before you can start solving. And the components, form patterns and small abstractions you build do not transfer back to your React projects, so a year of work produces no reusable inventory. Neither cost appears on a feature comparison.'
		},
		{
			q: 'What does Nuxt auto-import actually do, and is it worth it?',
			a: 'Nuxt resolves components, composables and utilities without an explicit import line, so files start with code instead of ceremony. Solo, it removes real friction. The cost is discoverability: you can no longer answer where a symbol comes from by reading the top of the file, which matters much more on a team or when someone new reads the codebase.'
		},
		{
			q: 'Are Nitro server routes a substitute for a separate backend?',
			a: 'For a project of thesis scale, yes. Nitro puts endpoints under `server/api` in the same repository, TypeScript config and deployment as the pages, which removes an entire class of cross-service problems. It is the same bet Next.js route handlers make. You outgrow it when endpoints need to scale, deploy or be owned separately from the UI.'
		},
		{
			q: 'Does the framework choice matter as much as it feels like it does?',
			a: 'Usually less. On QR Food the decisions that determined whether the product worked were what the table QR token identified, how branches owned menus, and where per-branch availability lived — all of them database and domain decisions that would have been identical in React or Vue. The framework changed how fast I typed, not what I was building.'
		}
	],
	sources: [
		{
			title: 'Nuxt — The pages directory',
			url: 'https://nuxt.com/docs/guide/directory-structure/pages'
		},
		{
			title: 'Next.js — Layouts and pages',
			url: 'https://nextjs.org/docs/app/getting-started/layouts-and-pages'
		},
		{
			title: 'Vue.js — Introduction',
			url: 'https://vuejs.org/guide/introduction.html'
		}
	]
}
