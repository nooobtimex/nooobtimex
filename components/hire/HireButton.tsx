import React from 'react'
import CyberButton from '@/components/cyber/CyberButton'
import CyberIcon from '@/components/cyber/CyberIcon'
import { personalData } from '@/common'

interface HireButtonProps {
	size?: 'sm' | 'md' | 'lg'
	variant?: 'solid' | 'outline'
	/** A shorter label where space is tight; defaults to `personalData.hire.label`. */
	label?: string
	className?: string
}

/**
 * The one "Hire me" control on a server-rendered surface. Every instance opens
 * `personalData.hire.url` — the Fastwork BYOB link — in a new tab, so a client who arrives
 * from any page is credited to this seller. Client components (NavBar) cannot import
 * `@/common`, so they take the same URL as a prop from their server parent instead.
 */
const HireButton: React.FC<HireButtonProps> = ({ size = 'md', variant = 'solid', label, className }) => (
	<CyberButton href={personalData.hire.url} external size={size} variant={variant} className={className}>
		<CyberIcon icon='mdi:handshake-outline' />
		{label ?? personalData.hire.label}
		<CyberIcon icon='mdi:arrow-top-right' className='opacity-70' />
	</CyberButton>
)

export default HireButton
