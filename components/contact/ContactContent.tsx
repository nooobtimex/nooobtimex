import React from 'react'
import ChannelCard from '@/components/contact/ChannelCard'
import VCardPanel from '@/components/contact/VCardPanel'
import WeChatPanel from '@/components/contact/WeChatPanel'
import Container from '@/components/cyber/Container'
import CyberButton from '@/components/cyber/CyberButton'
import CyberIcon from '@/components/cyber/CyberIcon'
import CyberTag from '@/components/cyber/CyberTag'
import GlitchText from '@/components/cyber/GlitchText'
import MotionReveal from '@/components/cyber/MotionReveal'
import NeonPanel from '@/components/cyber/NeonPanel'
import SectionHeader from '@/components/cyber/SectionHeader'
import { HIRE_LINK_LABEL, HireDestination, HireSteps } from '@/components/hire/HireBand'
import HireButton from '@/components/hire/HireButton'
import { buildVCard, vCardFilename } from '@/lib/vcard'
import { latestRole, personalData } from '@/common'

const PLATFORM_LABEL: Record<string, string> = {
	github: 'GitHub',
	linkedin: 'LinkedIn',
	youtube: 'YouTube',
	instagram: 'Instagram',
	email: 'Email',
	website: 'Website'
}

const ContactContent: React.FC = () => {
	const channels = personalData.contactChannels ?? []
	const wechat = channels.find(c => c.id === 'wechat' && c.qr)
	// WeChat gets its own QR panel; everything else renders as a row in the channel list.
	const listed = channels.filter(c => c !== wechat && c.value)

	return (
		<Container className='py-12 md:py-16'>
			{/* HEADER — deliberately NOT wrapped in MotionReveal. The reveal starts at
			    opacity 0 and depends on an IntersectionObserver callback; if that never
			    fires the content stays invisible. The page's identity block must not be
			    contingent on that, and the other pages render their headers eagerly too. */}
			<p className='text-cyber-cyan font-mono text-xs tracking-[0.35em] uppercase'>// Get in touch</p>
			<h1 className='font-display mt-3 text-5xl leading-[0.9] font-bold tracking-tight uppercase md:text-7xl'>
				<GlitchText text='Contact' />
			</h1>
			<p className='text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed'>
				Every project starts with a message on Fastwork — chat, agree on scope, and pay through the platform. For
				anything else, the card and channels further down reach me directly.
			</p>

			<div className='mt-6 flex flex-wrap gap-2'>
				<CyberTag icon='mdi:map-marker-outline'>{personalData.contact.location}</CyberTag>
				<CyberTag icon='mdi:home-outline'>Remote</CyberTag>
				<CyberTag icon='mdi:clock-outline'>ICT · UTC+7</CyberTag>
				<CyberTag icon='mdi:translate' tone='magenta'>
					{personalData.languages.map(l => l.code.toUpperCase()).join(' / ')}
				</CyberTag>
			</div>

			{/* PRIMARY — FASTWORK. The page's one call to action, so it sits straight under the
			    header and renders eagerly: never inside MotionReveal, which starts at opacity 0. */}
			<NeonPanel variant='yellow' className='mt-10 p-6 md:p-8'>
				<p className='text-cyber-yellow font-mono text-xs tracking-[0.3em] uppercase'>// Hire on Fastwork</p>
				<a
					href={personalData.hire.url}
					target='_blank'
					rel='noopener noreferrer'
					className='font-display hover:text-cyber-yellow mt-3 block text-lg font-bold tracking-wide break-all transition-colors sm:text-2xl md:text-3xl'>
					{HIRE_LINK_LABEL}
				</a>
				<p className='text-muted-foreground mt-3 flex items-start gap-2 text-sm'>
					<CyberIcon icon='mdi:circle' className='text-cyber-green mt-1.5 size-2 shrink-0' />
					{personalData.contact.availability}
				</p>

				<HireSteps className='mt-6' />

				<div className='mt-6 flex flex-wrap gap-3'>
					<HireButton size='lg' />
					<CyberButton href='/card/hire' download='nooobtimex-hire-card.png' variant='outline' size='lg'>
						<CyberIcon icon='mdi:download' />
						Hire card (1:1)
					</CyberButton>
				</div>
				<HireDestination className='mt-3' />
			</NeonPanel>

			{/* Availability and scope — the context behind the hire panel above, so it renders
			    eagerly too, ahead of the channel list rather than waiting on a scroll reveal. */}
			<div className='border-border/60 mt-12 border-t pt-8'>
				<h2 className='font-display text-xl font-bold tracking-wide uppercase'>Working together</h2>
				<p className='text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed'>
					{personalData.contact.availability}. Based in {personalData.contact.location}, Thailand — that is UTC+7, so
					mornings here overlap the working day across East Asia and Australia, while afternoons and early evenings
					overlap a full European morning. Work is remote by default, in{' '}
					{personalData.languages.map(l => l.name).join(' or ')}.
				</p>
				<p className='text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed'>
					The freelance work is web applications taken end to end — scoping and design through full-stack delivery,
					deployment and the infrastructure underneath. Recent builds include a flood and water-level monitoring
					dashboard, a real-time multiplayer game, and a QR-code restaurant ordering and multi-branch management
					platform. Day to day the stack is Next.js and React on the front, Node and Postgres behind it, containerized
					and shipped through GitHub CI/CD.
				</p>
				<p className='text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed'>
					Projects start on Fastwork, so the scope, the quote and the payment all live in one place. The card and
					channels below are for everything else, badged with whether they work inside mainland China.
				</p>
			</div>

			{/* SCAN-ME PANELS */}
			<MotionReveal delay={0.1}>
				<SectionHeader
					title='Scan me'
					subtitle='Two codes: one saves me to your phone, one adds me on WeChat.'
					className='mt-16'
				/>
				<div className='mt-8 grid gap-6 md:grid-cols-2'>
					{/* Built here, on the server, and handed over as strings — see VCardPanel. */}
					<VCardPanel
						name={personalData.name}
						qrPayload={buildVCard(personalData, { org: latestRole?.organization.name })}
						filePayload={buildVCard(personalData, { rich: true, org: latestRole?.organization.name })}
						filename={vCardFilename(personalData)}
					/>
					{wechat && <WeChatPanel channel={wechat} />}
				</div>
			</MotionReveal>

			{/* DIRECT CHANNELS */}
			{listed.length > 0 && (
				<MotionReveal delay={0.15}>
					<SectionHeader
						title='Direct channels'
						subtitle='Messaging apps, with mainland-China availability marked.'
						className='mt-16'
					/>
					<div className='mt-8 grid gap-3 sm:grid-cols-2'>
						{listed.map(channel => (
							<ChannelCard
								key={channel.id}
								icon={channel.icon}
								label={channel.label}
								value={channel.value}
								url={channel.url}
								inChina={channel.inChina}
								note={channel.note}
								external={channel.id !== 'phone'}
							/>
						))}
					</div>
				</MotionReveal>
			)}

			{/* SOCIALS */}
			<MotionReveal delay={0.2}>
				<SectionHeader title='Elsewhere' subtitle='Profiles and long-form output.' className='mt-16' />
				<div className='mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
					{personalData.socialLinks.map(social => (
						<a
							key={social.platform}
							href={social.url}
							target={social.platform === 'email' ? undefined : '_blank'}
							rel='noopener noreferrer'
							className='group border-border hover:border-cyber-cyan/60 hover:bg-cyber-cyan/[0.04] clip-notch-sm flex items-center gap-3 border px-4 py-3 transition-colors'>
							<CyberIcon
								icon={social.icon}
								className='text-muted-foreground group-hover:text-cyber-cyan size-5 shrink-0 transition-colors'
							/>
							<span className='min-w-0'>
								<span className='block text-xs font-semibold tracking-wide uppercase'>
									{PLATFORM_LABEL[social.platform] ?? social.platform}
								</span>
								<span className='text-muted-foreground block truncate font-mono text-[0.7rem]'>{social.username}</span>
							</span>
						</a>
					))}
				</div>
			</MotionReveal>
		</Container>
	)
}

export default ContactContent
