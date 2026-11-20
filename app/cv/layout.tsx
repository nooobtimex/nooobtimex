import React from 'react'
import { pageMetadata } from '@/lib/seo'

/**
 * `app/cv/page.tsx` is `'use client'`, so it cannot export metadata itself. This
 * layout carries it — without it the CV (the richest page on the site, ~1,400
 * words) inherited the root title and had no canonical of its own.
 */
export const metadata = pageMetadata({
	path: '/cv',
	title: 'CV',
	description:
		'Full curriculum vitae — roles, education, technical skills and shipped projects, with a print-friendly A4 layout.'
})

export default function CvLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
