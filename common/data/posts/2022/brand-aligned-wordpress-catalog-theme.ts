import type { PostDef } from '../../../interfaces'

/** Sources: rs-medal + rs-award timelines and descriptions in common/data/projects.ts (2022-09-01 milestone), ruamsuk-plating in common/data/entities.ts, ruamsuk-software-engineer-part-time in common/data/experiences.ts. */
export const brandAlignedWordpressCatalogTheme: PostDef = {
	id: 'brand-aligned-wordpress-catalog-theme',
	title: 'Designing a brand-aligned WordPress catalog theme without a designer',
	happenedAt: '2022-09-01',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'student',
	category: 'commerce',
	description:
		'Making a WordPress catalog theme look like a sixteen-year-old awards brand — a second-year CS student, no designer, no brand book, no budget.',
	tldr: "In September 2022 I spent a month making [[project:rs-medal]]'s WordPress theme look like it belonged to my family's awards company — with no designer and no brand book. **Brand alignment without a designer turned out to be restraint**: an accent palette taken from the medal finishes, one display face, neutral everything else, and product photography doing the talking. The theme was replaced by a Next.js remake in 2025; the information architecture thinking is the part that lasted.",
	skills: ['wordpress', 'seo'],
	relatedProjectIds: ['rs-medal', 'rs-award'],
	relatedExperienceIds: ['ruamsuk-software-engineer-part-time'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "In September 2022 I was starting my second year of Computer Science at Thammasat, a little over a year into the [[career:ruamsuk-software-engineer-part-time]] role at [[company:ruamsuk-plating]] — the awards manufacturer my family has run since 2006, my father, the CEO, at the head of it. The month before, I had stood up the WordPress foundation for [[project:rs-medal]], a catalog site for the company's medal line: hosting, a stock theme as the base, the plugin stack. September was the month it had to stop looking like a fresh install and start looking like it belonged to a company that had been making awards for sixteen years."
		},
		{
			kind: 'p',
			text: 'There was no designer. There was no budget for a designer, and hiring one for a part-time student project would have been a strange conversation to open with my father. So “brand-aligned” became a problem I had to define before I could solve it — because the brand did not live in any file I could open. It lived in the products: medals the factory casts, engraves, and electroplates in-house in Pathum Thani.'
		},
		{ kind: 'h2', text: 'The products were the only brand book' },
		{
			kind: 'p',
			text: 'What existed: a logo, and shelves of finished product. No palette document, no typography spec, no rules. I decided to treat the products as the spec. Medal finishes gave me the accent palette — gold, silver, bronze — and everything else stayed deliberately neutral, so the product photography could carry the page instead of competing with it.'
		},
		{
			kind: 'code',
			lang: 'css',
			caption:
				'Illustrative — the shape of the palette, not the real values. The accents were eyedropped from product photos; the neutrals exist to stay out of their way.',
			code: '/* accents come from the product, not from a trend */\n:root {\n\t--metal-gold: #c9a227;\n\t--metal-silver: #b7bcc2;\n\t--metal-bronze: #a5652b;\n\t/* everything else stays out of the way */\n\t--ink: #1f2933;\n\t--paper: #ffffff;\n}'
		},
		{
			kind: 'p',
			text: 'Typography followed the same logic. One display face for headings, an unremarkable body face, generous whitespace. The rule I gave myself was simple: any visual decision I could not defend by pointing at the logo or at a product did not ship. That single rule killed most of the decoration a second-year student with a stylesheet would otherwise commit.'
		},
		{ kind: 'h2', text: 'Information architecture was most of the design' },
		{
			kind: 'p',
			text: "The milestone in my project notes reads “brand-aligned theme and information architecture”, and the second half was the harder half. A catalog is only useful if it is organized the way customers ask, and customers do not ask the way a factory produces. Nobody enquires by alloy and millimeter; they ask for the event — a sports day, a graduation, a tournament. The structure had to speak the customer's language first and let the manufacturing detail live one level down. Concretely, every catalog page had three jobs:"
		},
		{
			kind: 'list',
			items: [
				'Recognition first — a visitor should know within seconds that this page sells medals, not plaques or trophies.',
				'The product big — photography at a size that shows the metal, because the finish is the selling point.',
				'A short path to a quote — every page ends at an enquiry, because that is where a custom order actually starts.'
			]
		},
		{
			kind: 'p',
			text: "That last point shaped the biggest structural call: RS Medal shipped as a catalog, not a store. No cart, no checkout. Custom awards are quoted — engraving, sizes, quantities, deadlines — so a checkout flow would have been theater in front of a conversation. The theme's job was to get the right product in front of the right visitor and hand them to that conversation quickly, which is also what made the on-page [[skill:seo]] and the Google Ads wired in at the November launch worth anything."
		},
		{ kind: 'h2', text: 'A stock base, a child theme, and knowing when to stop' },
		{
			kind: 'p',
			text: 'I did not build the theme from scratch, and I would defend that today. A stock [[skill:wordpress]] theme base ships with tested templates, responsive scaffolding, and an update path — weeks of work I did not have to redo badly. My changes went into a child theme: the palette, the typography, the catalog templates, all layered over the base where a parent update could not overwrite them.'
		},
		{
			kind: 'code',
			lang: 'php',
			caption: 'Illustrative — the child-theme pattern: load the parent stylesheet first, my overrides after it.',
			code: "// functions.php — parent styles first, overrides second\nadd_action('wp_enqueue_scripts', function () {\n\twp_enqueue_style('parent', get_template_directory_uri() . '/style.css');\n\twp_enqueue_style('child', get_stylesheet_uri(), ['parent']);\n});"
		},
		{
			kind: 'p',
			text: 'The honest counter-argument is that this whole month might have been the wrong spend. A purchased premium catalog theme, configured over a weekend, would probably have looked more polished than my hand-tuned child theme did. And a designer would have questioned things I never thought to question — I was aligning the site to the brand while also being the only person deciding what the brand was, which is a quiet conflict of interest. What I called brand alignment was really consistency plus restraint, applied without exception. I still think it was the right call for that year — the budget was zero and the practice was the point — but I stopped believing it was equivalent to design.'
		},
		{ kind: 'h2', text: 'One month, because it was the second time' },
		{
			kind: 'p',
			text: "The design phase fit inside September because I had already paid the tuition once. Five months earlier I had done the same job for [[project:rs-award]], the company's plaque and award catalog, whose brand-aligned showcase theme I designed in April 2022. RS Medal was the same problem against a different product line, and most of the decisions ported: neutral shell, metal accents, photography-first templates, quote-first structure. October went to building out the catalog and CMS content, and the site went live in November with SEO, analytics, and ad tracking wired in."
		},
		{
			kind: 'stat',
			value: '2022 → 2025',
			label:
				'service life of the theme — designed September 2022, live in November, replaced when the Next.js remake began in May 2025',
			source: 'RS Medal project timeline'
		},
		{
			kind: 'p',
			text: "The theme itself did not survive. In May 2025 I started the ground-up Next.js remake of RS Medal, and every line of that [child theme](https://developer.wordpress.org/themes/advanced-topics/child-themes/) was written off. What carried over was not code — it was the way of deciding: products as the palette source, structure in the customer's language, every page pointed at an enquiry. The files were disposable. The decisions were the asset."
		}
	],
	lessons: [
		'Restraint is the designer you can afford. An accent palette from the products, one display face, neutrals everywhere else — applied without exception, consistency did most of what I was calling design.',
		'Information architecture is the durable layer. The CSS was fully written off at the 2025 remake; organizing the catalog around how customers ask is the part I would rebuild the same way today.',
		'I should have written the decisions down. The palette and the rules lived in my head and one stylesheet, so every later build had to rediscover them. A one-page brand sheet would have cost an evening.'
	],
	faqs: [
		{
			q: 'How do you make a WordPress site look on-brand without hiring a designer?',
			a: 'Treat the products and the logo as the brand book. Pull an accent palette from the physical product, keep every other color neutral, limit yourself to one display typeface, and let consistent product photography do the visual work. Applied without exception, restraint reads as design — most off-brand sites fail by adding, not by lacking.'
		},
		{
			q: 'Should a small manufacturer build a catalog site or an online store?',
			a: 'If the products are custom — engraving, sizes, quantities, deadlines — a catalog with a fast path to a quote usually beats a cart, because the sale ends in a conversation anyway. RS Medal launched in 2022 as a pure catalog with no checkout; a sibling storefront in the family only added WooCommerce the following year.'
		},
		{
			q: 'Is it better to customize a stock WordPress theme or build a custom theme from scratch?',
			a: 'For a solo developer with a deadline, a stock base plus a child theme wins. The base contributes tested templates, responsive behavior, and an update path; the child theme holds your palette, typography, and template overrides where parent updates cannot erase them. Building from scratch buys control you will mostly not use and costs weeks you probably do not have.'
		},
		{
			q: 'What does information architecture mean for a product catalog website?',
			a: 'It is the structure underneath the styling: what the categories are, what each page must let a visitor do, and where every page leads. For a catalog, organize by how customers ask for the product rather than how the factory produces it, and give every page one clear next step — for custom goods that step is usually an enquiry, not a cart.'
		}
	],
	sources: [
		{
			title: 'WordPress Theme Handbook — Template Hierarchy',
			url: 'https://developer.wordpress.org/themes/classic-themes/basics/template-hierarchy/'
		},
		{
			title: 'WordPress Theme Handbook — Child Themes',
			url: 'https://developer.wordpress.org/themes/advanced-topics/child-themes/'
		}
	]
}
