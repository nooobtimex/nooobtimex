'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import Container from '@/components/cyber/Container'
import { NAV_LINKS, isActive } from '@/components/navigation/links'
import { loadSearchIndex } from '@/components/search/loadSearchIndex'
import { cn } from '@/lib/utils'

/**
 * Loaded on demand, not with the nav.
 *
 * NavBar mounts on every page, and the palette is something most visitors never open, so
 * neither its code nor its rows belong in the first-load bundle. `mounted` below keeps the
 * chunk request off the initial load entirely, and the rows are not in any bundle at all:
 * they come from the prerendered `/search-index.json`, which `openSearch` starts fetching
 * alongside the chunk. (The palette used to import the `@/common` arrays itself, and that
 * put every Journal post's full body into a 436 KB chunk.)
 */
const GlobalSearch = dynamic(() => import('@/components/search/GlobalSearch'))

const NavBar: React.FC = () => {
	const pathname = usePathname()
	const [searchOpen, setSearchOpen] = React.useState(false)
	// Latches on first open so the palette keeps its mounted state (and its chunk) after
	// being closed, instead of re-fetching on every ⌘K. Set from the user-intent handlers
	// rather than an effect on `searchOpen` — React Compiler rejects a synchronous setState
	// inside an effect, and the effect bought nothing here anyway.
	const [searchMounted, setSearchMounted] = React.useState(false)

	const openSearch = () => {
		void loadSearchIndex() // race the palette chunk rather than wait behind it
		setSearchMounted(true)
		setSearchOpen(true)
	}

	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				void loadSearchIndex()
				setSearchMounted(true)
				setSearchOpen(o => !o)
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [])

	return (
		<>
			<header className='border-cyber-cyan/25 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md'>
				<Container className='flex h-14 items-center justify-between gap-4'>
					{/* Handle */}
					<Link href='/' className='group flex items-center gap-2'>
						<span className='bg-cyber-yellow inline-block size-2.5 animate-pulse' />
						<span className='font-display text-lg font-bold tracking-widest uppercase'>
							Nooobtime<span className='text-cyber-yellow'>X</span>
						</span>
					</Link>

					{/* Desktop links */}
					<nav className='hidden items-center gap-1 md:flex'>
						{NAV_LINKS.map(link => {
							const active = isActive(pathname, link.href)
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										'group relative px-3 py-2 font-mono text-xs tracking-widest uppercase transition-colors',
										active ? 'text-cyber-yellow' : 'text-muted-foreground hover:text-foreground'
									)}>
									<span className='text-cyber-cyan/50 mr-1'>{link.code}</span>
									{link.label}
									{active && <span className='bg-cyber-yellow absolute right-3 -bottom-px left-3 h-px' />}
								</Link>
							)
						})}
					</nav>

					{/* Right controls. On mobile the search icon is the ONLY header control — the
					    hamburger is gone, replaced by MobileTabBar. Search is what keeps the
					    non-tab routes (Career, Companies, GitHub, CV) one tap away. */}
					<div className='flex items-center gap-2'>
						<button
							onClick={openSearch}
							className='border-border text-muted-foreground hover:border-cyber-cyan/50 hover:text-cyber-cyan hidden items-center gap-2 border px-2.5 py-1.5 font-mono text-xs transition-colors sm:flex'>
							<Icon icon='mdi:magnify' className='size-4' />
							<span className='tracking-wider uppercase'>Search</span>
							<kbd className='border-border bg-muted ml-1 border px-1 text-[0.6rem]'>⌘K</kbd>
						</button>
						<button
							onClick={openSearch}
							aria-label='Search'
							className='text-muted-foreground hover:text-cyber-cyan p-1.5 sm:hidden'>
							<Icon icon='mdi:magnify' className='size-5' />
						</button>
					</div>
				</Container>
			</header>

			{searchMounted && <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />}
		</>
	)
}

export default NavBar
