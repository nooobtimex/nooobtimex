import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (rs-trophy, rs-medal, rs-award timelines + consolidation event), common/data/experiences.ts (ruamsuk-software-engineer-part-time), common/data/entities.ts (ruamsuk-plating). */
export const onpageSeoForAThaiB2bCatalog: PostDef = {
	id: 'onpage-seo-for-a-thai-b2b-catalog',
	title: 'On-page SEO for a bilingual Thai B2B catalog',
	happenedAt: '2023-04-01',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'student',
	category: 'seo-aeo',
	description:
		'On-page SEO for a Thai trophy catalog: category pages as the landing pages, bilingual Thai-English titles, and measuring a funnel that ends on the phone.',
	tldr: 'I launched rs-trophy.com in April 2023 on [[skill:wordpress]] + [[skill:woocommerce]], and the on-page work that mattered was the **category pages** — hand-written titles, metas, and intro copy carrying both Thai and English product terms, because Thai buyers query in both scripts, often inside the same search. Analytics and ad tracking went live the same day, but most orders still closed on the phone, so I treated rankings and inquiries as the honest metrics and accepted the attribution gap.',
	skills: ['wordpress', 'woocommerce', 'seo', 'google-analytics', 'google-ads'],
	relatedProjectIds: ['rs-trophy', 'rs-medal', 'rs-award'],
	relatedExperienceIds: ['ruamsuk-software-engineer-part-time'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: 'On 1 April 2023 I put rs-trophy.com live — a [[skill:woocommerce]] storefront for [[company:ruamsuk-plating]], my family’s trophy factory in Pathum Thani. My father runs it as CEO, my mother as CFO, and the factory had been casting, engraving, and plating awards since 2006 — seventeen years before I touched its website. I was a Computer Science student at [[career:thammasat-bs-cs]], doing the web side part-time. This was the third storefront I had shipped for the family: RS Award in March 2022, RS Medal that August, and now the main brand.'
		},
		{
			kind: 'p',
			text: 'The build ran one phase per month — discovery in January, theme design in February, catalog, cart, and checkout in March. But the go-live milestone was never really the code. It was the on-page [[skill:seo]], the analytics, and the ad tracking that shipped with it. This post is about that part: making a Thai B2B catalog legible to a search engine when the buyers query in two languages at once.'
		},
		{
			kind: 'stat',
			value: '3 months',
			label: 'from discovery to go-live for rs-trophy.com — January to April 2023, one phase per month',
			source: 'rs-trophy project timeline'
		},
		{ kind: 'h2', text: 'A B2B catalog ranks on its category pages' },
		{
			kind: 'p',
			text: 'Trophy buying is B2B in shape even when the checkout looks retail. The buyer is a company ordering year-end awards, a school ordering sports-day medals, an event organizer ordering by the hundred — and nobody searches for one specific SKU out of a factory catalog. They search the category: trophy cups, award plaques, medals. So the category archive, not the product page, is the landing page, and that is where the on-page budget went.'
		},
		{
			kind: 'p',
			text: 'Stock WooCommerce fights this. A category archive out of the box is a grid of thumbnails with [a templated title](https://developers.google.com/search/docs/appearance/title-link) and no crawlable copy at all. Each category on rs-trophy.com got a hand-written title, its own meta description, one clean H1, and a real paragraph of Thai intro text above the grid — what the products are, that the factory makes them in house, that engraving is custom. Product pages inherited a template; the categories were written like landing pages, because that is what they were.'
		},
		{
			kind: 'code',
			lang: 'html',
			caption:
				'Illustrative — the category title/meta pattern I used: the Thai head term carries the query, the English term rides along for mixed-script searches.',
			code: "<title>ถ้วยรางวัล (Trophy) สั่งทำจากโรงงาน | RS TROPHY</title>\n<meta\n\tname='description'\n\tcontent='ถ้วยรางวัลสั่งทำจากโรงงานผลิตโดยตรง — custom trophy cups,\n\tengraving included, ships nationwide.'\n/>"
		},
		{
			kind: 'p',
			text: 'The catalog itself was the other half of on-page. A trophy storefront is image-heavy by nature — the factory’s products are physical objects people choose by eye — which means a large share of the crawlable surface is image markup. Every catalog photo got a descriptive Thai file name and alt text naming the product type, instead of the camera’s serial-number defaults. Image search is a real discovery channel for physical products, and alt text was the one place the work scaled: written once per product, inherited everywhere the image appeared.'
		},
		{ kind: 'h2', text: 'The catalog was Thai-first. The queries were not.' },
		{
			kind: 'p',
			text: 'The word **bilingual** in this post’s title describes the queries more than the site. Thai commercial search runs on loanwords: the same buyer types ถ้วยรางวัล (Thai for trophy cup) one day and “trophy” the next, and mixed-script queries — a Thai modifier attached to an English noun — are completely normal. A category page that carries only Thai text silently forfeits the English-typed half of its own demand, and an English-only page forfeits the larger Thai half. So every category title and meta carried both terms, Thai first.'
		},
		{
			kind: 'table',
			head: ['Category', 'Thai head term', 'English term it had to share the page with'],
			rows: [
				['Trophies', 'ถ้วยรางวัล', 'trophy'],
				['Plaques and shields', 'โล่รางวัล', 'award plaque'],
				['Medals', 'เหรียญรางวัล', 'medal']
			]
		},
		{
			kind: 'p',
			text: 'The other bilingual decision was slugs. Thai-script URLs are valid and Google indexes them fine — but they percent-encode into unreadable strings the moment someone pastes one into an email or a LINE chat, and in this business URLs get pasted into quote threads and purchase orders constantly. I went with romanized English slugs and Thai on-page headings: the URL for sharing, the H1 for the query.'
		},
		{ kind: 'h2', text: 'Measuring a funnel that ends on the phone' },
		{
			kind: 'p',
			text: '[[skill:google-analytics]] and conversion tracking for [[skill:google-ads]] went live with the storefront on launch day. The ads earned their keep twice: once as traffic, and once as research. The search-terms report shows the literal queries real buyers typed before clicking, which made it the cheapest bilingual keyword research available — the Thai-English mix I had guessed at in the titles was sitting right there in the data, and the winners got fed back into the category copy.'
		},
		{
			kind: 'code',
			lang: 'text',
			caption:
				'Illustrative — the shape of a search-terms report for this catalog: Thai, English, and mixed-script queries in the same column.',
			code: 'ถ้วยรางวัล ราคา          (trophy cups, price)\nโล่รางวัล สั่งทำ          (custom award plaques)\ntrophy สั่งทำ             (custom + English noun)\nเหรียญรางวัล งานวิ่ง       (medals, running event)\ncustom medal thailand'
		},
		{
			kind: 'p',
			text: 'Here is the honest part. I could not prove the on-page work moved a single order. Custom awards are quote-driven: the site got the buyer to shortlist, and the deal closed on the phone or in LINE, where no analytics property can see it. The dashboards showed visits and inquiries, never revenue. And for a catalog this size, it is a fair question whether ads alone would have been enough — paid clicks would have covered the same categories with far fewer of my evenings. I kept the on-page work anyway, for one reason: rankings compound and stay up when the budget stops, and my part-time hours were the one resource the company could spend freely. But I want to be plain that this was a judgment call, not a measured result.'
		},
		{ kind: 'h2', text: 'What survived' },
		{
			kind: 'p',
			text: 'That WordPress storefront ran for three years, until the platform was rebuilt from scratch in 2026 and the sibling sites were consolidated into one system. Two details of that migration are the real verdict on the 2023 launch: the legacy category-page redirects were preserved rather than dropped, and the new [[project:rs-trophy]] storefront shipped localized and SEO-optimized from its first commit. The theme, the plugins, and the platform were all replaceable. The category URLs and the bilingual query map were the assets worth carrying across.'
		}
	],
	lessons: [
		'The category page is the product page in B2B. Buyers shortlisted from category archives and bought over the phone — if I did it again I would treat the site as a quote engine first and a cart second.',
		'Write for the query, not the language. Thai buyers search in Thai, in English, and in both at once; putting both terms in every category title cost nothing and covered all three behaviors.',
		'URLs outlived everything else I shipped. Three years later the rebuild replaced the theme, the plugins, and WordPress itself — but the category slugs had earned redirects. I would name them even more carefully on day one.',
		'I stopped pretending I could attribute phone orders to rankings. Tracking what I could see — rankings, visits, inquiries — and naming the gap out loud was more useful than a dashboard that claimed to know.'
	],
	faqs: [
		{
			q: 'Should a Thai e-commerce site do SEO in Thai or English?',
			a: 'Both, on the same pages. Thai buyers routinely use English loanwords for product nouns — the same person searches ถ้วยรางวัล (trophy cup) and “trophy” interchangeably, and mixed-script queries are normal. Leading with the Thai term and carrying the English one in the title and meta covers Thai-only, English-only, and mixed queries without splitting the site into two thin language versions.'
		},
		{
			q: 'How do you optimize WooCommerce category pages for SEO?',
			a: 'Treat each category archive as a landing page. Stock WooCommerce renders a bare product grid with a templated title, so add a hand-written title tag, a unique meta description, one clear H1, and a real paragraph of crawlable intro copy above the grid describing the category. For a B2B catalog where buyers search categories rather than individual SKUs, this is where most on-page effort should go — product pages can inherit a template.'
		},
		{
			q: 'Do Thai-language URLs hurt SEO?',
			a: 'Not in rankings — Google indexes Thai-script URLs fine. The cost is practical: non-ASCII URLs percent-encode into long unreadable strings when copied into emails, chat apps, or documents. For a B2B business where links get pasted into quotes and purchase orders, romanized slugs with Thai on-page headings keep the URL shareable and the H1 matched to the query.'
		},
		{
			q: 'How do you measure SEO when customers order by phone or LINE?',
			a: 'Accept that web analytics only sees the top of the funnel and measure what it can honestly show: rankings, organic visits to the money pages, and inquiry actions like clicks on the phone number or chat link. The order itself closes off-platform, so revenue attribution to a ranking is a guess. Naming that gap is better than trusting a dashboard number that structurally cannot include most of the sales.'
		}
	],
	sources: [
		{
			title: 'Google Search Central — Localized versions of your pages (hreflang)',
			url: 'https://developers.google.com/search/docs/specialty/international/localized-versions'
		},
		{
			title: 'Google Search Central — Influencing your title links',
			url: 'https://developers.google.com/search/docs/appearance/title-link'
		},
		{
			title: 'Google Search Central — Consolidate duplicate URLs with canonicals',
			url: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls'
		}
	]
}
