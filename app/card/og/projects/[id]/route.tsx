import { ImageResponse } from 'next/og'
import { OG } from '@/lib/og-palette'
import { excerpt, projectStatus } from '@/lib/utils'
import { projectsData, workStories } from '@/common'

export const dynamic = 'force-static'
export function generateStaticParams() {
	return projectsData.map(p => ({ id: p.id }))
}
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const project = projectsData.find(p => p.id === id)
	if (!project) return new Response('Not found', { status: 404 })
	const story = workStories[id]
	return new ImageResponse(
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '100%',
				height: '100%',
				padding: 64,
				background: OG.bg,
				border: '12px solid #17191c',
				color: OG.fg,
				fontFamily: 'sans-serif'
			}}>
			<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: OG.cyan }}>
				<span>NooobtimeX · Projects</span>
				<span>{story?.status ?? projectStatus(project)}</span>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
				<div style={{ display: 'flex', fontSize: 62, fontWeight: 700, letterSpacing: -2 }}>{project.title}</div>
				<div style={{ display: 'flex', fontSize: 28, lineHeight: 1.5, color: OG.muted }}>
					{story?.context ?? project.summary ?? excerpt(project.description)}
				</div>
			</div>
			<div style={{ display: 'flex', borderTop: '3px solid #17191c', paddingTop: 22, fontSize: 23, color: OG.cyan }}>
				nooobtimex.me/projects/{id}
			</div>
		</div>,
		{ width: 1200, height: 630 }
	)
}
