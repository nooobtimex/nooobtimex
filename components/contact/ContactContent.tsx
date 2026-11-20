import React from 'react'
import ChannelCard from '@/components/contact/ChannelCard'
import VCardPanel from '@/components/contact/VCardPanel'
import WeChatPanel from '@/components/contact/WeChatPanel'
import Action from '@/components/site/Action'
import Container from '@/components/site/Container'
import ContentBlock from '@/components/site/ContentBlock'
import Panel from '@/components/site/Panel'
import SectionHeader from '@/components/site/SectionHeader'
import SiteIcon from '@/components/site/SiteIcon'
import Tag from '@/components/site/Tag'
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
			<SectionHeader as='h1' title='Contact' subtitle='Follow what I’m building, swap ideas, or just say hello.' />
			<p className='text-muted-foreground mt-6 max-w-2xl text-base'>
				I’m based in Nonthaburi, Thailand. My work is focused on RS TROPHY, Thaibotic, and my own projects. Email is the
				simplest way to reach me.
			</p>
			<Panel className='comic-contact-email mt-8 p-6 md:p-8'>
				<p className='eyebrow'>Say hello</p>
				<a
					href={personalData.contactAction.url}
					className='text-brand mt-3 block text-xl font-semibold break-all md:text-3xl'>
					{personalData.contact.email} ↗
				</a>
				<div className='mt-5 flex flex-wrap gap-2'>
					<Tag>Nonthaburi, Thailand</Tag>
					<Tag>ICT · UTC+7</Tag>
					<Tag>Thai / English</Tag>
				</div>
				<Action href='/card/hire' download='nooobtimex-profile-card.png' variant='outline' className='mt-6'>
					Download profile card
				</Action>
			</Panel>

			{/* SCAN-ME PANELS */}
			<ContentBlock delay={0.1}>
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
			</ContentBlock>

			{/* DIRECT CHANNELS */}
			{listed.length > 0 && (
				<ContentBlock delay={0.15}>
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
				</ContentBlock>
			)}

			{/* SOCIALS */}
			<ContentBlock delay={0.2}>
				<SectionHeader title='Elsewhere' subtitle='Profiles and long-form output.' className='mt-16' />
				<div className='mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
					{personalData.socialLinks.map(social => (
						<a
							key={social.platform}
							href={social.url}
							target={social.platform === 'email' ? undefined : '_blank'}
							rel='noopener noreferrer'
							className='group border-border hover:border-brand/60 hover:bg-brand/[0.04] flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors'>
							<SiteIcon
								icon={social.icon}
								className='text-muted-foreground group-hover:text-brand size-5 shrink-0 transition-colors'
							/>
							<span className='min-w-0'>
								<span className='block text-xs font-semibold tracking-normal'>
									{PLATFORM_LABEL[social.platform] ?? social.platform}
								</span>
								<span className='text-muted-foreground block truncate font-sans text-xs'>{social.username}</span>
							</span>
						</a>
					))}
				</div>
			</ContentBlock>
		</Container>
	)
}

export default ContactContent
