/**
 * Chart primitives for the GitHub section — server components, no chart library, no
 * client JavaScript. Hover and keyboard focus both open the same CSS-only readout, and
 * every chart pairs with a `DataTable`, so a tooltip never gates a value.
 *
 * Mark rules (the dataviz method): one hue per series, thin marks (columns ≤ 24px with a
 * 4px rounded data-end, square at the baseline), solid hairline baseline and reference
 * line, labels in text tokens — never in the series color.
 */
import React from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import NeonPanel from '@/components/cyber/NeonPanel'
import { cn } from '@/lib/utils'

/**
 * `base` is the series (cyan). `accent` + `muted` is the emphasis form — one mark in
 * yellow, the rest in a gray that still clears 3:1 on the panel. `partial` is a period
 * still in progress, dimmed so an unfinished month never reads as a drop.
 */
export type MarkTone = 'base' | 'accent' | 'muted' | 'partial'

const TONE: Record<MarkTone, string> = {
	base: 'bg-cyber-cyan',
	accent: 'bg-cyber-yellow',
	muted: 'bg-chart-muted',
	partial: 'bg-cyber-cyan/45'
}

/** Hover/focus readout. The value leads; the label follows. */
const Readout: React.FC<{ value: string; detail: string; align: 'start' | 'center' | 'end' }> = ({
	value,
	detail,
	align
}) => (
	<span
		aria-hidden
		className={cn(
			'border-border bg-popover pointer-events-none absolute -top-2 z-10 -translate-y-full border px-2 py-1 whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
			align === 'start' ? 'left-0'
			: align === 'end' ? 'right-0'
			: 'left-1/2 -translate-x-1/2'
		)}>
		<span className='text-foreground block font-mono text-xs font-semibold'>{value}</span>
		<span className='text-muted-foreground block text-[0.65rem]'>{detail}</span>
	</span>
)

export interface Column {
	key: string
	/** Axis label under the column. */
	label: string
	value: number
	valueText: string
	/** What the value is, for the readout and screen readers, e.g. 'Jun 2026 — so far'. */
	detail: string
	tone?: MarkTone
	/** Print the value on the cap. Label selectively: the peak, the selection — never all. */
	labelled?: boolean
	href?: string
}

/** Vertical columns from one baseline, with an optional reference line (e.g. the average). */
export const ColumnChart: React.FC<{
	columns: Column[]
	/** Names the chart for assistive tech — the panel heading says it visually. */
	title: string
	reference?: { value: number; label: string }
}> = ({ columns, title, reference }) => {
	const max = Math.max(1, reference?.value ?? 0, ...columns.map(c => c.value))
	// 85% of the plot at most, so a cap label above the tallest column stays inside it.
	const pct = (v: number) => (v / max) * 85

	return (
		// Top padding is the readout's headroom: it opens above the plot, inside the panel.
		<div className='pt-12'>
			<div role='group' aria-label={title} className='relative h-40'>
				<span className='bg-border absolute inset-x-0 bottom-0 h-px' />

				<div className='absolute inset-0 flex items-end gap-1 sm:gap-2'>
					{columns.map((c, i) => {
						const align =
							i === 0 ? 'start'
							: i === columns.length - 1 ? 'end'
							: 'center'
						const body = (
							<>
								{c.labelled && c.value > 0 && (
									<span className='text-foreground mb-1 font-mono text-[0.6rem]'>{c.valueText}</span>
								)}
								<span
									className={cn(
										'w-full max-w-6 rounded-t-[4px] transition-[filter] group-hover:brightness-125 group-focus-visible:brightness-125',
										TONE[c.tone ?? 'base']
									)}
									style={{ height: c.value > 0 ? `max(2px, ${pct(c.value)}%)` : 0 }}
								/>
								<Readout value={c.valueText} detail={c.detail} align={align} />
							</>
						)
						const cls =
							'group relative flex h-full flex-1 flex-col items-center justify-end outline-none focus-visible:bg-foreground/[0.06]'
						return c.href ?
								<Link key={c.key} href={c.href as Route} aria-label={`${c.valueText} — ${c.detail}`} className={cls}>
									{body}
								</Link>
							:	<div key={c.key} tabIndex={0} aria-label={`${c.valueText} — ${c.detail}`} className={cls}>
									{body}
								</div>
					})}
				</div>

				{/* After the columns so it sits on top; solid hairline, never dashed. */}
				{reference && reference.value > 0 && (
					<div className='pointer-events-none absolute inset-x-0' style={{ bottom: `${pct(reference.value)}%` }}>
						<span className='bg-foreground/40 block h-px' />
						<span className='bg-card text-muted-foreground absolute right-0 bottom-full mb-0.5 px-1 font-mono text-[0.55rem] tracking-wider uppercase'>
							{reference.label}
						</span>
					</div>
				)}
			</div>

			<div aria-hidden className='mt-2 flex gap-1 sm:gap-2'>
				{columns.map(c => (
					<span key={c.key} className='text-muted-foreground flex-1 text-center font-mono text-[0.6rem] uppercase'>
						{c.label}
					</span>
				))}
			</div>
		</div>
	)
}

export interface BarRow {
	key: string
	label: string
	value: number
	valueText: string
	tone?: MarkTone
}

/** Horizontal bars with the value at the tip — for a short ranked list (weekdays, languages). */
export const BarList: React.FC<{ rows: BarRow[]; title: string }> = ({ rows, title }) => {
	const max = Math.max(1, ...rows.map(r => r.value))
	return (
		<ul aria-label={title} className='space-y-2.5'>
			{rows.map(r => (
				<li key={r.key} className='flex items-center gap-3'>
					<span className='text-muted-foreground w-20 shrink-0 truncate text-xs'>{r.label}</span>
					<span className='flex min-w-0 flex-1 items-center gap-2'>
						<span
							className={cn('h-2.5 shrink-0 rounded-r-[4px]', TONE[r.tone ?? 'base'])}
							// 80% at most, so the tip value always has room on the same line.
							style={{ width: r.value > 0 ? `max(2px, ${(r.value / max) * 80}%)` : 0 }}
						/>
						<span className='text-foreground font-mono text-[0.65rem]'>{r.valueText}</span>
					</span>
				</li>
			))}
		</ul>
	)
}

/** The table twin of a chart — every value readable without hovering or seeing color. */
export const DataTable: React.FC<{ caption: string; head: [string, string]; rows: [string, string][] }> = ({
	caption,
	head,
	rows
}) => (
	<details className='mt-5'>
		<summary className='text-muted-foreground hover:text-cyber-cyan w-fit cursor-pointer font-mono text-[0.6rem] tracking-widest uppercase transition-colors'>
			Data table
		</summary>
		<table className='mt-3 w-full text-xs'>
			<caption className='sr-only'>{caption}</caption>
			<thead>
				<tr className='border-border text-muted-foreground border-b font-mono text-[0.6rem] uppercase'>
					<th scope='col' className='py-1.5 text-left font-normal'>
						{head[0]}
					</th>
					<th scope='col' className='py-1.5 text-right font-normal'>
						{head[1]}
					</th>
				</tr>
			</thead>
			<tbody>
				{rows.map(([label, value]) => (
					<tr key={label} className='border-border/40 border-b last:border-0'>
						<th scope='row' className='py-1.5 text-left font-normal'>
							{label}
						</th>
						<td className='py-1.5 text-right font-mono tabular-nums'>{value}</td>
					</tr>
				))}
			</tbody>
		</table>
	</details>
)

/** A chart's frame: the heading, then the one-line takeaway, then the chart. */
export const ChartPanel: React.FC<{
	title: string
	takeaway?: string
	className?: string
	children: React.ReactNode
}> = ({ title, takeaway, className, children }) => (
	<NeonPanel className={cn('clip-notch p-5', className)}>
		<div className='flex items-center gap-3'>
			<h3 className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// {title}</h3>
			<span className='bg-border h-px flex-1' />
		</div>
		{takeaway && <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{takeaway}</p>}
		<div className='mt-5'>{children}</div>
	</NeonPanel>
)
