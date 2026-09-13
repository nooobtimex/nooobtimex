import type { PostDef } from '../../../interfaces'

// Sources: common/data/experiences.ts (the CTO role description — “sole PM, PO, and UI/UX designer”) + this repo’s own CLAUDE.md conventions and build gates.
export const solePmPoDesigner: PostDef = {
	id: 'sole-pm-po-designer',
	title: 'Sole PM, sole PO, sole designer — and the engineer',
	happenedAt: '2026-08-01',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'ownership',
	category: 'engineering',
	description:
		'My CTO role description lists me as sole PM, PO and UI/UX designer. Four viewpoints in one head, and the implementer wins every argument by default.',
	tldr: 'From 2026-08-01 my role description says I act as **sole PM, PO, and UI/UX designer** on top of being the engineer. The honest version: those are not four jobs I am good at, they are four points of view that are supposed to disagree — and inside one head the implementer wins every argument by default, because the implementer is the one holding the keyboard. What keeps them apart is not discipline. It is **written artifacts and automated gates**: decisions committed before the code that depends on them, and a build that fails when the product promise and the shipped routes disagree.',
	skills: ['typescript', 'next-js', 'seo'],
	relatedProjectIds: ['portfolio', 'rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: 'On 2026-08-01 I became CTO of [[company:ruamsuk-plating]], the trophy and medal manufacturer my family has run since 2006. One clause in [[career:ruamsuk-cto]] describes the part of the job nobody asks about at a trade fair: I act as sole PM, PO and UI/UX designer, and author all product documentation and roadmaps. I am also the person who builds every one of those things.'
		},
		{
			kind: 'p',
			text: 'On paper that reads like efficiency — no handoff, no meetings, no ticket sitting in a column for four days. In practice it removes the friction that those roles exist to create. A PM protects the schedule. A PO protects what the thing is for. A designer protects the person who has to use it. An engineer protects the code. Those four are supposed to argue. When they are one person, the argument still happens; it just happens fast, silently, and with a predetermined winner.'
		},
		{ kind: 'h2', text: 'The implementer wins by default' },
		{
			kind: 'p',
			text: 'Here is the failure mode, stated plainly, because it is mine and it recurs. I write a spec for an internal tool. I start building. I hit a case that is genuinely awkward — a status that can be two things at once, a form that should remember state across a page the user might never come back to. And instead of the spec pushing back, the spec quietly changes. Not in a document. In my head, at 11pm, in the two seconds it takes to decide the edge case is rare.'
		},
		{
			kind: 'p',
			text: 'Nobody catches that, because there is nobody. The scope did not get cut in a meeting where someone could object; it got cut by the only person present, who happened to also be the person for whom cutting it was easiest. Two weeks later the tool ships and does 90% of what the factory floor actually needed, and the missing 10% is exactly the awkward case — which was awkward because the real work is awkward there.'
		},
		{
			kind: 'stat',
			value: '4',
			label:
				'roles the CTO job description assigns to one person — PM, PO, UI/UX designer, and the engineer who has to build it',
			source: 'common/data/experiences.ts on this site'
		},
		{ kind: 'h2', text: 'Written decisions are the only real second person' },
		{
			kind: 'p',
			text: 'The fix I actually use is not willpower. It is that [a decision written down before the code exists](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) cannot be silently overruled by the person writing the code, because it is sitting in the diff, in a file, with a reason attached. It becomes an argument with two sides again — my past self against my present self, and my past self had more context about the user and less about how annoying the implementation was going to be.'
		},
		{
			kind: 'p',
			text: 'This site is the cleanest example I can point at, because it is public. [[project:portfolio]] carries a conventions file that every agent and every future me reads before touching the code, and a section of it is nothing but rules that encode bugs that shipped silently. Each one is a product decision that lost an argument once and is not allowed to lose it again.'
		},
		{
			kind: 'code',
			lang: 'md',
			code: `## SEO — three invariants the build depends on

1. Never set \`alternates\` in \`app/layout.tsx\`.
2. Every \`[...id]\` route needs \`export const dynamicParams = false\`.
3. Detail-route URLs are keyed by \`id\`, never \`slugify(name)\`.`,
			caption:
				'Abridged from this repo’s CLAUDE.md — acceptance criteria written so the future implementer cannot argue with them.'
		},
		{
			kind: 'p',
			text: 'Rule 1 exists because a single `canonical` in the root layout made all 90 routes declare themselves duplicates of the home page — the whole site politely asking Google not to index it, with **no error anywhere** ([the full post-mortem](/blog/root-layout-canonical-90-duplicates)). Rule 2 exists because a streamed loading shell commits a 200 before `notFound()` runs, so every mistyped slug became an indexable soft-404 ([that one too](/blog/loading-tsx-soft-404)). None of those were engineering mistakes I could have caught by being a better engineer. They were product failures — the site did not do what it was for — and a solo engineer is structurally the worst person to notice them.'
		},
		{ kind: 'h2', text: 'Gates are the PO who says no' },
		{
			kind: 'p',
			text: 'The second half is mechanical. If I cannot have a reviewer, I can at least have a build that refuses. The build command on this repo is three gates in a row, and only the middle one is a compiler.'
		},
		{
			kind: 'code',
			lang: 'json',
			code: `"build": "bun run icons:check && next build && bun run links:check"`,
			caption: 'package.json in this repo — the reviewer I do not have.'
		},
		{
			kind: 'p',
			text: '`links:check` is the one that matters for this argument. It walks every internal `href` the site emits and fails if the build did not also emit that route. It exists because of a case where a link looked right, compiled fine, returned HTTP 200, and was still wrong: 60 of 61 skill slugs agreed with their ids, but `Vue.js` slugified to `vue-js` while its id is `vue`, so every Vue link and the sitemap pointed at a 200-status page reading “Skill Not Found”. TypeScript cannot catch that. A PO clicking around for ten minutes would have.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'Where this argument is weakest',
			text: 'Artifacts and gates substitute for the roles I can automate. They do nothing for the role I cannot. **The designer is the hat that suffers**, and no build step will tell me a screen is confusing. I have no user research beyond watching people in our own office use the thing, no second opinion on a layout, and a strong personal aesthetic that I mistake for a good decision more often than I would like. Being fast at all four roles is not the same as being right in any of them, and I would trade a lot of the speed for one honest critic.'
		},
		{ kind: 'h2', text: 'What separation looks like in practice' },
		{
			kind: 'list',
			items: [
				'**Write the spec on a different day than the code.** Not a process rule — a memory rule. The implementer is far less persuasive when he shows up 24 hours later and has to argue against something already committed.',
				'**Write down the reason, not just the rule.** A rule with no reason gets deleted by the next person who finds it inconvenient, and that person is me.',
				'**Encode anything that failed silently.** If a mistake produced no error, willpower will not catch it the second time. Turn it into a gate or accept that it will recur.',
				'**Give the roles different inputs.** The PM hat gets the roadmap file, the PO hat gets whatever the office and factory floor actually complained about this week, the designer hat gets the screen on a real device. Same head, different evidence.'
			]
		},
		{
			kind: 'p',
			text: 'The point of all of this is not that one person can do four jobs. It is that one person doing four jobs loses the disagreement that made the four jobs worth splitting up, and the only way to get it back is to make some of the disagreement external — in files, in gates, in decisions that outlive the mood they were made in. Whether the resulting title should be CTO or something more honest about the shape of the work is its own question. And the tooling I lean on to cover four roles is a separate argument about what AI is actually for.'
		}
	],
	lessons: [
		'I stopped treating “I am the only one here” as a reason to skip writing things down. It is the strongest reason to write things down — there is no one else holding the other half of the decision.',
		'Every bug that shipped without producing an error is a bug I will ship again unless I turn it into a build gate. Discipline has a worse hit rate than a failing exit code.',
		'The design role is the one I cannot automate around, and I should say so instead of implying that four hats fit equally well. Speed at all four is not competence at all four.',
		'If I could change one thing about the arrangement, it would be to find one outside critic for the interface work — not a team, just one person who is allowed to tell me a screen is confusing.'
	],
	faqs: [
		{
			q: 'Can one person be PM, PO, designer and engineer at the same time?',
			a: 'Mechanically yes, and at a small company it is often the only option. What you lose is not capacity but disagreement: those roles exist to push against each other, and when they share a head the person holding the keyboard wins by default. The work-around is to externalize part of the argument into written specs, conventions and automated gates so decisions cannot be silently overruled mid-implementation.'
		},
		{
			q: 'How do you stop scope from silently shrinking when you are the only engineer?',
			a: 'Write the decision and the reason for it down before the implementation exists, ideally on a different day. Once it is committed in a file, changing it costs an explicit edit with a justification instead of a two-second judgement call at 11pm. Anything that failed silently once should become a check the build runs, not something you promise to remember.'
		},
		{
			q: 'What does “sole PM, PO and UI/UX designer” mean on a CTO job description?',
			a: 'At a small limited partnership it means there is no product organization, so the same person sets the roadmap, decides what a system is for, designs the interface, and builds it. It is genuine end-to-end ownership and a genuine structural weakness at the same time — the one role it cannot cover well is design, because no automated check tells you an interface is confusing.'
		},
		{
			q: 'Do build gates really replace code review?',
			a: 'They replace one specific slice of it: the class of mistakes that produce no error. A link check that fails on any internal href the build did not emit catches a wrong slug that compiles, returns 200, and renders a “Not Found” page. It does not catch a bad abstraction, a confusing screen, or a wrong product decision — those still need a person, and if you work alone you simply do not have that coverage.'
		}
	],
	sources: [
		{
			title: 'Michael Nygard — Documenting Architecture Decisions',
			url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions'
		},
		{
			title: 'adr.github.io — Architecture Decision Records',
			url: 'https://adr.github.io/'
		}
	]
}
