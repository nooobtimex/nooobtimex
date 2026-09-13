import React from 'react'
import ChannelCard from '@/components/contact/ChannelCard'
import CopyButton from '@/components/contact/CopyButton'
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
			<p className='text-cyber-cyan font-mono text-xs tracking-[0.35em] uppercase'>// COMMS_CHANNEL</p>
			<h1 className='font-display mt-3 text-5xl leading-[0.9] font-bold tracking-tight uppercase md:text-7xl'>
				<GlitchText text='Get in touch' />
			</h1>
			<p className='text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed'>
				Scan the card, save me in one tap. Channels are badged with whether they work inside mainland China — useful if
				we&apos;re meeting somewhere the usual apps don&apos;t reach.
			</p>

			<div className='mt-6 flex flex-wrap gap-2'>
				<CyberTag icon='mdi:map-marker-outline'>{personalData.contact.location}</CyberTag>
				<CyberTag icon='mdi:home-outline'>Remote</CyberTag>
				<CyberTag icon='mdi:clock-outline'>ICT · UTC+7</CyberTag>
				<CyberTag icon='mdi:translate' tone='magenta'>
					{personalData.languages.map(l => l.code.toUpperCase()).join(' / ')}
				</CyberTag>
			</div>

			{/* Availability and scope. This is the block that answers the question someone
			    actually arrives on this page with, so it renders eagerly above the channel
			    list rather than waiting on a scroll reveal. */}
			<div className='border-border/60 mt-10 border-t pt-8'>
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
					Email is the fastest route and the one that reaches me wherever I am. The channels below are badged with
					whether they work inside mainland China.
				</p>
			</div>

			{/* PRIMARY — EMAIL. Also eager: it is the page's main call to action and sits
			    above the fold, so it must not wait on a scroll observer. */}
			<NeonPanel variant='yellow' className='mt-10 p-6 md:p-8'>
				<p className='text-cyber-yellow font-mono text-xs tracking-[0.3em] uppercase'>// Preferred</p>
				<div className='mt-3 flex flex-wrap items-center gap-3'>
					<a
						href={`mailto:${personalData.contact.email}`}
						className='font-display hover:text-cyber-yellow text-2xl font-bold tracking-wide break-all transition-colors md:text-3xl'>
						{personalData.contact.email}
					</a>
					<CopyButton value={personalData.contact.email} label='Copy email' />
				</div>
				<p className='text-muted-foreground mt-3 flex items-start gap-2 text-sm'>
					<CyberIcon icon='mdi:circle' className='text-cyber-green mt-1.5 size-2 shrink-0' />
					{personalData.contact.availability}
				</p>
				<div className='mt-5 flex flex-wrap gap-3'>
					<CyberButton href={`mailto:${personalData.contact.email}`} external size='lg'>
						<CyberIcon icon='mdi:email-outline' />
						Send an email
					</CyberButton>
					<CyberButton href='/card/hire' download='nooobtimex-hire-card.png' variant='outline' size='lg'>
						<CyberIcon icon='mdi:download' />
						Hire card (1:1)
					</CyberButton>
				</div>
			</NeonPanel>

			{/* SCAN-ME PANELS */}
			<MotionReveal delay={0.1}>
				<SectionHeader
					code='07'
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
						code='08'
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
				<SectionHeader code='09' title='Elsewhere' subtitle='Profiles and long-form output.' className='mt-16' />
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
