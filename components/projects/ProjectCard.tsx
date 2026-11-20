import type { Route } from 'next'
import Link from 'next/link'
import { excerpt, projectStatus } from '@/lib/utils'
import { type Project, assets, workStories } from '@/common'

export default function ProjectCard({ project }: { project: Project; index?: number }) {
	const story = workStories[project.id]
	const image =
		project.id === 'rs-trophy' ? assets.projects.rsTrophy.preview
		: project.id === 'unitree-g1' ? project.images.photos[0]
		: project.id === 'looklook-pet' ? project.images.photos[1]
		: project.images.cover
	return (
		<Link href={`/projects/${project.id}` as Route} className='comic-card group flex h-full flex-col'>
			<div className='comic-card-media relative aspect-[16/10] overflow-hidden'>
				<img
					src={image}
					alt={project.title}
					loading='lazy'
					decoding='async'
					className='size-full object-cover transition-transform duration-300 group-hover:scale-[1.025]'
				/>
			</div>
			<div className='comic-card-body flex flex-1 flex-col'>
				<p className='text-muted-foreground mb-3 text-xs'>
					{story?.status
						?? `${new Date(project.startDate).getFullYear()} · ${projectStatus(project).replaceAll('-', ' ')}`}
				</p>
				<h3 className='group-hover:text-brand text-xl leading-snug'>
					{project.title} <span aria-hidden='true'>↗</span>
				</h3>
				<p className='text-muted-foreground mt-3 text-base leading-relaxed'>
					{story?.context ?? project.summary ?? excerpt(project.description)}
				</p>
				{story && <p className='mt-3 text-sm'>{story.responsibility}</p>}
				<p className='text-brand mt-auto border-t pt-4 text-xs'>
					{project.activeSkills
						.slice(0, 3)
						.map(skill => skill.name)
						.join(' · ')}
				</p>
			</div>
		</Link>
	)
}
