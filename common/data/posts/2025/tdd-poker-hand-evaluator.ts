import type { PostDef } from '../../../interfaces'

/** Sources: the online-poker-game timeline in common/data/projects.ts (2025-06-09 kickoff, the 2025-06-11 test-driven hand evaluator, the 2025-06-12 showdown and deck logic), the project description, and common/data/experiences.ts for the roles that week. Poker combinatorics and TDD technique are general knowledge. */
export const tddPokerHandEvaluator: PostDef = {
	id: 'tdd-poker-hand-evaluator',
	title: 'Test-driving a poker hand evaluator',
	happenedAt: '2025-06-11',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'engineering',
	description:
		'Why a poker hand evaluator is the rare piece of software worth writing strictly test-first — a finite, published, fully verifiable spec.',
	tldr: 'A hand evaluator has a closed specification: nine hand categories, a total order over them, and exactly 2,598,960 distinct five-card hands. That is the profile of a problem where you can write the expected answer before the code, so I built the evaluator on [[project:online-poker-game]] test-first and let the comparison rules — kickers, the wheel, exact ties that split a pot — arrive as failing tests. It worked because the domain was closed. The same discipline did nothing for the parts of the game where I could not state **correct** in advance.',
	skills: ['typescript', 'next-js'],
	relatedProjectIds: ['online-poker-game'],
	relatedExperienceIds: ['freelance'],
	body: [
		{
			kind: 'p',
			text: "On 11 June 2025 the hand evaluator landed on [[project:online-poker-game]]. I had kicked the Texas Hold'em build off two days earlier, on 9 June, and on the same day the evaluator went in I also shipped live room state over Server-Sent Events — [that transport decision is its own post](/blog/sse-game-rooms-not-websockets). That week I was full-time at my family's trophy factory, three weeks from finishing a Computer Science degree, and the poker build was [[career:freelance]] work in the hours around both."
		},
		{
			kind: 'p',
			text: 'The evaluator was the first thing I wrote, and the milestone I recorded for it says [test-driven](https://martinfowler.com/bliki/TestDrivenDevelopment.html), with dedicated unit suites for the ranking logic. The day after, showdown resolution and deck management landed with full unit-test coverage too. That was not discipline for its own sake. It was that a poker hand evaluator is the rare piece of software whose specification is finite, published, and older than software.'
		},
		{ kind: 'h2', text: 'A closed domain is what TDD is actually for' },
		{
			kind: 'p',
			text: 'Test-first asks you to state the expected answer before you write the code. That is easy to say and genuinely hard to do when you do not yet know what correct looks like, which is most product work and nearly all UI work. Hand ranking has none of that ambiguity.'
		},
		{
			kind: 'list',
			items: [
				'**The categories are fixed.** Nine of them, from high card to straight flush, and a royal flush is not a tenth — it is the top straight flush.',
				'**The order is total.** Any two hands compare. There is no undefined pair, no context, no house preference.',
				'**Ties are exact, not approximate.** Two hands are either equal — split the pot — or one wins. Nothing in between.',
				'**The input space is enumerable.** You can, if you want, evaluate every hand that exists and assert the distribution.'
			]
		},
		{
			kind: 'stat',
			value: '2,598,960',
			label: 'distinct five-card hands from a 52-card deck — the entire input domain of the evaluator',
			source: 'C(52,5)'
		},
		{
			kind: 'p',
			text: "Hold'em hands you seven cards, so the evaluator picks the best five of seven. There are only 21 such subsets, which means the seven-card case is a loop over `C(7,5)` and a maximum, not a separate algorithm. Writing that test first is how I found out I did not need a second code path."
		},
		{ kind: 'h2', text: 'Comparison, not classification' },
		{
			kind: 'p',
			text: 'The first test I wrote was not that a hand is a flush. It was that one hand beats another. Classification is the easy half and it is not what the game needs — the game needs an order, because at showdown the pot goes to a maximum and possibly to several equal maxima. So the evaluator returns something comparable rather than a label. A category rank plus tie-break ranks in descending significance covers every case with one comparison rule, and the label falls out of the first element when the UI wants to print it.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the return shape that makes ties fall out for free.',
			code: 'type Score = readonly number[] // [category, ...tiebreakers]\n\nfunction compare(a: Score, b: Score): number {\n\tfor (let i = 0; i < Math.max(a.length, b.length); i++) {\n\t\tconst d = (a[i] ?? 0) - (b[i] ?? 0)\n\t\tif (d !== 0) return d\n\t}\n\treturn 0 // exactly equal — the pot splits\n}'
		},
		{
			kind: 'p',
			text: 'That last `return 0` is the line that matters. A split pot is not an edge case bolted on later; it is the natural result of the comparison being a real total order. If the evaluator had returned an enum plus some ad-hoc kicker logic, equality would have been something I had to remember to check.'
		},
		{ kind: 'h2', text: 'The cases the tests actually caught' },
		{
			kind: 'list',
			items: [
				'**The wheel.** `A-2-3-4-5` is a straight, and the ace is low, so it is the weakest straight — not the strongest.',
				'**Kickers, to the exact depth.** One pair compares three kickers, two pair compares one, trips compare two. Stopping a card early silently turns wins into splits.',
				'**The board plays.** When the best five cards are all community cards, every remaining player ties. That is a correct outcome, not a bug.',
				'**A straight flush is not a straight and a flush.** Category first, always.',
				"**Suits never break ties.** In Hold'em there is no suit order, so two identical hands in different suits are equal, full stop."
			]
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the shape of the wheel test, written before the straight detection.',
			code: 'test("the wheel is the lowest straight", () => {\n\tconst wheel = score(hand("As 2h 3d 4c 5s"))\n\tconst sixHigh = score(hand("2s 3h 4d 5c 6s"))\n\n\texpect(category(wheel)).toBe(Category.Straight)\n\texpect(compare(wheel, sixHigh)).toBeLessThan(0)\n})'
		},
		{ kind: 'h2', text: 'Where test-first stopped helping' },
		{
			kind: 'p',
			text: 'I have to argue against my own method here, because I did not write the rest of the game this way and I do not regret it. The realtime layer, the table UI, the timing of a betting round — for those I could not write the assertion first, because the specification was my own judgement and it changed the moment I saw the thing running. Writing tests first against a spec you are still inventing produces tests that encode your first guess, and then you maintain the guess.'
		},
		{
			kind: 'p',
			text: 'The honest cost of the approach even where it fits: the comparison suite is bigger than the code it checks. A total order over nine categories has more interesting cases than the function that produces the order. If you measure by lines written per feature shipped, test-driving the evaluator looks like a bad trade on day one. It only pays back later.'
		},
		{
			kind: 'callout',
			tone: 'info',
			title: 'The heuristic I use now',
			text: 'Write the test first when the specification exists outside your head — a protocol, a rule book, a format, a piece of arithmetic. When the specification **is** your head, build the thing, look at it, then write tests to pin down what you decided.'
		},
		{ kind: 'h2', text: 'What it paid back' },
		{
			kind: 'p',
			text: 'Twice, concretely. On 5 July I tore the engine apart into separate pot, position and betting modules — that refactor is here — and the evaluator was the one component I could move without reading it, because its tests said exactly what it promised. Then on 29 August I built Monte Carlo win probability, which is nothing but the evaluator called an enormous number of times. A simulation is only as trustworthy as the function inside the loop, and by then that function had already been argued with.'
		}
	],
	lessons: [
		'I now check for a closed specification before reaching for test-first. Finite inputs, a published rule set, an exact notion of equality — that combination is where writing the assertion first is cheapest and most useful.',
		'Returning a comparable value instead of a label removed a whole class of bug. Split pots stopped being special the moment equality was just a comparison returning zero.',
		"I should have written the seven-card test earlier. It proved the five-card evaluator was the entire algorithm, and I would have spent less time wondering whether Hold'em needed its own path.",
		'Tested code is portable code. The evaluator survived a full engine refactor untouched, and that had nothing to do with how it was written and everything to do with the fact that its contract was already written down.'
	],
	faqs: [
		{
			q: 'Is a poker hand evaluator a good candidate for test-driven development?',
			a: 'It is close to the ideal candidate. The rules are published, the categories are fixed at nine, ties are exact rather than approximate, and the input space is finite — 2,598,960 distinct five-card hands. You can write every expected answer before writing any code, which is the precondition test-first actually needs.'
		},
		{
			q: 'Should a hand evaluator return the hand type or a comparable score?',
			a: 'A comparable score. The game needs an ordering, not a label: at showdown you take a maximum and you must detect exact ties so the pot can split. Returning a category rank followed by tie-break ranks gives you comparison and the label from the same value.'
		},
		{
			q: 'What are the edge cases that break most hand evaluators?',
			a: 'The wheel — `A-2-3-4-5` is a straight with the ace low, so it is the weakest straight rather than the strongest. After that: comparing kickers to the wrong depth, treating a straight flush as a straight plus a flush, and forgetting that when the best five cards are the community cards everyone ties.'
		},
		{
			q: 'How do you evaluate the best five-card hand out of seven?',
			a: 'Enumerate the 21 five-card subsets of the seven cards, score each one, and take the maximum. There is no need for a separate seven-card algorithm, because `C(7,5)` is only 21 combinations and the five-card evaluator is already the whole rule set.'
		},
		{
			q: 'When is test-first the wrong approach?',
			a: 'When the specification is still your own judgement. If you cannot state the expected result before writing the code — most UI, most product decisions, anything whose correctness you will only recognise once you see it — tests written first just encode your first guess, and then you maintain the guess.'
		}
	],
	sources: [
		{
			title: 'Martin Fowler — Test Driven Development',
			url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html'
		},
		{
			title: 'List of poker hands — the ranking the tests encode',
			url: 'https://en.wikipedia.org/wiki/List_of_poker_hands'
		}
	]
}
