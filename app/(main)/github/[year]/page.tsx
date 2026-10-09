import React from 'react'
import type { Metadata } from 'next'
import Container from '@/components/cyber/Container'
import GithubIntro from '@/components/github/GithubIntro'
import GithubStats from '@/components/github/GithubStats'
import { type GithubPeriod, githubYears } from '@/lib/github'
import { pageMetadata } from '@/lib/seo'

/**
 * One prerendered page per calendar year since the account opened — every way the
 * period filter can slice the stats is built ahead of time, never computed per visitor.
 * Next year is included so a December deploy already has January's page; it holds zeros
 * until then and stays unlinked (the filter lists years up to the current one).
 */
export const generateStaticParams = () => githubYears(new Date().getUTCFullYear() + 1).map(year => ({ year }))

// An unknown year is a 404 at the routing layer, never a 200 "no data" page (CLAUDE.md, SEO #2).
export const dynamicParams = false

/** Refreshed once a day, like `/github` — the current year keeps moving. */
export const revalidate = 86400

interface Props {
	params: Promise<{ year: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { year } = await params
	return pageMetadata({
		path: `/github/${year}`,
		title: `GitHub ${year}`,
		description: `GitHub contribution activity in ${year} — heatmap, streaks, monthly cadence and weekday rhythm.`,
		index: false
	})
}

const GithubYearPage = async ({ params }: Props) => {
	const year = (await params).year as GithubPeriod
	return (
		<Container as='section' className='py-12 md:py-16'>
			<GithubIntro variant='page' year={year} />
			<GithubStats variant='page' period={year} />
		</Container>
	)
}

export default GithubYearPage
