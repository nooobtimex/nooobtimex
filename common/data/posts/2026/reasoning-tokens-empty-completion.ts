import type { PostDef } from '../../../interfaces'

/** Sources: rs-trophy b14f0971, f8266e73, 8bd422dc, 13d36a9b (all 2026-08-23); 2d59f259 (2026-08-21, the image-cost precedent); cb0b9eb9 (2026-08-24, the colon); 1bee8d3b (2026-09-09, the later ~95 s 502 on another route). */
export const reasoningTokensEmptyCompletion: PostDef = {
	id: 'reasoning-tokens-empty-completion',
	title: 'Why does an LLM API call return an empty string? Reasoning tokens count against max_tokens',
	happenedAt: '2026-08-23',
	publishedAt: '2026-08-23',
	chapter: 'ownership',
	series: { id: 'social-autopilot', part: 4 },
	category: 'engineering',
	description:
		"Every AI caption call 500'd in production: a reasoning model spent max_tokens thinking, finish_reason was 'length', and my client returned ''.",
	tldr: 'An LLM API call returns an empty string when a reasoning model spends its `max_tokens` budget thinking: the response is an HTTP 200 with `finish_reason: "length"`, no usable content, and the reasoning is still billed. My client returned `content ?? \'\'` without reading `finish_reason`, so every AI caption path in production failed as "No captions generated". The fix: treat `length` and empty as errors that name the tokens spent, the cap and the reasoning share, and size caps for reasoning plus answer.',
	skills: ['typescript', 'bun-js', 'elysia-js', 'bullmq', 'redis', 'railway'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: 'On 23 August 2026 every AI caption entry point in [[project:rs-trophy]]\'s admin returned 500 in production: the caption-template sample, the autopost "Generate now" button, and the composer\'s generate action. The platform runs the social channels of my family\'s trophy company, [[company:ruamsuk-plating]], and the log line under each failure said the same thing: "No captions generated". It read as if the model had looked at a trophy and declined to write about it.'
		},
		{
			kind: 'p',
			text: "It had not declined anything. It had run out of room. The caption call asked a reasoning model for a JSON object under a flat `maxTokens: 1500`, the model spent part of that budget thinking, the answer was cut off mid-string, and our client turned the truncated completion into an empty string that three layers of code then reported as the model's judgement. I fixed it the same day with an AI coding agent, and the day turned up two more failures: a sharper version of the same bug, and a 502 over a generation that had worked."
		},
		{ kind: 'h2', text: 'A 200 with nothing in it' },
		{
			kind: 'p',
			text: "[Part 1](/blog/social-publisher-false-success) of this series was publishers reporting success they had not earned. This is the same lie one layer down. The OpenRouter client in the API — the one function every text call goes through — awaited the response, checked the HTTP status, and returned `content ?? ''`. It never read `finish_reason`, which [OpenRouter normalises](https://openrouter.ai/docs/api_reference/overview#finish-reason) to `stop`, `length`, `tool_calls`, `content_filter` or `error`. `length` is the one that says the answer did not finish."
		},
		{
			kind: 'p',
			text: '[OpenRouter\'s reasoning-token docs](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens#reasoning-tokens-and-max_tokens) describe this exact failure: on most providers `max_tokens` covers reasoning and visible output combined, and a model that spends the whole limit reasoning comes back with `finish_reason: "length"`, empty content — and the reasoning still billed. Our client could not tell that turn from a short answer, so the empty string travelled until a parser three layers away blamed the model.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Simplified from apps/api/src/modules/ai/core/openrouter.client.ts (rs-trophy, b14f0971).',
			code: "// before: a budget-exhausted turn and a short answer looked identical\nreturn { content: data.choices?.[0]?.message?.content ?? '', usage: data.usage }\n\n// after: 'length' and empty are refused at the transport, with the numbers attached\nconst choice = data.choices?.[0]\nconst content = choice?.message?.content ?? ''\nif (choice?.finish_reason === 'length' || content.trim() === '') {\n\tthrow new OpenRouterEmptyCompletionError({\n\t\tfinishReason: choice?.finish_reason,\n\t\tusage: data.usage, // completion_tokens + completion_tokens_details.reasoning_tokens\n\t\tmaxTokens: params.maxTokens,\n\t\tmodel: params.model,\n\t})\n}\nreturn { content, finishReason: choice?.finish_reason, usage: data.usage }"
		},
		{
			kind: 'p',
			text: '`length` is fatal even when `content` is not empty. Every caller in this API asks for `json_object`, and the caption schema nests no objects, so a truncated body carries no closing brace at all — there is nothing for a lenient parser to salvage. Handing back the fragment would only move the failure further from its cause.'
		},
		{ kind: 'h2', text: 'How big the budget actually needed to be' },
		{
			kind: 'p',
			text: 'The flat cap was 1,500 completion tokens. Measured on the real prompt against `anthropic/claude-opus-5`, at the two caption variants the local settings asked for, three post types used most of it:'
		},
		{
			kind: 'table',
			head: ['Post type', 'Completion tokens', 'Share of the 1,500 cap'],
			rows: [
				['Promotion — offer and price', '1,135', '76%'],
				['New product — introduce a model', '1,426', '95%'],
				['Customer work — a delivery story', '1,295', '86%']
			]
		},
		{
			kind: 'p',
			text: "One more variant clears the cap outright. Two things drive the length. Thai is dense — one caption runs 500 to 800 characters — and the model's reasoning, 58 to 172 tokens on this prompt, comes out of the same allowance. The fix scales the ceiling with what the prompt asks for: 1,500 tokens of base for the angle, hashtags and JSON scaffolding, plus 1,200 per variant. It is a ceiling, not a spend. The charge follows the tokens actually emitted, so the headroom costs nothing until a runaway generation needs stopping."
		},
		{ kind: 'h2', text: 'Make the error name the remedy' },
		{
			kind: 'p',
			text: 'The new error carries the three numbers that tell you what to change: tokens spent, the cap, and how many of them went on reasoning. The commit quotes what it reads like:'
		},
		{
			kind: 'quote',
			text: 'OpenRouter chat completion for anthropic/claude-opus-5 was truncated by max_tokens (spent 400 completion tokens, max_tokens 400, 102 of them on reasoning). Raise maxTokens for this call — on a reasoning model the thinking is billed against the same budget as the answer.',
			cite: 'the new error message, rs-trophy commit b14f0971'
		},
		{
			kind: 'p',
			text: 'Two smaller changes ride with it. The service layer now writes the usage row before rethrowing, because a completion that burns its whole budget on reasoning and emits nothing is still billed — it is the most expensive way to fail. The row is tagged `:truncated` or `:empty`, so wasted calls separate from real ones in the usage rollups. That copies a fix from two days earlier, when an image call that returned no image had been discarding its own cost the same way. And the caption path stopped sharing one message between two faults: "not parseable JSON" now quotes the head of the raw body, and "No captions generated" means only what it says.'
		},
		{ kind: 'h2', text: 'The sweep found a sharper version' },
		{
			kind: 'p',
			text: 'With the client refusing truncated turns, every other caller became a question: was its cap sized for the answer, or for the answer plus thinking? The vision model, `google/gemini-3.7-flash`, reasons heavily and bills it inside `completion_tokens`:'
		},
		{
			kind: 'list',
			items: [
				'A one-line prompt at `max_tokens` 300 spent 129–151 tokens reasoning.',
				'A longer prompt at 3,000 spent 974.',
				'The caption prompt at 300 spent 285 of its 296 completion tokens reasoning, stopped on `length`, and returned nothing usable.'
			]
		},
		{
			kind: 'p',
			text: 'The callers on that model had been answering with under half their budget left, and one slug-fixing script ran on a cap of 200. They were passing, not safe — and now that a truncated completion throws, leaving them thin would have turned a latent risk into a visible failure. Six caps went up in the same push: three from 300 to 1,500, one from 200 to 1,000, one from 900 to 2,000, and the vision pass of the catalogue reconciliation from 1,500 to 4,000.'
		},
		{ kind: 'h2', text: 'Same evening: a 502 over a generation that worked' },
		{
			kind: 'p',
			text: 'The same day, "Generate now" failed a second way. The route ran caption generation and then image staging inside one synchronous request. Measured in production that night, those took 31,977 ms and 84,082 ms — about 116 seconds of work. The admin got a 502 well before that. The handler kept going and created the draft anyway, so the operator was told a paid, successful generation had failed, and the obvious response to that is to click again.'
		},
		{
			kind: 'p',
			text: "There was a stranger symptom too: two drafts a minute apart, with different captions, from a single POST in [[skill:railway]]'s HTTP log. That is the signature of a retry above the application — each upstream attempt is a real generation, but only the client-facing request is logged. The code was ruled out first: the admin's client has no retry layer, a manual run resolves exactly one batch, and the five-minute sweep was switched off for that rule."
		},
		{
			kind: 'p',
			text: 'The fix moved the work out of the request. The route now answers 202 and enqueues a [[skill:bullmq]] job on [[skill:redis]]; the rule carries a `generatingAt` marker and the admin polls until it clears. The two refusals stay synchronous — 404 for an unknown rule, 409 for the daily cap — and the cap is re-read inside the job, because minutes can pass in the queue.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Simplified from apps/api/src/modules/social/queue.ts (rs-trophy, 13d36a9b).',
			code: "// One id per rule: a retried POST lands on the live job instead of starting a second.\nexport async function enqueueGenerate(ruleId: string): Promise<boolean> {\n\tconst existing = await socialQueue.getJob(generateJobId(ruleId))\n\tif (existing) {\n\t\tif (isLiveJobState(await existing.getState())) return false // refuse, never replace\n\t\tawait existing.remove() // a finished job still holds the id\n\t}\n\tawait socialQueue.add('GENERATE', { ruleId }, {\n\t\tjobId: generateJobId(ruleId),\n\t\tattempts: 1,\n\t})\n\treturn true\n}"
		},
		{
			kind: 'p',
			text: 'Two properties carry the weight. `attempts: 1`, not the queue default of 4: one job is two paid AI calls, so the default would bill eight for a single failure. And a [custom job id](https://docs.bullmq.io/guide/jobs/job-ids) per rule, which BullMQ uses to ignore a duplicate add — so whatever layer retried, the second enqueue no-ops. Refusing is deliberate: replacing a running generation would pay for it twice.'
		},
		{ kind: 'h2', text: 'What this cost, and what I got wrong' },
		{
			kind: 'p',
			text: 'Refusing truncated turns has a price. Callers that used to limp along on a fragment now fail loudly, and a failed background job leaves only a log line: the operator sees the spinner stop and no draft appear, with no reason on screen. I took that trade on purpose — a visible failure I can read beats a wrong answer that looks finished — but it moved some failures from silent to user-visible on the day it shipped.'
		},
		{
			kind: 'p',
			text: 'The background-job commit also carries two errors that I am leaving in the history and correcting here. It says the request "sat at ~96s" because of the two phases, but 31,977 plus 84,082 is about 116 seconds; ~96 s was when the 502 arrived, not how long the work took. And it says Railway\'s edge gave up. [Railway\'s documented limits](https://docs.railway.com/networking/public-networking/specs-and-limits#technical-specifications) let a request run up to 15 minutes and only close one after 5 minutes with no data, so something closed this one far earlier.'
		},
		{
			kind: 'p',
			text: "Three weeks later a different route on the same API produced 502s with the same shape: [Bun's idle timeout](https://bun.com/docs/runtime/http/server#idletimeout), which covers an in-flight request whose handler has not written a byte, closed a silent socket at 30 seconds — the value [[skill:elysia-js]] passes by default — and the edge retried twice more before answering 502 after about 95 seconds. Three upstream attempts of ~32 seconds is 96, and a retried POST would also explain the second draft. But the same investigation found a streaming POST was not closed that way, and I never reproduced it on this route, so it stays a strong suspicion rather than a finding."
		},
		{
			kind: 'p',
			text: 'And the stable job id I was proud of was illegal. BullMQ reserves the colon, and `generate:<ruleId>` contains one, so from that commit until the next morning "Generate now" could not enqueue at all. That is [part 5](/blog/bullmq-custom-id-colon).'
		}
	],
	lessons: [
		'Read `finish_reason` on every completion. `length` is a failure even when there is text, and an empty string is never a valid answer to a JSON prompt.',
		'On a reasoning model, size `max_tokens` for thinking plus answer, and measure it on the real prompt. It is a ceiling, not a spend: generous costs nothing, tight costs the whole call.',
		"Put the remedy in the error — tokens spent, the cap, the reasoning share. An error that names the model's judgement sends you to the prompt; one that names the budget sends you to the fix.",
		'Work that takes minutes and costs money does not belong inside an HTTP request. Answer 202, run it as a job with `attempts: 1` and a stable id, and assume something above you will retry.'
	],
	faqs: [
		{
			q: 'Why does an LLM API call return an empty string with a 200 status?',
			a: 'Usually because a reasoning model spent its whole `max_tokens` budget thinking before it wrote any visible text. The response is still HTTP 200, with `finish_reason: "length"` and empty or truncated `content`, and the reasoning tokens are billed. Check `finish_reason` and compare `usage.completion_tokens` with `usage.completion_tokens_details.reasoning_tokens` — if almost all of the completion was reasoning, raise the cap.'
		},
		{
			q: 'Do reasoning tokens count against max_tokens?',
			a: 'Through OpenRouter, on most providers, yes: `max_tokens` applies to reasoning and visible output combined, and reasoning is billed as output. I measured 58–172 reasoning tokens on a caption prompt with `anthropic/claude-opus-5`, and `google/gemini-3.7-flash` spending 285 of 296 completion tokens reasoning on a 300-token cap — leaving nothing for the answer.'
		},
		{
			q: "What does finish_reason 'length' mean, and can I use the partial output?",
			a: 'It means generation stopped because it hit `max_tokens`, not because the model finished. For free text a partial answer may be usable; for JSON output treat it as a failure. A truncated object usually has no closing brace, so a lenient parser has nothing to salvage and the error simply surfaces further away from its cause.'
		},
		{
			q: 'How big should max_tokens be for a reasoning model?',
			a: 'Big enough for the reasoning plus the answer, measured on the real prompt. My Thai caption prompt used 1,135–1,426 of a flat 1,500 cap at two variants, so I replaced it with 1,500 base plus 1,200 per variant requested. Since you pay for tokens emitted rather than for the cap, headroom costs nothing — the cap only stops a runaway.'
		},
		{
			q: 'Why did a long request on Railway return a 502 even though the work finished?',
			a: "Railway documents a 15-minute request limit and a 5-minute no-data limit, so a ~96-second 502 means something else closed the connection — in my case most likely the app server's idle timeout on a handler that had written nothing, after which the edge retried. Each retry of a non-idempotent POST can run the work again. Move slow, paid work into a background job, answer 202, and give the job a stable id so a duplicate enqueue is ignored."
		}
	],
	sources: [
		{
			title: 'OpenRouter — Reasoning tokens and max_tokens',
			url: 'https://openrouter.ai/docs/guides/best-practices/reasoning-tokens#reasoning-tokens-and-max_tokens'
		},
		{
			title: 'OpenRouter — API overview: finish reason',
			url: 'https://openrouter.ai/docs/api_reference/overview#finish-reason'
		},
		{
			title: 'Railway — Public networking specs and limits',
			url: 'https://docs.railway.com/networking/public-networking/specs-and-limits#technical-specifications'
		},
		{
			title: 'Bun — HTTP server: idleTimeout',
			url: 'https://bun.com/docs/runtime/http/server#idletimeout'
		},
		{
			title: 'BullMQ — Job Ids',
			url: 'https://docs.bullmq.io/guide/jobs/job-ids'
		}
	]
}
