import React from 'react'
import Link from 'next/link'
import { cn, formatExperienceDuration } from '@/lib/utils'
import { ExperienceCategory, type ExperienceItem } from '@/common'

interface TraceNodeProps {
	item: ExperienceItem
	side: 'left' | 'right'
	isNow: boolean
}

const humanize = (value: string) =>
	value
		.split('-')
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')

const categoryAccent: Record<ExperienceCategory, string> = {
	work: 'text-cyber-cyan border-cyber-cyan/55',
	education: 'text-cyber-yellow border-cyber-yellow/55'
}

const TraceNode: React.FC<TraceNodeProps> = ({ item, side, isNow }) => {
	return (
		<div className='relative pl-14 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:pl-0'>
			{/* Station marker on the spine */}
			<span
				className={cn(
					'bg-background absolute top-4 left-5 z-10 flex size-9 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border lg:left-1/2',
					isNow ? 'now-pulse border-cyber-yellow' : 'border-cyber-cyan/60'
				)}>
				{item.organization.logo ?
					<img
						src={item.organization.logo}
						alt={item.organization.name}
						width={36}
						height={36}
						loading='lazy'
						decoding='async'
						className='size-full bg-white/90 object-contain p-1'
					/>
				:	<span className='bg-cyber-cyan size-2 rotate-45' />}
			</span>

			{/* Card on the chosen side */}
			<div className={cn('lg:col-start-1', side === 'right' && 'lg:col-start-2')}>
				<Link
					href={`/career/${item.id}` as never}
					className='group neon-panel clip-notch-sm hover:border-cyber-yellow/60 block p-4 transition-colors'>
					<div className='flex items-start justify-between gap-2'>
						<div className='min-w-0'>
							<h3 className='group-hover:text-cyber-yellow text-base leading-tight font-bold tracking-wide uppercase transition-colors'>
								{item.credential ?? humanize(item.position)}
							</h3>
							<p className='text-cyber-cyan truncate text-sm'>{item.organization.name}</p>
						</div>
						{isNow && (
							<span className='bg-cyber-yellow shrink-0 px-2 py-0.5 font-mono text-[0.65rem] font-bold tracking-widest text-black uppercase'>
								Now
							</span>
						)}
					</div>

					<p className='text-muted-foreground mt-2 font-mono text-[0.65rem] tracking-wider uppercase'>
						{formatExperienceDuration(item.startDate, item.endDate)}
					</p>
					<p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed'>{item.description}</p>

					<span
						className={cn(
							'mt-3 inline-block border px-2 py-0.5 font-mono text-[0.65rem] tracking-widest uppercase',
							categoryAccent[item.category]
						)}>
						{humanize(item.category)}
					</span>
				</Link>
			</div>
		</div>
	)
}

export default TraceNode
