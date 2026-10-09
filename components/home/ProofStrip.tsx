import React from 'react'
import Link from 'next/link'
import CyberIcon from '@/components/cyber/CyberIcon'
import type { ProfileStat } from '@/lib/profile-stats'

const Tile: React.FC<{ stat: ProfileStat }> = ({ stat }) => (
	<>
		<CyberIcon icon={stat.icon} className='text-cyber-cyan/70 absolute top-3 right-3 size-4' />
		<p className='font-display text-cyber-yellow text-3xl leading-none font-bold md:text-4xl'>{stat.value}</p>
		<p className='text-muted-foreground mt-2 font-mono text-[0.65rem] tracking-widest uppercase'>{stat.label}</p>
	</>
)

/**
 * The numbers under the hero — proof before the pitch is read twice. Not wrapped in
 * MotionReveal: it sits at the fold, and a reveal starts at opacity 0.
 */
const ProofStrip: React.FC<{ stats: ProfileStat[] }> = ({ stats }) => (
	<ul aria-label='At a glance' className='grid grid-cols-2 gap-3 md:grid-cols-4'>
		{stats.map(stat => (
			<li key={stat.label} className='contents'>
				{stat.href ?
					<Link
						href={stat.href}
						className='group neon-panel clip-notch-sm hover:border-cyber-yellow/60 relative block p-4 transition-colors'>
						<Tile stat={stat} />
					</Link>
				:	<div className='neon-panel clip-notch-sm relative p-4'>
						<Tile stat={stat} />
					</div>
				}
			</li>
		))}
	</ul>
)

export default ProofStrip
