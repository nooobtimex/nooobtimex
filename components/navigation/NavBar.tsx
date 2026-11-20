'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { loadSearchIndex } from '@/components/search/loadSearchIndex'
import Container from '@/components/site/Container'
import { cn } from '@/lib/utils'
import { HEADER_LINKS, isActive } from './links'

const GlobalSearch = dynamic(() => import('@/components/search/GlobalSearch'))

export default function NavBar() {
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false)
	const [searchOpen, setSearchOpen] = useState(false)
	const [searchMounted, setSearchMounted] = useState(false)
	const openSearch = () => {
		void loadSearchIndex()
		setSearchMounted(true)
		setSearchOpen(true)
		setMenuOpen(false)
	}
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setMenuOpen(false)
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				void loadSearchIndex()
				setSearchMounted(true)
				setSearchOpen(o => !o)
				setMenuOpen(false)
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [])
	return (
		<>
			<header
				className={cn('border-border/80 bg-background/95 sticky top-0 z-50 border-b backdrop-blur-md', 'comic-nav')}>
				<Container className={cn('flex h-20 items-center justify-between gap-4', 'w-full')}>
					<Link
						href='/'
						onClick={() => setMenuOpen(false)}
						className='flex items-center gap-2 text-base font-semibold tracking-tight'
						aria-label='NooobtimeX home'>
						<span className='text-brand'>n.</span>
						<span>NooobtimeX</span>
					</Link>
					<div className='flex items-center gap-3 md:gap-6'>
						<nav aria-label='Main navigation' className='hidden items-center gap-7 md:flex'>
							{HEADER_LINKS.map(link => (
								<Link
									key={link.href}
									href={link.href}
									aria-current={isActive(pathname, link) ? 'page' : undefined}
									className={cn(
										'hover:text-brand py-3 text-sm transition-colors',
										isActive(pathname, link) ? 'text-brand font-semibold' : 'text-muted-foreground'
									)}>
									{link.label}
								</Link>
							))}
						</nav>
						<button
							onClick={openSearch}
							aria-label='Search the site'
							className='text-muted-foreground hover:bg-muted hover:text-brand flex size-11 items-center justify-center rounded-md'>
							<Search className='size-5' />
						</button>
						<button
							onClick={() => setMenuOpen(o => !o)}
							aria-expanded={menuOpen}
							aria-controls='mobile-navigation'
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
							className='hover:bg-muted flex size-11 items-center justify-center rounded-md md:hidden'>
							{menuOpen ?
								<X className='size-5' />
							:	<Menu className='size-5' />}
						</button>
					</div>
				</Container>
				{menuOpen && (
					<nav id='mobile-navigation' aria-label='Mobile navigation' className='border-t px-6 py-4 md:hidden'>
						{HEADER_LINKS.map(link => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMenuOpen(false)}
								aria-current={isActive(pathname, link) ? 'page' : undefined}
								className='hover:bg-muted block rounded-md px-3 py-3 text-base'>
								{link.label}
							</Link>
						))}
					</nav>
				)}
			</header>
			{searchMounted && <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />}
		</>
	)
}
