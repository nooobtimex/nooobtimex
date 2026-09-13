import React from 'react'
import Link from 'next/link'
import Container from '@/components/cyber/Container'
import CyberIcon from '@/components/cyber/CyberIcon'
import { FOOTER_LINKS, LEGAL_LINKS } from '@/components/navigation/links'
import { personalData } from '@/common'

const PLATFORM_LABEL: Record<string, string> = {
	github: 'GitHub',
	linkedin: 'LinkedIn',
	youtube: 'YouTube',
	instagram: 'Instagram',
	email: 'Email',
	website: 'Website',
	twitter: 'Twitter',
	discord: 'Discord'
}

const NavFooter: React.FC = () => {
	return (
		<footer className='border-cyber-cyan/20 bg-background relative z-10 mt-20 border-t'>
			<Container className='grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1.6fr]'>
				{/* Brand */}
				<div>
					<p className='font-display text-2xl font-bold tracking-widest uppercase'>
						Nooobtime<span className='text-cyber-yellow'>X</span>
					</p>
					<p className='text-muted-foreground mt-2 font-mono text-xs tracking-wider'>
						{personalData.name} // Developer
					</p>
					<p className='text-muted-foreground/70 mt-3 max-w-xs text-sm leading-relaxed'>
						Full-stack developer building high-performance web systems.
					</p>
				</div>

				{/* Navigate */}
				<div>
					<h3 className='text-cyber-cyan mb-4 font-mono text-xs tracking-[0.3em] uppercase'>// Navigate</h3>
					<nav className='flex flex-col gap-2'>
						{FOOTER_LINKS.map(l => (
							<Link
								key={l.href}
								href={l.href}
								className='text-muted-foreground hover:text-cyber-yellow w-fit font-mono text-sm tracking-widest uppercase transition-colors'>
								{l.label}
							</Link>
						))}
					</nav>
				</div>

				{/* Connect */}
				<div>
					<h3 className='text-cyber-cyan mb-4 font-mono text-xs tracking-[0.3em] uppercase'>// Connect</h3>
					<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
						{personalData.socialLinks.map(s => (
							<a
								key={s.platform}
								href={s.url}
								target={s.platform === 'email' ? undefined : '_blank'}
								rel='noopener noreferrer'
								className='group border-border hover:border-cyber-cyan/60 hover:bg-cyber-cyan/[0.04] clip-notch-sm flex items-center gap-3 border px-3 py-2.5 transition-colors'>
								<CyberIcon
									icon={s.icon}
									className='text-muted-foreground group-hover:text-cyber-cyan size-5 shrink-0 transition-colors'
								/>
								<span className='min-w-0'>
									<span className='block text-xs font-semibold tracking-wide uppercase'>
										{PLATFORM_LABEL[s.platform] ?? s.platform}
									</span>
									<span className='text-muted-foreground block truncate font-mono text-[0.65rem]'>{s.username}</span>
								</span>
							</a>
						))}
					</div>
				</div>
			</Container>

			<div className='border-border/50 text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t px-4 py-4 text-center font-mono text-[0.65rem] tracking-widest uppercase md:px-6'>
				<span>
					© {new Date().getFullYear()} {personalData.name} — All systems operational
				</span>
				{LEGAL_LINKS.map(l => (
					<Link
						key={l.href}
						href={l.href}
						className='hover:text-cyber-cyan underline-offset-4 transition-colors hover:underline'>
						{l.label}
					</Link>
				))}
			</div>
		</footer>
	)
}

export default NavFooter
