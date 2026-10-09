import React from 'react'
import MobileTabBar from '@/components/navigation/MobileTabBar'
import NavBar from '@/components/navigation/NavBar'
import NavFooter from '@/components/navigation/NavFooter'
import { personalData } from '@/common'

export default function MainLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		// The bottom padding clears MobileTabBar (h-14 = 3.5rem, plus the iOS home indicator).
		// It goes on this wrapper rather than on <main> so the footer's last row isn't
		// occluded either. Scoping the bar to (main) keeps /cv — which has its own fixed
		// bottom controls and lives outside this group — untouched.
		<div className='relative flex min-h-screen flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0'>
			{/*
			 * Skip link. NavBar carries five section links plus the search trigger, so
			 * without this a keyboard or screen-reader user tabs through the whole nav on
			 * every page before reaching content. Visually hidden until focused.
			 */}
			<a
				href='#main'
				className='focus:bg-cyber-yellow sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-semibold focus:tracking-widest focus:text-black focus:uppercase'>
				Skip to content
			</a>
			{/* NavBar is a client component and may not import @/common, so the hire URL comes in as a prop. */}
			<NavBar hireUrl={personalData.hire.url} />
			<main id='main' className='flex-1'>
				{children}
			</main>
			<NavFooter />
			<MobileTabBar hireUrl={personalData.hire.url} />
		</div>
	)
}
