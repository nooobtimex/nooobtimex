/**
 * GET /card/og/blog/<id> — the 1200×630 social card for one post.
 *
 * Lives here rather than as an `opengraph-image.tsx` beside the post page for the
 * same reason `card/og/projects/[id]/route.tsx` does: `app/(main)/blog/[...id]/` is a
 * CATCH-ALL segment, and Next rejects any file convention nested beneath one. The post
 * route points `openGraph.images` here explicitly, via `pageMetadata({ ogImage })`.
 *
 * Text-only by design: posts carry no cover art, and a typographic card costs nothing
 * at build time — no sharp, no image inlining. Prerendered for published posts only
 * (`postsData` is draft-filtered), so drafts never even get a card URL.
 */
import { ImageResponse } from 'next/og'
import { alpha, gridBackground, truncate } from '@/components/og/card-primitives'
import { OG } from '@/lib/og-palette'
import { formatMilestoneDate } from '@/lib/utils'
import { categoryMetadataPosts, chapterMetadata, postsData } from '@/common'

export const dynamic = 'force-static'

const SIZE = { width: 1200, height: 630 }

export function generateStaticParams() {
	return postsData.map(p => ({ id: p.id }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const post = postsData.find(p => p.id === id)

	if (!post) return new Response('Not found', { status: 404 })

	const accent = post.accent

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				...gridBackground(accent),
				color: OG.fg,
				fontFamily: 'sans-serif'
			}}>
			<div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', padding: '0 64px' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, letterSpacing: 4, color: accent }}>
					<div style={{ display: 'flex', width: 34, height: 4, backgroundColor: accent }} />
					{`JOURNAL // ${chapterMetadata[post.chapter].label.toUpperCase()}`}
				</div>
				<div
					style={{
						display: 'flex',
						marginTop: 26,
						fontSize: 58,
						fontWeight: 700,
						letterSpacing: -1,
						lineHeight: 1.15,
						maxWidth: 1020
					}}>
					{truncate(post.title, 90)}
				</div>
				<div style={{ display: 'flex', marginTop: 24, fontSize: 24, lineHeight: 1.4, color: OG.muted, maxWidth: 980 }}>
					{truncate(post.description, 120)}
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '26px 56px',
					borderTop: `3px solid ${accent}`,
					backgroundColor: OG.panel
				}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
					<div
						style={{
							display: 'flex',
							padding: '8px 18px',
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: 3,
							color: accent,
							backgroundColor: alpha(accent, 0.16)
						}}>
						{categoryMetadataPosts[post.category].label.toUpperCase()}
					</div>
					<div style={{ display: 'flex', fontSize: 22, color: OG.muted }}>
						{`${formatMilestoneDate(post.happenedAt).toUpperCase()}  ·  ${post.readingMinutes} MIN`}
					</div>
				</div>
				<div style={{ display: 'flex', fontSize: 22, letterSpacing: 2, color: OG.muted }}>nooobtimex.me/blog</div>
			</div>
		</div>,
		SIZE
	)
}
