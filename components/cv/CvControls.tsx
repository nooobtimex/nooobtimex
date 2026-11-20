'use client'
import Link from 'next/link'
import { actionVariants } from '@/components/site/Action'

export default function CvControls() {
	return (
		<div className='bg-background/95 fixed inset-x-0 bottom-0 z-50 flex flex-wrap justify-center gap-3 border-t px-4 py-4 backdrop-blur print:hidden'>
			<button onClick={() => window.print()} className={actionVariants()}>
				Print / save PDF
			</button>
			<Link href='/cv/presentation' className={actionVariants({ variant: 'outline' })}>
				Presentation →
			</Link>
		</div>
	)
}
