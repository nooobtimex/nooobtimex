/**
 * Centralized asset map — the single place to edit any static image path.
 * Referenced by the data layer and app metadata. All images are WebP; icons
 * and the social card are served from the brand logo via Next.js metadata.
 */
export const assets = {
	site: {
		logo: '/logo/logo.webp'
	},
	personal: {
		avatar: '/logo/logo.webp'
	},
	logos: {
		rsTrophy: '/logo/RSTROPHY.webp',
		jasmineTech: '/logo/JTS.webp',
		tuLogo: '/logo/tu-logo.webp'
	},
	projects: {
		whenWe: { cover: '/issue/whenwe/cover.webp' },
		rsTrophy: { cover: '/issue/rs-trophy/cover.webp', gallery: ['/issue/rs-trophy/photo-1.webp'] },
		looklookPet: {
			cover: '/issue/looklook-pet/cover.webp',
			gallery: [
				'/issue/looklook-pet/photo-1.webp',
				'/issue/looklook-pet/photo-2.webp',
				'/issue/looklook-pet/photo-3.webp',
				'/issue/looklook-pet/photo-4.webp',
				'/issue/looklook-pet/photo-5.webp',
				'/issue/looklook-pet/photo-6.webp',
				'/issue/looklook-pet/photo-7.webp',
				'/issue/looklook-pet/photo-8.webp',
				'/issue/looklook-pet/photo-9.webp'
			]
		},
		onlinePokerGame: {
			cover: '/issue/online-poker-game/cover.webp',
			gallery: [
				'/issue/online-poker-game/photo-1.webp',
				'/issue/online-poker-game/photo-2.webp',
				'/issue/online-poker-game/photo-3.webp'
			]
		},
		prettierConfig: { cover: '/issue/prettier-config/cover.webp', gallery: ['/issue/prettier-config/photo-1.webp'] },
		floodProject: { cover: '/issue/flood-project/cover.webp' },
		rsMedal: { cover: '/issue/rs-medal/cover.webp', gallery: ['/issue/rs-medal/photo-1.webp'] },
		rsAward: { cover: '/issue/rs-award/cover.webp', gallery: ['/issue/rs-award/photo-1.webp'] },
		portfolio: { cover: '/issue/portfolio/cover.webp' },
		monomaxEplPortal: {
			cover: '/issue/monomax-epl-portal/cover.webp',
			gallery: ['/issue/monomax-epl-portal/photo-1.webp']
		},
		qrFood: { cover: '/issue/qr-food/cover.webp', gallery: ['/issue/qr-food/photo-1.webp'] }
	}
} as const
