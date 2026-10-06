import type { PostDef } from '../../../interfaces'

/**
 * Sources (rs-trophy.com, private): 6ece1bdf (AI-clean born, 08-20), 90c6e7c7 (v2 prompt, 08-22),
 * ebc4142c (deleted, 08-22), 3d16ba22 + 3c23f2b4 (declared source, verified background job, 08-24),
 * e07450e3 (the gate failed open), 64c3b98b + a8bbd2f9 (the product photo becomes a worked example),
 * ec206963 (AI plate-clean gone), 8bd422dc (the vision model's reasoning budget, part 4), 8d829b6a +
 * d7465ddb (social deleted 08-31, restored 09-04 without templates). Merge times from origin/main
 * (#446, #449). The 6-of-13 figure re-run against the shipped verdict logic, with and without its catch.
 */
export const aiVerificationGateFailedOpen: PostDef = {
	id: 'ai-verification-gate-failed-open',
	title: 'Why my LLM verification gate passed an empty {} reply — failing open in JSON mode',
	happenedAt: '2026-08-24',
	publishedAt: '2026-08-24',
	chapter: 'ownership',
	series: { id: 'social-autopilot', part: 6 },
	category: 'engineering',
	description:
		'My vision-model gate read each answer as parsed.x === true, so an empty {} reply counted as a pass. How it failed open, and why the feature died anyway.',
	tldr: 'My vision-model gate checked an AI-cleaned image by asking three yes/no questions in JSON mode and reading each answer as `parsed.x === true`. JSON mode guarantees valid JSON, not the keys you asked for, so a reply of `{}` produced no problems and reported a pass — a gate that failed open at exactly the moment the model misbehaved. The fix requires every answer to be a real boolean and treats anything else as a refusal. The same afternoon, the feature it guarded was deleted for good.',
	skills: ['typescript', 'bun-js', 'bullmq', 'cloudflare-r2', 'mongodb'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "At 11:29 on 2026-08-24 I committed a fix to a gate that had been committed 28 minutes earlier with no tests of its own. Writing them found it wrong. The gate decided whether an AI-cleaned image was good enough to keep, and it read each of the vision model's answers as `parsed.x === true`. A reply of `{}` made every check `undefined === true`, produced no problems, and reported a pass."
		},
		{
			kind: 'p',
			text: "The gate guarded **AI-clean**, a feature in the social auto-posting module of [[project:rs-trophy]], the platform I run as [[career:ruamsuk-cto]] at [[company:ruamsuk-plating]], my family's trophy company. This was its third version in five days. The first two had both reached production wrong, and nobody caught either in time, because nothing inspected what they produced. The third was built around inspection — and the inspection was the part that did not work."
		},
		{
			kind: 'stat',
			value: '6 of 13',
			label:
				'new verdict tests that fail against the gate logic as it shipped — every one of them in the fail-closed group',
			source: 'commit e07450e3; reproduced against the shipped logic'
		},
		{ kind: 'h2', text: 'What AI-clean was for' },
		{
			kind: 'p',
			text: 'The auto-poster stages a product photo into a **plate** — a reusable background scene on a photo template — and every post made from that template reuses it. AI-clean took a photo or a finished marketing card, asked an image model to remove the product, and kept what was left as a plate. A bad plate is not one bad image. It is a bad image repeated on every post staged from it.'
		},
		{
			kind: 'p',
			text: 'Version one (2026-08-20) told the model to remove the product "and any award, trophy, stand, person, hand or text attached to it". The model read **attached** as physical adjacency. When the owner cleaned a finished card, the trophies, the colour pills under them and the dimension arrow went — and the headline, the product code and the price, each in its own block of the layout, stayed. A plate carrying the last product\'s price prints it under every product staged into it.'
		},
		{
			kind: 'p',
			text: 'Version two (2026-08-22) restated the contract as a keep-list first and a remove-list second, with layout position named as irrelevant. It failed the other way: every piece of text gone, three trophies still standing. The culprit, identified later, was a hedge — anything uncertain "stays if it is decorative or branded", which describes a gold laurel-wreath cup exactly. That evening I deleted the feature. It was asking a model to judge, from pixels alone, which elements belonged to a design the admin already controlled.'
		},
		{ kind: 'h2', text: 'Version three: inspect before you keep' },
		{
			kind: 'p',
			text: 'It came back on the morning of 2026-08-24 with two changes. The admin now declares, before uploading, that a photo contains a product, so the model no longer guesses the premise. And the output is inspected before it is kept: the cleaned image is generated unstored, a vision model reads it back and answers three yes/no questions — is a product still in frame, is product wording still printed, is there garbled half-erased lettering — and only a pass is uploaded to [[skill:cloudflare-r2]]. Two rounds, then refuse and keep the plate that was already there. The render plus its read-back takes ~30–60 s, so the route answers 202 and a [[skill:bullmq]] job does the work.'
		},
		{
			kind: 'p',
			text: 'The read-back ran in JSON mode — `response_format` set to `json_object` — and the prompt spelled out the exact shape it wanted back. The doc comment on the verification method said a check that cannot run returns NOT ok. The code under it did something else.'
		},
		{ kind: 'h2', text: 'How {} became a pass' },
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'The verdict as it shipped in 3c23f2b4, simplified. Only a thrown error ever reached the catch around it.',
			code: "const parsed = JSON.parse(res.content) as {\n\tproductPresent?: boolean\n\tproductTextPresent?: boolean\n\tgarbledText?: boolean\n}\nconst problems = [\n\t...(parsed.productPresent === true ? ['a product is still in frame'] : []),\n\t...(parsed.productTextPresent === true ? ['product wording is still printed'] : []),\n\t...(parsed.garbledText === true ? ['garbled lettering was left behind'] : [])\n]\nreturn { ok: problems.length === 0, problems }"
		},
		{
			kind: 'p',
			text: 'Each line asks "did the model say yes?" and treats every other outcome as no. `{}` passes. So does `{"productPresent": "no"}`, and so do `true` and `[]`, which parse fine and carry no keys at all. The type annotation made it look safe, but those `boolean` fields are a claim about the reply, not a check of it. [JSON mode](https://openrouter.ai/docs/api_reference/parameters#response-format) guarantees that the model\'s message is valid JSON — and `{}` is valid JSON.'
		},
		{
			kind: 'p',
			text: 'Security has a name for this shape: [CWE-636, Not Failing Securely](https://cwe.mitre.org/data/definitions/636.html) — on failure, falling back to a less safe state than the options available, and leaving everyone with a false sense of security. Nothing here was a security boundary, but the cost has the same structure: the gate opened at exactly the moment the model was misbehaving, which is the moment a bad plate was most likely. And the read-back model was the same one that, the day before, had been caught spending its token budget on reasoning and returning nothing usable ([part 4](/blog/reasoning-tokens-empty-completion)).'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'plateCleanVerdict, simplified from e07450e3 — a pure function over the raw reply, so it needs no mocks to test.',
			code: "export function plateCleanVerdict(raw: string) {\n\tlet parsed: unknown\n\ttry { parsed = JSON.parse(raw) } catch {\n\t\treturn { ok: false, problems: ['the check did not answer: not JSON'] }\n\t}\n\tif (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))\n\t\treturn { ok: false, problems: ['the check did not answer: not an object'] }\n\tconst answers = parsed as Record<string, unknown>\n\tconst asked = ['productPresent', 'productTextPresent', 'garbledText']\n\tconst unanswered = asked.filter(k => typeof answers[k] !== 'boolean')\n\tif (unanswered.length > 0)\n\t\treturn { ok: false, problems: [`the check did not answer: ${unanswered.join(', ')}`] }\n\t// only now map the true answers to problems, exactly as before\n}"
		},
		{
			kind: 'p',
			text: 'The fix moved the judgement into `plateCleanVerdict` and made it fail closed. All three answers must be real booleans; missing, wrong-typed, null, non-object or unparseable all mean "the check did not answer", which is a refusal — logged in words a reader can tell apart from a real finding. Extracting it was not tidiness. The model client is a module export the test suite had never spied on, which is also why the poster pipeline\'s equivalent gate had never been tested. A pure function needs no mocking at all.'
		},
		{
			kind: 'p',
			text: 'The commit says six of the thirteen new verdict tests fail against the code as it shipped. Re-run while writing this, that holds for the verdict logic on its own: the six fail-closed tests fail and the other seven pass. With its original try/catch wrapped around it, a prose or empty reply throws into the catch and is refused, so five still fail. Either way, the fail-closed group earned its place on its first run.'
		},
		{ kind: 'h2', text: 'The same afternoon, the premise inverted' },
		{
			kind: 'p',
			text: "By 14:35 the premise itself had flipped, on the owner's call. AI-clean treated a scene photographed with a product in it as a defect, inert until a lossy, non-deterministic erase repaired it. 64c3b98b keeps the same photo whole as an **example** and sends it as a third staging reference, so the model copies placement, scale and contact shadow by demonstration instead of being told about them in prose. The reference order became plate, example, product — the product last, because it is the one image that must be reproduced exactly, and the end of the prompt is where an image model attends hardest."
		},
		{
			kind: 'p',
			text: "At 15:05, ec206963 deleted AI-clean end to end: the service, the route, the job id, the worker case and the prompt. In-flight jobs were checked rather than assumed — the worker's `switch` on the job name has no `default`, so a leftover clean job falls through and BullMQ marks it completed; the commit warns, with a capitalised NOT, against ever adding a `default` that throws. The freeform prompt box survived at the owner's request, keeping its old 2,000-character ceiling beside the new pickers rather than instead of them."
		},
		{ kind: 'h2', text: 'What it cost, and what I got wrong' },
		{
			kind: 'list',
			items: [
				'**Three versions across five days.** Born 2026-08-20, deleted 08-22, back on the morning of 08-24, gone for good that afternoon. Each version was a reasonable answer to the previous failure, and none questioned the premise until the last one did.',
				'**The reason to trust version three was its least-tested part.** The whole case for bringing it back was "now the output is inspected", and the inspection shipped with no tests of its own.',
				"**It was saved by a different bug, not by design.** The clean job's id was `clean:${templateId}`, which BullMQ refuses ([part 5](/blog/bullmq-custom-id-colon)). From the merge that shipped version three until the merge that carried both fixes, the job could not even be enqueued, so the open gate never got a chance to pass a bad plate. That is luck, and I do not count it.",
				'**An enum that keeps all four values.** The plate-source enum was introduced at 11:01; by 15:05 two of its four members were legacy. They stay, because removing a value that exists in stored [[skill:mongodb]] documents would fail response validation on the list route and take the whole template gallery down.',
				'**Then the whole area went.** On 2026-08-31 I deleted social auto-posting entirely ([part 7](/blog/deleted-38k-lines-restored-in-4-days)). When it came back on 2026-09-04, templates and scene plates did not.'
			]
		},
		{
			kind: 'p',
			text: 'The obvious objection is that structured outputs would have prevented this: send a JSON schema with `strict: true` and an empty object never comes back. Maybe. OpenRouter\'s own [structured-outputs guidance](https://openrouter.ai/docs/guides/features/structured-outputs#best-practices) says enforcement varies by provider and exact compliance is not guaranteed on every endpoint. A schema lowers the odds of a malformed answer. It does not change what the code must do when one arrives — the verdict still has to read "did not answer" as no.'
		}
	],
	lessons: [
		'A gate that treats "did not answer" as "found nothing" is not a gate. Every answer a verifier depends on gets checked for presence and type, and the default is refusal.',
		'JSON mode guarantees syntax, not shape. A TypeScript annotation on the result of `JSON.parse` is a claim about the reply, not a check of it.',
		'Put the judgement in a pure function. The verdict became testable the moment it stopped needing the model client — and the first tests written against it found the bug.',
		'When three versions in a row fail in different directions, question the premise before writing a fourth. What lasted was keeping the photo, not erasing it better.'
	],
	faqs: [
		{
			q: 'What does fail open vs fail closed mean for an LLM verification check?',
			a: 'A check fails open when an error or a non-answer lets the item through, and fails closed when it blocks it. My image gate failed open: it only flagged a problem when the model explicitly answered `true`, so a missing or malformed answer counted as "no problems". A fail-closed check requires every answer to be present and correctly typed, and refuses otherwise.'
		},
		{
			q: 'Does OpenRouter JSON mode guarantee the keys I asked for?',
			a: "No. Setting `response_format` to `{ type: 'json_object' }` guarantees the model's message is valid JSON — and `{}` is valid JSON. If you need specific keys, use structured outputs with a JSON schema, and still validate the parsed result in code, because OpenRouter notes that schema enforcement varies by provider."
		},
		{
			q: "How should I validate a model's JSON verdict in TypeScript?",
			a: 'Parse it as `unknown`, not as the type you hope for. Check that it is a non-null, non-array object, then check each field you depend on with `typeof` — for example `typeof answers.productPresent === "boolean"`. A missing or wrong-typed field returns a refusal with a reason a log reader can tell apart from a real finding. Keep it a pure function so it can be tested without mocking the model client.'
		},
		{
			q: 'Why does checking parsed.x === true fail open?',
			a: 'Because it only distinguishes "the model said yes" from everything else. A missing key, a string like `"no"`, or an empty object all make the comparison false, which the code then reads as "no problem found". It is correct for a well-formed reply and silently permissive for every malformed one.'
		},
		{
			q: 'Can an image model reliably erase a product to make a reusable background?',
			a: "Not in my experience. Two prompt versions failed in opposite directions — one left the product's name, code and price on the card, the next removed all the text and kept the trophies — because the model was being asked to judge which pixels belonged to the design. Keeping the photo whole and using it as a worked example for placement and lighting replaced the erase entirely."
		}
	],
	sources: [
		{
			title: 'OpenRouter — API parameters: response_format (JSON mode)',
			url: 'https://openrouter.ai/docs/api_reference/parameters#response-format'
		},
		{
			title: 'OpenRouter — Structured outputs: best practices',
			url: 'https://openrouter.ai/docs/guides/features/structured-outputs#best-practices'
		},
		{
			title: "CWE-636: Not Failing Securely ('Failing Open')",
			url: 'https://cwe.mitre.org/data/definitions/636.html'
		}
	]
}
