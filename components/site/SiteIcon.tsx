import React from 'react'
import { iconToSVG } from '@iconify/utils'
import { resolveIcon } from '@/lib/icon-data'

interface SiteIconProps {
	/** `collection:id`, e.g. `mdi:home-variant-outline`. Must be in the generated subset. */
	icon: string
	className?: string
	/** Inline colour is load-bearing on the CV, which prints with exact colour adjust. */
	style?: React.CSSProperties
}

/**
 * A SERVER-side `<Icon>`: inlines the SVG instead of fetching it.
 *
 * `@iconify/react`'s `Icon` is a client component that requests its SVG from
 * api.iconify.design after mount. The measured result was that the prerendered HTML
 * contained **zero** inline `<svg>` across 69 render sites — every icon blank until a
 * third-party round-trip finished, and no iconography at all wherever that host is slow
 * or blocked. Preloading the data does not help: `Icon` still emits `<span></span>`
 * under `renderToString` even when the icon is registered via `addIcon`. The only way
 * to get an icon into the HTML is to render the SVG ourselves.
 *
 * Use this in server components. Client components keep `@iconify/react` — pulling this
 * module into a client bundle would drag `lib/og-icons.generated.json` (~138 KB) with
 * it, which is the cost this whole pipeline exists to avoid.
 *
 * Throws on an unknown name rather than rendering nothing, matching `iconDataUri` in
 * `lib/og-assets.ts`. A silently invisible icon is the failure mode the generate/check
 * pipeline was built to prevent, and `bun run icons:check` already gates the build.
 */
const SiteIcon: React.FC<SiteIconProps> = ({ icon, className, style }) => {
	const data = resolveIcon(icon)

	if (!data) {
		throw new Error(
			`[SiteIcon] unknown icon "${icon}" — not in lib/og-icons.generated.json. `
				+ `If it comes from common/data, run \`bun run icons:generate\`; `
				+ `if it is hard-coded in a server component, add it to EXTRA_ICONS in `
				+ `scripts/icons/required.ts and regenerate.`
		)
	}

	// Entries are pre-resolved through `getIconData` at generation time, so aliases and
	// collection-level width/height defaults are already baked in.
	const { body, attributes } = iconToSVG(data)

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={attributes.viewBox}
			// 1em matches @iconify/react's default so the Tailwind `size-*` utilities at the
			// call sites keep behaving exactly as they did before the swap.
			width='1em'
			height='1em'
			className={className}
			style={style}
			aria-hidden='true'
			focusable='false'
			dangerouslySetInnerHTML={{ __html: body }}
		/>
	)
}

export default SiteIcon
