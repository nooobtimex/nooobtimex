import React, { Suspense } from 'react'
import Container from '@/components/cyber/Container'
import GithubIntro from '@/components/github/GithubIntro'
import GithubStats, { GithubStatsSkeleton } from '@/components/github/GithubStats'
import { resolveGithubYear } from '@/lib/github'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
	path: '/github',
	title: 'GitHub',
	description: 'Live GitHub contribution activity — heatmap, streaks, repos, stars, and followers.'
})

/**
 * The one route with a Suspense boundary, and it is scoped to the numbers on purpose.
 *
 * This page renders per request (it reads `searchParams`), so without a boundary a client
 * navigation here would wait on the GitHub fetches with no feedback. Wrapping the whole
 * page — what the old root `app/loading.tsx` did — would hide the heading and prose too:
 * React outlines a completed boundary into a `hidden` segment once the response grows
 * past its chunk size. So the intro stays outside and only the stats stream.
 *
 * `key` remounts the boundary per year, so switching years shows the skeleton instead of
 * leaving the previous year's numbers under the new year's heading.
 */
const GithubPage = async ({ searchParams }: { searchParams: Promise<{ year?: string }> }) => {
	const year = resolveGithubYear('page', (await searchParams).year)

	return (
		<Container as='section' className='py-12 md:py-16'>
			<GithubIntro variant='page' year={year} />
			<Suspense key={year} fallback={<GithubStatsSkeleton />}>
				<GithubStats variant='page' year={year} />
			</Suspense>
		</Container>
	)
}

export default GithubPage
