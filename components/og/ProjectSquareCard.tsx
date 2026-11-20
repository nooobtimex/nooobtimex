import { OG } from '@/lib/og-palette'
import { excerpt, projectStatus } from '@/lib/utils'
import { type Project, workStories } from '@/common'

export default function ProjectSquareCard({ project }: { project: Project; cover?: string | null }) {
	const story = workStories[project.id]
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '100%',
				height: '100%',
				padding: 72,
				background: OG.bg,
				border: '12px solid #17191c',
				color: OG.fg,
				fontFamily: 'sans-serif'
			}}>
			<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: OG.cyan }}>
				<span>NooobtimeX.</span>
				<span>{story?.status ?? projectStatus(project)}</span>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
				<div style={{ display: 'flex', fontSize: 78, fontWeight: 700, letterSpacing: -3 }}>{project.title}</div>
				<div style={{ display: 'flex', fontSize: 36, lineHeight: 1.5, color: OG.muted }}>
					{story?.context ?? project.summary ?? excerpt(project.description)}
				</div>
				{story && <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.5 }}>{story.responsibility}</div>}
			</div>
			<div style={{ display: 'flex', borderTop: '3px solid #17191c', paddingTop: 28, fontSize: 28, color: OG.cyan }}>
				nooobtimex.me/projects/{project.id}
			</div>
		</div>
	)
}
