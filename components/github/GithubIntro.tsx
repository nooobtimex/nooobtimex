import React from 'react'
import CyberIcon from '@/components/cyber/CyberIcon'
import SectionHeader from '@/components/cyber/SectionHeader'
import { USERNAME } from '@/lib/github'

/**
 * The heading and framing prose of `/github` — everything that does not depend on the API,
 * so it renders even when the feed is offline. (It was split out to sit outside a Suspense
 * boundary; `/github` is prerendered per year now and has none.)
 */
const GithubIntro: React.FC<{ year: string }> = ({ year }) => (
	<>
		<SectionHeader
			as='h1'
			code='05'
			title='GitHub'
			subtitle={year === 'last' ? 'Live contribution activity, refreshed daily.' : `Contribution activity in ${year}.`}
			action={
				<a
					href={`https://github.com/${USERNAME}`}
					target='_blank'
					rel='noopener noreferrer'
					className='text-cyber-cyan hover:text-cyber-yellow inline-flex shrink-0 items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors'>
					<CyberIcon icon='simple-icons:github' className='size-4' /> @{USERNAME}
				</a>
			}
		/>

		{/* Server-rendered framing. Everything below this point is numbers pulled from the
		    GitHub API, so without it the standalone page ships almost no prose — a crawler
		    saw a heading, some digits and a heatmap of empty cells. */}
		<p className='text-muted-foreground mt-6 max-w-3xl text-base leading-relaxed'>
			A running record of what actually gets shipped: commits, pull requests and issues across public repositories,
			refreshed daily. Most of the work behind the projects on this site lives in private repositories, so treat this as
			a floor rather than a total. Pick a year to see how the shape of the work changed — the heatmap below reads left
			to right, one column per week.
		</p>
	</>
)

export default GithubIntro
