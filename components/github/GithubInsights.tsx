import React from 'react'
import CyberIcon from '@/components/cyber/CyberIcon'
import NeonPanel from '@/components/cyber/NeonPanel'
import { BarList, ChartPanel, type Column, ColumnChart, DataTable } from '@/components/github/GithubCharts'
import type { GithubPeriod, RepoSummary } from '@/lib/github'
import type { PeriodStats, foldLanguages } from '@/lib/github-stats'

const fmt = (n: number) => n.toLocaleString('en-US')

export interface GithubInsightsData {
	period: GithubPeriod
	stats: PeriodStats
	/** Contributions per calendar year since the account opened, oldest first. Null if the fetch failed. */
	yearTotals: { year: string; total: number }[] | null
	languages: ReturnType<typeof foldLanguages>
	topRepos: RepoSummary['top']
	profile: { repos: number; followers: number } | null
	stars: number | null
}

const Tile: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
	<NeonPanel className='clip-notch-sm flex flex-col gap-1 p-4'>
		<CyberIcon icon={icon} className='text-cyber-cyan size-4' />
		<span className='font-display neon-text-yellow text-2xl leading-none font-bold'>{value}</span>
		<span className='text-muted-foreground font-mono text-[0.65rem] tracking-widest uppercase'>{label}</span>
	</NeonPanel>
)

/** Monthly cadence: one series in cyan, the in-progress month dimmed, the average as a reference line. */
const MonthlyCadence: React.FC<{ stats: PeriodStats }> = ({ stats }) => {
	const { monthly, monthlyAvg, peakMonth } = stats
	const partial = monthly.find(m => m.partial)
	const columns: Column[] = monthly.map(m => ({
		key: m.key,
		label: m.label,
		value: m.count,
		valueText: fmt(m.count),
		detail: m.partial ? `${m.full} — so far` : m.full,
		tone: m.partial ? 'partial' : 'base',
		labelled: m.key === peakMonth?.key
	}))
	const takeaway =
		peakMonth ?
			`Peak: ${peakMonth.full} with ${fmt(peakMonth.count)}. Average ${fmt(Math.round(monthlyAvg))} a month${partial ? ` — ${partial.label} is still in progress, shown dimmed` : ''}.`
		:	undefined

	return (
		<ChartPanel title='Monthly cadence' takeaway={takeaway}>
			<ColumnChart
				title='Contributions per month'
				columns={columns}
				reference={{ value: monthlyAvg, label: `avg ${fmt(Math.round(monthlyAvg))}` }}
			/>
			<DataTable
				caption='Contributions per month'
				head={['Month', 'Contributions']}
				rows={monthly.map(m => [m.partial ? `${m.full} (so far)` : m.full, fmt(m.count)])}
			/>
		</ChartPanel>
	)
}

/** Weekday rhythm: emphasis form — the busiest day in yellow, the rest in gray. */
const WeekdayRhythm: React.FC<{ stats: PeriodStats }> = ({ stats }) => {
	const total = stats.weekday.reduce((s, w) => s + w.count, 0)
	const top = stats.busiestWeekday
	return (
		<ChartPanel
			title='Weekday rhythm'
			takeaway={
				top && total ?
					`${top.name} is the busiest — ${Math.round((top.count / total) * 100)}% of all contributions land on it.`
				:	undefined
			}>
			<BarList
				title='Contributions by weekday'
				rows={stats.weekday.map(w => ({
					key: w.label,
					label: w.name,
					value: w.count,
					valueText: fmt(w.count),
					tone: top && w.name === top.name ? 'accent' : 'muted'
				}))}
			/>
		</ChartPanel>
	)
}

/** Years at a glance: every calendar year since the account opened; the selected one highlighted. */
const YearsAtAGlance: React.FC<{ period: GithubPeriod; years: { year: string; total: number }[] }> = ({
	period,
	years
}) => {
	const sum = years.reduce((s, y) => s + y.total, 0)
	const biggest = years.reduce((best, y) => (y.total > best.total ? y : best), years[0])
	const selected = years.find(y => y.year === period)
	const columns: Column[] = years.map(y => ({
		key: y.year,
		label: `'${y.year.slice(2)}`,
		value: y.total,
		valueText: fmt(y.total),
		detail: `${y.year} — open the ${y.year} view`,
		// Emphasis when a year is selected; otherwise one plain series.
		tone:
			!selected ? 'base'
			: y.year === period ? 'accent'
			: 'muted',
		labelled: y.year === biggest.year || y.year === period,
		href: `/github/${y.year}`
	}))
	const takeaway =
		selected ?
			`${selected.year} highlighted: ${fmt(selected.total)} of ${fmt(sum)} contributions since ${years[0].year}.`
		:	`${fmt(sum)} contributions since ${years[0].year}; ${biggest.year} is the biggest year. Select a column to open that year.`

	return (
		<ChartPanel title='Years at a glance' takeaway={takeaway}>
			<ColumnChart title='Contributions per calendar year' columns={columns} />
			<DataTable
				caption='Contributions per calendar year'
				head={['Year', 'Contributions']}
				rows={years.map(y => [y.year, fmt(y.total)])}
			/>
		</ChartPanel>
	)
}

/**
 * The /github analysis below the heatmap. Two groups, and the split is the point: the
 * period charts follow the year filter; the all-time group sits under its own heading
 * because repos, stars, followers and languages don't change with it.
 */
const GithubInsights: React.FC<{ data: GithubInsightsData }> = ({ data }) => {
	const { period, stats, yearTotals, languages, topRepos, profile, stars } = data
	const hasActivity = stats.total > 0

	return (
		<div className='mt-12 space-y-5'>
			{hasActivity && (
				<div className='grid gap-5 lg:grid-cols-[1.4fr_1fr]'>
					<MonthlyCadence stats={stats} />
					<WeekdayRhythm stats={stats} />
				</div>
			)}

			{yearTotals && yearTotals.length > 0 && <YearsAtAGlance period={period} years={yearTotals} />}

			<div className='flex items-center gap-3 pt-8'>
				<h2 className='font-display text-2xl font-bold tracking-wide uppercase'>All time</h2>
				<span className='bg-border h-px flex-1' />
				<span className='text-muted-foreground font-mono text-[0.65rem] tracking-widest uppercase'>
					Not affected by the year filter
				</span>
			</div>

			<div className='grid grid-cols-3 gap-3'>
				<Tile icon='mdi:source-repository' label='Public repos' value={profile ? fmt(profile.repos) : '—'} />
				<Tile icon='mdi:star-outline' label='Stars earned' value={stars !== null ? fmt(stars) : '—'} />
				<Tile icon='mdi:account-multiple-outline' label='Followers' value={profile ? fmt(profile.followers) : '—'} />
			</div>

			<div className='grid gap-5 lg:grid-cols-2'>
				{languages.length > 0 && (
					<ChartPanel title='Languages' takeaway='Share of code across public repositories, by bytes.'>
						<BarList
							title='Share of code by language'
							rows={languages.map(l => ({
								key: l.name,
								label: l.name,
								value: l.share,
								valueText: `${l.share < 1 ? '<1' : Math.round(l.share)}%`
							}))}
						/>
					</ChartPanel>
				)}

				{topRepos.length > 0 && (
					<NeonPanel className='clip-notch p-5'>
						<div className='mb-4 flex items-center gap-3'>
							<h3 className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// Top repositories</h3>
							<span className='bg-border h-px flex-1' />
						</div>
						<div className='-mt-1'>
							{topRepos.map(r => (
								<a
									key={r.name}
									href={r.url}
									target='_blank'
									rel='noopener noreferrer'
									className='border-border/40 hover:text-cyber-cyan group flex items-center justify-between gap-3 border-b py-2.5 transition-colors last:border-0'>
									<div className='min-w-0'>
										<p className='truncate text-sm font-semibold'>{r.name}</p>
										{r.description && <p className='text-muted-foreground truncate text-[0.7rem]'>{r.description}</p>}
									</div>
									<div className='flex shrink-0 items-center gap-3 font-mono text-xs'>
										{r.language && <span className='text-muted-foreground'>{r.language}</span>}
										<span className='text-foreground flex items-center gap-1'>
											<CyberIcon icon='mdi:star' className='text-cyber-yellow size-3' />
											{r.stars}
										</span>
									</div>
								</a>
							))}
						</div>
					</NeonPanel>
				)}
			</div>
		</div>
	)
}

export default GithubInsights
