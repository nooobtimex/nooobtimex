import React from 'react'
import Script from 'next/script'
import { ADSENSE_CLIENT_ID, ADSENSE_SCRIPT_SRC } from '@/lib/adsense'

/**
 * The AdSense loader, rendered only by a Journal post that actually has an in-article unit.
 * The `google-adsense-account` meta tag in the root layout only declares the account; it
 * never serves an ad on its own.
 *
 * `lazyOnload`, not `afterInteractive`: in the App Router `afterInteractive` still emits a
 * `<link rel=preload as=script>` in `<head>`, so a ~100 KB third-party script would compete
 * with the article for connections and main-thread time. The units sit mid-article, below
 * the fold, so waiting for the window load event costs nothing (prettier-config 5f8f8f6).
 *
 * Production only: under React Strict Mode's double-mount `adsbygoogle.js` throws
 * `TagError`s, and clicking your own ads — even on localhost — is invalid traffic.
 *
 * Once loaded, the script stays loaded across client-side navigation. That is harmless only
 * because Auto ads are OFF for this site in the AdSense dashboard; with them on, Google
 * would place ads on whatever page the reader navigates to next.
 */
const AdSenseScript: React.FC = () => {
	if (process.env.NODE_ENV !== 'production') return null

	return (
		<Script
			id='adsbygoogle-init'
			async
			strategy='lazyOnload'
			crossOrigin='anonymous'
			src={`${ADSENSE_SCRIPT_SRC}?client=${ADSENSE_CLIENT_ID}`}
		/>
	)
}

export default AdSenseScript
