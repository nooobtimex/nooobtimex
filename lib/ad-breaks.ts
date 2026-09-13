import { IN_ARTICLE_SLOTS } from '@/lib/adsense'
import type { PostBlock } from '@/common'

/**
 * Where in-article ads go inside a Journal post: strictly ascending indexes into `body`,
 * where an ad renders AFTER `body[i]` — at most `maxAds` of them.
 *
 * TODO(human): the placement rule. This placeholder returns no breaks, so no post carries an
 * ad until it is written. `blockWords(block)` from `@/common` gives a block's word count, the
 * same count reading time uses. Worth weighing:
 *   - never directly after an `h2`/`h3` — an ad between a heading and its first paragraph
 *     reads as part of the section;
 *   - never next to `code`, `table` or `image` — an ad beside a snippet is the likeliest
 *     accidental click, and accidental clicks are invalid traffic;
 *   - a minimum run of words before the first ad and between ads;
 *   - nothing in the last few blocks, where the article hands over to lessons and FAQs;
 *   - a single ad (or none) on a short post.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function adBreaksFor(body: readonly PostBlock[], maxAds: number): number[] {
	return []
}

/**
 * Pairs the placement rule's breaks with the configured slot IDs, keyed by block index for
 * `PostBody`. Unset (`null`) slots are skipped, so a post only ever gets as many ads as there
 * are real units.
 *
 * Throws on a break that is not a strictly ascending, in-range block index: a placement bug
 * should fail the build, not silently drop an ad or stack two in one gap.
 */
export function inArticleAds(body: readonly PostBlock[]): Readonly<Record<number, string>> {
	const slots = IN_ARTICLE_SLOTS.filter((s): s is string => s !== null)
	if (slots.length === 0) return {}

	const breaks = adBreaksFor(body, slots.length).slice(0, slots.length)
	const ads: Record<number, string> = {}
	breaks.forEach((index, n) => {
		const inRange = Number.isInteger(index) && index >= 0 && index < body.length
		if (!inRange || (n > 0 && index <= breaks[n - 1]))
			throw new Error(
				`[ad-breaks] ${JSON.stringify(breaks)} must be ascending indexes into a ${body.length}-block body`
			)
		ads[index] = slots[n]
	})
	return ads
}
