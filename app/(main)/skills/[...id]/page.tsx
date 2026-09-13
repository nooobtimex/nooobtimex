import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import SkillDetail from '@/components/skills/SkillDetail'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { skillsData } from '@/common'

interface PageProps {
	params: Promise<{ id: string[] }>
}

export function generateStaticParams() {
	return skillsData.map(skill => ({ id: [skill.id] }))
}

/**
 * Unknown slugs must 404 at the routing layer, not render.
 *
 * A page's own `notFound()` is only a real 404 while nothing above the page streams —
 * any Suspense boundary flushes response headers at 200 first. The old root
 * `app/loading.tsx` did exactly that and turned every mistyped detail slug into an
 * indexable soft-404 titled "… Not Found". With `generateStaticParams` above and
 * `dynamicParams` false, Next never enters the segment for an unknown param, so the
 * status no longer depends on what wraps the page.
 */
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { id } = await params
	const skill = skillsData.find(s => s.id === id?.[0])

	if (!skill) return { title: 'Skill Not Found', robots: { index: false, follow: false } }

	return pageMetadata({
		path: `/skills/${skill.id}`,
		title: `${skill.name} | Skill`,
		// Prefer the real copy; the generic line is only a fallback for a skill with none.
		description: skill.description ?? `Projects and work powered by ${skill.name}.`
	})
}

export default async function SkillDetailPage({ params }: PageProps) {
	const { id } = await params
	const skill = skillsData.find(s => s.id === id?.[0])

	if (!skill) notFound()

	const breadcrumbs = breadcrumbSchema([
		{ name: 'Home', path: '/' },
		{ name: 'Skills', path: '/skills' },
		{ name: skill.name, path: `/skills/${skill.id}` }
	])

	return (
		<>
			<JsonLd data={breadcrumbs} />
			<SkillDetail skill={skill} />
		</>
	)
}
