import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

export default function Tag({
	children,
	icon,
	className
}: {
	children: ReactNode
	icon?: string
	className?: string
	tone?: 'cyan' | 'yellow' | 'magenta'
}) {
	return (
		<span
			className={cn(
				'comic-tag text-foreground inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium',
				className
			)}>
			{icon && <Icon icon={icon} className='size-3.5' />}
			{children}
		</span>
	)
}
