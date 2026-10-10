/**
 * The set of icon names that must exist in `lib/og-icons.generated.json`.
 *
 * Derived from the TYPED DATA LAYER, never from a regex scan of source files. That is
 * not a style preference — a scan produces false positives that fail the build on
 * icons nobody uses. Two live examples:
 *   - `common/data/skills.ts` mentions `simple-icons:recharts` in a comment; the skill
 *     itself uses `mdi:chart-line`.
 *   - `common/data/personal.ts` has three `icon:` lines inside a doc comment showing
 *     how to add a contact channel (`mdi:phone`, `simple-icons:whatsapp`,
 *     `simple-icons:line`) — none are real entries.
 *
 * Equally, the ~56 `collection:id` literals in `components/` and `app/` are CLIENT-side
 * `@iconify/react`, which fetches from the Iconify API in the browser. They must stay
 * out of the subset — bundling them would grow the server payload for nothing.
 *
 * Imports only `@/common` (~112 KB), never `./collections` — `scripts/icons/check.ts`
 * runs on every build and must not pull in the 26.7 MB of collections.
 */
import { categoryMetadata, personalData, projectsData, serviceIcons, skillsData } from '@/common'

/**
 * Escape hatch for names a server-rendered surface hard-codes rather than reading from
 * `common/data`.
 *
 * Populated when `components/cyber/CyberIcon.tsx` landed: the ~35 `<Icon>` sites inside
 * SERVER components now inline their SVG from this subset instead of fetching from
 * api.iconify.design after hydration. Those are literals in JSX, not data, so they have
 * to be listed here — and listed EXPLICITLY, never scanned. A scan is what the doc
 * comment above rules out, and `icons:check` gating the build is exactly why.
 *
 * Client components (NavBar, the ⌘K palette, the CV pages) still use `@iconify/react`
 * and must NOT be added — bundling their icons would grow the payload for nothing.
 */
const EXTRA_ICONS: string[] = [
	'material-symbols:call',
	'material-symbols:download',
	'material-symbols:location-on',
	'material-symbols:mail',
	'material-symbols:slideshow',
	'mdi:account-multiple-outline',
	'mdi:account-tie-outline',
	'mdi:arrow-left',
	'mdi:arrow-right',
	'mdi:arrow-top-right',
	'mdi:briefcase-outline',
	'mdi:calendar-check',
	'mdi:calendar-star',
	'mdi:cancel',
	'mdi:chart-line-variant',
	'mdi:chat-outline',
	'mdi:check-circle-outline',
	'mdi:circle',
	'mdi:clock-outline',
	'mdi:domain',
	'mdi:dots-horizontal',
	'mdi:download',
	'mdi:email-outline',
	'mdi:file-account-outline',
	'mdi:file-document-edit-outline',
	'mdi:file-document-outline',
	'mdi:fire',
	'mdi:flash',
	'mdi:folder-multiple-outline',
	'mdi:handshake-outline',
	'mdi:home-variant-outline',
	'mdi:map-marker-outline',
	'mdi:office-building-outline',
	'mdi:open-in-new',
	'mdi:package-variant-closed',
	'mdi:presentation',
	'mdi:rocket-launch-outline',
	'mdi:shape-outline',
	'mdi:sitemap-outline',
	'mdi:source-commit',
	'mdi:source-repository',
	'mdi:star',
	'mdi:star-four-points-outline',
	'mdi:star-outline',
	'simple-icons:github'
]

/**
 * Every icon-bearing field in `common/`, sorted and deduped.
 *
 * Strictly required by a server-side renderer today:
 *   - `skillsData[].icon` — Satori cards (`components/og/*SquareCard.tsx`) and the
 *     README arsenal/gig cards
 *   - `categoryMetadata[*].icon` — the README arsenal card
 *   - `personalData.socialLinks[].icon` — the README comms card
 *   - `serviceIcons` — the home "What I build" cards (server-rendered via CyberIcon), hidden ones included
 *
 * Included for headroom (client-rendered today, ~11 KB total): `contactChannels` and
 * project timeline milestones. Cheap insurance against a future card reaching for one.
 */
export function requiredIcons(): string[] {
	const names = [
		...skillsData.map(s => s.icon),
		...Object.values(categoryMetadata).map(m => m.icon),
		...personalData.socialLinks.map(s => s.icon),
		...(personalData.contactChannels ?? []).map(c => c.icon),
		...serviceIcons,
		...projectsData.flatMap(p => (p.timeline ?? []).flatMap(m => (m.icon ? [m.icon] : []))),
		...EXTRA_ICONS
	]
	return [...new Set(names)].sort()
}
