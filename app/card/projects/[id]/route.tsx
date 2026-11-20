/**
 * GET /card/projects/<id> — the downloadable 1080×1080 project card.
 *
 * Lives at the top level of `app/` rather than under the project detail page
 * because `app/(main)/projects/[...id]/` is a CATCH-ALL segment: it consumes every
 * remaining path segment, so nothing can nest beneath it.
 *
 * Prerendered for all ten projects at build time, so this costs nothing at request
 * time and works on any host. The URL stays previewable (no Content-Disposition) —
 * the `download` attribute on the link supplies the filename.
 */
import { ImageResponse } from 'next/og'
import ProjectSquareCard from '@/components/og/ProjectSquareCard'
import { CARD_SIZE } from '@/components/og/card-primitives'
import { projectsData } from '@/common'

export const dynamic = 'force-static'

export function generateStaticParams() {
	return projectsData.map(p => ({ id: p.id }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const project = projectsData.find(p => p.id === id)

	if (!project) return new Response('Not found', { status: 404 })

	return new ImageResponse(<ProjectSquareCard project={project} />, {
		width: CARD_SIZE,
		height: CARD_SIZE
	})
}
