import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/seo'
import { assets, personalData } from '@/common'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		short_name: 'NooobtimeX',
		description: personalData.tagline,
		start_url: '/',
		display: 'standalone',
		background_color: '#0a0a0a',
		theme_color: '#FCEE0A',
		icons: [
			{
				// Must match the real file. `logo.webp` is a true 640×640 square, sized by
				// `bun run images:optimize` for the home avatar at DPR 2 — Chrome's install
				// prompt needs a declared icon of at least 512, so do not go below that.
				src: assets.site.logo,
				sizes: '640x640',
				type: 'image/webp',
				purpose: 'any'
			}
		]
	}
}
