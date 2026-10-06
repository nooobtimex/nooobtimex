import type { PostDef } from '../../../interfaces'

/** Sources: rs-trophy c275d299, 63f67dc3, 58796cdc, 9ae5ec9b, 703fdc7f, 8b61df25, ad8b8a04 (all 2026-08-17); 8d829b6a (2026-08-31, the deletion); 1ca9d0a4 (2026-09-24, the SARA AM fix). */
export const thaiTextMacosVsAlpineResvg: PostDef = {
	id: 'thai-text-macos-vs-alpine-resvg',
	title: 'How to render Thai SVG text byte-identically on macOS and in Alpine Docker',
	happenedAt: '2026-08-17',
	publishedAt: '2026-08-17',
	chapter: 'ownership',
	series: { id: 'social-autopilot', part: 3 },
	category: 'engineering',
	description:
		'SVG text through sharp asks fontconfig for fonts: hundreds on a Mac, none in Alpine. resvg with bundled static fonts gave byte-identical Thai on both.',
	tldr: 'To render Thai text identically on macOS and in an Alpine container, take the host fonts out of the loop. SVG text through sharp resolves fonts via fontconfig, which finds hundreds of faces on a Mac and none in the Alpine image, so text can render locally and ship blank. I moved to resvg with two bundled static font files and `loadSystemFonts: false`, and the same Thai + Latin layer produced the same sha256 on darwin-arm64 and inside the image.',
	skills: ['typescript', 'bun-js', 'docker', 'cloudflare-r2'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "On 17 August 2026 I was building a promo-card generator for [[project:rs-trophy]], the platform I run as [[career:ruamsuk-cto]] at my family's trophy company, and the first measurement I took was wrong. A probe rendered Thai through resvg and appeared to work. It had passed an option the Node binding does not have, the library ignored it without a word, and the text came out in a font installed on my Mac — a font the production container would never have. The same probe then concluded that weight selection was broken, which was also wrong."
		},
		{
			kind: 'p',
			text: 'That bug is the whole post in miniature. Text is the one part of an image pipeline that quietly reaches outside your code, into whatever fonts the machine happens to hold. On a laptop that is hundreds of faces. In an Alpine container it can be none. The work that day, done with an AI coding agent between mid-afternoon and late evening, was making a Thai card render the same bytes in both places — and proving it.'
		},
		{ kind: 'h2', text: 'Why the cards are typeset in code at all' },
		{
			kind: 'p',
			text: 'A promo card for [[company:ruamsuk-plating]] is mostly exact text. The commit that started the generator put it at **roughly 80%** of the card: a product code, size rows, price rows, phone numbers. [Part 2](/blog/image-model-must-not-render-text) of this series is about what an image model did with that material — it dropped a size row and a price row, invented a product code, and rendered "LINE" as "LIME" — and every one of those failures looked finished. So the generator became deterministic: a committed template plate, geometry measured in code, and text typeset onto it.'
		},
		{
			kind: 'p',
			text: "The owner's own design history picked the first template. Of roughly 190 finished cards, 144 were one A4 house design, and the clean background export of that design was a plate at exactly 1587×2245 px. The product photo goes into a measured well, the code into a navy banner, the sizes and prices into a two-column table. Compositing all of that is sharp's job, and sharp does it well. The text was the part that could not stay with it."
		},
		{ kind: 'h2', text: 'The SVG text path asks the machine for fonts' },
		{
			kind: 'p',
			text: "The API already shipped sharp, so the obvious move was to draw the text as SVG `<text>` and let sharp rasterise it. [sharp's install docs](https://sharp.pixelplumbing.com/install/#fonts) say what happens next: when it renders an SVG that contains text, fontconfig is used to find the fonts. On macOS every system font is available. On Linux you get whatever fonts a package manager put there."
		},
		{
			kind: 'p',
			text: 'The API image is `oven/bun:1-alpine` plus ffmpeg, built on [[skill:docker]] and run by [[skill:bun-js]]. The commit records what fontconfig finds in each place: hundreds of faces on the Mac, **zero** in the container. That failure never throws. The card renders perfectly in development and ships with blank text, and the only test that catches it is a person looking at a production card.'
		},
		{ kind: 'h2', text: 'resvg: explicit font files, system fonts switched off' },
		{
			kind: 'p',
			text: 'resvg takes font files as input and can be told to ignore the host entirely. Its shaper is rustybuzz, a Rust port of HarfBuzz, so Thai gets real GSUB/GPOS positioning — tone marks and upper vowels land over the right consonant. The renderer that went into the API is small:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Simplified from apps/api/src/modules/promo-card/layout.ts (rs-trophy, 63f67dc3).',
			code: "import { Resvg } from '@resvg/resvg-js'\n\nconst FONT_FILES = [join(ASSETS, 'Anuphan-Medium.ttf'), join(ASSETS, 'Anuphan-Bold.ttf')]\n\nexport function renderTextLayer(svg: string): Buffer {\n\tassertPromoFontsPresent() // a missing file throws at startup, not as a blank card\n\tconst resvg = new Resvg(svg, {\n\t\tfont: {\n\t\t\tfontFiles: FONT_FILES,\n\t\t\tdefaultFontFamily: 'Anuphan',\n\t\t\tloadSystemFonts: false, // the load-bearing line\n\t\t},\n\t})\n\treturn resvg.render().asPng()\n}"
		},
		{
			kind: 'p',
			text: "`loadSystemFonts: false` is the line that matters. [resvg-js's Node typings](https://github.com/thx/resvg-js/blob/main/index.d.ts) document it as defaulting to true — which is exactly why my first probe looked like it worked."
		},
		{ kind: 'h3', text: 'Three measurements that contradicted the design' },
		{
			kind: 'list',
			items: [
				"**`fontBuffers` does not exist in the Node binding.** The resvg-js README shows it in its browser example, and it is real — in the [WebAssembly build's typings](https://github.com/thx/resvg-js/blob/main/wasm/index.d.ts). The Node binding at 2.6.2 takes `fontFiles` and `fontDirs` only. The unknown key was dropped in silence, system fonts were on by default, and the probe measured a macOS face.",
				'**Variable fonts render at their default master.** Anuphan, the Thai face the storefront already ships, is variable: a `wght` axis from 100 to 700, defaulting to 400. resvg-js 2.6.2 [bundles resvg 0.34](https://github.com/thx/resvg-js/blob/v2.6.2/Cargo.toml), and PNGs rendered at weight 400 and 700 came out byte-identical — every headline would have printed at body weight. An issue filed by someone I have never met, [linebender/resvg#962](https://github.com/linebender/resvg/issues/962), describes the same thing with another variable font, and the workaround suggested in its thread is the one I had already reached: instance the font at a fixed weight.',
				'**No font means no text.** With `fontFiles: []` and system fonts off, the output had **0 inked pixels**. There is no hidden fallback. I kept that as a feature: a missing font is a visibly empty card in review, never a card silently set in the wrong typeface.'
			]
		},
		{
			kind: 'p',
			text: "The variable-font finding forced a build step. A small script decompresses the committed WOFF2, uses HarfBuzz's subsetter to pin the `wght` axis, and writes two static instances, Medium 500 and Bold 700, under the same family name so `font-weight` selects between them again. It refuses to write a face it cannot verify, because a font that is still variable would silently render at one weight:"
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'Simplified from apps/api/src/scripts/gen-promo-fonts.ts (rs-trophy, 63f67dc3). Run by hand; the output is committed.',
			code: "const WEIGHTS = [\n\t{ wght: 500, file: 'Anuphan-Medium.ttf' },\n\t{ wght: 700, file: 'Anuphan-Bold.ttf' },\n] as const\n\nfor (const { wght, file } of WEIGHTS) {\n\tconst ttf = instantiateAt(hb, variableTtf, wght) // hb-subset: pin wght, bake the deltas\n\tif (readWeightClass(ttf) !== wght) throw new Error(`${file}: usWeightClass is not ${wght}`)\n\tif (hasTable(ttf, 'fvar')) throw new Error(`${file}: still variable, resvg would ignore its weight`)\n\tawait writeFile(join(OUT_DIR, file), ttf)\n}"
		},
		{
			kind: 'p',
			text: 'With the two static faces in place, the same string inked 18,233 pixels at 500 and 24,787 at 700. Weight selection worked again. Anuphan is OFL with no Reserved Font Name, so the instances keep the family name, and the licence file travels beside them.'
		},
		{ kind: 'h2', text: 'The proof: one hash on two platforms' },
		{
			kind: 'p',
			text: 'A determinism claim deserves a determinism test. Once, on 17 August, the same two-line Thai and Latin layer was rendered on darwin-arm64 and inside the built Alpine image, which runs the linux-arm64-musl resvg prebuild. The two PNGs were the same bytes: sha256 `57eefda892c005e495506d9a38b8568bc848bdc7ed74239f6b3d905e01dca99e`.'
		},
		{
			kind: 'stat',
			value: '25,696 B',
			label: 'one Thai + Latin text layer, rendered on macOS and inside the Alpine image — the same sha256 on both',
			source: 'rs-trophy commit 63f67dc3'
		},
		{
			kind: 'p',
			text: 'That is the evidence that no font lookup happens at runtime. No Dockerfile change was needed: the image already copies the API source wholesale, so the two TTFs ship beside the template plate the same way the older card frames do. The commit landed with 900 tests passing, 9 of them new.'
		},
		{
			kind: 'p',
			text: "Two smaller decisions finished the path into publishing. The social composer cover-cropped every image to each platform's aspect at approval time, which suits a photograph and amputates a card: an A4 card cropped to a 4:5 feed loses about 11% of its height — the top of the layout and the contact footer at the bottom. Rendered cards now contain-pad onto a colour sampled from their own corner instead, which is what the owner does when posting A4 cards by hand. And because a card is a short-lived intermediate, it is stored as 2 [[skill:cloudflare-r2]] objects instead of the 9 a normal upload produces."
		},
		{ kind: 'h2', text: 'What it cost, and what identical bytes do not prove' },
		{
			kind: 'p',
			text: "The owner's first look at a real render found what my tests did not: the code label sat off-centre. The plate had `CODE :` baked into the artwork at the position it was exported around, so any code of a different length lopsided the phrase. The fix painted the baked glyphs out with a one-pixel column of the banner's own navy, stretched across the patch — the banner carries a vertical gradient, so a flat fill would band — and typeset the whole phrase centred. Pixel-exact rendering does not make a layout right."
		},
		{
			kind: 'p',
			text: 'Identical bytes prove determinism, not correctness. Five weeks later, on 24 September, Thai words containing SARA AM (U+0E33) were found printing wrong on product stamps that reuse this renderer: resvg gave the precomposed vowel no advance of its own, so its second half was drawn under the next letter. On every platform, byte-identically wrong. The fix splits the character before resvg shapes it, the way HarfBuzz decomposes it. My cross-platform proof would have passed that bug all day.'
		},
		{
			kind: 'p',
			text: 'One of the commit\'s reasons for leaving sharp was too strong. It says `sharp({ text })` threw `VipsOperation: class "text" not found`, as though sharp could not set text at all. [sharp\'s constructor docs](https://sharp.pixelplumbing.com/api-constructor/) describe a `text` input that takes a `fontfile`, and I never chased why it threw that day. The fontconfig argument against the SVG path stands on its own; the blanket claim about sharp does not.'
		},
		{
			kind: 'p',
			text: 'And the feature itself did not last. On 31 August the admin promo-card endpoints and the composer dialog were deleted with the rest of social auto-posting — [part 7](/blog/deleted-38k-lines-restored-in-4-days) is that story. The render internals survived because offline batch scripts still use them. The typesetting outlived the product it was built for.'
		}
	],
	lessons: [
		'Any rendering step that resolves fonts at runtime is environment-dependent. Pass font files explicitly and switch system fonts off, so a missing font fails in review instead of rendering in whatever typeface the host has.',
		'An option a binding does not recognise is usually not an error — it is silence. When a probe "works", check that it used the input I think it used before trusting what it measured.',
		'Variable fonts are not safe input for every renderer. Bake the weights you need into static instances, and verify the output (usWeightClass, no fvar) rather than trusting the conversion.',
		'A cross-platform hash proves two machines agree. It does not prove either one is right, so a human still looks at real output at 100% zoom.'
	],
	faqs: [
		{
			q: 'Why does SVG text render on my Mac but come out blank in Docker?',
			a: 'Because the renderer asks the machine for fonts. sharp rasterises SVG text through librsvg, which resolves fonts via fontconfig: a Mac exposes every system font, while a slim or Alpine image often has none installed. Nothing throws — the text simply renders empty. Either install fonts and a fontconfig configuration in the image, or use a renderer such as resvg that takes explicit font files and can ignore the system entirely.'
		},
		{
			q: 'How do I load a custom font in resvg-js on Node.js?',
			a: 'Pass file paths: `font: { fontFiles: [...], loadSystemFonts: false, defaultFontFamily: "..." }`. `loadSystemFonts` defaults to true, so leave it on and a missing font quietly falls back to a host face. `fontBuffers` exists only in the WebAssembly build; the Node binding at 2.6.2 ignores it without an error.'
		},
		{
			q: 'Does resvg support variable fonts and font-weight?',
			a: 'resvg-js 2.6.2 bundles resvg 0.34, which renders a variable font at its default master — weight 400 and 700 produced byte-identical PNGs for me. The reliable fix is to instance the font at fixed weights (hb-subset or fontTools can pin the `wght` axis) and ship static files that share a family name. Upstream resvg has since added variable-weight handling, per the discussion in linebender/resvg#962.'
		},
		{
			q: 'How can I prove image rendering is identical on macOS and Linux?',
			a: 'Render the same input on both and compare a hash of the output. My Thai + Latin text layer produced the same 25,696-byte PNG, with the same sha256, on darwin-arm64 and inside the Alpine image. That proves no host font is consulted — it does not prove the output is correct, which still needs a human review.'
		},
		{
			q: 'Does resvg shape Thai text correctly?',
			a: 'Mostly. Its shaper, rustybuzz, applies real GSUB/GPOS positioning, so tone marks and upper vowels stack over the right consonant. The exception I hit was SARA AM (U+0E33): the precomposed character got no advance of its own and its second half drew under the next letter. Decomposing it before shaping, as HarfBuzz does, fixed it.'
		}
	],
	sources: [
		{
			title: 'sharp — Installation: Fonts',
			url: 'https://sharp.pixelplumbing.com/install/#fonts'
		},
		{
			title: 'sharp — Constructor (text input and fontfile)',
			url: 'https://sharp.pixelplumbing.com/api-constructor/'
		},
		{
			title: 'resvg-js — Node.js type definitions (font options)',
			url: 'https://github.com/thx/resvg-js/blob/main/index.d.ts'
		},
		{
			title: 'resvg-js — WebAssembly type definitions (fontBuffers)',
			url: 'https://github.com/thx/resvg-js/blob/main/wasm/index.d.ts'
		},
		{
			title: 'resvg-js v2.6.2 — Cargo.toml (bundled resvg version)',
			url: 'https://github.com/thx/resvg-js/blob/v2.6.2/Cargo.toml'
		},
		{
			title: 'linebender/resvg#962 — Add support for variable font weight detection/conversion',
			url: 'https://github.com/linebender/resvg/issues/962'
		}
	]
}
