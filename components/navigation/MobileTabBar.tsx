'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { cyberButtonVariants } from '@/components/cyber/CyberButton'
import { LEGAL_LINKS, MOBILE_TABS, NAV_LINKS, isActive } from '@/components/navigation/links'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const cellClass = (active: boolean) =>
	cn(
		'relative flex flex-col items-center justify-center gap-1 transition-colors',
		active ? 'text-cyber-yellow' : 'text-muted-foreground hover:text-foreground'
	)

interface MobileTabBarProps {
	/** `personalData.hire.url`, passed by the server layout — a client module cannot import `@/common`. */
	hireUrl: string
}

/**
 * App-style bottom navigation below lg — phones and tablets, wherever NavBar's header links
 * are hidden. Four link tabs plus a Menu cell whose sheet lists every section, so no page is
 * reachable only through search or the footer.
 *
 * z-40 is deliberate: every overlay in this repo sits at z-50 (Sheet, Dialog, the ⌘K
 * CommandDialog, Tooltip) and the sticky header is z-50 too. Sitting below them means
 * dialogs occlude this bar structurally, without depending on portal DOM order — and it
 * stops the bar floating over the iOS soft keyboard. The decorative ScanlineOverlay is
 * z-30, under the bar, so it never dims the tabs.
 *
 * These are navigation links, not tabs in the ARIA sense, so `aria-current='page'` is
 * correct and `role='tablist'`/`aria-selected` would be wrong (that pattern implies
 * same-page panel switching).
 */
const MobileTabBar: React.FC<MobileTabBarProps> = ({ hireUrl }) => {
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = React.useState(false)
	// Lit when the open page belongs to a section without a tab of its own (Skills, Contact…),
	// so the bar always says where the visitor is.
	const menuActive = menuOpen || !MOBILE_TABS.some(link => isActive(pathname, link))
	const closeMenu = () => setMenuOpen(false)

	return (
		<nav
			aria-label='Primary'
			// The safe-area bottom padding clears the iOS home indicator. It only resolves to
			// a non-zero value because app/layout.tsx sets viewportFit to cover.
			// NB: never write a bracket-utility example in a comment here — Tailwind v4 scans
			// this file as plain text and will try to compile it into real (invalid) CSS.
			className='border-cyber-cyan/25 bg-background/90 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden print:hidden'>
			<ul className='grid h-14 grid-cols-5'>
				{MOBILE_TABS.map(link => {
					const active = isActive(pathname, link)
					return (
						<li key={link.href} className='contents'>
							<Link href={link.href} aria-current={active ? 'page' : undefined} className={cellClass(active)}>
								{active && <span className='bg-cyber-yellow absolute inset-x-4 top-0 h-px' />}
								<Icon icon={link.icon} className='size-5' />
								<span className='font-mono text-[0.65rem] tracking-widest uppercase'>{link.label}</span>
							</Link>
						</li>
					)
				})}
				<li className='contents'>
					<button
						type='button'
						onClick={() => setMenuOpen(true)}
						aria-haspopup='dialog'
						aria-expanded={menuOpen}
						className={cellClass(menuActive)}>
						{menuActive && <span className='bg-cyber-yellow absolute inset-x-4 top-0 h-px' />}
						<Icon icon='mdi:menu' className='size-5' />
						<span className='font-mono text-[0.65rem] tracking-widest uppercase'>Menu</span>
					</button>
				</li>
			</ul>

			<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
				<SheetContent
					side='bottom'
					className='bg-background border-cyber-cyan/25 gap-5 px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]'>
					<SheetTitle className='font-display text-lg font-bold tracking-widest uppercase'>Menu</SheetTitle>
					<ul className='grid grid-cols-2 gap-2'>
						{NAV_LINKS.map(link => {
							const active = isActive(pathname, link)
							return (
								<li key={link.href}>
									<Link
										href={link.href}
										onClick={closeMenu}
										aria-current={active ? 'page' : undefined}
										className={cn(
											'clip-notch-sm flex items-center gap-3 border px-3 py-3 font-mono text-xs tracking-widest uppercase transition-colors',
											active ?
												'border-cyber-yellow/60 text-cyber-yellow'
											:	'border-border text-muted-foreground hover:border-cyber-cyan/50 hover:text-foreground'
										)}>
										<Icon icon={link.icon} className='size-5 shrink-0' />
										{link.label}
									</Link>
								</li>
							)
						})}
					</ul>
					<a
						href={hireUrl}
						target='_blank'
						rel='noopener noreferrer'
						onClick={closeMenu}
						className={cn(cyberButtonVariants({ size: 'lg' }), 'w-full justify-center')}>
						<Icon icon='mdi:handshake-outline' />
						Hire me on Fastwork
						<Icon icon='mdi:arrow-top-right' />
						<span className='sr-only'> (opens in a new tab)</span>
					</a>
					<div className='flex justify-center gap-4'>
						{LEGAL_LINKS.map(l => (
							<Link
								key={l.href}
								href={l.href}
								onClick={closeMenu}
								className='text-muted-foreground hover:text-cyber-cyan font-mono text-xs tracking-widest uppercase'>
								{l.label}
							</Link>
						))}
					</div>
				</SheetContent>
			</Sheet>
		</nav>
	)
}

export default MobileTabBar
