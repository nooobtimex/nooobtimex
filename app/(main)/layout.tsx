import type { ReactNode } from 'react'
import NavBar from '@/components/navigation/NavBar'
import NavFooter from '@/components/navigation/NavFooter'

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col'>
			<a
				href='#main'
				className='bg-brand sr-only z-[200] rounded-md px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3'>
				Skip to content
			</a>
			<NavBar />
			<main id='main' className='min-w-0 flex-1'>
				{children}
			</main>
			<NavFooter />
		</div>
	)
}
