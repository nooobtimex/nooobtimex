import type { PostDef } from '../../../interfaces'

/**
 * Sources (rs-trophy.com, private): cb0b9eb9 (the fix), 92a239ed (the source-scanning guard + mutation
 * test), 6f9ed9a5 (the docs and agent skill files), ec206963 (scan floor 12 → 11); id origins via
 * `git log -S`: 5507d7ea (publish, 2026-06-22), 2b204c5d (restage), ebc4142c (sample), 13d36a9b
 * (generate), 3c23f2b4 (clean). BullMQ 6.0.9's predicate read in node_modules (job.js:912) and run
 * against the old ids; the 1,034 / 1,066 suite sizes re-run on snapshots of 4a5e320c and e07450e3.
 */
export const bullmqCustomIdColon: PostDef = {
	id: 'bullmq-custom-id-colon',
	title: "Why BullMQ throws 'Custom Id cannot contain :' — and 1,034 green tests missed it",
	happenedAt: '2026-08-24',
	publishedAt: '2026-08-24',
	chapter: 'ownership',
	series: { id: 'social-autopilot', part: 5 },
	category: 'engineering',
	description:
		'BullMQ refuses a custom job id with a colon. Four of my five id builders used one, and 1,034 green tests spied on queue.add and never noticed.',
	tldr: 'BullMQ throws `Custom Id cannot contain :` when a custom `jobId` holds a colon — it only lets exactly two through, for old repeatable jobs. Four of the five stable id builders in my family\'s trophy company\'s API were written `prefix:${id}`, so scheduled publishing, "Generate now", sample renders and plate cleans could not enqueue, while 1,034 unit tests stayed green: they spied on `queue.add`, which proves an id is stable, never that BullMQ accepts it. The fix was hyphens plus a test that scans the source for every id builder and was mutation-tested to prove it can fail.',
	skills: ['bullmq', 'redis', 'typescript', 'bun-js', 'elysia-js'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "On the morning of 2026-08-24, an upload route in the [[project:rs-trophy]] admin API — the platform I run as [[career:ruamsuk-cto]] at [[company:ruamsuk-plating]] — returned a 500 with nothing in the log. The route saved a photo template's background plate, then queued a preview render of it. I was working through the social auto-posting module with an AI coding agent, as I did for most of that month, and isolating the enqueue on its own finally produced the real message: `Custom Id cannot contain :`."
		},
		{
			kind: 'p',
			text: 'That string comes from [[skill:bullmq]]. A custom `jobId` is how you make a job idempotent — enqueue the same id twice and the queue keeps one — and every stable id in the social module was built the same way: `publish:${postId}`, `sample:${templateId}`, `generate:${ruleId}`, `clean:${templateId}`. BullMQ refuses all four at `queue.add`. Scheduled publishing, "Generate now", the template sample render and the AI plate clean could not enqueue a single job between them.'
		},
		{
			kind: 'stat',
			value: '1,034',
			label: 'API tests, all green, on the merge that shipped a "Generate now" job BullMQ could never accept',
			source: 'commit 92a239ed; reproduced by re-running a snapshot of that merge'
		},
		{ kind: 'h2', text: 'What BullMQ actually refuses' },
		{
			kind: 'p',
			text: "The [BullMQ docs on job ids](https://docs.bullmq.io/guide/jobs/job-ids) say a custom id must not contain `:`, because it is the separator in BullMQ's [[skill:redis]] keys, and suggest `-` or `_` instead. The thrown error is newer than the advice. It arrived in [a pull request merged in September 2025](https://github.com/taskforcesh/bullmq/pull/3384), fixing [an issue filed by a stranger](https://github.com/taskforcesh/bullmq/issues/3382) whose flow children came back `undefined` because their ids held colons. I read [the check itself](https://github.com/taskforcesh/bullmq/blob/v6.0.9/src/classes/job.ts#L1354) in the version our lockfile pinned, bullmq 6.0.9 — `job.js:912` in the installed package — and ran the old ids through it:"
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'The rule in bullmq 6.0.9 (job.js:912), paraphrased as a predicate, with what the old ids returned when fed through the real validation.',
			code: "const rejected = (id: string) =>\n\tid.includes(':') && id.split(':').length !== 3\n\nrejected('publish:507f1f77')     // true  → throws 'Custom Id cannot contain :'\nrejected('clean:507f1f77')       // true  → throws\nrejected('restage:507f1f77:7')   // false → exactly two colons: let through\nrejected('publish-507f1f77')     // false"
		},
		{
			kind: 'p',
			text: "Read the predicate closely and the commit message I merged that morning is wrong in one place. It said every custom job id was illegal. Exactly two colons pass — a compatibility branch for old repeatable jobs, which BullMQ's own comment marks for replacement in its next breaking change. Photo Studio's `restage:${batchId}:${index}` had exactly two. So four of five builders were broken, not five, and photo restaging was never blocked by this. It was hyphenated anyway: leaning on a branch scheduled for deletion is the same bug on a slower timer."
		},
		{
			kind: 'table',
			head: ['builder', 'written as', 'since', 'bullmq 6.0.9'],
			rows: [
				['publish', '`publish:${postId}`', '2026-06-22', 'throws'],
				['restage', '`restage:${batchId}:${index}`', '2026-08-10', 'accepted — two colons'],
				['sample', '`sample:${templateId}`', '2026-08-22', 'throws'],
				['generate', '`generate:${ruleId}`', '2026-08-23', 'throws'],
				['clean', '`clean:${templateId}`', '2026-08-24', 'throws']
			]
		},
		{ kind: 'h2', text: 'Why 1,034 green tests could not see it' },
		{
			kind: 'p',
			text: 'The queue had tests. `social-sample-queue.test.ts` replaced `socialQueue.add` with a spy, enqueued twice, and asserted the job id it was handed:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Simplified from social-sample-queue.test.ts as it stood before the fix — the spy accepts any string.',
			code: "const add = makeSpy(socialQueue, 'add')\nadd.mockImplementation(() => Promise.resolve({} as never))\n\nawait enqueueSampleRender(ID)\nawait enqueueSampleRender(ID)\n\nconst opts = add.mock.calls[0]?.[2] as { jobId?: string }\nexpect(opts.jobId).toBe(sampleJobId(ID)) // 'sample:507f…' — fine by the spy"
		},
		{
			kind: 'p',
			text: 'That test is right about what it checks. It proves the id is **stable**: the same template gives the same id, so a second edit replaces a pending render instead of paying for two. It says nothing about whether the id is **legal**, because the validation lives inside BullMQ, behind `queue.add` — exactly the call the spy replaced. The mock was more permissive than the library it stood in for, and a total failure fit through that gap.'
		},
		{
			kind: 'p',
			text: 'The 1,034 is not a rhetorical number. It is the suite size quoted in the follow-up commit, and re-running a snapshot of the merge that shipped `generate:${ruleId}` on the night of 2026-08-23 gives exactly 1,034 passing tests and zero failures. The commit just before the fix ran 1,066, also green. A bigger suite of the same kind of test buys nothing here — every one of them was a spy.'
		},
		{ kind: 'h2', text: 'A guard that reads the source, and is proven able to fail' },
		{
			kind: 'p',
			text: 'The fix, cb0b9eb9, swapped each colon for a hyphen and added `queue-job-ids.test.ts`, which asserts the property BullMQ enforces on the string itself — no Redis needed. Its first version was a hand-written list of the five builders that existed that day, which is the same blind spot moved somewhere new: a sixth builder in some future module is not on the list, and nothing notices. The follow-up, 92a239ed, made the source the input.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Simplified from queue-job-ids.test.ts (92a239ed). The first test is the guard guarding itself.',
			code: "// every JobId builder literal and inline jobId: '…' under apps/api/src\nconst literals = idLiteralsInSource()\n\ntest('the scan actually finds the ids it is supposed to be checking', () => {\n\tconst found = literals.map(l => l.literal)\n\texpect(found).toContain('publish-')\n\texpect(found).toContain('football-bootstrap-squads')\n\texpect(literals.length).toBeGreaterThanOrEqual(12)\n})\n\ntest('not one of them would be rejected by BullMQ', () => {\n\texpect(literals.filter(l => bullmqRejects(l.literal))).toEqual([])\n})"
		},
		{
			kind: 'p',
			text: "The first test is the one I would keep if I could keep only one. A regex that silently matches nothing passes forever while proving nothing — the same false confidence that let the original bug ship. If a refactor changes how ids are written, the scan finds fewer, this fails, and the pattern gets updated. The commit also closed a quieter route in: the football ingester builds a resume id by interpolating a job-name constant, so a colon could reach that id without ever appearing in a literal. The constant's values are asserted too."
		},
		{
			kind: 'p',
			text: "Then it was proven able to fail rather than trusted because it was green. Reintroducing `clean:${templateId}` fails four assertions in that file, the source scan among them; re-run on a snapshot while writing this, the count holds at four of eight. Putting restage back to its two-colon form fails exactly one — the strict no-colon test — because the scan checks BullMQ's real predicate, and the real predicate lets it through. That single failure is the reason the file holds a stricter line than the library does."
		},
		{ kind: 'h2', text: 'The docs were teaching the bug' },
		{
			kind: 'p',
			text: 'The part I think about most is not the code. cb0b9eb9 hyphenated the builders but left their descriptions alone, and 6f9ed9a5 found the old format still written as house convention in eight lines across seven files: source comments, the shared package, the social README, and two files under `.claude/skills/api-conventions/`. Those last two are what my coding agent auto-loads before it writes API queue code. They documented, as the rule to follow, the exact string `queue.add` throws on.'
		},
		{
			kind: 'p',
			text: "Most of this module was written with that agent, and on ids it was doing what it was told. A bad convention in an agent's instructions is not a typo in a README; it is a generator. The test catches a recurrence at the gate, but the docs are what stop it being written in the first place, and until that afternoon they argued for it. The rule now sits in the section where a new queue gets designed — separate custom ids with `-`, never `:` — with the failure mode and the bullmq line number attached."
		},
		{
			kind: 'quote',
			text: 'A convention that only says what to type gets copied; one that says what breaks gets understood.',
			cite: 'commit 6f9ed9a5'
		},
		{ kind: 'h2', text: 'What it cost, and what I got wrong' },
		{
			kind: 'list',
			items: [
				'**"Generate now" was broken by its own fix.** The night before, I moved it into a background job because the inline request ran so long that a 502 came back after ~96 s, over a generation that had actually succeeded ([part 4](/blog/reasoning-tokens-empty-completion) covers that day). The new job\'s id was `generate:${ruleId}`, so from that merge until the fix the button could not enqueue at all — a misleading 502 traded for a guaranteed error, for about twelve and a half hours on main.',
				"**The publish path was the oldest.** `publish:${postId}` dates from the publish queue's first commit on 2026-06-22, and BullMQ's check was already in the release the lockfile pinned that day. By the time of the fix, scheduling, retrying, \"post now\" and the boot-time catch-up all went through that one enqueue — nine weeks of a path that could not have queued one job. In the fix commit's own words, it was safe to ship without a migration precisely because the feature never worked.",
				'**The commit message overstated it.** "Every custom job id was illegal" was four of five. I would rather correct that here than leave the commit log as the record.',
				'**The guard has upkeep.** Its floor of 12 had to drop to 11 the same afternoon, when the AI plate clean was deleted ([part 6](/blog/ai-verification-gate-failed-open)) and took its id builder with it. A count floor is a number every deletion has to remember to edit.',
				'**It is still a regex.** It sees two shapes: a `JobId` builder with a template literal, and an inline `jobId:` string. An id built some third way is invisible to it, and the self-check only proves the scan still finds the ids it already knew about.'
			]
		},
		{
			kind: 'p',
			text: "The honest alternative was an integration test that calls the real `queue.add` against a real Redis. It would have caught this on its first run, along with failures a string predicate never will. I chose the string because BullMQ's rule is a property of the string, and a test that needs no infrastructure runs on every save — but the cheap test is not the complete one, and I would not claim it is."
		}
	],
	lessons: [
		'A spy proves what my code handed a library, never what the library will accept. When the mock is more permissive than the real thing, that gap is exactly where a total failure hides.',
		"Test the property the library enforces, on the value itself. BullMQ's rule is a property of a string, so the string is what gets asserted — no Redis required.",
		'A scanning test needs a test of its own: assert that it finds what it claims to check, then break the code on purpose and watch it fail.',
		'Agent instructions are code. A convention in an auto-loaded skill file is reproduced on every new queue, so the docs get fixed in the same breath as the bug — and they say what breaks, not just what to type.'
	],
	faqs: [
		{
			q: "Why does BullMQ throw 'Custom Id cannot contain :'?",
			a: 'BullMQ uses `:` as the separator inside its Redis keys, so a custom `jobId` containing one can be misread as two values. Since a change merged in September 2025, `queue.add` validates the id and throws `Custom Id cannot contain :` rather than letting it through. Use `-` or `_` as your separator: `publish-<postId>`, not `publish:<postId>`.'
		},
		{
			q: 'Can a BullMQ job id contain a colon at all?',
			a: "In bullmq 6.0.9, an id with exactly two colons passes, because the check is `id.includes(':') && id.split(':').length !== 3` — a compatibility branch for old repeatable jobs that BullMQ's own comment marks for replacement in its next breaking change. One colon, or three or more, throws. Do not rely on the two-colon case; treat any colon as illegal."
		},
		{
			q: "Why didn't my unit tests catch an invalid BullMQ job id?",
			a: 'Most likely because they mock or spy on `queue.add`. BullMQ validates the id inside the call your spy replaced, so the spy accepts strings the real library refuses. Such a test proves the id is stable — same input, same id — but not that BullMQ will accept it. My API suite ran 1,034 tests green over a job id that could never be enqueued.'
		},
		{
			q: 'How do I test BullMQ job ids without running Redis?',
			a: 'Assert the rule on the string: call each id builder with a realistic input and check the result holds no colon. To cover builders added later, scan the source for id literals instead of keeping a hand-written list, and add a test that the scan actually finds the ids you know exist, so a regex that matches nothing cannot pass silently.'
		},
		{
			q: 'Will removing colons from BullMQ job ids break jobs already in the queue?',
			a: 'Not if the old ids were being rejected. An id that failed validation never reached Redis, so there is no old key space to reconcile. In my case that made the fix safe to ship with no migration at all — precisely because the feature it repaired had never worked.'
		}
	],
	sources: [
		{
			title: 'BullMQ — Job Ids',
			url: 'https://docs.bullmq.io/guide/jobs/job-ids'
		},
		{
			title: 'taskforcesh/bullmq#3382 — getFlow() returns undefined children when colons are used in jobIds',
			url: 'https://github.com/taskforcesh/bullmq/issues/3382'
		},
		{
			title: 'taskforcesh/bullmq#3384 — add custom job id validation to prevent : inclusion',
			url: 'https://github.com/taskforcesh/bullmq/pull/3384'
		},
		{
			title: 'BullMQ v6.0.9 source — the custom job id validation in job.ts',
			url: 'https://github.com/taskforcesh/bullmq/blob/v6.0.9/src/classes/job.ts#L1354'
		}
	]
}
