import type { PostDef } from '../../../interfaces'

/** Sources: the node graph + sticky notes of the 46-node n8n "Video Factory v2" workflow JSON, and the rs-trophy-platform memory note. */
export const automationIsMostlyFailureHandling: PostDef = {
	id: 'automation-is-mostly-failure-handling',
	title: 'Most of my automation is failure handling',
	happenedAt: '2026-08-18',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'ownership',
	category: 'engineering',
	description:
		'A third of my n8n video pipeline — 13 of 40 nodes — exists only for failure: retries, error writes, cleanup. The happy path was the easy part.',
	tldr: "I built an n8n workflow that turns a row in a Google Sheet into a finished, uploaded product video for my family's trophy business. Of its 40 working nodes, 13 — a full third — exist only for failure: polling, retry counters, error writes, cleanup. The pipeline's real coordination layer is four words in a spreadsheet status column: `pending`, `processing`, `done`, `error`. The happy path is the demo; the failure-handling third is what makes it automation.",
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "In mid-August 2026, a few weeks into the [[career:ruamsuk-cto]] role at my family's 20-year-old trophy company, I finished [an n8n workflow](https://docs.n8n.io/) that turns a row in a Google Sheet into a finished product video for [[company:ruamsuk-plating]]'s social channels — script, voice-over, AI footage, music, logo, uploaded to Drive — with no human in the loop. Type a product description into a spreadsheet; within the next scheduled run, a video exists."
		},
		{
			kind: 'p',
			text: 'Then I counted the nodes. The canvas holds 46; six are sticky notes documenting the six phases, so 40 do actual work. Of those 40, 13 exist only for when something goes wrong: retry counters, wait nodes, polling, status checks, error writers, a janitor. A third of the workflow produces nothing. It verifies, retries, records failure and cleans up. I no longer think that ratio is an accident of this workflow — I think it is the shape of automation itself.'
		},
		{ kind: 'h2', text: 'What the happy path does' },
		{
			kind: 'p',
			text: "The trigger fires every six hours. The workflow reads a Products sheet, filters for rows with status `pending`, sorts by `created_at` so the oldest goes first, and takes exactly one. Then it fans out in parallel: Claude writes a 30–45 second Thai script from a brand-knowledge prompt and ElevenLabs' multilingual model speaks it; background music downloads; Fal.ai's Kling model generates the product footage, and the brand logo comes down alongside. A merge node waits for all four files, then FFMPEG scales the footage to the target platform's aspect ratio, loops it to the voice-over's duration, mixes the music under the narration at 12% volume, overlays the logo and encodes H.264. The result uploads into a date-named Google Drive folder, a row is appended to a Published sheet, and the product row flips to `done`."
		},
		{
			kind: 'p',
			text: 'Counted on the canvas, that entire happy path — trigger to upload — is 27 nodes. The other 13 are for the mornings when it does not go like that.'
		},
		{
			kind: 'stat',
			value: '13 of 40',
			label: 'working nodes that only poll, verify, retry, record errors or clean up — none of them produce the video',
			source: "counted from the workflow's node graph"
		},
		{ kind: 'h2', text: 'The retry loop around the video model' },
		{
			kind: 'p',
			text: 'The fragile branch is video generation. Fal.ai runs Kling as an async queue: you submit a job, get a request id back, and poll until the job reports `COMPLETED`. n8n has no native retry-until construct, so the loop is built from seven nodes: a code node zeroes a retry counter in workflow static data, a wait node gives the render 30 seconds of head start, an HTTP node polls, an IF node checks the status. Not ready? A second code node increments the counter, a second IF asks whether it has reached five, and either a 15-second wait loops back to the poll — or the failure path begins: a set node writes a human-readable message ("Video generation timed out after 5 retries") and a Sheets node marks the row `error`, message included.'
		},
		{
			kind: 'code',
			lang: 'text',
			caption:
				'The retry loop, paraphrased from the node graph — seven nodes doing what a few lines of code would say.',
			code: 'submit job to the video API        # async queue, returns request_id\nretries = 0\nwait 30s                           # renders never finish instantly\nloop:\n  status = poll(request_id)\n  if status == COMPLETED: continue the pipeline\n  retries += 1\n  if retries >= 5:\n    row.status  = "error"          # plus a readable error_message\n    stop\n  wait 15s'
		},
		{
			kind: 'p',
			text: "I will argue against my own design here. Add the waits up: 30 seconds plus four more polls 15 seconds apart is roughly **90 seconds of patience** before the workflow declares a render dead — to this loop, a slow-but-succeeding job and a failed job look identical. The retry counter also lives in global static data, which two overlapping executions would happily share; it is only safe because the workflow claims exactly one product per tick. Both are real weaknesses. I shipped them anyway, because the fix for both is a real queue, and this workflow's whole reason to exist is that it is not one."
		},
		{ kind: 'h2', text: 'The spreadsheet is the state machine' },
		{
			kind: 'p',
			text: "The second thing the failure nodes taught me to respect is the humble status column. The whole factory is coordinated by four words in a Google Sheet: `pending`, `processing`, `done`, `error`. The first write happens before any work does — the moment a row is picked it flips from `pending` to `processing`, and that write is the lock that stops the next six-hour tick from claiming the same product twice. Every terminal path ends in a write: `done` arrives with the Drive link and a `finished_at` timestamp; `error` arrives with a message a human will actually read. Success also appends product, brand, platform, folder and link to a separate Published sheet — the factory's ledger."
		},
		{
			kind: 'table',
			head: ['status', 'who writes it', 'when'],
			rows: [
				['pending', 'a human', 'typing a product row into the sheet'],
				['processing', 'the workflow', 'the moment a row is claimed — before any work starts'],
				['done', 'the workflow', 'after upload, with the Drive link and a timestamp'],
				['error', 'the workflow', 'on poll timeout or FFMPEG failure, with a readable message']
			]
		},
		{
			kind: 'code',
			lang: 'text',
			caption: 'The whole coordination layer, paraphrased — one status column doing the work of a queue.',
			code: 'row = sheet.filter(status == "pending")\n           .sortBy(created_at).first()   # oldest first, one per tick\nrow.status = "processing"                # claim BEFORE doing any work\n# ... script, voice, footage, FFMPEG ...\nrow.status = "done" or "error"           # every path must end in a write'
		},
		{
			kind: 'p',
			text: "The obvious question is why a spreadsheet at all. On [[project:rs-trophy]] I already run a real job queue — [[skill:bullmq]] on [[skill:redis]] drives the embedding pipeline behind the site's semantic search — and a queue would give this factory leases, concurrency and dead-letter handling for free. I chose the sheet for one reason: legibility. In a family business, a spreadsheet is a UI everyone already knows. Anyone in the office can add a product, watch its status change, and read the error message when it fails — no dashboard, no n8n login, no me. The cost is equally honest: the sheet has no lease timeout, so if the workflow itself dies mid-run, a row sits at `processing` forever until a human resets the cell. For one video every six hours I take that trade. At ten times the volume I would not."
		},
		{ kind: 'h2', text: 'Every ending runs the janitor' },
		{
			kind: 'p',
			text: "The detail I am most attached to is the smallest. All three endings converge on the same cleanup node: the success path, the poll-timeout path and the FFMPEG-failure path each finish by deleting the temp directory that held the voice file, the music, the footage and the logo. FFMPEG gets its own guard — an IF node checks the exit code, and a non-zero exit writes the actual stderr into the sheet's `error_message` column, so a codec complaint surfaces in exactly the same place a timeout does. Failure handling is not just retrying. It is making sure a failed run leaves the system as clean, and as informative, as a successful one."
		},
		{
			kind: 'p',
			text: 'None of this is clever. Every node in that third is boring — a counter, a wait, an IF, a status write. But the boring third is the difference between automation and a demo: a demo works when everything works; automation has already decided what happens when things do not. When I open the canvas now I do not see the 27 nodes that make the video. I see the 13 that let it run while I do something else.'
		}
	],
	lessons: [
		'Budget for the failure paths up front. The happy path was a third of the effort and none of the operational value — I now read every automation estimate as "demo time, times three".',
		'Every lock needs a lease. My `processing` status has no timeout, so a crashed run strands its row until a human edits a cell. It is the first thing I would fix in a v3.',
		'Write errors where the operator already looks. An `error_message` column in the sheet the family already uses is worth more than any execution log inside n8n.',
		'Choosing the primitive everyone can read — a spreadsheet over the queue I already run elsewhere — was right at this volume. The discipline is admitting out loud that it has a ceiling.'
	],
	faqs: [
		{
			q: 'How do you build a retry loop in n8n?',
			a: 'n8n has no native retry-until construct, so you compose one from nodes: a Code node initialises a counter in workflow static data, a Wait node delays, an HTTP Request node polls the async API, and an IF node checks the response status. On a not-ready response a second Code node increments the counter and a second IF compares it to a cap — below the cap you loop back to the poll through another Wait; at the cap you branch to an error path that records the failure somewhere a human will see it. In my video workflow that is seven nodes for the loop plus two more for the error write.'
		},
		{
			q: 'Can you use a Google Sheet as a job queue?',
			a: 'At low volume, yes — with open eyes. A status column gives you a state machine (pending, processing, done, error), writing `processing` before starting work gives you a lock, and an `error_message` column gives you an operator-readable failure log. What you do not get is a lease timeout or safe concurrency: a crashed worker strands its row, and two workers would race. For one job every few hours with non-technical stakeholders watching, the legibility wins; for real throughput, use a real queue.'
		},
		{
			q: 'Why does automation need so much failure handling?',
			a: "Because the happy path only has to work once to be written, while the failure paths have to work every time something external misbehaves. My product-video workflow depends on four external services — an LLM, a text-to-speech API, an async video model and Google's Sheets and Drive APIs — plus FFMPEG, and each can be slow, down or wrong. Thirteen of the workflow's 40 working nodes exist only to poll, verify, retry, record errors and clean up, and that third is precisely what lets it run unattended."
		},
		{
			q: 'How does an AI product video pipeline work end to end?',
			a: "Mine runs on a six-hour schedule: it claims the oldest `pending` row from a Google Sheet, has Claude write a short Thai script from a brand-knowledge prompt, synthesises the voice-over with ElevenLabs, and generates footage with Kling through Fal.ai's async queue. FFMPEG then scales the footage to the target platform's aspect ratio, loops it to the voice duration, mixes background music under the narration and overlays the logo. The finished H.264 file uploads to a date-named Google Drive folder and the row flips to `done` with the link."
		}
	],
	sources: [
		{
			title: 'n8n — Handle errors gracefully',
			url: 'https://docs.n8n.io/build/flow-logic/handle-errors-gracefully'
		},
		{
			title: 'n8n — Documentation',
			url: 'https://docs.n8n.io/'
		}
	]
}
