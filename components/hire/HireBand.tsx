import React from 'react'
import Container from '@/components/cyber/Container'
import CyberButton from '@/components/cyber/CyberButton'
import CyberIcon from '@/components/cyber/CyberIcon'
import NeonPanel from '@/components/cyber/NeonPanel'
import SectionHeader from '@/components/cyber/SectionHeader'
import HireButton from '@/components/hire/HireButton'
import { cn, hireLinkLabel } from '@/lib/utils'
import { personalData } from '@/common'

/** `fastwork.co/byob/…` — the hire link as text. Typed or copied, it still credits the client to this seller. */
export const HIRE_LINK_LABEL = hireLinkLabel(personalData.hire.url)

/*
 * Kept to what is true of every Fastwork hire: chatting is free, the deal is agreed on
 * the platform, and payment runs through it. Nothing here promises a specific
 * buyer-protection term — those are Fastwork's to state, and they change.
 */
const STEPS = [
	{
		icon: 'mdi:chat-outline',
		title: 'Chat on Fastwork',
		body: 'Tell me what you need. Asking costs nothing and commits you to nothing.'
	},
	{
		icon: 'mdi:file-document-edit-outline',
		title: 'Agree on scope',
		body: 'I reply with the scope, a timeline and a quote you accept on Fastwork.'
	},
	{
		icon: 'mdi:rocket-launch-outline',
		title: 'Build & ship',
		body: 'Payment runs through Fastwork. I build, deploy and hand it over.'
	}
] as const

/** The three-step "how hiring works" row — on the home hire band and on /contact. */
export const HireSteps: React.FC<{ className?: string }> = ({ className }) => (
	<ol className={cn('grid gap-3 sm:grid-cols-3', className)}>
		{STEPS.map((step, i) => (
			<li key={step.title} className='border-border/60 bg-background/40 border p-4'>
				<div className='flex items-center gap-2'>
					<span className='text-cyber-yellow font-mono text-xs'>{String(i + 1).padStart(2, '0')}</span>
					<CyberIcon icon={step.icon} className='text-cyber-cyan size-4' />
					<p className='font-display text-sm font-bold tracking-wide uppercase'>{step.title}</p>
				</div>
				<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{step.body}</p>
			</li>
		))}
	</ol>
)

/** Small print under a hire button: where it goes, before the click. */
export const HireDestination: React.FC<{ className?: string }> = ({ className }) => (
	<p className={cn('text-muted-foreground font-mono text-[0.65rem] tracking-wider uppercase', className)}>
		Opens {HIRE_LINK_LABEL} in a new tab
	</p>
)

/**
 * One-line hire prompt for the end of a detail page — a project or a Journal post is
 * where a reader has just seen the work, so it is where the ask lands best.
 */
export const HireStrip: React.FC<{ heading: string; className?: string }> = ({ heading, className }) => (
	<NeonPanel
		variant='yellow'
		className={cn(
			'clip-notch-sm mt-12 flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6',
			className
		)}>
		<div>
			<p className='text-cyber-yellow font-mono text-[0.65rem] tracking-[0.3em] uppercase'>// Open for freelance</p>
			<p className='font-display mt-1 text-xl font-bold tracking-wide uppercase md:text-2xl'>{heading}</p>
			<p className='text-muted-foreground mt-1 text-sm'>
				Remote web app work, scoped and shipped end to end — start with a message on Fastwork.
			</p>
		</div>
		<HireButton className='shrink-0' />
	</NeonPanel>
)

/**
 * The home page's closing section: the full ask, how hiring works, and the CV for anyone
 * who wants the long version first. Replaces the old CV teaser, whose two links live on here.
 */
const HireBand: React.FC = () => (
	<Container as='section' className='mt-20 pb-10'>
		<SectionHeader title='Hire me' subtitle='Remote freelance web app projects, scoped and shipped end to end.' />

		<NeonPanel variant='yellow' corners className='mt-8 p-6 md:p-10'>
			<p className='text-cyber-yellow font-mono text-xs tracking-[0.3em] uppercase'>// Open for freelance</p>
			<h3 className='font-display mt-3 text-3xl leading-none font-bold tracking-wide uppercase md:text-5xl'>
				Got a web app to build?
			</h3>
			<p className='text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed'>
				One engineer accountable for all of it — from the first message to the deploy. Here is how a project starts.
			</p>

			<HireSteps className='mt-8' />

			<div className='mt-8 flex flex-wrap items-center gap-3'>
				<HireButton size='lg' />
				<CyberButton href='/cv' variant='outline' size='lg'>
					<CyberIcon icon='mdi:file-document-outline' /> View CV
				</CyberButton>
				<CyberButton href='/cv/presentation' variant='ghost' size='lg'>
					<CyberIcon icon='mdi:presentation' /> Presentation
				</CyberButton>
			</div>
			<HireDestination className='mt-4' />
		</NeonPanel>
	</Container>
)

export default HireBand
