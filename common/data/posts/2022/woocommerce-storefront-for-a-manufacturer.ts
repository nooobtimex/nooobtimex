import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (rs-trophy, rs-medal, rs-award timelines), experiences.ts, entities.ts. */
export const woocommerceStorefrontForAManufacturer: PostDef = {
	id: 'woocommerce-storefront-for-a-manufacturer',
	title: 'Launching a WooCommerce storefront for a Thai manufacturer',
	happenedAt: '2022-11-01',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'student',
	category: 'commerce',
	description:
		"Why a CS student chose WooCommerce over custom code for his family's trophy factory storefront — and why the 'temporary' launch ran for three years.",
	tldr: "In late 2022, as a second-year CS student and part-time developer at my family's trophy factory, I started the WooCommerce storefront that became **rs-trophy.com**. Choosing a plugin over custom code felt like a cop-out and was the right call: four recorded months from discovery to the April 2023 go-live, solo, with SEO, analytics, and ad tracking wired in at launch. That storefront then ran in production for three years.",
	skills: ['woocommerce', 'wordpress', 'seo', 'google-analytics', 'google-ads'],
	relatedProjectIds: ['rs-trophy', 'rs-medal', 'rs-award'],
	relatedExperienceIds: ['ruamsuk-software-engineer-part-time', 'thammasat-bs-cs'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "November 2022. I was a second-year computer science student at Thammasat, and since August 2021 I had also been [[career:ruamsuk-software-engineer-part-time]] at [[company:ruamsuk-plating]] — my family's trophy factory in Pathum Thani, casting, engraving, and electroplating awards since 2006. On the first of the month, [[project:rs-medal]] went live: the second WordPress catalog site I had shipped for the company's brands that year, after [[project:rs-award]] in June. Both sites could show products. Neither could sell them."
		},
		{
			kind: 'p',
			text: "The next build had a harder requirement. The trophy brand's own storefront — the site that became [[project:rs-trophy]] — had to take orders, which meant a cart, a checkout, and everything that stands behind them. I built it on WordPress and [[skill:woocommerce]]. This post sits at the decision point; the project's recorded milestones run from January to April 2023."
		},
		{ kind: 'h2', text: 'Why WooCommerce, when I wanted to write code' },
		{
			kind: 'p',
			text: 'The honest starting point: I did not want to use WooCommerce. I was a computer science student with a working knowledge of the stack underneath it, and the pull toward building a custom cart was real. I picked the plugin anyway, for reasons that had nothing to do with what I felt like learning.'
		},
		{
			kind: 'p',
			text: "A checkout is not a feature; it is a liability surface. Payments, pricing, stock, shipping rules, refunds — every one of those is a place where a bug costs the business actual money, and I was one part-time developer working between lectures. WooCommerce carried a decade of other people's handled edge cases. A proven commerce engine operated carefully beat a clever one operated alone."
		},
		{
			kind: 'p',
			text: "There was also a fact about the company that outweighed anything about the stack: it had been making and selling awards for sixteen years before I added a buy button. The storefront's job was to fit an existing business, not to showcase what its developer could build. That framing settled most of the arguments I was having with myself."
		},
		{
			kind: 'list',
			items: [
				'**One person, part-time.** The whole build — hosting, theme, plugin stack, content, marketing wiring — had to fit around a degree.',
				'**Money paths need maturity.** Cart and checkout flows came battle-tested instead of hand-rolled.',
				'**The ecosystem was the feature.** Marketing integrations, analytics, and ad tracking all had beaten paths into WooCommerce.',
				'**The pattern was proven.** Two WordPress catalog sites were already live; the storefront extended a system the company already ran on, rather than introducing a new one.'
			]
		},
		{ kind: 'h2', text: 'Four months, in the order the timeline records' },
		{
			kind: 'p',
			text: 'The build ran in a straight line, roughly one phase a month. Discovery and setup meant hosting, a theme, and the [commerce plugin stack](https://developer.wordpress.org/plugins/hooks/). Design meant the storefront theme and the catalog browsing experience. Development meant the product catalog, the cart and checkout flows, and the marketing integrations. Then go-live — the storefront that ran until the modern rebuild.'
		},
		{
			kind: 'table',
			head: ['Month', 'Milestone'],
			rows: [
				['January 2023', 'Discovery and setup — hosting, theme, and the commerce plugin stack'],
				['February 2023', 'Design — storefront theme and catalog browsing UX'],
				['March 2023', 'Development — catalog, cart and checkout flows, marketing integrations'],
				['April 2023', 'Go-live — on-page SEO, analytics, and ad tracking wired in']
			]
		},
		{ kind: 'h2', text: 'The launch was mostly not the storefront' },
		{
			kind: 'p',
			text: "A manufacturer's storefront does not get traffic by existing — nobody types a trophy factory's URL from memory. Orders start as searches. So the go-live work that mattered most was the least visible: on-page SEO so the catalog could rank, analytics to see what visitors actually did, and ad tracking to buy the demand that organic rankings had not earned yet. The two catalog sites had already proven that playbook earlier in the year; the storefront pointed it at pages with a buy button."
		},
		{
			kind: 'code',
			lang: 'php',
			caption:
				'Illustrative — the shape of a WooCommerce child-theme hook. You operate the platform through hooks; you never fork it.',
			code: "// functions.php (child theme)\nadd_action( 'wp_enqueue_scripts', function () {\n\t// Keep cart-fragment polling off pages that have no cart UI\n\tif ( ! is_woocommerce() && ! is_cart() && ! is_checkout() ) {\n\t\twp_dequeue_script( 'wc-cart-fragments' );\n\t}\n}, 20 );"
		},
		{
			kind: 'p',
			text: 'That snippet is illustrative, but the principle it encodes was the real skill this launch taught: you do not rewrite a platform like WooCommerce, you operate it — child themes, hooks, and restraint. For someone who wanted to write everything from scratch, restraint was the harder half to learn.'
		},
		{ kind: 'h2', text: 'The case against my own choice' },
		{
			kind: 'p',
			text: "The tradeoffs were real. A plugin stack means someone else's release schedule touching your money path — every WordPress, WooCommerce, and theme update was a small gamble taken on a live store. Performance had a ceiling I could push against but never remove. Every feature was somebody else's opinion first and mine second. And the final verdict is in the project's own timeline: in 2026 I replaced the whole thing with a custom Bun monorepo and consolidated the legacy WordPress sibling sites into it, redirects and all. The critics of the 2022 decision eventually included me."
		},
		{
			kind: 'stat',
			value: '3 years',
			label: "the WooCommerce storefront's production run — April 2023 go-live to the 2026 rebuild that replaced it",
			source: 'rs-trophy.com project timeline'
		},
		{
			kind: 'p',
			text: 'But that number is also the defense. The storefront ran for three years, and it was the version of the business that earned the rebuild. The custom platform I wanted to build in 2022 did get built — in 2026, by which time there were orders to justify it and a developer who had spent those years learning what a storefront has to do before deciding how one should be written. Three go-lives in ten months — June 2022, November 2022, April 2023 — happened because I kept choosing boring.'
		}
	],
	lessons: [
		'Choose boring infrastructure when you are the only engineer and the thing you are building carries money. The interesting engineering can wait until the business can pay for it — mine waited until 2026, and was better for the wait.',
		'The storefront was the smaller half of the launch. Search, analytics, and ad tracking are what turn a website into an order channel, and I would wire them in at go-live every time.',
		"I underrated how long a 'temporary' platform lives. Anything that takes real orders is production, and production outlasts your plans for it — maintain it like it will run for years, because it will."
	],
	faqs: [
		{
			q: "Is WooCommerce a good choice for a small manufacturer's first online store?",
			a: 'It was for us in 2022, and the reasoning still holds: a solo or near-solo team gets a battle-tested cart, checkout, and plugin ecosystem without building any of it. Our WooCommerce storefront ran in production for three years before a custom rebuild replaced it. The costs are real — update risk on a live store and a performance ceiling — but they are operating costs, not blockers.'
		},
		{
			q: 'Should you build a custom e-commerce site or use WooCommerce first?',
			a: 'Use the platform first unless you have a team and a proven sales channel. A checkout is a liability surface — payments, stock, refunds — and a mature platform carries years of handled edge cases. Build custom later, once real order volume justifies it; our custom rebuild came three years after the WooCommerce launch, funded by the orders that store took.'
		},
		{
			q: 'How long does it take to launch a WooCommerce storefront solo?',
			a: 'Ours took four recorded months, built part-time: discovery and setup (hosting, theme, and the commerce plugin stack), design, development of the catalog, cart, and checkout with marketing integrations, then go-live. A full-time developer could compress the calendar, but the sequence itself — setup, design, build, launch — had no skippable steps.'
		},
		{
			q: 'What matters most when launching an e-commerce site for a manufacturer?',
			a: "Being findable. A manufacturer's customers start as searches, not as visitors who already know the brand's URL, so on-page SEO, analytics, and ad tracking belong in the launch itself, not in a phase two. The storefront features are table stakes; the demand wiring is what makes them earn anything."
		}
	],
	sources: [
		{
			title: 'WooCommerce — Template structure and overrides',
			url: 'https://developer.woocommerce.com/docs/theming/theme-development/template-structure'
		},
		{
			title: 'WordPress Plugin Handbook — Hooks',
			url: 'https://developer.wordpress.org/plugins/hooks/'
		}
	]
}
