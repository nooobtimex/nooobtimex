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
	work: 'text-brand border-brand/55',
	education: 'text-brand border-brand/55'
}

const TraceNode: React.FC<TraceNodeProps> = ({ item, side, isNow }) => {
	return (
		<div className='relative pl-14 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:pl-0'>
			{/* Station marker on the spine */}
			<span
				className={cn(
					'bg-background absolute top-4 left-5 z-10 flex size-9 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border lg:left-1/2',
					isNow ? 'border-brand rounded-full' : 'border-brand/60'
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
				:	<span className='bg-brand size-2 rotate-45' />}
			</span>

			{/* Card on the chosen side */}
			<div className={cn('lg:col-start-1', side === 'right' && 'lg:col-start-2')}>
				<Link
					href={`/career/${item.id}` as never}
					className='group surface hover:border-brand/60 block rounded-lg p-4 transition-colors'>
					<div className='flex items-start justify-between gap-2'>
						<div className='min-w-0'>
							<h3 className='group-hover:text-brand text-base leading-tight font-bold tracking-normal transition-colors'>
								{item.credential ?? humanize(item.position)}
							</h3>
							<p className='text-brand truncate text-sm'>{item.organization.name}</p>
						</div>
						{isNow && (
							<span className='bg-brand text-primary-foreground shrink-0 px-2 py-0.5 font-sans text-xs font-bold tracking-normal'>
								Now
							</span>
						)}
					</div>

					<p className='text-muted-foreground mt-2 font-sans text-xs tracking-normal'>
						{formatExperienceDuration(item.startDate, item.endDate)}
					</p>
					<p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed'>{item.description}</p>

					<span
						className={cn(
							'mt-3 inline-block border px-2 py-0.5 font-sans text-xs tracking-normal',
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
