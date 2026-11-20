import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function SectionHeader({
	title,
	subtitle,
	className,
	action,
	as: Heading = 'h2'
}: {
	title: string
	subtitle?: string
	className?: string
	action?: ReactNode
	as?: 'h1' | 'h2'
}) {
	return (
		<div className={cn('comic-heading flex flex-wrap items-end justify-between gap-4', className)}>
			<div>
				<Heading className={Heading === 'h1' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}>{title}</Heading>
				{subtitle && <p className='text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed'>{subtitle}</p>}
			</div>
			{action}
		</div>
	)
}
