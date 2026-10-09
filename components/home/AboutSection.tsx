import React from 'react'
import CyberIcon from '@/components/cyber/CyberIcon'
import MotionReveal from '@/components/cyber/MotionReveal'
import NeonPanel from '@/components/cyber/NeonPanel'
import SectionHeader from '@/components/cyber/SectionHeader'
import { personalData } from '@/common'

/** Short facts a client checks before messaging: where, when and in what language. */
const FACTS = [
	{ icon: 'mdi:map-marker-outline', label: 'Based in', value: `${personalData.contact.location}, Thailand` },
	{ icon: 'mdi:clock-outline', label: 'Time zone', value: 'ICT · UTC+7' },
	{ icon: 'mdi:home-variant-outline', label: 'Works', value: 'Remote' },
	{
		icon: 'mdi:account-multiple-outline',
		label: 'Languages',
		value: personalData.languages.map(l => l.name).join(' · ')
	}
] as const

/**
 * Home "About" — the bio and highlights, which until now only the CV carried. A profile
 * page that never says who the person is asks a client to hire a list of projects.
 */
const AboutSection: React.FC<{ code: string }> = ({ code }) => (
	<section className='mt-20'>
		<SectionHeader code={code} title='About' subtitle='Who you would be hiring.' />

		<div className='mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
			<MotionReveal>
				<p className='text-base leading-relaxed md:text-lg'>{personalData.about.bio}</p>
				<ul className='mt-6 space-y-3'>
					{personalData.about.highlights.map(h => (
						<li key={h} className='flex items-start gap-3 text-sm md:text-base'>
							<CyberIcon icon='mdi:check-circle-outline' className='text-cyber-yellow mt-0.5 size-5 shrink-0' />
							<span className='text-muted-foreground'>{h}</span>
						</li>
					))}
				</ul>
			</MotionReveal>

			<MotionReveal delay={0.08}>
				<NeonPanel corners className='p-5'>
					<p className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// Profile</p>
					<dl className='mt-4 space-y-4'>
						{FACTS.map(f => (
							<div key={f.label} className='flex items-start gap-3'>
								<CyberIcon icon={f.icon} className='text-cyber-cyan mt-0.5 size-4 shrink-0' />
								<div>
									<dt className='text-muted-foreground font-mono text-[0.6rem] tracking-widest uppercase'>{f.label}</dt>
									<dd className='mt-0.5 text-sm font-semibold'>{f.value}</dd>
								</div>
							</div>
						))}
					</dl>
				</NeonPanel>
			</MotionReveal>
		</div>
	</section>
)

export default AboutSection
