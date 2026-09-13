import type { PostDef } from '../../../interfaces'

/** Sources: common/data/experiences.ts (both 2021-08-01 starts), entities.ts (company + Thammasat facts), projects.ts (rs-award 2022-03-01), personal.ts (birthDate), posts/2026/how-i-became-cto-at-23.ts and plan-was-2030-came-back-2026.ts. */
export const startedJobAndDegreeSameMonth: PostDef = {
	id: 'started-job-and-degree-same-month',
	title: 'I started my first dev job and my CS degree in the same month',
	happenedAt: '2021-08-01',
	publishedAt: '2026-08-25',
	chapter: 'student',
	category: 'engineering',
	description:
		"August 2021: a part-time developer job at my family's trophy factory and a CS degree at Thammasat, both dated 2021-08-01. What that month set in motion.",
	tldr: "In August 2021 I started my first developer job — part-time at [[company:ruamsuk-plating]], my family's trophy and medal factory — and my B.S. in Computer Science at Thammasat, both dated 2021-08-01 in this site's career data. I was 18. The job and the degree ran in parallel for almost four years, and the pattern that month set — studying and shipping at the same time — ended with the same company making me CTO exactly five years later.",
	relatedExperienceIds: ['ruamsuk-software-engineer-part-time', 'thammasat-bs-cs'],
	relatedEntityIds: ['ruamsuk-plating'],
	skills: ['wordpress', 'seo'],
	body: [
		{
			kind: 'p',
			text: "On 2021-08-01 I started two things at once: a part-time developer job at my family's trophy and medal factory, and a computer science degree at Thammasat University ([[career:thammasat-bs-cs]]). Both lines on this site's career timeline carry the same start date. I did not plan the symmetry — enrollment set one date and the company set the other — but no month since has set as much in motion."
		},
		{
			kind: 'p',
			text: "I was 18. My father, the CEO, ran the company — a Thai limited partnership founded in 2006, fifteen years old that August, with an in-house facility for zinc casting, laser engraving, and metal electroplating in Pathum Thani. Thammasat's Rangsit campus sits in the same province. For the next four years I moved between the two."
		},
		{ kind: 'h2', text: 'The job existed because of my father. The work still had to hold up' },
		{
			kind: 'p',
			text: 'Let me scope the word “hired” honestly: I did not pass an interview. The job existed because my father ran the company and I was the son who had been helping around the factory since high school. That fact bought me the seat and nothing else. What I could control was whether the work held up — and that question does not care whose son you are. A broken page is broken whoever deployed it.'
		},
		{
			kind: 'p',
			text: "It also came with a cost I only priced correctly years later. Taking the family job meant no internships anywhere else and no exposure to how an engineering team runs — code review, release processes, architecture someone else chose. My first external employer came four years later, in 2025, and I ended up spending a full year at a SET-listed company partly to close that exact gap. If you want credibility that is legible outside your family's firm, this path defers it. I would still take it — but it was a real trade, not a free ride."
		},
		{ kind: 'h2', text: 'What a first dev job looks like before there is anything to develop' },
		{
			kind: 'p',
			text: "The title said developer. The record says the first storefront project on my own timeline — [[project:rs-award]], first built on WordPress — does not start until March 2022, seven months after I did. The early months were groundwork instead: the company's web presence, search and online-marketing basics, and learning the legacy, paper-based workflows that the next four years of [[career:ruamsuk-software-engineer-part-time]] would slowly move onto the web."
		},
		{
			kind: 'p',
			text: "I already knew the building — I had helped around the factory in high school — but helping as the owner's kid and being expected to modernize how the place works are different jobs. The first one requires showing up. The second one requires understanding why a workflow survived fifteen years before you decide you can replace it."
		},
		{ kind: 'h2', text: 'Running the degree and the job in parallel' },
		{
			kind: 'p',
			text: 'From that month on, everything ran in parallel: a full course load plus the part-time job, three years and ten months of overlap before either track ended. The degree gave me foundations in the usual order — algorithms, data structures, databases, operating systems. The job gave me a reason to need them the same week. Later the parallel track widened rather than closed: freelance work from my third year, and a senior thesis — QR Food — that I built and defended like a product rather than a paper.'
		},
		{
			kind: 'stat',
			value: '3 yr 10 mo',
			label: 'the part-time job and the degree ran in parallel — 2021-08-01 to 2025-05-31',
			source: "this site's own career data"
		},
		{
			kind: 'p',
			text: 'The honest version of how those years looked day to day is thinner than the arc suggests: classes, website work in the WordPress era, small fixes for a small company. Milestones only look like milestones from a distance.'
		},
		{ kind: 'h2', text: 'Why this month earned a post' },
		{
			kind: 'p',
			text: 'Because of the date it rhymes with. Exactly five years later, on 2026-08-01, the same company made me its Chief Technology Officer ([[career:ruamsuk-cto]]). Nobody could have promised that in August 2021 — least of all me, an 18-year-old with two start dates and no shipped work. But every later post in this journal stands on the pattern this month set: study and ship at the same time, and stay somewhere long enough for the consequences to be yours.'
		}
	],
	lessons: [
		'Start applying the degree the same month it starts, if you can. Four years of needing the coursework at work the week I learned it taught me more than either track alone would have.',
		'I would plan earlier for what a family company cannot teach — how engineering teams run. I only closed that gap with a year at a listed company in 2025, and it was the single biggest missing piece.',
		"Being the owner's son got me the seat; it could not do the work. Keeping those two facts separate — and letting the shipped record answer for the second — mattered more than either fact alone."
	],
	faqs: [
		{
			q: 'Can you work a part-time developer job while studying computer science full-time?',
			a: "I did, for three years and ten months — the job and the degree started on the same date, 2021-08-01, and overlapped until the degree's final months. It worked because the employer was flexible around classes and because the two tracks fed each other instead of competing: coursework supplied foundations, the job supplied reasons to use them that week. The real cost was everything else the time could have gone to, starting with internships."
		},
		{
			q: "Is working for your family's business a good first developer job?",
			a: 'It was for me, with an honest caveat on each half. The good: real consequences from day one, broad ownership, and a business that needed the work rather than a program that tolerated an intern. The caveat: zero exposure to engineering teams, and a credibility question you can only answer with output — I later spent a year at a SET-listed company to close the team-experience gap, and I would plan for that from the start.'
		},
		{
			q: 'Do you need experience to get a part-time developer job as a student?',
			a: 'I am the wrong person to ask about getting hired — my first job existed because my father ran the company, and I will not dress that up. What I can speak to is surviving the job without experience: a small business has real problems that do not care about your resume, and shipping fixes to them built the record that got me my first external job in 2025 through an exam and a take-home assignment, not a connection.'
		},
		{
			q: 'What does a developer actually do at a small manufacturer at first?',
			a: 'Less than the title implies at first, then more. My first storefront project did not start until March 2022 — seven months in. The early months were web presence, SEO groundwork, and learning the paper workflows I would later help move onto the web; after that the role became genuinely full-stack, from storefronts to analytics to the slow digitization of manual processes.'
		}
	]
}
