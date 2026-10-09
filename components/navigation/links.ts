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
	/** Iconify name — used by the mobile tab bar, its Menu sheet and the ⌘K palette. */
	icon: string
	/**
	 * Other path prefixes this section owns, so its link stays lit there too —
	 * `/companies/*` belongs to Career since the companies index merged into it.
	 */
	matches?: readonly string[]
	/** Shown in the desktop header (lg and up). Kept to five so Search + Hire always fit. */
	inHeader: boolean
	/** One of the four link tabs in the mobile bottom bar (the fifth cell is Menu). */
	isMobileTab: boolean
	/** Appears in the footer's Navigate column (Home is the logo, so it is excluded). */
	inFooter: boolean
}

export const NAV_LINKS: readonly NavLink[] = [
	{ label: 'Home', href: '/', icon: 'mdi:home-variant-outline', inHeader: false, isMobileTab: true, inFooter: false },
	{
		label: 'Projects',
		href: '/projects',
		icon: 'mdi:folder-multiple-outline',
		inHeader: true,
		isMobileTab: true,
		inFooter: true
	},
	{
		label: 'Career',
		href: '/career',
		icon: 'mdi:timeline-text-outline',
		matches: ['/companies'],
		inHeader: true,
		isMobileTab: true,
		inFooter: true
	},
	{ label: 'Skills', href: '/skills', icon: 'mdi:chip', inHeader: true, isMobileTab: false, inFooter: true },
	{ label: 'Journal', href: '/blog', icon: 'mdi:post-outline', inHeader: true, isMobileTab: true, inFooter: true },
	{
		label: 'Contact',
		href: '/contact',
		icon: 'mdi:card-account-mail-outline',
		inHeader: true,
		isMobileTab: false,
		inFooter: true
	},
	{
		label: 'GitHub',
		href: '/github',
		icon: 'simple-icons:github',
		inHeader: false,
		isMobileTab: false,
		inFooter: true
	},
	{ label: 'CV', href: '/cv', icon: 'mdi:file-account-outline', inHeader: false, isMobileTab: false, inFooter: true }
]

export const HEADER_LINKS = NAV_LINKS.filter(l => l.inHeader)
export const MOBILE_TABS = NAV_LINKS.filter(l => l.isMobileTab)
export const FOOTER_LINKS = NAV_LINKS.filter(l => l.inFooter)

/**
 * Legal pages — the footer's bottom row and the foot of the mobile Menu sheet. Kept out of
 * `NAV_LINKS` on purpose: the ⌘K palette renders that table whole, and a privacy policy is
 * not a site section.
 */
export const LEGAL_LINKS: readonly { label: string; href: Route }[] = [{ label: 'Privacy', href: '/privacy' }]

/**
 * Whether `link` is the section the visitor is in. Home matches exactly; every other link
 * matches its own detail pages (`/projects/looklook-pet` keeps Projects lit) and any prefix
 * in `matches`. A prefix must end at a segment boundary, so `/careers` would not light Career.
 */
export const isActive = (pathname: string, link: Pick<NavLink, 'href' | 'matches'>) => {
	if (link.href === '/') return pathname === '/'
	return [link.href, ...(link.matches ?? [])].some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
