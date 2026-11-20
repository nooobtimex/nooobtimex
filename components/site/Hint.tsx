'use client'

import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface HintProps {
	label: string
	children: React.ReactElement
	side?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Shared tooltip. `children` becomes the trigger via Base UI's render prop,
 * so it merges onto your element (link/button) instead of wrapping it in a button.
 */
const Hint: React.FC<HintProps> = ({ label, children, side = 'bottom' }) => {
	return (
		<Tooltip>
			<TooltipTrigger render={children} />
			<TooltipContent
				side={side}
				className='text-brand border-brand/50 bg-popover rounded-none border font-sans text-xs tracking-normal'>
				{label}
			</TooltipContent>
		</Tooltip>
	)
}

export default Hint
