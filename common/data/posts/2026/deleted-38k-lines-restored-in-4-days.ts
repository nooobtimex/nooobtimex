import type { PostDef } from '../../../interfaces'

/**
 * Sources (rs-trophy.com, private — never linked): 30da547b (admin removal), 74a5c5ff (data-deletion
 * page → PDPA page), 8d829b6a (engine removal + teardown script), 41fc4189 (docs + ROADMAP), all 2026-08-31,
 * merged as PR #472; context 3c02efeb (2026-08-18 template merge), 69892e16 (2026-08-20 split);
 * the reversal, outside the window: d7465ddb, 9ffced4f, 40c31034, 2b29df53, 0b2e8e78 (2026-09-04,
 * merged as 9b1eae23 / PR #520) and ff36e608 (2026-09-14, teardown rescoped).
 */
export const deleted38kLinesRestoredIn4Days: PostDef = {
	id: 'deleted-38k-lines-restored-in-4-days',
	title: 'Should you delete a feature stuck in platform review? I deleted ~38k lines, restored it 4 days later',
	happenedAt: '2026-08-31',
	publishedAt: '2026-08-31',
	chapter: 'ownership',
	category: 'engineering',
	series: { id: 'social-autopilot', part: 7 },
	description:
		"The code was done; launch waited on three platforms' review queues. I deleted 37,990 lines, then restored the feature four days later.",
	tldr: "On 31 August 2026 I deleted a finished social auto-posting system — 37,990 lines across three commits — because its launch was gated on TikTok, YouTube and Meta review queues, and an MCP assistant plus each platform's own scheduler could replace it. Four days later I restored it: Meta never needed App Review to post to our own Page and Instagram; I had generalised TikTok's and YouTube's gates to it. Verify each platform's gate from its own docs before deleting, and treat schedulers, collections and OAuth grants as part of the deletion.",
	skills: ['bullmq', 'redis', 'mongodb', 'typescript', 'elysia-js', 'cloudflare-r2', 'git-github'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "On 31 August 2026 I deleted the social auto-posting system I had been building since 22 June for [[project:rs-trophy]], the site of [[company:ruamsuk-plating]], my family's trophy company — 110 commits into its API module alone. It was not deleted for being broken. The code side of its milestone had finished on schedule. What had not finished was the platform side — in the roadmap's own words, launch was gated on three companies' review queues, not on any work in the repo. Four commits in one pull request removed it. Four days later, on 4 September, I put it back."
		},
		{
			kind: 'p',
			text: 'This is the last part of the August arc. Along the way the publisher [reported success for posts that never went out](/blog/social-publisher-false-success), the image model [had to be kept away from text](/blog/image-model-must-not-render-text), Thai text [rendered differently on macOS and Alpine](/blog/thai-text-macos-vs-alpine-resvg), a reasoning model [returned an empty completion](/blog/reasoning-tokens-empty-completion), a [colon in a custom BullMQ job id](/blog/bullmq-custom-id-colon) caused trouble, and an [AI verification gate failed open](/blog/ai-verification-gate-failed-open). This one is about deleting all of it, and why I was half wrong to.'
		},
		{
			kind: 'stat',
			value: '37,990',
			label:
				'lines deleted across the three removal commits — admin 12,505, engine 24,358, docs 1,127 — against 891 added',
			source: 'git show --stat of 30da547b, 8d829b6a and 41fc4189'
		},
		{ kind: 'h2', text: 'Why I deleted a feature that worked' },
		{
			kind: 'p',
			text: 'The production UAT milestone was due on 17 August, scoped to YouTube and Meta only, with seven issues still open on the day. TikTok had been left out because its approval issue carried a 4–10 week platform lead time. The Meta Page, Meta Instagram and YouTube issues all said the same thing: the code is done, the wait is external.'
		},
		{
			kind: 'p',
			text: "TikTok's own docs explain why that wait was not going to end well. Under its [Direct Post developer guidelines](https://developers.tiktok.com/docs/en/content-sharing-guidelines#direct_post_api_-_developer_guidelines), an unaudited client can only post in private viewing mode, and the same page's intended-use rules reject a utility tool for uploading to accounts you or your team manage — a fair description of what I had built. YouTube's [videos.insert reference](https://developers.google.com/youtube/v3/docs/videos/insert) restricts uploads from unverified API projects created after 28 July 2020 to private viewing until the project passes an audit, and [quota beyond the default allocation](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) needs an audit too."
		},
		{
			kind: 'p',
			text: "So the replacement was chosen before the deletion, and it needed no code: an MCP-connected assistant drafts each post from real product data through the admin MCP endpoint, and each platform's own built-in scheduler publishes it. The roadmap entry listed what that one move removed:"
		},
		{
			kind: 'table',
			head: ['Removed', 'What it had meant'],
			rows: [
				[
					'OAuth token custody',
					'stored tokens with publish scopes, encrypted under a key derived from the auth secret'
				],
				['The TikTok app audit', 'a 4–10 week lead time, for a use case the guidelines list as not acceptable'],
				['The YouTube upload quota', 'a default allocation, with a compliance audit to go beyond it'],
				['An unattended AI job', 'a sweep every five minutes, able to generate posts with nobody watching']
			]
		},
		{ kind: 'h2', text: 'What the deletion actually was' },
		{
			kind: 'p',
			text: "The commits were ordered so each one compiled alone. The admin went first — 72 files changed, including seven deleted pages and 29 deleted component files — because the admin type-checks against the API through [[skill:elysia-js]]'s Eden client, so removing the consumer before the producer is the direction that stays green. Photo Studio, a batch product-photo tool built on the same pipeline, went in the same call."
		},
		{
			kind: 'p',
			text: "The engine commit touched 229 files: 39 under the social module, the whole photo-batch module, and 70 from the shared types package, 61 of them social. The API and the shared package could not be split. The calendar's layer enum is a closed union and its service types a runner table as a record over it, so deleting the social entries without the enum member fails type-checking, and deleting the member first breaks every file still naming it. The commit message says it flatly: a green split does not exist here."
		},
		{
			kind: 'p',
			text: "Two surfaces collapsed rather than just losing an option. The calendar's empty-day chooser had offered Article or Social; with one option left it was a click asking permission to do the only thing it could do, so an empty day now opens a new article directly. Record search lost its `post` group, because a closed union enumerated in three places would otherwise ship a section that can never fill. The data-deletion page that Meta's review required was kept, rewritten as a general PDPA rights page — Thai law grants that right whether or not a reviewer is asking."
		},
		{
			kind: 'p',
			text: 'The gate held: 1,111 tests passing, 0 failing, after 38 API, 5 integration and 10 shared-package test files were deleted with their subjects. A clean local boot ensured 111 of 111 indexes with no social worker and no scheduler registration, and the docs check went back to zero dangling links.'
		},
		{ kind: 'h2', text: 'Deleting the code deletes nothing outside the repo' },
		{
			kind: 'p',
			text: 'The part worth copying is the artefact that had to outlive the removal. Five [[skill:bullmq]] job schedulers lived in [[skill:redis]] — `social-autopilot-v2` on a five-minute interval, `social-poll-v1` every 90 seconds — and a scheduler is a durable entry keyed by id, not something in the code; it survives the worker and the code that registered it. Eight [[skill:mongodb]] collections left the codebase, including `social_channel` and its OAuth tokens with publish scopes. Every [[skill:cloudflare-r2]] object under the social prefix stayed where it was.'
		},
		{
			kind: 'p',
			text: "BullMQ's docs describe [removeJobScheduler](https://docs.bullmq.io/guide/job-schedulers/manage-job-schedulers#remove-job-scheduler) as the way to clean up obsolete schedulers. So the old retire script became `social:teardown`:"
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				"Simplified from the teardown script in 8d829b6a. Order is the point: per the script, obliterate clears a queue's jobs but not its scheduler entries.",
			code: "// Literals, not imports — the module that declared them is deleted.\nconst SCHEDULER_IDS = [\n\t'social-poll-v1', // every 90 s\n\t'social-refresh-tokens-v1',\n\t'social-autopilot-v2', // every 5 min\n\t'social-autopilot-v1',\n\t'social-metrics-v1',\n] as const\n\nfor (const name of ['social-publish', 'photo-batch']) {\n\tconst queue = new Queue(name, { connection })\n\tfor (const id of SCHEDULER_IDS) await queue.removeJobScheduler(id) // first\n\tawait queue.obliterate({ force: true }) // jobs only\n\tawait queue.close()\n}"
		},
		{
			kind: 'p',
			text: 'It had to run after the removal deployed — the old code re-registered every scheduler on boot, so draining Redis first would buy exactly one restart. Each collection is exported, the export re-read and its row count matched, the live count re-checked, and only then dropped, one collection at a time so one failure cannot cost another its data. It refuses any name the live models still declare, because a reused collection name is how this kind of script destroys production data. And it guards the host, not the database name:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'Simplified from the same script — an unrecognised host is refused, not guessed at, and the only override is a CLI flag.',
			code: "function classifyHost(host: string): 'local' | 'production' | 'unknown' {\n\tconst name = host.split(':')[0] // the port varies per tunnel\n\tif (PRODUCTION_HOSTS.includes(name)) return 'production'\n\tif (LOCAL_HOSTS.includes(name)) return 'local'\n\treturn 'unknown'\n}\n\n// Every environment names its database 'rs-trophy', so the name proves nothing.\nconst verdict = classifyHost(mongoHost(MONGODB_URI))\nif (commit && verdict !== 'local' && !argv.includes('--i-know-this-is-production')) {\n\tconsole.log(`Refusing a ${verdict} host. Take a fresh dump first.`)\n\tprocess.exit(1)\n}"
		},
		{
			kind: 'p',
			text: 'The script ends by saying what it cannot do: the token key was derived from the auth secret, so dropping the collection revoked nothing platform-side. Deleting the developer apps and account grants at Meta, TikTok and Google stayed a manual, human step.'
		},
		{ kind: 'h2', text: 'Four days later, the premise turned out wrong' },
		{
			kind: 'p',
			text: 'On 4 September a 21-commit pull request put social publishing back — 217 files, 26,074 lines added, all in one day. Its docs commit reads like a note to the person who did the deleting:'
		},
		{
			kind: 'quote',
			text: "The premise was wrong for Meta … The 4-10 week gate was TikTok's and YouTube's, generalised to Meta by association.",
			cite: 'commit 0b2e8e78, 2026-09-04'
		},
		{
			kind: 'p',
			text: "Meta's [access-levels documentation](https://developers.facebook.com/docs/graph-api/overview/access-levels#standard-access) supports the narrower claim: an app used only by people who have a role on it needs only Standard Access, which Business apps get automatically, while App Review and Business Verification belong to Advanced Access. Publishing to a Facebook Page and an Instagram professional account the business itself owns sat on the cheap side of that line. The restored roadmap put it at roughly one working day from a fresh Meta app to a live API-published post."
		},
		{
			kind: 'p',
			text: 'What came back was selective. The adapters, the publish worker and OAuth connect returned as they were; the TikTok and YouTube adapters came back idle, their credentials left blank. The template layer did not return at all — and it had already churned: photo presets and caption templates were merged into one record on 18 August and split apart again on 20 August. Styling is now picked per post. The MCP idea survived inside the system it was meant to replace: an assistant can stage a draft, and nothing AI-made reaches a platform until a human approves it.'
		},
		{ kind: 'h2', text: 'What I got wrong' },
		{
			kind: 'p',
			text: "The deletion was carefully executed and built on an unchecked premise. I had two platforms' review gates in front of me and generalised them to a third without reading the third's docs. One page of Meta's documentation would have kept Facebook and Instagram on the roadmap and turned the 31 August decision into a much smaller one."
		},
		{
			kind: 'p',
			text: "The teardown did not save me either. The commit that switched publishing back on says the old autopilot schedulers were 'still firing every five minutes in production' against a worker deleted in August, so the restored code now retires them by id on every boot. The commits do not record why the teardown had not cleared them, and I will not invent a reason. And once social was live again, the script itself became the hazard: a `--commit` run would have obliterated the live publish queue and deleted every post's media. On 14 September it was cut back to retired collections only and renamed, because a runbook line saying teardown reads as 'tear social down'."
		},
		{
			kind: 'p',
			text: 'The honest case for the deletion is that it was cheap to reverse because it was clean: commits that each compiled, a script that refused to guess, docs that recorded the removal instead of hiding it. The restore took one day and left the twice-churned template layer behind. I still would not make the same call on the same evidence.'
		},
		{ kind: 'h2', text: 'Before you delete a feature stuck in review' },
		{
			kind: 'list',
			ordered: true,
			items: [
				"**Verify the gate per platform, from that platform's docs.** Waiting on review was three different claims for three platforms, and only two were true.",
				'**Choose the replacement first,** and write down what it removes — token custody, audits, quotas, unattended jobs.',
				'**Inventory what outlives the code:** schedulers, collections, object storage, platform-side grants. Run the teardown after the deploy, and rescope it the day the feature can come back.',
				'**Delete in commits that compile alone,** so a restore is a selective revert rather than an excavation.'
			]
		}
	],
	lessons: [
		"A gate I had verified for two platforms became an assumption about the third. 'Blocked on review' has to be checked per platform, against that platform's own docs, before it justifies deleting anything.",
		'Deleting code is a repo operation. Schedulers, collections, object storage and OAuth grants live outside the repo, so the teardown is part of the deletion, not a follow-up.',
		'A cleanup script written to outlive its feature becomes dangerous the day the feature returns. I would scope it to what is retired from the start, never to a feature name.',
		'A clean, compiling, documented deletion was cheap to reverse — and the restore was the chance to leave behind the template layer that had churned twice in two days.'
	],
	faqs: [
		{
			q: 'Should you delete a finished feature that is stuck behind platform app review?',
			a: "Only after verifying the gate for each platform separately, from that platform's own documentation. I deleted a finished social auto-posting system because launch was waiting on TikTok, YouTube and Meta reviews, then restored it four days later when it turned out Meta needed no App Review to post to accounts the business owns. If the gate is real everywhere and a replacement removes the token custody and audits, deleting is defensible — but make the deletion clean enough to reverse."
		},
		{
			q: 'Does Meta require App Review to publish to your own Facebook Page and Instagram account?',
			a: "It did not in my case. Meta's access-levels documentation says an app used only by people who have a role on it needs only Standard Access, which Business apps receive automatically; App Review and Business Verification apply to Advanced Access. Publishing to a Facebook Page and an Instagram professional account the business itself owns fell on the Standard side, and my restore notes put it at roughly one working day from a new app to a live post. Check the current docs against the permissions you actually need."
		},
		{
			q: 'Why do BullMQ job schedulers survive deleting the code that created them?',
			a: 'Because a job scheduler is a durable entry in Redis keyed by its id, not something that lives in your code. Deleting the worker and the call to upsertJobScheduler leaves the entry in place, still scheduling a job no worker will take. Remove each one explicitly with removeJobScheduler, before obliterating the queue, and run that cleanup after the deploy that removes the registering code — otherwise the old code re-registers everything on its next boot.'
		},
		{
			q: 'What can a TikTok Content Posting API client do before it passes the audit?',
			a: "Very little that is public. TikTok's content sharing guidelines say an unaudited Direct Post client can only post in private viewing mode, caps how many users can post through it in a 24-hour window, and requires the posting accounts to be private. The same guidelines reject a utility tool for uploading to accounts you or your team manage as an intended use — which is close to what an in-house auto-poster is."
		},
		{
			q: 'How do you safely drop MongoDB collections that held OAuth tokens?',
			a: 'Export first and prove the export: write it atomically, re-read it, match its row count, re-check the live count, and only then drop — one collection at a time, so a failure cannot cost another collection its data. Refuse any name the live code still declares, guard on the database host rather than the database name, and remember that dropping the tokens revokes nothing on the platform side; deleting the developer apps and account grants is a separate manual step.'
		}
	],
	sources: [
		{
			title: 'TikTok for Developers — Content Sharing Guidelines: Direct Post API',
			url: 'https://developers.tiktok.com/docs/en/content-sharing-guidelines#direct_post_api_-_developer_guidelines'
		},
		{
			title: 'YouTube Data API — Videos: insert',
			url: 'https://developers.google.com/youtube/v3/docs/videos/insert'
		},
		{
			title: 'YouTube Data API — Quota and compliance audits',
			url: 'https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits'
		},
		{
			title: 'Meta for Developers — Graph API access levels',
			url: 'https://developers.facebook.com/docs/graph-api/overview/access-levels#standard-access'
		},
		{
			title: 'BullMQ — Manage Job Schedulers',
			url: 'https://docs.bullmq.io/guide/job-schedulers/manage-job-schedulers#remove-job-scheduler'
		}
	]
}
