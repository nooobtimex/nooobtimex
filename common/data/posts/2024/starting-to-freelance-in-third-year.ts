import type { PostDef } from '../../../interfaces'

/** Sources: common/data/experiences.ts (freelance startDate 2024-01-01, thammasat-bs-cs, ruamsuk-software-engineer-part-time), common/data/entities.ts (freelance org, founded 2024), common/data/projects.ts (qrFood, floodProject, onlinePokerGame + linkedExperienceIds). */
export const startingToFreelanceInThirdYear: PostDef = {
	id: 'starting-to-freelance-in-third-year',
	title: 'Starting to freelance in my third year of university',
	happenedAt: '2024-01-01',
	publishedAt: '2026-08-25',
	chapter: 'freelance',
	category: 'engineering',
	description:
		'Why I started taking client work on 1 January 2024 — mid-degree, already holding a part-time dev job and a thesis — and what the first year produced.',
	tldr: "On 1 January 2024 I started taking outside client work, in the third year of my CS degree, while already working part-time at my family's trophy factory and five months into a senior thesis. The reason was not money or portfolio: every line of code I had shipped for money went to one client I could not be fired by. Freelance was the first work where someone else defined the problem and could say no.",
	skills: ['next-js', 'typescript', 'prisma'],
	relatedProjectIds: ['qr-food', 'flood-project', 'online-poker-game'],
	relatedExperienceIds: ['freelance', 'thammasat-bs-cs', 'ruamsuk-software-engineer-part-time'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "In my own career data, [[career:freelance]] starts on 1 January 2024. That is the third year of a four-year Computer Science degree at [[career:thammasat-bs-cs]], two and a half years into a part-time developer job at [[company:ruamsuk-plating]] — my family's trophy and medal factory, running since 2006 — and five months into the senior thesis I would defend at the end of that year."
		},
		{
			kind: 'p',
			text: 'Nothing about that calendar says add a fourth track. I added one anyway, and the reason had nothing to do with money or with filling a portfolio. It had to do with a gap in what the first two tracks could teach me.'
		},
		{ kind: 'h2', text: 'Everything I had shipped went to one client' },
		{
			kind: 'p',
			text: 'By January 2024 I had real production work behind me. I had [started the job and the degree in the same month](/blog/started-job-and-degree-same-month) in August 2021, and between March 2022 and January 2023 I had [stood up three storefronts](/blog/three-storefronts-ten-months) for the family business. Those sites take orders and get found on Google. That is not practice work.'
		},
		{
			kind: 'p',
			text: 'But all of it went to one client, and that client was my family. The deadlines were real and the consequences were real. What was not real was the market test. A supplier who is never compared to another supplier learns a specific set of things very well and a different set not at all — pricing, scoping, saying no, and the plain experience of a stranger deciding your work is not what they wanted.'
		},
		{
			kind: 'table',
			head: ['', 'Part-time at the factory', 'Freelance'],
			rows: [
				['Who defines the problem', 'The business I work inside', 'Someone whose business I do not live in'],
				['Requirements', 'Absorbed by being there', 'Extracted, then written down'],
				['Stack', 'Chosen once, maintained for years', 'Chosen per project, supported per project'],
				['Continuity', 'Years, by default', 'One engagement at a time']
			]
		},
		{
			kind: 'p',
			text: 'The right-hand column is not better. It is just a different discipline, and at 21 I could see that I only had one of the two.'
		},
		{ kind: 'h2', text: 'The date marks a decision, not a launch' },
		{
			kind: 'p',
			text: "I should be honest about what 1 January 2024 actually is. It is a clean date on a role in a database, not a day something shipped. What it marks is the point where outside work stopped being an accident and became a thing I was open to — the freelance organization in my own data layer is dated `founded: '2024'` for exactly that reason."
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The first year under that banner produced nothing that survived',
			text: 'Every freelance build on this site sits well after the start date: [[project:flood-project]] ran in February 2025, [[project:online-poker-game]] began the month after. If you judged the decision purely by shipped artifacts in 2024, you would call it a year of nothing. The artifacts came a year late, and I would rather say that than backfill the gap.'
		},
		{ kind: 'h2', text: 'Third year was arguably the wrong year' },
		{
			kind: 'p',
			text: 'The strongest argument against the timing is [[project:qr-food]], the senior thesis. I had scoped it in August 2023 — objectives and a Prisma schema, [no screens at all](/blog/replacing-pos-hardware-with-qr-ordering). Phase 1, the working Nuxt application with table QR scanning and order management, is dated 15 March 2024. Seven months separate the schema from the first running system, and Phase 2 landed five months after that.'
		},
		{
			kind: 'p',
			text: 'I cannot prove which track cost which. Four parallel commitments in one calendar year do not produce a clean attribution. But the arithmetic is not flattering to me, and anyone reading this while deciding whether to add a track should weigh that honestly rather than take my framing at face value.'
		},
		{
			kind: 'stat',
			value: '4',
			label: 'parallel tracks running through 2024 — a CS degree, a part-time dev job, a senior thesis, and freelance',
			source: 'common/data/experiences.ts'
		},
		{
			kind: 'p',
			text: 'The argument for the timing is narrower but I still believe it. A student is the one person who can take a small, awkwardly scoped, badly estimated job and treat the loss as tuition. The same mistake made two years later, with rent attached, is not a lesson — it is a problem. If the cost of learning to be a supplier is highest when the stakes are highest, then the cheapest moment to start is while something else is paying for your life.'
		},
		{ kind: 'h2', text: 'What the second track was actually for' },
		{
			kind: 'p',
			text: 'The clearest thing freelancing changed was where requirements come from. Inside the factory I absorbed them: I knew what a plaque order looked like because I had watched one move through the building. Working for someone else, none of that is free. You have to ask, write it down, and read it back to them before you write code — and the writing-down is the deliverable, not the courtesy.'
		},
		{
			kind: 'p',
			text: 'The second thing was stack accountability. At the family company a choice I made in 2022 was still mine to maintain in 2026, which sounds like a burden and is actually a luxury: I never had to justify a stack to anyone. A freelance engagement makes you support what you chose, on a schedule you agreed to, for someone who is entitled to ask why. That pressure is why my later freelance work converged on the boring, well-lit end of the ecosystem — [[skill:next-js]], [[skill:typescript]], [[skill:prisma]] — rather than the framework experiment I was running on the thesis at the same time.'
		},
		{
			kind: 'p',
			text: 'The freelance thread never became my main job. It has run underneath every role since — through the degree, through a full-time job, and now alongside a C-suite title at the same factory where the whole thing started. Opening it in a year that was already full is the part I would defend; expecting it to produce something in its first twelve months is the part I got wrong.'
		}
	],
	lessons: [
		'Work you cannot be fired from teaches half the job. The part-time role at the family company taught me delivery; only outside work taught me scoping, pricing, and the possibility of no.',
		'A start date on a career page is a decision, not an output. Mine sat there for a full year before the first freelance project on this site existed, and pretending otherwise would be the easiest lie in the journal.',
		'I would start freelancing as a student again, but not in the same year as a thesis. Being a student is what makes a badly estimated first job affordable; a thesis is what makes any extra track expensive.',
		'Extracting requirements is a skill with its own reps. Being inside a business hides it from you entirely, because the requirements arrive by osmosis and you never learn to ask.'
	],
	faqs: [
		{
			q: 'Is the third year of university a good time to start freelancing?',
			a: 'It is a good time in one specific sense: a student can absorb a badly scoped, badly estimated first engagement as tuition rather than as a financial problem. The caution is what else that year holds. I started in January 2024 alongside a part-time job and a senior thesis, and the first freelance project that survived into my portfolio did not appear until February 2025.'
		},
		{
			q: 'Does working for a family business count as real professional experience?',
			a: 'Yes for delivery, partially for everything else. Building and maintaining production systems for a family company is real work with real consequences, and mine ran for years. What it does not teach is the supplier discipline — extracting requirements from someone whose business you do not live in, scoping in writing, and being told no. Those need an outside client.'
		},
		{
			q: 'How do you freelance while studying full-time and holding a part-time job?',
			a: 'By keeping the freelance track small and accepting that it will be the slowest of your commitments. In 2024 I was running four in parallel — a CS degree, a part-time developer job, a senior thesis, and freelance — and the honest result is that the freelance track produced nothing shippable that year. Treat the first year as opening a door, not as a revenue line.'
		},
		{
			q: 'What changes technically when you go from in-house work to freelance?',
			a: 'Requirement gathering and stack accountability. In-house you absorb requirements by being present; freelance you have to ask, write them down, and read them back before writing code. And a stack you choose for a client is a stack you have to support on an agreed schedule for someone entitled to ask why — which is why my freelance work converged on Next.js, TypeScript, and Prisma rather than on framework experiments.'
		}
	]
}
