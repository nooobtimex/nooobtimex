'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import Hint from '@/components/site/Hint'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
	value: string
	label?: string
	className?: string
}

/**
 * Copy-to-clipboard with a transient check state. `navigator.clipboard` needs a secure
 * context and a user gesture — on failure we stay silent, because the value is always
 * rendered as selectable text next to this button.
 */
const CopyButton: React.FC<CopyButtonProps> = ({ value, label = 'Copy', className }) => {
	const [copied, setCopied] = React.useState(false)

	React.useEffect(() => {
		if (!copied) return
		const timer = setTimeout(() => setCopied(false), 1500)
		return () => clearTimeout(timer)
	}, [copied])

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
		} catch {
			// Insecure context or denied permission — the value stays selectable on screen.
		}
	}

	return (
		<Hint label={copied ? 'Copied' : label}>
			<button
				type='button'
				onClick={handleCopy}
				aria-label={`${label} ${value}`}
				className={cn(
					'text-muted-foreground hover:text-brand flex size-9 shrink-0 items-center justify-center transition-colors',
					copied && 'text-success',
					className
				)}>
				<Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} className='size-4' />
			</button>
		</Hint>
	)
}

export default CopyButton
