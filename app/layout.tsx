import React from 'react'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Noto_Sans_Thai, Rajdhani } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import ScanlineOverlay from '@/components/cyber/ScanlineOverlay'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ADSENSE_CLIENT_ID } from '@/lib/adsense'
import { cn } from '@/lib/utils'
import { assets } from '@/common'
import './globals.css'

const rajdhani = Rajdhani({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-rajdhani'
})

const jetbrains = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	variable: '--font-jetbrains'
})

const notoThai = Noto_Sans_Thai({
	subsets: ['thai', 'latin'],
	weight: ['300', '400', '500', '700'],
	variable: '--font-noto-thai'
})

/**
 * `viewportFit: 'cover'` is load-bearing, not cosmetic: without it the meta viewport has
 * no `viewport-fit=cover` and every `env(safe-area-inset-*)` resolves to 0px — which would
 * silently drop MobileTabBar's labels under the iOS home indicator.
 */
export const viewport: Viewport = {
	viewportFit: 'cover',
	themeColor: '#FCEE0A'
}

export const metadata: Metadata = {
	metadataBase: new URL('https://nooobtimex.me'),
	title: {
		default: 'Portfolio | Wongsaphat Puangsorn',
		template: '%s | Wongsaphat Puangsorn'
	},
	authors: [{ name: 'Wongsaphat Puangsorn', url: 'https://nooobtimex.me' }],
	creator: 'Wongsaphat Puangsorn',
	publisher: 'Wongsaphat Puangsorn',
	description:
		'Portfolio | Wongsaphat Puangsorn - Specializing in modern web development, I turn ideas into seamless digital affiliations by building robust web applications using the latest skills.',
	keywords: [
		'Wongsaphat Puangsorn',
		'NooobtimeX',
		'Thammasat University',
		'Software Developer',
		'Thailand',
		'Portfolio',
		'Resume',
		'Frontend',
		'Fullstack',
		'Web Developer'
	],
	/**
	 * NOTE: no `alternates.canonical` here on purpose. `alternates` is inherited by
	 * every child segment, so a value at this level made all 90 routes declare
	 * themselves duplicates of the home page. Canonicals are set per route via
	 * `pageMetadata()` in lib/seo.ts.
	 */
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://nooobtimex.me',
		title: 'Wongsaphat Puangsorn - Portfolio',
		description:
			'Specializing in modern web development, I turn ideas into seamless digital affiliations by building robust web applications.',
		siteName: 'Wongsaphat Puangsorn Portfolio'
		// Social card is generated dynamically by app/opengraph-image.tsx (1200×630).
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Wongsaphat Puangsorn - Portfolio',
		description:
			'Specializing in modern web development, I turn ideas into seamless digital affiliations by building robust web applications.',
		creator: '@NooobtimeX' // Assuming this handle based on github, can be updated
		// Twitter falls back to the dynamic app/opengraph-image.tsx card.
	},
	icons: {
		icon: assets.site.logo,
		apple: assets.site.logo
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			'index': true,
			'follow': true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1
		}
	},
	verification: {
		google: 'KiAn5R5UAuZgmwSS_KpMOO2FIRmt-39QIKrHKXrAOL8',
		// Declares the AdSense account for the whole domain — the tag AdSense verifies the site
		// by and reads during review. It serves nothing on its own: ads load only on Journal
		// posts (components/ads/AdSenseScript.tsx). Pairs with public/ads.txt.
		other: {
			'google-adsense-account': ADSENSE_CLIENT_ID
		}
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className={cn('dark', rajdhani.variable, jetbrains.variable, notoThai.variable)}
			suppressHydrationWarning>
			<GoogleTagManager gtmId='GTM-5PVXPTWP' />
			<body className='bg-background text-foreground font-sans antialiased'>
				{/*
				 * Every `<Icon>` is client-side `@iconify/react`, which fetches its SVG from
				 * api.iconify.design after mount — the prerendered HTML contains zero inline
				 * `<svg>`. Preloading the data via `addIcon` does NOT fix that: Icon renders
				 * `<span></span>` under renderToString even when the icon is registered, so
				 * SSR'd icons need a different component, not a bigger bundle. Until then this
				 * origin is a hard runtime dependency, so pay DNS + TLS up front.
				 *
				 * Must stay inside <body>: React hoists it to <head>, whereas a <link> placed
				 * directly under <html> is invalid markup the browser relocates.
				 */}
				<link rel='preconnect' href='https://api.iconify.design' crossOrigin='anonymous' />
				<link rel='dns-prefetch' href='https://api.iconify.design' />
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					forcedTheme='dark'
					enableSystem={false}
					disableTransitionOnChange>
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
				{/* Global cyberpunk scanline + vignette overlay */}
				<ScanlineOverlay />
			</body>
		</html>
	)
}
