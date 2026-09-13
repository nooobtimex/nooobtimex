import type { PostDef } from '../../../interfaces'

export const howIBecameCtoAt23: PostDef = {
	id: 'how-i-became-cto-at-23',
	title: 'How I became CTO at 23 of the company that hired me as a part-time student',
	happenedAt: '2026-08-01', // the event — the CTO start date
	publishedAt: '2026-08-25',
	chapter: 'ownership',
	category: 'engineering',
	description:
		'Hired part-time in August 2021, CTO of the same company in August 2026 — five years to the month. What actually happened in between, honestly scoped.',
	tldr: 'On 2021-08-01 I started a part-time developer job and a computer science degree in the same month. On 2026-08-01 — five years later to the month — I became CTO of that same company, RS Trophy, at 23. The path ran through four years of part-time work while studying, a 45-day full-time bridge, and one year at a SET-listed telecom. A CTO title at a small limited partnership means owning every technology decision alone, not leading an engineering org — and saying that plainly is the point of this post.',
	skills: ['next-js', 'wordpress', 'seo', 'bun-js', 'railway'],
	relatedProjectIds: ['rs-trophy', 'looklook-pet'],
	relatedExperienceIds: [
		'ruamsuk-software-engineer-part-time',
		'ruamsuk-software-engineer-full-time',
		'jasmine-tech',
		'ruamsuk-cto'
	],
	relatedEntityIds: ['ruamsuk-plating', 'jasmine-technology-solution'],
	body: [
		{
			kind: 'p',
			text: 'Two dates, exactly five years apart. On 2021-08-01 I started as a part-time developer at [[company:ruamsuk-plating]] — a trophy and medal manufacturer with a factory floor — the same month I enrolled in computer science at Thammasat. On 2026-08-01 I became its Chief Technology Officer. This is the honest version of what happened in between, with the parts a LinkedIn headline leaves out.'
		},
		{ kind: 'h2', text: 'Four years part-time, in parallel with a degree' },
		{
			kind: 'p',
			text: 'From August 2021 to May 2025 — three years and ten months — I was [[career:ruamsuk-software-engineer-part-time]] while carrying a full course load. The work was unglamorous and formative in equal measure: building WordPress and WooCommerce storefronts for the company brands ([[project:rs-trophy]] started as one of them), wiring analytics and ads, and slowly moving paper workflows onto the web.'
		},
		{
			kind: 'p',
			text: 'The honest observation about those years: a small company gives a student something no internship does — **consequences**. When the storefront broke, it was mine. When SEO worked, orders came in and everyone knew why. Four years of that teaches ownership faster than any curriculum.'
		},
		{ kind: 'h2', text: 'The 45-day bridge' },
		{
			kind: 'p',
			text: 'In June 2025, straight out of the degree, I converted to full-time — and left 45 days later, on 2025-07-15, for [[company:jasmine-technology-solution]]. Both sides knew the shape of it at the time: the conversion kept continuity while I finished handover, and the move was already planned. I have mixed feelings about how clean that reads in hindsight, but the proof it ended well is the rest of this story — thirteen months later the same company asked me back to run technology.'
		},
		{ kind: 'h2', text: 'One year at a listed company' },
		{
			kind: 'p',
			text: 'The [[career:jasmine-tech]] year was the counterweight to everything the small-company years could not teach. On [[project:looklook-pet]] I worked inside a real engineering team — microservices over a message bus, code review, release processes, other people’s architectural decisions that I had to understand before I was allowed to dislike them. I owned about 55% of the commits on the B2B partner portal, which also means someone else owned the other 45% — coordinating that was the actual lesson.'
		},
		{
			kind: 'p',
			text: 'The transitions on both ends were zero-day: RS ended 2025-07-15, JTS started 2025-07-16; JTS ended 2026-07-31, the CTO role started 2026-08-01. Not a day of gap in either direction. I did not plan it as a symbol, but it is an accurate one — each role was the direct continuation of the last.'
		},
		{ kind: 'h2', text: 'What "CTO" means at a small limited partnership' },
		{
			kind: 'p',
			text: 'Here is the scoping a title like this owes you. RS Trophy is a small limited partnership, not a tech company. My CTO role has no engineering org under it — it is **total technology ownership by one person**: technical strategy, then also building every system myself, from architecture to deployment. It includes the unglamorous whole of it — IT support, hardware, networking, and technology procurement across an office and a factory floor. I am also the sole PM, PO and designer, which mostly means the person who writes the spec argues with the person who implements it inside one head.'
		},
		{
			kind: 'stat',
			value: '5 years, 0 days',
			label: 'from part-time student hire (2021-08-01) to CTO (2026-08-01), same company',
			source: 'the dates in this site’s own career data'
		},
		{
			kind: 'p',
			text: 'Is that a "real" CTO job? It is a real version of one — the version where the title measures breadth of responsibility, not headcount. A CTO at a listed company and I share maybe a third of a job description. I would rather state that plainly than let the title imply the other two thirds.'
		},
		{ kind: 'h2', text: 'Why come back' },
		{
			kind: 'list',
			items: [
				'**Leverage**: at a small company, one good technical decision changes the whole business. The distance between shipping and impact is a day, not a quarter.',
				'**Trust already earned**: five years of history means no probation period on judgment — the mandate was total from day one.',
				'**The work is genuinely full-stack**: strategy in the morning, a Bun monorepo in the afternoon, a factory-floor network problem at five.'
			]
		}
	],
	lessons: [
		'Stay long enough somewhere for your work to have consequences you personally absorb. That, not the stack, is what compounds.',
		'Leaving was necessary: the year away is what made coming back a promotion instead of a continuation.',
		'Scope your own title before someone else does. "CTO of a small LP, org of one" is a stronger sentence than an unqualified "CTO" — because it is verifiable.'
	],
	faqs: [
		{
			q: 'Can you become a CTO without big-company experience?',
			a: 'At a small company, yes — the role is total ownership rather than org leadership. My path was five years of accumulating trust at one company (four of them part-time as a student), plus exactly one year inside a larger engineering team to see how structured teams actually work. The title measures responsibility breadth, and that you can build early.'
		},
		{
			q: 'Is a CTO title at a small company meaningful?',
			a: 'It is meaningful and it is different — and both halves matter. Meaningful: every technology decision, budget, and failure is genuinely yours. Different: there is no engineering org, so it develops ownership and range rather than management skills. Stating that scope plainly makes the title credible; letting it imply a big-company role does the opposite.'
		},
		{
			q: 'Should you go back to a former employer?',
			a: 'It worked for me under specific conditions: I left cleanly with handover, stayed away long enough to bring back something new (a year of team-scale engineering practice), and returned one level up with a broader mandate. A boomerang without any of those three is just going back.'
		},
		{
			q: 'What does a CTO actually do at a small manufacturer?',
			a: 'Everything technical, literally: web applications and infrastructure, CI/CD and reliability, IT support, hardware and networking for the office and factory, technology procurement and vendor management, plus product documentation and roadmaps. The software half looks like a startup CTO-of-one; the other half looks like an IT department of one. Both halves are the job.'
		}
	]
}
