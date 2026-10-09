import React from 'react'
import CopyButton from '@/components/contact/CopyButton'
import CyberIcon from '@/components/cyber/CyberIcon'
import CyberTag from '@/components/cyber/CyberTag'

interface ChannelCardProps {
	icon: string
	label: string
	value: string
	url?: string
	/** Reachable from inside mainland China? Renders the availability badge. */
	inChina: boolean
	note?: string
	external?: boolean
}

/**
 * One contact channel: icon, label, copyable value, optional deep link, and the badge
 * that says whether it survives the Great Firewall — the single most useful piece of
 * information on this page for someone standing in a hall in Yiwu.
 */
const ChannelCard: React.FC<ChannelCardProps> = ({ icon, label, value, url, inChina, note, external = true }) => {
	return (
		<div className='border-border hover:border-cyber-cyan/50 clip-notch-sm flex items-center gap-3 border p-3 transition-colors'>
			<CyberIcon icon={icon} className='text-cyber-cyan size-6 shrink-0' />

			<div className='min-w-0 flex-1'>
				<div className='flex flex-wrap items-center gap-2'>
					<span className='font-mono text-xs tracking-widest uppercase'>{label}</span>
					<CyberTag tone={inChina ? 'yellow' : 'magenta'} icon={inChina ? 'mdi:check-circle-outline' : 'mdi:cancel'}>
						{inChina ? 'CN OK' : 'Blocked in CN'}
					</CyberTag>
				</div>

				{url ?
					<a
						href={url}
						target={external ? '_blank' : undefined}
						rel={external ? 'noopener noreferrer' : undefined}
						className='text-muted-foreground hover:text-cyber-yellow block truncate font-mono text-sm transition-colors'>
						{value}
					</a>
				:	<span className='text-muted-foreground block truncate font-mono text-sm'>{value}</span>}

				{note && <p className='text-muted-foreground mt-1 text-xs'>{note}</p>}
			</div>

			<CopyButton value={value} label={`Copy ${label}`} />
		</div>
	)
}

export default ChannelCard
