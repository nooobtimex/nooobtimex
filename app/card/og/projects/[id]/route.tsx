/**
 * GET /card/og/projects/<id> — the 1200×630 social card for one project.
 *
 * Every page used to share the single site-wide card from `app/opengraph-image.tsx`,
 * so ten different projects all previewed identically in a link unfurl.
 *
 * Lives here rather than as an `opengraph-image.tsx` beside the project page for the
 * same reason `card/projects/[id]/route.tsx` does: `app/(main)/projects/[...id]/` is a
 * CATCH-ALL segment, and Next rejects any file convention nested beneath one
 * ("Catch-all must be the last part of the URL"). The project route therefore points
 * `openGraph.images` at this URL explicitly, via `pageMetadata({ ogImage })`.
 *
 * The project cover does most of the work. Covers are 16:9 finished compositions, so at
 * 1200 wide one is 675 tall — taller than the whole 630 card. It is therefore TOP-ALIGNED
 * and clipped, not `objectFit: 'cover'`: a centred crop sliced the cover's own bottom meta
 * row ("STACK // …") exactly through the middle, which reads as a broken image. Anchoring
 * to the top drops that row whole — and losing it costs nothing, because the strip below
 * reprints the same stack alongside what a static cover cannot carry: status and the URL.
 *
 * Prerendered for every project, so `pngDataUri`'s sharp import stays a build-time
 * cost and never reaches the runtime container. See the Deployment section in CLAUDE.md.
 */
import { ImageResponse } from 'next/og'
import { alpha, gridBackground, stripEmoji, truncate } from '@/components/og/card-primitives'
import { pngDataUri } from '@/lib/og-assets'
import { OG } from '@/lib/og-palette'
import { type ProjectStatus, projectStatus } from '@/lib/utils'
import { projectsData } from '@/common'

export const dynamic = 'force-static'

const STATUS_LABEL = {
	'live': 'LIVE',
	'in-development': 'IN DEVELOPMENT',
	'archived': 'ARCHIVED'
} satisfies Record<ProjectStatus, string>

const SIZE = { width: 1200, height: 630 }
/** The visible band of the cover. The rest is clipped off the bottom. */
const COVER_HEIGHT = 470
/** A 16:9 cover rendered at the full card width — taller than the card, hence the clip. */
const COVER_NATURAL_HEIGHT = Math.round((SIZE.width * 9) / 16)

export function generateStaticParams() {
	return projectsData.map(p => ({ id: p.id }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const project = projectsData.find(p => p.id === id)

	if (!project) return new Response('Not found', { status: 404 })

	const accent = project.accent
	// Downscaled to the card width — a full-size 1600×900 cover inlines to ~1.5 MB.
	const cover = await pngDataUri(project.images.cover, SIZE.width)
	const status = projectStatus(project)
	const stack = project.skills
		.slice(0, 6)
		.map(s => s.name)
		.join('  ·  ')

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				// gridBackground supplies backgroundColor as well as the grid image.
				...gridBackground(accent),
				color: OG.fg,
				fontFamily: 'sans-serif'
			}}>
			{cover ?
				<div style={{ display: 'flex', height: COVER_HEIGHT, overflow: 'hidden' }}>
					<img src={cover} width={SIZE.width} height={COVER_NATURAL_HEIGHT} alt='' />
				</div>
			:	<div
					style={{
						display: 'flex',
						alignItems: 'center',
						height: COVER_HEIGHT,
						padding: '0 64px',
						fontSize: 72,
						fontWeight: 700,
						letterSpacing: -1,
						textTransform: 'uppercase',
						color: accent
					}}>
					{truncate(stripEmoji(project.title), 28)}
				</div>
			}

			<div
				style={{
					display: 'flex',
					flex: 1,
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 56px',
					borderTop: `3px solid ${accent}`,
					backgroundColor: OG.panel
				}}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
					<div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
						{truncate(stripEmoji(project.title), 34)}
					</div>
					<div style={{ display: 'flex', fontSize: 19, color: OG.muted }}>{truncate(stack, 62)}</div>
				</div>

				<div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
					<div
						style={{
							display: 'flex',
							padding: '8px 18px',
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: 3,
							color: status === 'live' ? OG.bg : accent,
							backgroundColor: status === 'live' ? accent : alpha(accent, 0.16)
						}}>
						{STATUS_LABEL[status]}
					</div>
					<div style={{ display: 'flex', fontSize: 22, letterSpacing: 2, color: OG.muted }}>nooobtimex.me</div>
				</div>
			</div>
		</div>,
		SIZE
	)
}
