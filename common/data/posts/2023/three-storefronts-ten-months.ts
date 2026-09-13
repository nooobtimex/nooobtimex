import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (rsAward, rsMedal, rsTrophy timelines), common/data/experiences.ts, common/data/entities.ts (ruamsukPlating). */
export const threeStorefrontsTenMonths: PostDef = {
	id: 'three-storefronts-ten-months',
	title: 'Three storefronts in ten months on the boring stack',
	happenedAt: '2023-01-01',
	publishedAt: '2026-08-25',
	chapter: 'student',
	category: 'commerce',
	description:
		"Three WordPress storefronts for my family's trophy factory in ten months, solo, while studying CS full-time — the four-phase playbook and what boring cost.",
	tldr: "Between March 2022 and January 2023 I stood up three storefronts for my family's trophy business — [[project:rs-award]], [[project:rs-medal]], and [[project:rs-trophy]] — solo, part-time, on WordPress. A fixed four-phase playbook (setup, design, development, launch with SEO and ad tracking) turned each build into a repetition instead of a project. Boring was the point: as a full-time student I needed a stack I could not get stuck in, and I paid for it in skills that did not compound.",
	faqs: [
		{
			q: 'Why choose WordPress and WooCommerce instead of a custom stack for a small manufacturer?',
			a: 'Because the constraint was capacity, not technology. I was a solo part-time developer studying Computer Science full-time, and WordPress turned hosting, theming, cataloging, and checkout into configuration instead of code. A custom stack would have produced a better codebase and a slower business. For a factory that needed to be found and contacted online, shipping in months beat elegance.'
		},
		{
			q: 'How long does it take one person to launch a WordPress storefront?',
			a: 'In my case, about four months per site, working part-time: one month each for setup, theme design, catalog development, and launch. RS Award ran March to June 2022 and RS Medal ran August to November 2022 on exactly that cadence. The consistency came from treating the phases as a fixed recipe rather than re-deciding the process every time.'
		},
		{
			q: 'What should a small-business storefront launch include beyond the website itself?',
			a: 'My rule was that a site did not count as launched until on-page SEO, analytics, and ad tracking were live. A catalog nobody can find is a brochure. All three storefronts shipped with search optimization and measurement wired in on launch day, so the business could see from day one whether the site was doing anything.'
		},
		{
			q: 'Why build three separate storefronts instead of one website?',
			a: 'Each product line — plaques and awards, medals, trophies — had its own brand and its own domain, so each got a focused catalog with its own theme. That matched how the business presented itself at the time, and it kept every build small enough for one part-time developer to finish. Years later the brands were consolidated onto rs-trophy.com, but that is a different chapter.'
		}
	],
	body: [
		{
			kind: 'p',
			text: "January 2023. The first working days of the year went into hosting, a fresh WordPress install, and a commerce plugin stack for rs-trophy.com — the storefront for [[company:ruamsuk-plating]], my family's factory in Pathum Thani. The factory has designed and manufactured trophies, medals, and award plaques since 2006, with zinc casting, laser engraving, and metal electroplating done in-house, selling nationwide. This build was the third storefront I had stood up for the business in ten months."
		},
		{
			kind: 'p',
			text: 'I was not a full-time developer. I was in the second year of a Computer Science degree ([[career:thammasat-bs-cs]]) and did the factory’s web work part-time around it ([[career:ruamsuk-software-engineer-part-time]]). That constraint made the stack decision before I did. Solo, part-time, with exams on the calendar, I did not need the most interesting storefront technology. I needed one I could not get stuck in.'
		},
		{ kind: 'h2', text: 'Ten months, three domains' },
		{
			kind: 'p',
			text: 'The run started in March 2022 with [[project:rs-award]], a showcase for plaques and awards. Setup in March. A brand-aligned theme and site structure in April. The catalog, content pages, and CMS workflows in May. Launch in June, with on-page SEO, analytics, and ad tracking wired in before I called it done. [[project:rs-medal]] repeated the same arc from August to November 2022 for the medal catalog: foundation, brand-aligned theme and information architecture, catalog and CMS, then a November go-live with the same tracking checklist.'
		},
		{
			kind: 'p',
			text: 'In January 2023 I broke ground on [[project:rs-trophy]]. This one was different in kind, not just in product line: the first of the three with real commerce to build — WooCommerce, a cart, a checkout — rather than a catalog that routes buyers to a phone call.'
		},
		{
			kind: 'stat',
			value: '10 months',
			label:
				'from the first WordPress install for rs-award.com (March 2022) to breaking ground on rs-trophy.com (January 2023)',
			source: 'RS Award / RS Medal / RS Trophy project timelines'
		},
		{ kind: 'h2', text: 'The playbook that made it repeatable' },
		{
			kind: 'p',
			text: 'By the second site I had stopped treating a storefront as a project and started treating it as a recipe. Four phases, roughly a month each, in the same order every time. The third build did not begin with decisions. It began with phase one.'
		},
		{
			kind: 'table',
			head: ['Phase', 'RS Award', 'RS Medal', 'RS Trophy'],
			rows: [
				['Discovery & setup', 'Mar 2022', 'Aug 2022', 'Jan 2023'],
				['Design — brand-aligned theme', 'Apr 2022', 'Sep 2022', 'planned Feb 2023'],
				['Development — catalog & CMS', 'May 2022', 'Oct 2022', 'planned Mar 2023'],
				['Launch — SEO, analytics, ads', 'Jun 2022', 'Nov 2022', 'planned Apr 2023']
			]
		},
		{
			kind: 'p',
			text: 'Phase one was plumbing: hosting, WordPress, and the plugin stack — which for the trophy site now included WooCommerce. Phase two was design, and I refused to ship a default template: the factory had a real brand, seventeen years old at that point, and the theme had to look like it. Phase three was the catalog itself — products, content pages, and CMS workflows, so that once I handed the site over, edits happened in the admin instead of waiting on me. At the code level every build started the same way too: a child theme, a parent-style enqueue, and a short list of cleanups.'
		},
		{
			kind: 'code',
			lang: 'php',
			caption: 'Illustrative — the child-theme functions.php pattern each of the three builds started from.',
			code: `// functions.php — where every one of the three builds started
add_action('wp_enqueue_scripts', function () {
	wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
});
// Catalog pages fight for mobile load time — strip what the theme does not need
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_head', 'wp_generator');
add_theme_support('post-thumbnails');
add_image_size('catalog-card', 480, 360, true);`
		},
		{
			kind: 'p',
			text: 'Phase four had one rule I refused to bend: a site did not count as launched until on-page [[skill:seo]], analytics, and ad tracking were live. A catalog nobody can find is a brochure. RS Award went live that way in June 2022, RS Medal in November 2022, and the trophy site would follow the same checklist. Measurement shipping with the site — not after it — was what let the family judge the work by enquiries instead of by my enthusiasm.'
		},
		{
			kind: 'code',
			lang: 'html',
			caption: 'Illustrative — the launch-phase tracking block; no measurement, no launch.',
			code: `<!-- Launch phase, every time: analytics + ad tracking before the site "counts" -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() { dataLayer.push(arguments); }
	gtag('js', new Date());
	gtag('config', 'G-XXXXXXX');
</script>`
		},
		{ kind: 'h2', text: 'Why boring, and what it cost' },
		{
			kind: 'p',
			text: 'The case for [[skill:wordpress]] was never that it was good engineering. It was that hosting, theming, cataloging, and — this time — checkout became configuration instead of code. The CMS was the point: after launch, product and content edits did not need a developer in the room. And a stack this common fails in ways a search result has already solved, which matters when your development time is whatever the degree leaves over.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The honest cost',
			text: 'Ten months of WordPress made me faster at WordPress, not at the engineering my degree was pointing toward. Hours in a theme and plugin stack were hours not spent writing the kind of code I actually wanted to be judged on, and I knew the plugin stack was a maintenance surface I would keep paying for as long as the sites ran. I chose boring anyway. I just never mistook it for free.'
		},
		{ kind: 'h2', text: 'What the third one changes' },
		{
			kind: 'p',
			text: 'RS Award and RS Medal were showcases — catalogs whose job was to get the factory found and start a conversation. The trophy site had a cart and checkout to build and marketing integrations to wire, which made it the same recipe with a much heavier development phase. If the playbook held, design would land in February, the catalog and checkout in March, and launch — SEO, analytics, ads, the usual rule — in April. Ask me in April.'
		}
	],
	lessons: [
		'A fixed playbook beat talent I did not have yet. Naming the four phases — setup, design, development, launch — turned the second and third storefronts from projects into repetitions, and repetition was the only way I got faster while studying full-time.',
		'Boring is a real choice with a real bill. WordPress bought me shipping speed and a CMS the business could run without me, and it charged me in plugin maintenance and in skills that did not compound toward the developer I wanted to become. I would make the same trade again at that capacity — and only at that capacity.',
		'None of the three builds were the final form. RS Award and RS Medal were later remade in [[skill:next-js]], and the brands were eventually consolidated onto rs-trophy.com — but the boring versions ran for years and kept the factory visible online while I finished the degree. Shipping the interim thing was the right call.'
	],
	skills: ['wordpress', 'woocommerce', 'seo', 'google-analytics', 'google-ads'],
	relatedProjectIds: ['rs-trophy', 'rs-award', 'rs-medal'],
	relatedExperienceIds: ['ruamsuk-software-engineer-part-time', 'thammasat-bs-cs'],
	relatedEntityIds: ['ruamsuk-plating'],
	sources: [
		{ title: 'RS TROPHY', url: 'https://rs-trophy.com' },
		{ title: 'RS Award', url: 'https://www.rs-award.com' },
		{ title: 'RS Medal', url: 'https://www.rs-medal.com' }
	]
}
