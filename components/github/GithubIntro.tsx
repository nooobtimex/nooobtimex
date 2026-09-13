import React from 'react'
import Link from 'next/link'
import CyberIcon from '@/components/cyber/CyberIcon'
import SectionHeader from '@/components/cyber/SectionHeader'
import { USERNAME } from '@/lib/github'

/**
 * The heading and framing prose of the GitHub section — everything that does not depend
 * on the API.
 *
 * Split out of `GithubStats` so `/github` can render it OUTSIDE the Suspense boundary
 * that wraps the numbers. Inside a boundary it would stream with them, and React
 * outlines a completed boundary into a hidden segment once the response is large, so the
 * page's only prose would ship invisible to anything that doesn't run JavaScript.
 */
const GithubIntro: React.FC<{ variant: 'home' | 'page'; year: string }> = ({ variant, year }) => (
	<>
		{/* On home the hero owns the h1; only the standalone /github page promotes this. */}
		<SectionHeader
			as={variant === 'home' ? 'h2' : 'h1'}
			code='04'
			title='GitHub'
			subtitle={year === 'last' ? 'Live contribution activity, refreshed daily.' : `Contribution activity in ${year}.`}
			action={
				variant === 'home' ?
					<Link
						href='/github'
						className='text-cyber-cyan hover:text-cyber-yellow hidden items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors md:inline-flex'>
						View activity <CyberIcon icon='mdi:arrow-right' className='size-4' />
					</Link>
				:	<a
						href={`https://github.com/${USERNAME}`}
						target='_blank'
						rel='noopener noreferrer'
						className='text-cyber-cyan hover:text-cyber-yellow hidden items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors md:inline-flex'>
						<CyberIcon icon='simple-icons:github' className='size-4' /> @{USERNAME}
					</a>
			}
		/>

		{/* Server-rendered framing. Everything below this point is numbers pulled from the
		    GitHub API, so without it the standalone page ships almost no prose — a crawler
		    saw a heading, some digits and a heatmap of empty cells. */}
		{variant === 'page' && (
			<p className='text-muted-foreground mt-6 max-w-3xl text-base leading-relaxed'>
				A running record of what actually gets shipped: commits, pull requests and issues across public repositories,
				refreshed daily. Most of the work behind the projects on this site lives in private repositories, so treat this
				as a floor rather than a total. Pick a year to see how the shape of the work changed — the heatmap below reads
				left to right, one column per week.
			</p>
		)}
	</>
)

export default GithubIntro
