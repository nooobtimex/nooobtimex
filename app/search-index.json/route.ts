import { buildSearchIndex } from '@/lib/search-index'

/**
 * The ⌘K palette's index, prerendered at build like the `card/` image routes — so it is
 * always derived from the data layer the same build shipped, with no generated file to
 * commit or keep in sync. Fetched by the palette on first open (`loadSearchIndex`).
 *
 * `noindex`: it is a data file for the palette, not a page, and nothing links to it.
 */
export const dynamic = 'force-static'

export function GET(): Response {
	return Response.json(buildSearchIndex(), { headers: { 'X-Robots-Tag': 'noindex' } })
}
