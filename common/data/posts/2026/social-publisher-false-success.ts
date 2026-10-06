import type { PostDef } from '../../../interfaces'

/** Sources: rs-trophy.com commits 5b5b1519, f92000ae, fcdb5bb3, 57f9f513, 7f94a1d4 (2026-08-05, development branch), 1af7d2f8 + f6e13e56 (2026-08-10, dry-run sandbox removed), 1d62ee0e (2026-08-14, Meta OAuth grant). */
export const socialPublisherFalseSuccess: PostDef = {
	id: 'social-publisher-false-success',
	title: 'Why our social publisher reported success for posts that never went out',
	happenedAt: '2026-08-05',
	publishedAt: '2026-08-05',
	chapter: 'ownership',
	series: { id: 'social-autopilot', part: 1 },
	category: 'engineering',
	description:
		'Before it ever touched a platform, our social publisher could go green for posts sent private, wrong or not at all. What we fixed, and what it cost.',
	tldr: 'Before our social auto-posting system had ever been connected to a platform, a review on 5 August 2026 found it could report PUBLISHED for posts that went out privately, went out as the wrong media, or never went out: a TikTok privacy lookup that failed open to `SELF_ONLY`, a dry-run sandbox that answered for disabled channels with a synthetic success, and OAuth scopes stored as what we asked Meta for rather than what Meta granted. Every fix reduced to one rule — a status may only say what the platform confirmed — and keeping it cost us the sandbox.',
	skills: ['bullmq', 'mongodb', 'elysia-js', 'typescript', 'bun-js'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: 'On the morning of 5 August 2026, four days into the [[career:ruamsuk-cto]] role at [[company:ruamsuk-plating]], I sat down with an AI coding agent to review the social auto-posting subsystem in the [[project:rs-trophy]] admin. It lets the team draft a post, send it through review, schedule it, and fan it out to Facebook, Instagram, TikTok and YouTube from one delayed [[skill:bullmq]] job per post. It had never been connected to a real platform. Between 10:34 and 11:47 six commits to that module landed on the development branch, and the first one set the tone: none of these defects could fire yet, but each one produces wrong behaviour the moment the system is connected.'
		},
		{
			kind: 'p',
			text: 'What surprised me was the shape of them. A publisher has two jobs: put the post on the platform, and tell the operator whether it did. Ours had never attempted the first and was confidently wrong at the second. That is a different failure from the one in [my n8n video workflow](/blog/automation-is-mostly-failure-handling), where the hard part was retrying a slow API. Retries assume you can tell success from failure. These bugs were about not being able to.'
		},
		{
			kind: 'stat',
			value: '"0 done, 8 failed"',
			label: 'what a bulk Approve reported when every item had failed — in a green success toast',
			source: 'commit 5b5b1519'
		},
		{ kind: 'h2', text: 'Five ways to report success without publishing' },
		{
			kind: 'p',
			text: 'Each of these ends with the operator looking at a result that says everything went fine:'
		},
		{
			kind: 'table',
			head: ['Path', 'What the admin saw', 'What actually happened'],
			rows: [
				[
					'TikTok privacy lookup',
					'`PUBLISHED`',
					'The lookup failed, the code fell back to `SELF_ONLY`, and the video went out private'
				],
				[
					'Instagram carousel led by a video',
					'`PUBLISHED`',
					"Routing read only the first item's type, so it published one Reel and silently dropped every other asset"
				],
				[
					'A disabled channel, dry-run off',
					'`PUBLISHED`',
					'The sandbox adapter answered for it with a synthetic success; nothing was sent'
				],
				['Bulk Approve', 'a green toast', '"Approved: 0 done, 8 failed" — every item had failed'],
				[
					'A post scheduled while auto-post was off',
					'`SCHEDULED`',
					'The worker returned, the job completed and was removed, and nothing would ever publish it'
				]
			]
		},
		{
			kind: 'p',
			text: "The TikTok one is the one I keep thinking about, because nothing inside the system could ever have caught it. Before publishing, the adapter asks TikTok's [creator info endpoint](https://developers.tiktok.com/docs/en/content-posting-api-reference-query-creator-info) which privacy levels the account allows, and [the publish request must use one of them](https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post). Our code wrapped that lookup in a try/catch whose fallback was the most private option. One transient error and the post went out visible only to its owner, while the channel recorded success. A private post is a perfectly valid TikTok post, so no later check could tell. The commit message calls it a green result for a post nobody could see."
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'Simplified from the TikTok adapter, commit 57f9f513 — the fallback that turned an outage into a private post, and its replacement.',
			code: "// before — any error became a private post\ntry {\n\tconst opts = (await creatorInfo(token)).privacy_level_options\n\treturn opts.includes('PUBLIC_TO_EVERYONE') ? 'PUBLIC_TO_EVERYONE' : (opts[0] ?? 'SELF_ONLY')\n} catch {\n\treturn 'SELF_ONLY'\n}\n\n// after — the error propagates and the channel records FAILED\nconst opts = (await creatorInfo(token)).privacy_level_options\nconst chosen = opts.includes('PUBLIC_TO_EVERYONE') ? 'PUBLIC_TO_EVERYONE' : opts[0]\nif (!chosen) throw new Error('TikTok returned no allowed privacy levels')\nreturn chosen"
		},
		{
			kind: 'p',
			text: "Letting the error through makes the channel FAILED, which is retryable and true. An account that genuinely offers only `SELF_ONLY` is still honoured — TikTok restricts everything posted by an unaudited app to private viewing, and that is the platform's answer, not our guess. The scheduling bug had a second layer worth knowing: re-adding the job from inside the running worker looked like the fix, but the job id is stable and the completed job is retained, and [BullMQ ignores an add whose id already exists](https://docs.bullmq.io/guide/jobs/job-ids). The worker now defers the active job with `moveToDelayed` instead of pretending to re-queue it."
		},
		{ kind: 'h2', text: 'The approval gate had a side door' },
		{
			kind: 'p',
			text: "Two more defects were not about publish status, but they had the same smell — the screen said one thing and the data did another. The edit route, `PATCH /admin/social/posts/:id`, accepted a partial of the full post model, and that model includes `status`. The service spread the body straight into its [[skill:mongodb]] `$set` without passing through the state machine, so `{ status: 'APPROVED' }` skipped the readiness check, the reviewer stamp and the image renders the worker would later need. The composer sent `status` on every autosave, so the field was on the wire constantly."
		},
		{
			kind: 'p',
			text: 'The route body is now an explicit allowlist rather than an omit-list, so a lifecycle field added to the model later is non-editable by default, and the service strips `status` again for any caller that does not arrive over HTTP. The second defect: Bulk Duplicate copied a post by reference to the same stored media, and deleting either copy garbage-collected the shared objects — the survivor lost its source image, thumbnail, renditions and video variants. Deletes now ask whether another post still references an asset before queueing anything.'
		},
		{ kind: 'h2', text: 'A clock that could not keep a token alive' },
		{
			kind: 'p',
			text: "The token-refresh sweep ran every 24 hours and refreshed anything due to expire within the next 2. TikTok's [access tokens are valid for 24 hours](https://developers.tiktok.com/docs/en/oauth-user-access-token-management). Walk the arithmetic: the tick before expiry sees more than 2 hours left and does nothing; the next tick arrives a day later, after the token has died. The sweep structurally could not keep a channel connected, and nothing would fail until a real post tried to use the dead token. It now runs hourly, and the look-ahead is derived from the period — twice it — so the two cannot drift apart again."
		},
		{
			kind: 'p',
			text: 'Nine days later, on 14 August, the same pattern turned up in the OAuth records. Every Meta channel stored `scopes` at connect, and what it stored was `META_SCOPES` — the hardcoded list of permissions we ask for. The record was true by construction. Any check for a missing permission built on it would compare a constant against itself and always pass, which is worse than no check, because it manufactures confidence. Meta lets a person [decline individual permissions on the consent screen](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke), and that is exactly the case worth catching.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'Simplified from oauth.providers.ts, commit 1d62ee0e — store the grant Meta reports, not the request we sent.',
			code: '// before: every Meta channel persisted the list we ASK for\nchannel.scopes = META_SCOPES\n\n// after: read Meta\'s answer — declined permissions are in it too\nconst res = await fetchJson(`${graphBase}/me/permissions?access_token=${token}`)\nconst granted = (res.data ?? [])\n\t.filter(p => p.status === \'granted\')\n\t.map(p => p.permission)\n// empty or unreadable means "not recorded", never "granted nothing"\nif (granted.length > 0) channel.scopes = granted'
		},
		{
			kind: 'p',
			text: 'The [user permissions edge](https://developers.facebook.com/docs/graph-api/reference/user/permissions/) returns granted and declined permissions side by side, each with a status, so a key list or a length check would still count a declined one as held. Filtering on `granted` is the whole fix. The grant is now enforced at the two moments it can still be acted on: at connect, where re-consenting is one click, and at scheduling, where the error names the account and the missing permission.'
		},
		{ kind: 'h2', text: 'What deleting the sandbox cost' },
		{
			kind: 'p',
			text: 'On 10 August I removed the dry-run mode entirely. It was on by default, and it routed channels to a sandbox adapter that returned a synthetic success with a placeholder URL. Worse, it also answered for disabled channels when dry-run was off, so a post that never left the building rolled up PUBLISHED with nothing on screen saying otherwise — and in the metrics sweep it quietly replaced real engagement numbers with synthetic ones. Now a disabled channel fails its entry by name, and the auto-post switch is the only gate between a scheduled post and a platform.'
		},
		{ kind: 'p', text: 'That was the right call for the lie. It was not free:' },
		{
			kind: 'list',
			items: [
				"**The TikTok audit demo now needs a live token.** TikTok's audit is a person watching a screen recording of our compliance UI, and that UI cannot render without creator info. The sandbox faked it on purpose so the recording could be made before approval. Nothing replaced it.",
				'**There is no end-to-end publish check.** The smoke test was built on the sandbox and went with it. The publish path is now verifiable only against a real connected account.',
				'**Most of the adapter layer is unproven.** An August audit catalogued 27 defects there. Four were provable from the code alone and fixed on 5 August; about 23 hinge on API response shapes nobody had seen yet. One known lie was left open that day, on the record: Facebook video posts reported PUBLISHED immediately, whatever the transcode state.',
				'**The scope gate is silent where it knows nothing.** Channels connected before grants were recorded carry no scopes at all, and blocking them would strand every existing channel on a fact we do not have. So they pass.'
			]
		},
		{
			kind: 'p',
			text: 'I am also not certain deletion was the only answer. A sandbox that wrote its own status — SIMULATED, never PUBLISHED — would have kept the rehearsal and dropped the lie. I chose removal over a third state. With no platform connected yet, that traded a misleading green for no rehearsal at all, and on a system that already had traffic I would weigh it differently.'
		},
		{ kind: 'h2', text: 'A status only says what the platform confirmed' },
		{
			kind: 'p',
			text: 'Every fix that week reduced to one rule: a status may only report what the other side confirmed. The post rollup already held half of it — a channel left pending and never attempted rolls the post up to FAILED, a case an earlier version had defaulted to PUBLISHED. The reverse lie got fixed too. A channel that failed once and then published kept showing its old red error, because a successful update never mentioned the `error` field and `$set` left it in place. A false failure is just as corrosive as a false success: it teaches the operator to ignore red.'
		},
		{
			kind: 'p',
			text: 'None of this needed clever code. It needed reading every place that writes a status and asking where its evidence came from — and in this subsystem, several had none. [Part 2](/blog/image-model-must-not-render-text) is the same lesson in pixels: a restyled price card that looked finished and was wrong.'
		}
	],
	lessons: [
		'A status is a claim with a source. I now read every write to PUBLISHED and ask which platform response it came from; several here came from nowhere.',
		'Never fail open on a call that decides visibility. A fallback that turns an error into a private post converts an outage into a silent success.',
		'Store what the other side said, not what you asked for. A scope list that echoes the request can only ever agree with itself.',
		'A sandbox that answers "success" trains everyone to trust green. If I build a rehearsal mode again, it gets its own status instead of borrowing PUBLISHED.'
	],
	faqs: [
		{
			q: 'Why do my TikTok API posts come out private (SELF_ONLY)?',
			a: "Two common causes. TikTok restricts everything posted by an unaudited API client to private viewing until the app passes its Content Posting audit — that one is the platform's rule. The other is your own code: the publish request's privacy level must match one of the options the creator info endpoint returns, and if your adapter falls back to `SELF_ONLY` when that lookup fails, a transient error becomes a private post that still reports success. Ours did; the fix was to let the error fail the channel."
		},
		{
			q: 'How do I check which permissions a user actually granted my Meta app?',
			a: "Call the Graph API `/me/permissions` edge with the user's token and keep only the entries whose status is `granted`. The response lists declined and expired permissions as well, so counting keys or checking the length treats a declined permission as held. Do not persist the scope list you requested — Meta lets people untick individual permissions on the consent screen, so the request and the grant routinely differ."
		},
		{
			q: 'How often should a job that refreshes OAuth tokens run?',
			a: "Often enough that its look-ahead window is at least as long as its period, or a token can expire between two ticks. We ran a refresh every 24 hours with a 2-hour look-ahead against TikTok access tokens that are valid for 24 hours, so the sweep could never catch a token before it died. Running hourly with a 2-hour look-ahead, derived from the period so the two cannot drift, turns a failed refresh into an hour's delay instead of a dead channel."
		},
		{
			q: 'Should a social media publisher have a dry-run mode?',
			a: 'A rehearsal mode is useful; one that reports success is not. Ours returned a synthetic PUBLISHED and also answered for disabled channels when dry-run was off, so posts that never left the building looked published. Removing it cost us a pre-approval TikTok audit recording and any end-to-end publish test without a real account. If I built one again it would write its own status, such as SIMULATED, never PUBLISHED.'
		},
		{
			q: 'How do you stop an API PATCH from bypassing an approval workflow?',
			a: 'Do not accept a partial of the full model on the edit route. Accept an explicit allowlist of editable fields, so any lifecycle field added later is non-editable by default. Then strip lifecycle fields again in the service, so the guarantee holds for non-HTTP callers and does not depend on how the framework treats unknown properties. Status should change only through the transition functions that run the checks.'
		}
	],
	sources: [
		{
			title: 'TikTok for Developers — Content Posting API: Query Creator Info',
			url: 'https://developers.tiktok.com/docs/en/content-posting-api-reference-query-creator-info'
		},
		{
			title: 'TikTok for Developers — Content Posting API: Direct Post reference',
			url: 'https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post'
		},
		{
			title: 'TikTok for Developers — Manage user access tokens',
			url: 'https://developers.tiktok.com/docs/en/oauth-user-access-token-management'
		},
		{
			title: 'Meta for Developers — Graph API: User permissions',
			url: 'https://developers.facebook.com/docs/graph-api/reference/user/permissions/'
		},
		{
			title: 'Meta for Developers — Facebook Login: request and revoke permissions',
			url: 'https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke'
		},
		{
			title: 'BullMQ — Job Ids',
			url: 'https://docs.bullmq.io/guide/jobs/job-ids'
		}
	]
}
