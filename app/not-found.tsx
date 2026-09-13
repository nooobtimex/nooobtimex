import type { Metadata } from 'next'
import Link from 'next/link'
import CyberIcon from '@/components/cyber/CyberIcon'
import GlitchText from '@/components/cyber/GlitchText'
import { NAV_LINKS } from '@/components/navigation/links'

/**
 * A 404 is a real 404 — `dynamicParams = false` on the `[...id]` routes stopped unknown
 * slugs from streaming a 200 through the old root `app/loading.tsx` (since deleted). That
 * makes this page the actual destination for every mistyped or stale inbound link, so it
 * carries recovery links rather than a single "Return Home" and a dead end.
 */
export const metadata: Metadata = {
	title: 'Not Found',
	robots: { index: false, follow: true }
}

export default function NotFound() {
	return (
		<div className='bg-background relative flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center'>
			<div className='cyber-grid pointer-events-none absolute inset-0 opacity-25' />
			<GlitchText text='404' className='neon-text-magenta font-display text-8xl font-bold tracking-tight md:text-9xl' />
			<p className='text-cyber-cyan mt-2 font-mono text-sm tracking-[0.4em] uppercase'>// Signal Lost</p>
			<p className='text-muted-foreground mt-4 max-w-md'>
				This sector of the grid doesn&apos;t exist. The route may have been moved or never deployed.
			</p>

			<Link
				href='/'
				className='bg-cyber-yellow clip-notch-sm hover:bg-cyber-yellow/80 mt-8 inline-flex items-center gap-2 px-5 py-3 font-mono text-xs font-semibold tracking-widest text-black uppercase transition-colors'>
				<CyberIcon icon='mdi:home-variant-outline' className='size-4' /> Return Home
			</Link>

			{/* Crawlable recovery links — the same nav the rest of the site uses, so a crawler
			    that lands here still reaches every section instead of hitting a dead end. */}
			<nav aria-label='Site sections' className='mt-10 w-full max-w-lg'>
				<p className='text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase'>// Reroute</p>
				<ul className='mt-4 flex flex-wrap justify-center gap-2'>
					{NAV_LINKS.filter(l => l.href !== '/').map(link => (
						<li key={link.href}>
							<Link
								href={link.href}
								className='border-border text-muted-foreground hover:border-cyber-cyan hover:text-cyber-cyan clip-notch-sm inline-flex border px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors'>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	)
}
