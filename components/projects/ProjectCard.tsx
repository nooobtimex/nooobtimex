import React from 'react'
import Link from 'next/link'
import CyberIcon from '@/components/cyber/CyberIcon'
import { cn, excerpt } from '@/lib/utils'
import type { Project } from '@/common'

interface ProjectCardProps {
	project: Project
	index?: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
	const year = new Date(project.startDate).getFullYear()
	// Active tech first, retired trailing (dimmed) — capped at 5 icons + overflow count.
	const shownSkills = [...project.activeSkills, ...project.retiredSkills]

	return (
		<Link
			href={`/projects/${project.id}` as never}
			className='group neon-panel clip-notch hover:border-cyber-yellow/60 relative flex h-full flex-col overflow-hidden transition-colors'>
			{/* Banner */}
			<div className='border-border/60 relative aspect-[16/9] w-full overflow-hidden border-b'>
				<img
					src={project.images.cover}
					alt={project.title}
					loading='lazy'
					decoding='async'
					className='absolute inset-0 size-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100'
				/>
				<div className='from-background/90 via-background/20 absolute inset-0 bg-gradient-to-t to-transparent' />
				<span className='text-cyber-cyan absolute top-2 left-2 font-mono text-[0.65rem] tracking-widest'>
					{String(index + 1).padStart(2, '0')}
				</span>
				<span className='text-muted-foreground absolute top-2 right-2 font-mono text-[0.65rem] tracking-widest'>
					{year}
				</span>
			</div>

			{/* Body */}
			<div className='flex flex-1 flex-col gap-3 p-4'>
				<h3 className='font-display group-hover:text-cyber-yellow text-xl leading-tight font-bold tracking-wide transition-colors'>
					{project.title}
				</h3>
				{/* An excerpt, never the full description: this card renders on up to 15+ pages per
				    project, and `line-clamp` hides overflow from readers, not from the HTML. */}
				<p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
					{project.summary ?? excerpt(project.description)}
				</p>

				<div className='mt-auto flex flex-wrap items-center gap-1.5 pt-2'>
					{shownSkills.slice(0, 5).map((a, i) => (
						<CyberIcon
							key={a.name}
							icon={a.icon}
							aria-label={i >= project.activeSkills.length ? `${a.name} (retired)` : a.name}
							className={cn('size-4', i >= project.activeSkills.length && 'opacity-40')}
						/>
					))}
					{shownSkills.length > 5 && (
						<span className='text-muted-foreground font-mono text-[0.65rem]'>+{shownSkills.length - 5}</span>
					)}
				</div>
			</div>

			{/* Footer bar */}
			<div className='border-border/60 flex items-center justify-between border-t px-4 py-2'>
				<span className={cn('font-mono text-[0.65rem] tracking-widest uppercase', 'text-cyber-cyan')}>
					{project.links.live ? 'Live' : 'Archived'}
				</span>
				<CyberIcon
					icon='mdi:arrow-top-right'
					className='text-muted-foreground group-hover:text-cyber-yellow size-4 transition-colors'
				/>
			</div>
		</Link>
	)
}

export default ProjectCard
