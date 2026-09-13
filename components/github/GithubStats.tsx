import React from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import Container from '@/components/cyber/Container'
import CyberIcon from '@/components/cyber/CyberIcon'
import NeonPanel from '@/components/cyber/NeonPanel'
import ContributionHeatmap from '@/components/github/ContributionHeatmap'
import GithubInsights from '@/components/github/GithubInsights'
import GithubIntro from '@/components/github/GithubIntro'
import {
	type ContributionDay,
	type RepoSummary,
	USERNAME,
	getContributions,
	getProfile,
	getRepos,
	resolveGithubYear
} from '@/lib/github'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Roll the daily series up into the visualizations the insights panel needs. */
function buildInsights(days: ContributionDay[], repos: RepoSummary | null) {
	const monthMap = new Map<string, number>()
	const weekdaySums = Array<number>(7).fill(0)
	let activeDays = 0
	let total = 0
	let busiest: ContributionDay | null = null

	for (const d of days) {
		monthMap.set(d.date.slice(0, 7), (monthMap.get(d.date.slice(0, 7)) ?? 0) + d.count)
		weekdaySums[new Date(d.date).getUTCDay()] += d.count
		if (d.count > 0) activeDays++
		total += d.count
		if (!busiest || d.count > busiest.count) busiest = d
	}

	const monthly = [...monthMap.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.slice(-12)
		.map(([key, count]) => {
			const m = Number(key.slice(5, 7)) - 1
			return { key, label: MONTHS[m][0], full: `${MONTHS[m]} ${key.slice(0, 4)}`, count }
		})

	const weekday = WEEKDAYS.map((label, i) => ({ label, count: weekdaySums[i] }))

	return {
		monthly,
		weekday,
		languages: repos?.languages ?? [],
		topRepos: repos?.top ?? [],
		activeDays,
		totalDays: days.length,
		avgPerDay: activeDays ? total / activeDays : 0, // averaged over active days, not the full window
		busiest: busiest ? { date: busiest.date, count: busiest.count } : null
	}
}

function computeStreaks(days: ContributionDay[]) {
	let longest = 0
	let run = 0
	for (const d of days) {
		if (d.count > 0) {
			run++
			longest = Math.max(longest, run)
		} else {
			run = 0
		}
	}
	let current = 0
	for (let i = days.length - 1; i >= 0; i--) {
		if (days[i].count > 0) current++
		else break
	}
	return { current, longest }
}

const fmt = (n: number) => n.toLocaleString('en-US')

/** Placeholder for `/github`'s Suspense boundary — same footprint as the resolved stats. */
export const GithubStatsSkeleton: React.FC = () => (
	<div aria-busy='true'>
		<span className='sr-only'>Loading contribution activity…</span>
		<div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
			{Array.from({ length: 6 }, (_, i) => (
				<NeonPanel key={i} className='clip-notch-sm h-[5.25rem] animate-pulse' />
			))}
		</div>
		<NeonPanel className='mt-5 h-40 animate-pulse' />
	</div>
)

/**
 * `/github` when the contributions API fails. Home simply omits its section, but this
 * page's `<main>` would otherwise hold a heading over nothing — a screen that reads as
 * unfinished to a visitor and as empty to a reviewer.
 */
const GithubUnavailable: React.FC = () => (
	<NeonPanel className='mt-8 flex flex-col items-start gap-3 p-6'>
		<span className='text-cyber-magenta font-mono text-xs tracking-[0.3em] uppercase'>// Feed offline</span>
		<p className='text-muted-foreground max-w-2xl leading-relaxed'>
			GitHub&apos;s contribution data didn&apos;t come back for this request, so there is nothing to chart right now. It
			refreshes daily — check back later, or read the activity straight from the profile.
		</p>
		<a
			href={`https://github.com/${USERNAME}`}
			target='_blank'
			rel='noopener noreferrer'
			className='text-cyber-cyan hover:text-cyber-yellow inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors'>
			<CyberIcon icon='simple-icons:github' className='size-4' /> github.com/{USERNAME}
		</a>
	</NeonPanel>
)

/**
 * On home this renders the whole section, intro included. On `/github` it renders only
 * the data: the page draws `GithubIntro` itself, outside the Suspense boundary around
 * this component, so the heading and prose never stream behind the numbers.
 */
const GithubStats = async ({ variant = 'page', year }: { variant?: 'home' | 'page'; year?: string }) => {
	const selectedYear = resolveGithubYear(variant, year)
	const contrib = await getContributions(selectedYear)
	if (!contrib) return variant === 'home' ? null : <GithubUnavailable />

	const [profile, repos] = await Promise.all([getProfile(), getRepos()])
	const { current, longest } = computeStreaks(contrib.days)

	const currentYear = new Date().getFullYear()
	const startYear = profile?.createdYear ?? currentYear - 5
	const years = [
		'last',
		...Array.from({ length: Math.max(0, currentYear - startYear) + 1 }, (_, i) => String(currentYear - i))
	]

	const allStats: { label: string; value: string; icon: string; homeHidden?: boolean }[] = [
		{
			label: selectedYear === 'last' ? 'Contributions / yr' : `Contributions ${selectedYear}`,
			value: fmt(contrib.total),
			icon: 'mdi:source-commit'
		},
		{ label: 'Current streak', value: `${current}d`, icon: 'mdi:fire' },
		{ label: 'Longest streak', value: `${longest}d`, icon: 'mdi:trophy-outline' },
		{
			label: 'Public repos',
			value: profile ? fmt(profile.repos) : '—',
			icon: 'mdi:source-repository',
			homeHidden: true
		},
		{ label: 'Stars earned', value: repos ? fmt(repos.stars) : '—', icon: 'mdi:star-outline' },
		{
			label: 'Followers',
			value: profile ? fmt(profile.followers) : '—',
			icon: 'mdi:account-multiple-outline',
			homeHidden: true
		}
	]
	// Home keeps the four activity-focused cards; the full repos/followers set lives on /github.
	const stats = variant === 'home' ? allStats.filter(s => !s.homeHidden) : allStats

	const data = (
		<>
			{variant === 'page' && (
				<div className='mt-6 flex flex-wrap gap-2'>
					{years.map(y => {
						const active = y === selectedYear
						return (
							<Link
								key={y}
								href={(y === 'last' ? '/github' : `/github?year=${y}`) as Route}
								className={cn(
									'clip-notch-sm border px-3 py-1 font-mono text-xs tracking-widest uppercase transition-colors',
									active ?
										'bg-cyber-yellow border-cyber-yellow text-black'
									:	'border-border text-muted-foreground hover:border-cyber-cyan hover:text-cyber-cyan'
								)}>
								{y === 'last' ? 'Last 12 mo' : y}
							</Link>
						)
					})}
				</div>
			)}

			<div
				className={
					variant === 'home' ?
						'mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4'
					:	'mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'
				}>
				{stats.map(s => (
					<NeonPanel key={s.label} className='clip-notch-sm flex flex-col gap-1 p-4'>
						<CyberIcon icon={s.icon} className='text-cyber-cyan size-4' />
						<span className='font-display neon-text-yellow text-2xl leading-none font-bold'>{s.value}</span>
						<span className='text-muted-foreground font-mono text-[0.6rem] tracking-widest uppercase'>{s.label}</span>
					</NeonPanel>
				))}
			</div>

			<NeonPanel className='clip-notch mt-5 p-5'>
				<ContributionHeatmap contributions={contrib.days} />
			</NeonPanel>

			{variant === 'page' && <GithubInsights data={buildInsights(contrib.days, repos)} />}
		</>
	)

	if (variant === 'page') return data

	return (
		<Container as='section' className='mt-20 pb-4'>
			<GithubIntro variant='home' year={selectedYear} />
			{data}
		</Container>
	)
}

export default GithubStats
