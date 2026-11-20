import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'cyan' | 'yellow'
	notch?: boolean
	corners?: boolean
}

export default function Panel({ className, variant, notch: _notch, corners: _corners, ...props }: PanelProps) {
	void _notch
	void _corners
	return <div className={cn('surface', variant === 'yellow' && 'surface-emphasis', className)} {...props} />
}
