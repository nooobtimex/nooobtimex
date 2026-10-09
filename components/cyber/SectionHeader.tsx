import React from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
	title: string
	subtitle?: string
	className?: string
	action?: React.ReactNode
	/**
	 * Heading level. Defaults to `h2` because most uses are sections *within* a page.
	 * Index routes (/projects, /skills, /career, /github) have no other
	 * heading, so their top SectionHeader passes `as='h1'` — without it those pages
	 * ship no `h1` at all. Purely semantic: the visual styling is identical.
	 */
	as?: 'h1' | 'h2'
}

/**
 * Standard section header: accent rule + title + optional subtitle/action.
 *
 * The accent used to be a numbered `03 //` code. The numbers meant nothing to a visitor and
 * drifted out of step (two index pages both said 05; home skipped 07 whenever a section
 * was absent), so the HUD mark is now purely visual.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className, action, as = 'h2' }) => {
	const Heading = as
	return (
		<div className={cn('border-border/60 flex items-end justify-between gap-4 border-b pb-4', className)}>
			<div>
				<span aria-hidden className='bg-cyber-cyan block h-0.5 w-8' />
				<Heading className='font-display mt-3 text-3xl font-bold tracking-wide md:text-4xl'>{title}</Heading>
				{subtitle && <p className='text-muted-foreground mt-1 max-w-2xl text-sm'>{subtitle}</p>}
			</div>
			{action}
		</div>
	)
}

export default SectionHeader
