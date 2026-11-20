import React from 'react'
import ContentBlock from '@/components/site/ContentBlock'
import SiteIcon from '@/components/site/SiteIcon'
import { cn, formatMilestoneDate } from '@/lib/utils'
import { type Milestone } from '@/common'

interface ProjectTimelineProps {
	items: Milestone[]
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ items }) => {
	// Timelines are authored oldest-first; display newest-first so the latest milestone leads.
	const ordered = [...items].reverse()

	return (
		<div className='relative'>
			{/* Central spine */}
			<span className='timeline-line absolute top-0 bottom-0 left-5 w-px' />

			<div className='space-y-6'>
				{ordered.map((m, i) => {
					const isLatest = i === 0
					return (
						<ContentBlock key={m.title} delay={(i % 2) * 0.06}>
							<div className='relative pl-14'>
								{/* Station marker on the spine */}
								<span
									className={cn(
										'bg-background absolute top-3 left-5 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border',
										isLatest ? 'border-brand rounded-full' : 'border-brand/60'
									)}>
									{m.icon ?
										<SiteIcon icon={m.icon} className={cn('size-4', isLatest ? 'text-brand' : 'text-brand')} />
									:	<span className='bg-brand size-2 rotate-45' />}
								</span>

								{/* Milestone card */}
								<div className='surface rounded-lg p-4'>
									<div className='flex items-start justify-between gap-2'>
										<h3 className='text-base leading-tight font-bold tracking-normal'>{m.title}</h3>
										{isLatest && (
											<span className='bg-brand text-primary-foreground shrink-0 px-2 py-0.5 font-sans text-xs font-bold tracking-normal'>
												Now
											</span>
										)}
									</div>
									<p className='text-brand mt-2 font-sans text-xs tracking-normal'>{formatMilestoneDate(m.date)}</p>
									{m.description && (
										<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{m.description}</p>
									)}
									{m.addedSkills?.length || m.removedSkills?.length ?
										<div className='mt-3 flex flex-wrap gap-1.5'>
											{m.addedSkills?.map(s => (
												<span
													key={`add-${s.id}`}
													className='text-success border-success/40 flex items-center gap-1 border px-1.5 py-0.5 font-sans text-xs tracking-normal'>
													<SiteIcon icon={s.icon} className='size-3' />+{s.name}
												</span>
											))}
											{m.removedSkills?.map(s => (
												<span
													key={`rm-${s.id}`}
													className='text-danger border-danger/40 flex items-center gap-1 border px-1.5 py-0.5 font-sans text-xs tracking-normal'>
													<SiteIcon icon={s.icon} className='size-3' />
													<span className='line-through'>{s.name}</span>
												</span>
											))}
										</div>
									:	null}
								</div>
							</div>
						</ContentBlock>
					)
				})}
			</div>
		</div>
	)
}

export default ProjectTimeline
