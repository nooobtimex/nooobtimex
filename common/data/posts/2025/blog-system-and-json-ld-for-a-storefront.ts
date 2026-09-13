import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (rsMedal timeline — 2025-05-30 remake, 2025-06-06 blog + JSON-LD, 2025-06-23 landing pages), experiences.ts (full-time bridge role), entities.ts (ruamsukPlating). */
export const blogSystemAndJsonLdForAStorefront: PostDef = {
	id: 'blog-system-and-json-ld-for-a-storefront',
	title: 'Adding a blog system and JSON-LD to a catalog storefront',
	happenedAt: '2025-06-06',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'bridge',
	category: 'seo-aeo',
	description:
		'A week after replacing a WordPress catalog with Next.js, I rebuilt the blog, sitemap and structured data the CMS had been giving away for free.',
	tldr: 'On 6 June 2025 I added a blog system, a sitemap and [[skill:json-ld]] structured data to [[project:rs-medal]], seven days after starting its ground-up Next.js remake. Moving off WordPress had quietly deleted all three. **The structured data was the cheapest piece to build and the one that mattered most** — it is a plain object serialised from the same content the page already renders. The blog existed mainly to give that object something true to describe.',
	skills: ['next-js', 'json-ld', 'seo', 'vercel'],
	relatedProjectIds: ['rs-medal'],
	relatedExperienceIds: ['ruamsuk-software-engineer-full-time'],
	relatedEntityIds: ['ruamsuk-plating'],
	sources: [
		{ title: 'schema.org — BlogPosting', url: 'https://schema.org/BlogPosting' },
		{
			title: 'Google Search Central — Article structured data',
			url: 'https://developers.google.com/search/docs/appearance/structured-data/article'
		},
		{ title: 'RS Medal', url: 'https://www.rs-medal.com' }
	],
	body: [
		{
			kind: 'p',
			text: "June 2025. Five days earlier I had converted from part-time to full-time at [[company:ruamsuk-plating]], my family's trophy factory, in the final month of my Computer Science degree — [[career:ruamsuk-software-engineer-full-time]], a short stint before I left for a telecom job that July. I spent part of it on [[project:rs-medal]], the medal catalog the company had been running on WordPress since November 2022."
		},
		{
			kind: 'p',
			text: 'On 30 May I had started a ground-up [[skill:next-js]] remake of it — a localized, statically-optimized showcase to replace the WordPress build. A week later, on 6 June, I shipped a blog system, structured data, a sitemap, and a batch of SEO fixes. That sequencing was not a plan. It was me discovering, one week in, how much the old CMS had been doing that I had never written down.'
		},
		{ kind: 'h2', text: 'What WordPress had been doing that I never counted' },
		{
			kind: 'p',
			text: 'The WordPress site went live in November 2022 with on-page SEO, analytics and ad tracking wired in. I built that. What I did not build, and therefore did not think about, was everything underneath it. A CMS ships a content type, an archive, a feed, a sitemap and a pile of meta tags before you have made a single decision. You inherit a search-legible site and mistake it for one you designed.'
		},
		{
			kind: 'p',
			text: "The Next.js remake started from a blank app. The catalog pages came back quickly, because those were the visible thing and I had the content. Everything invisible did not come back at all, and nothing failed to tell me so. A missing sitemap does not throw. Missing structured data does not throw. The site looked finished and was, from a crawler's point of view, several steps behind the thing it had replaced."
		},
		{
			kind: 'list',
			items: [
				'**A content type for articles** — with a slug, a date, an author and a canonical URL, all of it enforced.',
				'**An archive and a feed** — index pages, pagination, and an RSS output I had never once looked at.',
				'**A sitemap that updated itself** whenever content changed, without anyone remembering to regenerate it.',
				'**Metadata and structured data** emitted per page by a plugin, from fields an editor filled in.'
			]
		},
		{ kind: 'h2', text: 'The blog system, kept deliberately small' },
		{
			kind: 'p',
			text: 'A medal catalog does not need a publishing platform. It needs a place to answer the questions customers ask before they order — sizes, materials, engraving, lead times — in pages a search engine can index separately from the product grid. So I built the smallest thing that produced those pages: typed content objects in the repository, rendered by one route, with no editor, no database and no admin.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the shape of a repo-authored post. One object per article, typed, no CMS behind it.',
			code: 'type Article = {\n\tslug: string // the URL — never derived from the title\n\ttitle: string\n\tpublishedAt: string // YYYY-MM-DD, the real date\n\tdescription: string // the meta description AND the JSON-LD description\n\tbody: Block[]\n}'
		},
		{
			kind: 'p',
			text: 'The tradeoff is obvious and I took it knowingly: nobody but me can publish. For a company that had been making and plating awards since 2006, whose staff had a WordPress editor and now did not, that is a real regression in who is allowed to write. It was the right call for a site with a handful of articles and one developer, and it would be the wrong call for a site with a content team.'
		},
		{ kind: 'h2', text: 'JSON-LD is the part that pays' },
		{
			kind: 'p',
			text: "[Structured data](https://developers.google.com/search/docs/appearance/structured-data/article) was the cheapest thing I built that week and the one I would keep if I could only keep one. It is not a feature; it is the page's own data, serialised in a shape a machine reads without guessing. The catalog already knew what a product was. The blog already knew what an article was. Emitting that as `application/ld+json` is a `JSON.stringify` away."
		},
		{
			kind: 'code',
			lang: 'tsx',
			caption: 'Illustrative — the JSON-LD is built from the same object the page renders, so the two cannot drift.',
			code: "const ld = {\n\t'@context': 'https://schema.org',\n\t'@type': 'BlogPosting',\n\theadline: article.title,\n\tdescription: article.description,\n\tdatePublished: article.publishedAt,\n\tmainEntityOfPage: `https://www.rs-medal.com/blog/${article.slug}`\n}\n\nreturn <script type=\"application/ld+json\" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />"
		},
		{
			kind: 'p',
			text: 'The rule I settled on that day, and have not broken since, is that structured data is never authored separately from the page. The moment a `headline` is typed by hand next to a `<h1>` that says something else, you have two sources of truth and one of them is lying to a crawler. Derive it from the same object, or do not ship it.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'Structured data that disagrees with the page is worse than none',
			text: 'A missing `BlogPosting` block costs you an opportunity. A `BlogPosting` block whose date, title or URL contradicts the rendered page costs you trust, and it fails silently — the page looks correct to every human who opens it.'
		},
		{ kind: 'h2', text: 'The sitemap, and the fixes that came with it' },
		{
			kind: 'p',
			text: 'The sitemap was the last piece and the most embarrassing one, because WordPress had been generating it since 2022 and I had shipped a replacement site without it. In Next.js it is a route that maps over the same content arrays the pages read — the catalog entries and the articles — so a new page is in the sitemap the moment it exists. That is strictly better than the plugin it replaced, and it only became better because losing it forced me to write it.'
		},
		{
			kind: 'stat',
			value: '7 days',
			label: 'from the Next.js remake kickoff on 30 May 2025 to the blog, sitemap and JSON-LD on 6 June',
			source: 'rs-medal.com project timeline'
		},
		{
			kind: 'p',
			text: 'The case against doing any of this in week two is fair. The remake had no product landing pages yet — those came on 23 June, with a reusable product data model behind them — so I was building the machinery for indexing content before the content that actually sells anything existed. If a crawler had come early, it would have found a tidy sitemap pointing at a half-finished catalog. I would still order it this way, for one reason: the SEO work on the WordPress site had taken two and a half years to accumulate, and every day the new site ran without it was a day of that quietly draining away.'
		},
		{
			kind: 'p',
			text: 'What I actually learned is smaller than the post makes it sound. A rewrite does not only move features. It cancels every default the old platform was providing, and defaults are invisible precisely because nobody chose them. The blog and the JSON-LD were not new capabilities. They were me paying, explicitly, for things I had been getting on credit since 2022.'
		}
	],
	lessons: [
		'Before replacing a CMS, list what it does that I never wrote — sitemap, feeds, canonical URLs, structured data, meta defaults. That list is the real migration scope, and I discovered mine a week late.',
		'Derive structured data from the same object the page renders. Hand-authored JSON-LD drifts from the page it describes, and the drift is invisible to everyone except the crawler it misleads.',
		'I built the blog with no editor, which locked publishing to me. That was right for a handful of articles and one developer, and I should be honest that it was a capability the old WordPress site had and the new one did not.',
		'Losing a feature is sometimes how you get a better version of it. The self-updating sitemap I ended up with is stronger than the plugin output it replaced, and I would never have written it if the plugin had come along.'
	],
	faqs: [
		{
			q: 'What do you lose when you move a site from WordPress to Next.js?',
			a: "Mostly the invisible parts: the sitemap, the feed, the article content type, canonical URLs, and whatever structured data an SEO plugin was emitting. None of it fails loudly, so the new site can look complete while being less legible to crawlers than the one it replaced. Audit the old platform's defaults before the cutover, not a week after it like I did."
		},
		{
			q: 'Does a product catalog site actually need a blog?',
			a: 'It needs indexable pages that answer pre-purchase questions — sizes, materials, engraving, lead times — which a product grid cannot do on its own. A blog is the cheapest structure for that. It does not need a publishing platform behind it; typed content files in the repository were enough for our catalog.'
		},
		{
			q: 'How do you add JSON-LD structured data to a Next.js page?',
			a: 'Build a plain object with the schema.org fields, then render it inside a `script` tag with `type="application/ld+json"`. The important part is where the values come from: derive every field from the same content object the page renders, so the structured data cannot drift from the visible page.'
		},
		{
			q: 'Is a hand-built blog better than a CMS for a small business site?',
			a: 'Only when the developer is also the only author. Repo-authored content gives you type safety, version control and no admin surface to maintain, but it removes the ability for anyone non-technical to publish. That is a genuine capability loss and worth stating out loud before you make the trade.'
		},
		{
			q: 'Should structured data or the sitemap come first in a rebuild?',
			a: 'The sitemap, if you have to choose — it tells a crawler what exists, and it is a single route that maps over the content you already have. Structured data then makes each of those pages easier to interpret. I shipped both on the same day and would not split them again.'
		}
	]
}
