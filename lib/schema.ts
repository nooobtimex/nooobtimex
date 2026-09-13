import { DISPLAY_NAME, SITE_URL } from '@/lib/seo'
import { personalData } from '@/common'

/**
 * Structured-data builders.
 *
 * Kept apart from `lib/seo.ts` (which builds Next `Metadata`) because these emit
 * schema.org graphs rendered into the body via `<JsonLd>`, not `<head>` tags.
 *
 * Names use `DISPLAY_NAME`, never `personalData.name` — the latter is stored ALL CAPS
 * for the HUD headings, and that string is what would surface in a Google knowledge
 * panel or an AI answer if it were used here.
 */

/** Stable node id so separate JSON-LD blocks refer to one Person, not several. */
export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

/** Minimal Person reference — use where a full Person node is already declared elsewhere. */
export const personRef = () => ({ '@id': PERSON_ID })

/**
 * The site itself. `WebSite` is what lets an answer engine name the source, and it is
 * the node `ProfilePage`/`BreadcrumbList` hang off.
 */
export const websiteSchema = () => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	'url': SITE_URL,
	'name': `${DISPLAY_NAME} — Portfolio`,
	'inLanguage': 'en',
	'description': personalData.tagline,
	'publisher': personRef(),
	'about': personRef()
})

interface Crumb {
	name: string
	/** Route-absolute path, no trailing slash. Omit on the final crumb. */
	path?: string
}

/**
 * BreadcrumbList for a detail route.
 *
 * The last crumb intentionally carries no `item`: schema.org treats a trailing
 * self-referential URL as redundant, and Google drops it from the rendered trail.
 */
export const breadcrumbSchema = (trail: Crumb[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	'itemListElement': trail.map((crumb, i) => ({
		'@type': 'ListItem',
		'position': i + 1,
		'name': crumb.name,
		// Same `/` → '' normalisation as `pageMetadata()`, so a breadcrumb item and that
		// page's canonical are byte-identical rather than differing by a trailing slash.
		...(crumb.path && i < trail.length - 1 && { item: `${SITE_URL}${crumb.path === '/' ? '' : crumb.path}` })
	}))
})

/** The blog index node — `/blog` is `@id`-stable so posts can point back at it. */
export const BLOG_ID = `${SITE_URL}/blog#blog`

export const blogSchema = (posts: { id: string; title: string }[]) => ({
	'@context': 'https://schema.org',
	'@type': 'Blog',
	'@id': BLOG_ID,
	'url': `${SITE_URL}/blog`,
	'name': `${DISPLAY_NAME} — Engineering Journal`,
	'inLanguage': 'en',
	'author': personRef(),
	'publisher': personRef(),
	'isPartOf': { '@id': WEBSITE_ID },
	'blogPost': posts.map(p => ({ '@type': 'BlogPosting', '@id': `${SITE_URL}/blog/${p.id}#article` }))
})

interface BlogPostingInput {
	id: string
	title: string
	description: string
	/** When the post went live — the byline date. */
	publishedAt: string
	updatedAt?: string
	/** When the events it describes happened — carried as `temporalCoverage`, never as a byline date. */
	happenedAt: string
	section: string
	keywords: string[]
	wordCount: number
	image?: string
	sources?: { title: string; url: string }[]
}

/**
 * One post. `author`/`publisher` resolve to the SAME `#person` node the home page
 * declares, so the whole archive reads as one entity's body of work — the reason
 * `PERSON_ID` exists (see the header of this file).
 *
 * `citation` carries the post's outbound sources. Without it the reference list is a
 * visual footer only: a human sees the post is grounded in the Next.js docs and a bug
 * report, and a machine reading the structured data sees an unsourced opinion. Reachability
 * of these URLs is enforced separately by `bun run links:external`.
 *
 * `datePublished` is the day the post went live. A post about 2021 written in 2026 is
 * published in 2026; the year it is ABOUT goes in `temporalCoverage` — schema.org's "the
 * period that the content applies to" — which is exactly what Google's byline-date
 * guidance asks for instead of backdating the page.
 */
export const blogPostingSchema = (post: BlogPostingInput) => ({
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	'@id': `${SITE_URL}/blog/${post.id}#article`,
	'headline': post.title,
	'description': post.description,
	'url': `${SITE_URL}/blog/${post.id}`,
	'datePublished': post.publishedAt,
	'dateModified': post.updatedAt ?? post.publishedAt,
	'temporalCoverage': post.happenedAt,
	'inLanguage': 'en',
	'author': personRef(),
	'publisher': personRef(),
	'isPartOf': { '@id': BLOG_ID },
	'mainEntityOfPage': `${SITE_URL}/blog/${post.id}`,
	'articleSection': post.section,
	'keywords': post.keywords.join(', '),
	'wordCount': post.wordCount,
	...(post.image && { image: `${SITE_URL}${post.image}` }),
	...(post.sources?.length && {
		citation: post.sources.map(s => ({ '@type': 'CreativeWork', 'name': s.title, 'url': s.url }))
	})
})

/**
 * FAQPage for a post's rendered FAQ section. Emitted ONLY alongside the visible
 * `PostFaq` component — schema for content the page does not show reads as spam.
 */
export const faqSchema = (faqs: { q: string; a: string }[]) => ({
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	'mainEntity': faqs.map(f => ({
		'@type': 'Question',
		'name': f.q,
		'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
	}))
})
