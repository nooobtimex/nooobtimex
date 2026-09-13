/**
 * Google AdSense wiring — constants only, so client components can import it.
 *
 * The publisher ID is public (it ships in every ad request), so it is a committed constant
 * rather than an env var: a `NEXT_PUBLIC_*` value is inlined at build time, which on
 * Railway would mean a Docker build arg, and this repo keeps build args out of the image.
 *
 * Two spellings of one ID must agree:
 *   - `ADSENSE_CLIENT_ID` (`ca-pub-…`) → the `google-adsense-account` meta tag in
 *     `app/layout.tsx`, the loader's `?client=`, and every unit's `data-ad-client`.
 *   - `public/ads.txt` → the bare `pub-…` form, no `ca-` prefix.
 */
export const ADSENSE_CLIENT_ID = 'ca-pub-6034794215506479'

export const ADSENSE_SCRIPT_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

/**
 * In-article unit slot IDs, in the order they fill a Journal post — AdSense → Ads → By ad
 * unit → In-article, the number in the generated `data-ad-slot`.
 *
 * `null` means the unit does not exist yet. A post renders no slot, and loads no ad script,
 * until at least one ID is set, so this ships safely before the units are created. The
 * number of non-null entries caps how many ads one post can carry.
 */
export const IN_ARTICLE_SLOTS: readonly (string | null)[] = [null, null]
