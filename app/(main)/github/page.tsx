import React from 'react'
import Container from '@/components/cyber/Container'
import GithubIntro from '@/components/github/GithubIntro'
import GithubStats from '@/components/github/GithubStats'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
	path: '/github',
	title: 'GitHub',
	description: 'Live GitHub contribution activity — heatmap, streaks, repos, stars, and followers.',
	// A dashboard of API numbers under one paragraph, with a page per year.
	// Useful to a visitor, nothing a search result needs — and absent from the sitemap.
	index: false
})

/** Prerendered, then refreshed once a day — the same cadence as the GitHub fetches it reads. */
export const revalidate = 86400

/**
 * The trailing 12 months. Each calendar year is its own prerendered page under
 * `/github/[year]` — this route used to read `?year=`, which made it the one page rendered
 * per request, behind the site's only Suspense boundary and a loading skeleton.
 */
const GithubPage: React.FC = () => (
	<Container as='section' className='py-12 md:py-16'>
		<GithubIntro variant='page' year='last' />
		<GithubStats variant='page' period='last' />
	</Container>
)

export default GithubPage
