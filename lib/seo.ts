import type { Metadata } from 'next'
import { personalData } from '@/common'

export const SITE_URL = 'https://nooobtimex.me'

/**
 * Title-case display name. `personalData.name` is stored ALL CAPS because the cyber HUD
 * headings render it that way — but an all-caps `<title>` reads as shouting in a SERP and
 * Google frequently rewrites it, so titles use the structured given/family names instead.
 */
export const DISPLAY_NAME =
	[personalData.contact.givenName, personalData.contact.familyName].filter(Boolean).join(' ') || personalData.name

/**
 * Google renders roughly 155–160 characters of a description and drops the rest, so an
 * untrimmed one wastes the snippet rather than enriching it. Live examples before this
 * clamp: `/career/ruamsuk-cto` shipped 1032 characters and `/projects/rs-trophy` 646.
 *
 * Cuts on a word boundary and appends an ellipsis, so the snippet ends as a phrase
 * instead of mid-word.
 */
const MAX_DESCRIPTION = 155

export function clampDescription(text: string): string {
	const flat = text.replace(/\s+/g, ' ').trim()
	if (flat.length <= MAX_DESCRIPTION) return flat
	const cut = flat.slice(0, MAX_DESCRIPTION)
	return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]$/, '')}…`
}

interface PageMetaInput {
	/** Route-absolute path, no trailing slash. `/` for home. */
	path: string
	/** Bare title — the root layout's `%s | Wongsaphat Puangsorn` template appends the name. */
	title: string
	description: string
	/** Set when the title must not receive the template suffix (the home page). */
	absoluteTitle?: string
	/**
	 * Route-absolute path to a 1200×630 card, for routes the file convention cannot
	 * reach. `app/(main)/projects/[...id]/` is a catch-all, and Next forbids nesting an
	 * `opengraph-image.tsx` beneath one — so that route generates its card at
	 * `/card/og/projects/<id>` and names it here. Everywhere else, omit this and let
	 * the nearest `opengraph-image.tsx` resolve.
	 */
	ogImage?: string
	/**
	 * Present on blog posts only. Switches `openGraph.type` to `'article'` and carries
	 * the byline fields. `publishedTime` is the date the URL went public, which for a
	 * backfilled post is its real milestone date — never a future date.
	 */
	article?: { publishedTime: string; modifiedTime?: string; section: string; tags?: string[] }
	/**
	 * `false` emits `noindex, follow`: the page stays reachable and passes link equity, but
	 * stops competing in the index — a thin skill page, the `/github` dashboard. Coverage
	 * decisions come from `common/data/coverage.ts`, which `app/sitemap.ts` reads too.
	 *
	 * A route-level `robots` REPLACES the root layout's rather than merging with it, which is
	 * why indexable pages omit the key entirely and keep inheriting the root directives.
	 */
	index?: boolean
}

/**
 * Single source of truth for per-page metadata.
 *
 * Exists because Next *inherits* `alternates` and `openGraph` from the nearest
 * ancestor that declares them: the root layout's `canonical: '/'` silently made
 * all 90 routes declare themselves duplicates of the home page. Every route must
 * therefore declare its own canonical — this helper makes that the cheap path.
 *
 * `openGraph.images` is deliberately omitted: the file-convention
 * `app/opengraph-image.tsx` is resolved separately and still applies.
 */
export function pageMetadata({
	path,
	title,
	description,
	absoluteTitle,
	ogImage,
	article,
	index = true
}: PageMetaInput): Metadata {
	const url = `${SITE_URL}${path === '/' ? '' : path}`
	const socialTitle = absoluteTitle ?? `${title} | ${DISPLAY_NAME}`

	/*
	 * Google renders roughly 60 characters of a title. When the page's own title is
	 * already long the ` | Wongsaphat Puangsorn` suffix is the first thing worth losing —
	 * it is the least distinguishing part, and it repeats on every page anyway.
	 * `/career/ruamsuk-cto` was 85 characters because the organisation is stored under its
	 * full legal name; dropping the suffix there recovers 24 of them.
	 */
	const suffixed = `${title} | ${DISPLAY_NAME}`
	const resolvedTitle = absoluteTitle ?? (suffixed.length > 60 ? title : undefined)

	const clamped = clampDescription(description)

	return {
		title: resolvedTitle ? { absolute: resolvedTitle } : title,
		description: clamped,
		alternates: { canonical: path },
		...(!index && { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }),
		openGraph: {
			locale: 'en_US',
			siteName: `${DISPLAY_NAME} Portfolio`,
			url,
			title: socialTitle,
			description: clamped,
			...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: socialTitle }] }),
			// Discriminated last so TS narrows the union: article pages carry the byline
			// fields, everything else stays a plain website node.
			...(article ?
				{
					type: 'article' as const,
					publishedTime: article.publishedTime,
					...(article.modifiedTime && { modifiedTime: article.modifiedTime }),
					authors: [DISPLAY_NAME],
					section: article.section,
					...(article.tags && { tags: article.tags })
				}
			:	{ type: 'website' as const })
		},
		// No `creator` here on purpose: `personalData.socialLinks` lists no X/Twitter
		// account, so the handle in the root layout is an unverified guess. Asserting a
		// handle you may not own attributes the card to whoever does.
		twitter: {
			card: 'summary_large_image',
			title: socialTitle,
			description: clamped,
			...(ogImage && { images: [ogImage] })
		}
	}
}
