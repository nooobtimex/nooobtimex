import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CompanyDetail from '@/components/companies/CompanyDetail'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { SITE_URL, pageMetadata } from '@/lib/seo'
import { entitiesData } from '@/common'

interface CompanyDetailPageProps {
	params: Promise<{ id: string[] }>
}

export async function generateStaticParams() {
	return entitiesData.map(org => ({ id: [org.id] }))
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

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
	const { id } = await params
	const org = entitiesData.find(o => o.id === id?.[0])
	if (!org) return { title: 'Company Not Found', robots: { index: false, follow: false } }

	return pageMetadata({
		path: `/companies/${org.id}`,
		title: `${org.name} | Company`,
		description: org.about ?? org.description ?? `Roles and projects at ${org.name}.`
	})
}

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = async ({ params }) => {
	const { id } = await params
	const org = entitiesData.find(o => o.id === id?.[0])
	if (!org) notFound()

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': org.type === 'university' ? 'CollegeOrUniversity' : 'Organization',
		'name': org.name,
		'description': org.about ?? org.description,
		...(org.url && { url: org.url }),
		...(org.logo && { logo: `${SITE_URL}${org.logo}` }),
		...(org.founded && { foundingDate: org.founded }),
		...(org.headquarters && { address: org.headquarters })
	}

	const breadcrumbs = breadcrumbSchema([
		{ name: 'Home', path: '/' },
		{ name: 'Companies', path: '/companies' },
		{ name: org.name, path: `/companies/${org.id}` }
	])

	return (
		<>
			<JsonLd data={jsonLd} />
			<JsonLd data={breadcrumbs} />
			<CompanyDetail organization={org} />
		</>
	)
}

export default CompanyDetailPage
