import React from 'react'
import Link from 'next/link'
import CyberIcon from '@/components/cyber/CyberIcon'
import MotionReveal from '@/components/cyber/MotionReveal'
import NeonPanel from '@/components/cyber/NeonPanel'
import SectionHeader from '@/components/cyber/SectionHeader'
import { HireDestination } from '@/components/hire/HireBand'
import HireButton from '@/components/hire/HireButton'
import { servicesData } from '@/common'

/**
 * Home "What I build" — the freelance offerings, each followed by the shipped work that
 * proves it. One hire button under the grid rather than one per card: four identical
 * buttons read as noise, and the decision is "hire him", not "buy service #3".
 */
const ServicesSection: React.FC<{ code: string }> = ({ code }) => (
	<section className='mt-20'>
		<SectionHeader code={code} title='What I build' subtitle='Freelance work I take on — each with shipped proof.' />

		<div className='mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
			{servicesData.map((s, i) => (
				<MotionReveal key={s.id} delay={i * 0.08} className='h-full'>
					<NeonPanel className='flex h-full flex-col p-5'>
						<span className='perk-node clip-notch-sm flex size-12 items-center justify-center'>
							<CyberIcon icon={s.icon} className='text-cyber-yellow size-6' />
						</span>
						<h3 className='font-display mt-4 text-xl font-bold tracking-wide uppercase'>{s.title}</h3>
						<p className='text-muted-foreground mt-2 flex-1 text-sm leading-relaxed'>{s.blurb}</p>

						<p className='text-cyber-cyan mt-5 font-mono text-[0.6rem] tracking-[0.3em] uppercase'>// Proof</p>
						<ul className='mt-2 space-y-1.5'>
							{s.proof.map(p => (
								<li key={`${p.kind}:${p.id}`}>
									<Link
										href={(p.kind === 'project' ? `/projects/${p.id}` : `/blog/${p.id}`) as never}
										className='hover:text-cyber-yellow flex items-start gap-1.5 text-xs leading-snug font-semibold transition-colors'>
										<CyberIcon icon='mdi:arrow-right' className='text-cyber-cyan mt-px size-3.5 shrink-0' />
										{p.label}
									</Link>
								</li>
							))}
						</ul>
					</NeonPanel>
				</MotionReveal>
			))}
		</div>

		<div className='mt-8 flex flex-col items-start gap-3'>
			<HireButton size='lg' />
			<HireDestination />
		</div>
	</section>
)

export default ServicesSection
