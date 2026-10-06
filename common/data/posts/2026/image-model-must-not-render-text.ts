import type { PostDef } from '../../../interfaces'

/** Sources: rs-trophy.com commits 28e27421 + 58956e74 (2026-08-11, card re-skin script and its tests), 733a7ea6 + d2b3759b (2026-08-12, centring/low-res fixes and the bulk-image-gen playbook), PR #309 merged as 664b8905 (2026-08-13); eed7718e (2026-08-19) for the follow-up. */
export const imageModelMustNotRenderText: PostDef = {
	id: 'image-model-must-not-render-text',
	title: 'Why an image model must never render the text on your product cards',
	happenedAt: '2026-08-11',
	publishedAt: '2026-08-11',
	chapter: 'ownership',
	series: { id: 'social-autopilot', part: 2 },
	category: 'engineering',
	description:
		'A bulk AI restyle of our price cards dropped rows, invented a code and turned LINE into LIME, and every card looked finished. What replaced it.',
	tldr: 'On 11 August 2026 I moved my family\'s trophy-company ad cards onto a new navy/gold template. One bulk image-model prompt was tried first and failed silently: it dropped a size row and a price row, invented a product code, printed the LINE badge as "LIME" and deleted the red X that marks an item as excluded from a set — and every output looked finished. The replacement re-types nothing. A local sharp script lifts each card\'s own printed pixels as an alpha matte and composites them onto the new frame, so the text a customer reads is the text the operator printed.',
	skills: ['typescript', 'bun-js'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: 'On 11 August 2026 I had a folder of 176 exported ad cards from [[company:ruamsuk-plating]] and a new navy-and-gold template to move them onto. The old cards were blue and teal: a product photo on top, a banner carrying the product code, and under it a printed table of sizes and prices. The new brand had been drawn for [[project:rs-trophy]]; the cards had not. The alternative was re-laying 176 cards by hand, so the first thing tried was the obvious one — one generic prompt to an image model, run over every card.'
		},
		{
			kind: 'p',
			text: 'It was measured on `google/gemini-2.5-flash-image` over real cards, and the playbook commit the next day recorded what came back:'
		},
		{
			kind: 'list',
			items: [
				"It **dropped a row** from one card's size column and another from its price column.",
				'It **invented a product code** on a card whose real code is a line of Thai text.',
				'It printed the LINE contact badge as **"LIME"**.',
				'It deleted the **red X** over one trophy on a set promotion. The X is what says that item is not in the set, so the restyled post advertised a different offer.'
			]
		},
		{
			kind: 'p',
			text: 'Every one of those cards looked finished. That is the whole problem. Nothing in the output said "I changed your prices" — no smear, no gibberish, nothing a reviewer would catch on a thumbnail. A card with a missing price row reaches a customer looking exactly like a correct one.'
		},
		{
			kind: 'stat',
			value: '"LIME"',
			label: 'what one bulk image-model prompt printed where the card said LINE — on a card that otherwise looked done',
			source: 'bulk-image-gen playbook, commit d2b3759b'
		},
		{ kind: 'h2', text: 'Legible is not the same as faithful' },
		{
			kind: 'p',
			text: 'It is tempting to file this under prompt engineering, or under an old model. Google\'s documentation now advertises [advanced text rendering](https://ai.google.dev/gemini-api/docs/image-generation#gemini-3-capabilities) for its newer image models — legible, stylized text for menus and marketing assets. But "LIME" is perfectly legible. The failure was never that the model could not draw letters. It was that it was drawing them at all: asked to restyle a card, an image model regenerates the pixels, text included, and nothing in that process obliges the new digits to equal the old ones.'
		},
		{
			kind: 'p',
			text: 'Our cards made it worse. Their text mixes Thai and Latin, and Thai is not on the list of languages [Google recommends for best performance](https://ai.google.dev/gemini-api/docs/image-generation#limitations). And the failures were per card and random — one loses a row, another gains a code — so the only way to catch them is to read every output against its original, digit by digit. At that point the model has saved no labour. It has moved the labour to the step where a tired human is most likely to miss something.'
		},
		{ kind: 'h2', text: 'Lift the ink, never retype it' },
		{
			kind: 'p',
			text: "The replacement, committed late that night, takes the opposite position: every glyph on a re-skinned card is the operator's original printed pixels, moved. Nothing is re-typeset and nothing is generated. It is a local [[skill:bun-js]] script on [sharp](https://sharp.pixelplumbing.com/api-constructor/#sharp) — no network, no API key, it reads one folder and writes another, and it never touches the database or object storage. Four steps:"
		},
		{
			kind: 'list',
			ordered: true,
			items: [
				'**Classify.** A source must be A4 portrait and big enough. Of the 176 exports, 36 were rejected at intake — square promo posts, 4:5 social crops and low-resolution re-saves — each with a written reason.',
				"**Detect** the photo, the code banner and the table by sampling the card's accent colour inside its coloured border. Two earlier detector designs failed at scale; one sampled the white page margin outside the border and got white back.",
				'**Lift** the code line and the table off their background as an alpha matte: brightness becomes opacity, and the ink keeps its own pixels.',
				'**Composite** the photo, the new frame and the lifted text onto a blank canvas, in a fixed order.'
			]
		},
		{ kind: 'p', text: 'The lift is the idea everything else rests on, and it is a few lines:' },
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Simplified from cards/lift.ts, commit 28e27421 — the dark-ink-on-paper mode only.',
			code: '// Luminance to alpha as a RAMP, not a hard cut, so glyph edges stay anti-aliased.\n// The paper cutoff is 210, not 232: at 232, JPEG noise in the paper got\n// alpha ~17 and read as ghost text under every table.\nfunction inkAlpha(L: number): number {\n\tconst PAPER = 210 // at or above: paper, fully transparent\n\tconst CORE = 105 // at or below: solid ink, fully opaque\n\tif (L >= PAPER) return 0\n\tif (L <= CORE) return 255\n\treturn Math.round(((PAPER - L) * 255) / (PAPER - CORE))\n}'
		},
		{
			kind: 'p',
			text: "Because the glyphs arrive as pixels, there is no font to license and no Thai shaping to get right — the operator's original typesetting comes along intact. Composition is then ordinary [sharp compositing](https://sharp.pixelplumbing.com/api-composite/#composite): an ordered list of layers over a canvas. The template is opaque artwork with its photo well painted in, so the script punches an alpha hole in it and slides the photo underneath, which lets the frame's bevel and ribbon overlap the photo instead of being covered by it."
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'Simplified from cards/render.ts, commit 28e27421 — layer order is the contract; text goes last so nothing can cover a price.',
			code: "await sharp({ create: { width: 1587, height: 2245, channels: 4, background: '#ffffff' } })\n\t.composite([\n\t\t{ input: photo, left: WINDOW.x, top: WINDOW.y }, // under the frame\n\t\t{ input: frameWithHole, left: 0, top: 0 }, // bevel overlaps the photo edge\n\t\t{ input: navyPatch, left: BAKED.x, top: BAKED.y }, // hide the baked-in label\n\t\t{ input: codeInk, left: codeLeft, top: codeTop }, // lifted code line\n\t\t{ input: tableInk, left: tableLeft, top: TABLE.y } // lifted table, last\n\t])\n\t.jpeg({ quality: 92 })\n\t.toFile(out)"
		},
		{ kind: 'h2', text: 'Every bug hid on the contact sheet' },
		{
			kind: 'p',
			text: 'The first version wrote contact sheets — 24 thumbnails a page — so a batch could be reviewed without opening every file. That was a mistake. Every defect worth fixing looked fine at thumbnail size and only appeared at 100% zoom. The test commit that followed says so in its first line, and pins each fix to the constant that encodes it:'
		},
		{
			kind: 'list',
			items: [
				'**Ghost text.** At a paper cutoff of 232, JPEG noise in the paper (luminance 225–231) got an alpha around 17 — invisible per pixel, but smeared across a whole table block it read as faint text under every real table. The cutoff is 210.',
				'**Missing equals signs.** The filter that strips decorative rules tested shape, and an `=` is two short solid bars. It deleted every `=` from the size and price columns until a 40px width floor separated real rules (50px and up) from the sign (about 22px).',
				'**Shrinking tables.** Fitting every table into one fixed box made an 8-row card three times smaller than a 3-row one; rendered glyph heights ran from 20.1 to 60.9px. Sizing now targets a glyph height and fits against a per-row profile of the template, because its navy corner curves in.',
				'**Off-centre codes.** Measured row by row, the banner centre was 781.5px, not the assumed 800 — every code line sat 18.5px right. Centring on the heavy ink instead of the ink box moved the median card only 4.5px, but corrected the affected ones by up to 170px.'
			]
		},
		{
			kind: 'p',
			text: 'The contact sheets were replaced by a local review page: old card beside new, one comparison per screen, a verdict and a note per card, every decision reversible. The rule in the playbook is blunt — verify at 100% zoom, never on a contact sheet.'
		},
		{ kind: 'h2', text: 'What the deterministic route costs' },
		{
			kind: 'p',
			text: 'Look at that list again. The deterministic pipeline also silently deleted characters — every `=` sign, on every card, until a test caught it. So "pixels cannot go missing" is too strong. The honest difference is that its failures are systematic: one cause, every card, reproducible, fixed once and pinned by a test. The model\'s failures were per card and unpredictable. I will take a bug I can reproduce over one I have to hunt for across 176 files. The rest of the bill:'
		},
		{
			kind: 'list',
			items: [
				'**It is not AI-free.** The model was used once, offline, to erase the NEW ribbon from the template and produce a plain frame variant. That is the job an image model suits: erasing artwork, checkable by eye on one image, unable to corrupt a price. Its output is committed, never regenerated.',
				'**Detection is not complete.** The first commit records 132 of 140 A4 cards detected. The rest are skipped and listed with a reason, because a half-rendered card looks finished and would be sent.',
				'**Low-resolution sources come out softer.** A day later the thresholds became resolution-relative, admitting eight genuine 435–532px catalogue cards and taking the rendered set from 134 to 142. Their text is lifted ink rescaled and holds up; the photos do not.',
				'**It is bespoke.** The first commit added 1,139 lines, with every coordinate measured off one template. Redraw the artwork and the geometry has to be measured again. A prompt adapts to a new template for free.'
			]
		},
		{
			kind: 'p',
			text: 'A transplant is also faithful to the original, errors included. Whatever the old card printed, the new one prints. That is the property I wanted — but it means the script is a re-skin, not a proofread.'
		},
		{ kind: 'h2', text: 'The rule outlived the script' },
		{
			kind: 'p',
			text: "The playbook commit on 12 August turned the incident into a rule for anyone — person or agent — touching images in that repo: never let an image model render your text; use it for erasing and masks, and move the operator's own pixels for anything a customer reads. Eight days later it decided the design of something else. When we built a generator for one house card design per priced product, the model was allowed to stage the photograph and nothing more; every character was rasterised locally. Doing that for Thai is its own story, and it is [part 3](/blog/thai-text-macos-vs-alpine-resvg)."
		},
		{
			kind: 'p',
			text: 'It is also the lesson of [part 1](/blog/social-publisher-false-success), arriving in pixels instead of status codes. A green PUBLISHED on a post that went out private and a finished-looking card with a missing price row are the same failure: output that looks done and carries no evidence that it is right.'
		}
	],
	lessons: [
		'An image model regenerates text; it does not copy it. Anything a customer will read — a price, a code, a size — gets moved as pixels or set by code, never redrawn by a model.',
		'Judge an AI batch by its worst card, not its average. One silent dropped row outweighs a hundred clean restyles, and a contact sheet shows you the average.',
		'Prefer failures that are systematic. My deterministic pipeline had bugs too, but each one broke every card the same way, so one fix and one test closed it for good.',
		'Reject and report beats guess and render. A skipped card is a line in a report; a wrong card that looks finished is a customer conversation.'
	],
	faqs: [
		{
			q: 'Can AI image models render text on product images accurately?',
			a: 'They can render text that is legible, but not text you can trust to match a source. In our trial one generic prompt over real cards dropped a size row and a price row, invented a product code, printed "LIME" for "LINE" and deleted a red X that marked an excluded item — and every card still looked finished. Because the model regenerates the pixels, nothing guarantees the new digits equal the old ones, so anything a customer reads should be moved as pixels or set by code.'
		},
		{
			q: 'How do you change a product card template without retyping the text?',
			a: "Lift the printed text as pixels. Detect the text regions, convert each pixel's brightness into opacity so the ink becomes an alpha matte over a transparent background, then composite those mattes onto the new template with an image library such as sharp. The glyphs are the original typesetting, so nothing can be newly misspelled, and there is no font licensing or complex-script shaping to solve. The trade-off is geometry measured off one specific template."
		},
		{
			q: 'Why do automated image edits look fine on a contact sheet but fail at full size?',
			a: 'Because thumbnails average away exactly the defects that matter on a price card. In our re-skin, faint ghost text from JPEG noise, missing equals signs, a divider cutting through a price column and an 18.5px off-centre code line all looked correct on a sheet of 24 thumbnails and only showed at 100% zoom. Review one comparison per screen, original beside output, at full resolution.'
		},
		{
			q: 'Where is an image model still the right tool in a card pipeline?',
			a: 'Anywhere its output is checkable by eye on a single image and cannot corrupt data — erasing a ribbon from template artwork, or producing a background matte. We used one exactly once, offline, to make a plain variant of our frame, and committed the result rather than regenerating it. Using the model output as a mask applied to the original full-resolution image, rather than as pixels, also keeps the result sharp.'
		},
		{
			q: 'What is the best way to composite layers onto a template in Node or Bun?',
			a: "sharp's composite takes an ordered list of layers, each with an input and a position, and draws them in order over a base image or a blank canvas. Order is the contract: put the photo under a template with an alpha hole punched in its photo well, then any patches, then text last so nothing can cover it. If the template is opaque artwork, generate the hole yourself before compositing."
		}
	],
	sources: [
		{
			title: 'Google AI for Developers — Gemini image generation: Limitations',
			url: 'https://ai.google.dev/gemini-api/docs/image-generation#limitations'
		},
		{
			title: 'Google AI for Developers — Gemini image generation: model capabilities',
			url: 'https://ai.google.dev/gemini-api/docs/image-generation#gemini-3-capabilities'
		},
		{
			title: 'sharp — Compositing images',
			url: 'https://sharp.pixelplumbing.com/api-composite/#composite'
		},
		{
			title: 'sharp — Constructor (raw pixel input)',
			url: 'https://sharp.pixelplumbing.com/api-constructor/#sharp'
		}
	]
}
