import type { PostDef } from '../../../interfaces'

// Sources: memory/topics/career-history.md (the plan, JTS hiring, daily updates, the return) + common/data/experiences.ts (role dates).
export const planWas2030CameBack2026: PostDef = {
	id: 'plan-was-2030-came-back-2026',
	title: 'The plan was to come back in 2030. I came back in 2026.',
	happenedAt: '2026-08-01',
	publishedAt: '2026-08-25',
	chapter: 'ownership',
	category: 'engineering',
	description:
		'The plan said Senior at JTS, then back to the family company in 2030 as Technical Lead. Instead: CTO on 2026-08-01 — four years early, one level higher.',
	tldr: "The plan I carried into my year away said: reach Senior at [[company:jasmine-technology-solution]], build a web career at scale, and return to my family's trophy company around 2030 as Technical Lead or Architect. Instead I came back on 2026-08-01 as **CTO — four years early, one level higher** than the plan's target. The date moved because everything the plan was waiting on turned out to be already done: trust was banked through five prior years and a year of daily proof, the company needed its systems owned now, and the role on offer was bigger than the one I was staying away to qualify for.",
	relatedProjectIds: ['looklook-pet', 'monomax-epl-portal'],
	relatedExperienceIds: ['jasmine-tech', 'ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating', 'jasmine-technology-solution'],
	body: [
		{
			kind: 'p',
			text: 'On 2026-08-01 I became CTO of [[company:ruamsuk-plating]] — RS Trophy, the trophy and medal company my family has run for twenty years, with my father, the CEO, at the head of it. That date was not the plan. The plan I actually carried into my year away said 2030, and it said Technical Lead or Architect, not CTO. I came back four years early and one level higher, and the interesting part is not that the plan lost. It is what the plan got wrong — and what it quietly got right.'
		},
		{
			kind: 'p',
			text: "The plan had three steps. Get hired at [[company:jasmine-technology-solution]] — JTS, a real engineering organization. Climb to Senior there and build a serious web career at a scale my family's company could never provide. Then, around 2030, come back to RS Trophy as its Technical Lead or Architect — credentialed, finished, with nothing left to prove."
		},
		{ kind: 'h2', text: 'The 2030 plan, and why it made sense' },
		{
			kind: 'p',
			text: 'The first step ran exactly on schedule. I took the JTS exam in April 2025 and did the take-home assignment at home over Songkran — the Thai New Year holiday. About two weeks before my last day at RS Trophy, the word came back that I had passed. I told my father, the CEO, and went.'
		},
		{
			kind: 'p',
			text: "The plan's logic still holds up. Four years part-time at a family company teaches ownership, but it cannot teach you how a real engineering team works — code review, release process, architecture you did not choose and have to understand anyway. Senior was the external proof I thought the return required: a title earned on a ladder my family did not own. And 2030 was simply the year the math said that proof would be complete. It was a good plan. I want that on the record before I explain why I abandoned it."
		},
		{ kind: 'h2', text: 'The year that ran ahead of the plan' },
		{
			kind: 'p',
			text: '[[career:jasmine-tech]] ran from 2025-07-16 to 2026-07-31 — a year and two weeks. In that year I was the architect and lead full-stack developer of [[project:looklook-pet]], and in the final two months I shipped the [[project:monomax-epl-portal]], an EPL broadcast-licensing platform. The plan had budgeted roughly five years for the away leg, because it assumed experience accrues with tenure. It accrued with responsibility instead, and responsibility arrived in month one.'
		},
		{
			kind: 'p',
			text: 'There was also a channel the plan never modeled. Most days that year I told my father, the CEO, what I had been doing at JTS — partly a report, mostly “โม้” (Thai for boasting, the affectionate kind): that I was in the rooms where the product was being thought through, not just closing tickets. He kept asking one question back — when was I coming home. I had an answer, 2030, and a year of daily proof was quietly making it obsolete.'
		},
		{ kind: 'h2', text: 'Why 2030 collapsed into 2026' },
		{
			kind: 'p',
			text: 'When the chance to return came, it was not the job the plan had reserved for 2030. It was [[career:ruamsuk-cto]] — ownership of every technology decision in the company, end-to-end. Three things made the early return the right call, and none of them appeared anywhere in the plan.'
		},
		{
			kind: 'list',
			items: [
				'**Trust was already banked.** The plan treated 2030 as the year I would finally have proved enough. But the proof had a live audience the whole time — five years of work inside the company before I left, then a year of daily updates from the outside. There was no committee waiting to inspect a Senior title. The one person it was supposed to convince was already convinced.',
				'**The timing belonged to the company, not to me.** The systems needed an owner in 2026. Technology decisions were going to be made over the next four years either way — by whoever was there. Coming back in 2030 meant inheriting four years of decisions instead of making them.',
				"**The role on offer was bigger than the role in the plan.** The plan's finish line was Technical Lead or Architect. What was actually on the table was CTO — everything technical, strategy included. Staying away four more years to qualify for a smaller job than the one being offered is the exact point where a plan stops being discipline and starts being stubbornness."
			]
		},
		{
			kind: 'p',
			text: 'And part of it was never strategic at all. I wanted to come back and help. The office is at home now and I can work from anywhere — a detail I rated too low when I was planning, and one of the things I would now defend hardest about the whole arrangement.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The case against my own decision',
			text: 'The plan was right about the thing it was built to protect: four more years inside a larger engineering organization would have made me a better engineer, full stop. I walked away from the Senior ladder, from code review by people ahead of me, and from watching a system age past year one — the year most of my JTS lessons came from. As an organization of one there is a real plateau risk: nobody reviews my work now. I traded depth for scope, and I will not know for years whether I priced that trade correctly.'
		},
		{
			kind: 'stat',
			value: '4 years',
			label: 'how far the return moved up — planned ~2030 as Technical Lead / Architect, actual 2026-08-01 as CTO',
			source: "my own plan against the role dates in this site's career data"
		},
		{ kind: 'h2', text: 'What the plan was actually for' },
		{
			kind: 'table',
			head: ['', 'The plan', 'What happened'],
			rows: [
				['Return year', '~2030', '2026'],
				['Role coming back', 'Technical Lead / Architect', 'CTO'],
				['Time away', 'Roughly five years, reaching Senior', 'A year and two weeks as a developer'],
				['What ended the wait', 'A seniority milestone', 'Trust, timing, and a bigger role than planned']
			]
		},
		{
			kind: 'p',
			text: 'The plan was superseded, not refuted. Its core instruction — leave, learn how real teams build software, bring that back — executed exactly as written; only the schedule compressed by four years. What broke was one assumption underneath it: that readiness accrues in fixed annual installments, and that trust waits politely until the credential is finished. Readiness turned out to track responsibility, and trust turned out to have been accruing the whole time — through twenty years of the company existing and five years of me working inside it. A plan can be wrong about every number in it and still be the reason you end up in the right place.'
		}
	],
	lessons: [
		'Write the plan anyway. Mine was wrong about the date and the title, and it was still what made the right decision recognizable — I could only see that the 2026 offer exceeded the 2030 target because I had a target.',
		'Measure a return by trust banked, not years served. A year of daily proof to the one person the plan was meant to convince moved the date more than a Senior title ever would have.',
		"Treat a plan's dates as estimates and its direction as the commitment. I nearly did the reverse — defending 2030 as if the year itself were the point.",
		'Name what you gave up. Four more years at scale would have made me a deeper engineer; I chose scope earlier instead. Saying that plainly is the only way the decision stays honest.'
	],
	faqs: [
		{
			q: 'Should you return to a family business earlier than planned?',
			a: 'The planned date matters less than three tests: is the trust already there, does the business need the ownership now, and is the role on offer at least as big as the one you were waiting to qualify for? In my case all three said 2026, four years ahead of my plan. If any one of them had failed, the original date should have stood.'
		},
		{
			q: 'How much outside experience do you need before joining a family business?',
			a: 'My plan said roughly five years and a Senior title. What actually transferred was one intense year of team-scale engineering — architecture I did not choose, code review, release process, and leading full-stack delivery inside a larger organization. Measure it in what you can now own that you could not before, not in years. The title I was waiting for turned out to be proof for an audience that did not exist.'
		},
		{
			q: 'Is it a mistake to abandon a five-year career plan?',
			a: "Not when the plan's goal arrives early through a different door. Mine existed to make a strong return to the family company possible around 2030; when a bigger version of that return became available in 2026, following the plan would have meant preferring the schedule to the goal. The mistake is abandoning the direction, not the dates."
		},
		{
			q: 'What can a year at a large company teach that a family business cannot?',
			a: "How software gets built beyond one person: working inside an engineering team, defending architecture to people who can push back, review culture, and shipping under someone else's release process. In my year that meant leading full-stack development of a pet-services platform and building an EPL broadcast-licensing portal. That single year did most of the work my plan had budgeted five years for."
		}
	]
}
