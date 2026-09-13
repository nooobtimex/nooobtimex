import type { SearchItem } from '@/components/search/types'

let pending: Promise<SearchItem[]> | undefined

/**
 * Fetches the prerendered `/search-index.json` — once per page load; every later call gets
 * the same promise, which is what lets the palette read it with `use()`.
 *
 * NavBar calls this on the user's intent to open (click or ⌘K), so the request races the
 * palette's own lazy chunk instead of waiting behind it: by the time the dialog renders, the
 * rows are usually already here.
 *
 * A failure resolves to an empty index rather than throwing — the palette still offers its
 * section links — and is cached like a success, so a re-render never retries in a loop.
 */
export function loadSearchIndex(): Promise<SearchItem[]> {
	pending ??= fetch('/search-index.json')
		.then(res => {
			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			return res.json() as Promise<SearchItem[]>
		})
		.catch((error: unknown) => {
			console.error('[search] index unavailable', error)
			return []
		})
	return pending
}
