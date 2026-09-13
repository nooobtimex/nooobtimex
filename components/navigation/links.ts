import type { Route } from 'next'

/**
 * The single source of truth for site navigation.
 *
 * This table used to exist as four hand-maintained copies (NavBar, NavFooter,
 * GlobalSearch, and implicitly the sitemap). Adding a route meant remembering all of
 * them. Consumers now filter this list by flag instead.
 *
 * `app/sitemap.ts` stays separate on purpose — it needs `priority`/`changeFrequency`,
 * which are a different concern.
 */
export interface NavLink {
	label: string
	href: Route
	/** HUD index shown in the desktop nav, e.g. '03'. */
	code: string
	/** Iconify name — used by the mobile tab bar and the ⌘K palette. */
	icon: string
	/** Appears in the footer's Navigate column (Home is the logo, so it is excluded). */
	inFooter: boolean
	/** One of the four mobile bottom-bar tabs. */
	isMobileTab: boolean
}

export const NAV_LINKS: readonly NavLink[] = [
	{ label: 'Home', href: '/', code: '00', icon: 'mdi:home-variant-outline', inFooter: false, isMobileTab: true },
	{
		label: 'Career',
		href: '/career',
		code: '01',
		icon: 'mdi:timeline-text-outline',
		inFooter: true,
		isMobileTab: false
	},
	{
		label: 'Projects',
		href: '/projects',
		code: '02',
		icon: 'mdi:folder-multiple-outline',
		inFooter: true,
		isMobileTab: true
	},
	{ label: 'Skills', href: '/skills', code: '03', icon: 'mdi:chip', inFooter: true, isMobileTab: true },
	{ label: 'Companies', href: '/companies', code: '04', icon: 'mdi:domain', inFooter: true, isMobileTab: false },
	{ label: 'GitHub', href: '/github', code: '05', icon: 'simple-icons:github', inFooter: true, isMobileTab: false },
	{ label: 'CV', href: '/cv', code: '06', icon: 'mdi:file-account-outline', inFooter: true, isMobileTab: false },
	{
		label: 'Contact',
		href: '/contact',
		code: '07',
		icon: 'mdi:card-account-mail-outline',
		inFooter: true,
		isMobileTab: true
	},
	{
		label: 'Journal',
		href: '/blog',
		code: '08',
		icon: 'mdi:post-outline',
		inFooter: true,
		isMobileTab: false
	}
]

export const MOBILE_TABS = NAV_LINKS.filter(l => l.isMobileTab)
export const FOOTER_LINKS = NAV_LINKS.filter(l => l.inFooter)

/**
 * Legal pages — the footer's bottom row only. Kept out of `NAV_LINKS` on purpose: NavBar and
 * the ⌘K palette render that table whole, and a privacy policy is not a site section.
 */
export const LEGAL_LINKS: readonly { label: string; href: Route }[] = [{ label: 'Privacy', href: '/privacy' }]

/**
 * Home matches exactly; every other route matches its detail pages too, so
 * `/projects/looklook-pet` keeps the Projects tab lit.
 */
export const isActive = (pathname: string, href: string) =>
	href === '/' ? pathname === '/' : pathname.startsWith(href)
