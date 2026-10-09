'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { MOBILE_TABS, isActive } from '@/components/navigation/links'
import { cn } from '@/lib/utils'

/**
 * App-style bottom navigation below xl — phones and tablets, wherever NavBar's nine desktop
 * links don't fit. Replaces the old hamburger Sheet.
 *
 * z-40 is deliberate: every overlay in this repo sits at z-50 (Sheet, Dialog, the ⌘K
 * CommandDialog, Tooltip, the loading splash) and the sticky header is z-50 too. Sitting
 * below them means dialogs occlude this bar structurally, without depending on portal DOM
 * order — and it stops the bar floating over the iOS soft keyboard.
 *
 * These are navigation links, not tabs in the ARIA sense, so `aria-current='page'` is
 * correct and `role='tablist'`/`aria-selected` would be wrong (that pattern implies
 * same-page panel switching).
 */
const MobileTabBar: React.FC = () => {
	const pathname = usePathname()

	return (
		<nav
			aria-label='Primary'
			// The safe-area bottom padding clears the iOS home indicator. It only resolves to
			// a non-zero value because app/layout.tsx sets viewportFit to cover.
			// NB: never write a bracket-utility example in a comment here — Tailwind v4 scans
			// this file as plain text and will try to compile it into real (invalid) CSS.
			className='border-cyber-cyan/25 bg-background/90 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md xl:hidden print:hidden'>
			<ul className='grid h-14 grid-cols-4'>
				{MOBILE_TABS.map(link => {
					const active = isActive(pathname, link.href)
					return (
						<li key={link.href} className='contents'>
							<Link
								href={link.href}
								aria-current={active ? 'page' : undefined}
								className={cn(
									'relative flex flex-col items-center justify-center gap-1 transition-colors',
									active ? 'text-cyber-yellow' : 'text-muted-foreground hover:text-foreground'
								)}>
								{active && <span className='bg-cyber-yellow absolute inset-x-4 top-0 h-px' />}
								<Icon icon={link.icon} className='size-5' />
								<span className='font-mono text-[0.6rem] tracking-widest uppercase'>{link.label}</span>
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export default MobileTabBar
