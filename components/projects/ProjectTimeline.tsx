import React from 'react'
import CyberIcon from '@/components/cyber/CyberIcon'
import MotionReveal from '@/components/cyber/MotionReveal'
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
			<span className='spine-line absolute top-0 bottom-0 left-5 w-px' />

			<div className='space-y-6'>
				{ordered.map((m, i) => {
					const isLatest = i === 0
					return (
						<MotionReveal key={m.title} delay={(i % 2) * 0.06}>
							<div className='relative pl-14'>
								{/* Station marker on the spine */}
								<span
									className={cn(
										'bg-background absolute top-3 left-5 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border',
										isLatest ? 'now-pulse border-cyber-yellow' : 'border-cyber-cyan/60'
									)}>
									{m.icon ?
										<CyberIcon
											icon={m.icon}
											className={cn('size-4', isLatest ? 'text-cyber-yellow' : 'text-cyber-cyan')}
										/>
									:	<span className='bg-cyber-cyan size-2 rotate-45' />}
								</span>

								{/* Milestone card */}
								<div className='neon-panel clip-notch-sm p-4'>
									<div className='flex items-start justify-between gap-2'>
										<h3 className='text-base leading-tight font-bold tracking-wide uppercase'>{m.title}</h3>
										{isLatest && (
											<span className='bg-cyber-yellow shrink-0 px-2 py-0.5 font-mono text-[0.65rem] font-bold tracking-widest text-black uppercase'>
												Now
											</span>
										)}
									</div>
									<p className='text-cyber-cyan mt-2 font-mono text-[0.65rem] tracking-wider uppercase'>
										{formatMilestoneDate(m.date)}
									</p>
									{m.description && (
										<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{m.description}</p>
									)}
									{m.addedSkills?.length || m.removedSkills?.length ?
										<div className='mt-3 flex flex-wrap gap-1.5'>
											{m.addedSkills?.map(s => (
												<span
													key={`add-${s.id}`}
													className='text-cyber-green border-cyber-green/40 flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wide'>
													<CyberIcon icon={s.icon} className='size-3' />+{s.name}
												</span>
											))}
											{m.removedSkills?.map(s => (
												<span
													key={`rm-${s.id}`}
													className='text-cyber-magenta border-cyber-magenta/40 flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wide'>
													<CyberIcon icon={s.icon} className='size-3' />
													<span className='line-through'>{s.name}</span>
												</span>
											))}
										</div>
									:	null}
								</div>
							</div>
						</MotionReveal>
					)
				})}
			</div>
		</div>
	)
}

export default ProjectTimeline
