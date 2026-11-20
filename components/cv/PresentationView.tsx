'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { actionVariants } from '@/components/site/Action'
import ContentBlock from '@/components/site/ContentBlock'
import TitleText from '@/components/site/TitleText'
import { cn, formatExperienceDuration } from '@/lib/utils'
import type { ExperienceItem, PersonalData, Project, Skill, SkillCategory } from '@/common'

type SkillChip = Pick<Skill, 'name' | 'icon'>

/**
 * Everything the deck renders, assembled on the server by `app/cv/presentation/page.tsx`.
 *
 * The deck used to import `personalData`, `featuredProjects` and five more arrays from
 * `@/common` directly. It is a client component, and a client import of that barrel shipped
 * the whole data layer — every Journal post's body included — in this page's first-load
 * JavaScript. Now it imports types only, and receives exactly the fields a slide shows, with
 * the cross-entity lookups (client and seconded-to names) already resolved.
 */
export interface PresentationData {
	personal: Pick<PersonalData, 'name' | 'tagline' | 'about' | 'languages' | 'contactAction'> & {
		email: string
		website: string
	}
	/** The latest role's position id, humanized for the intro slide. */
	latestPosition: string
	roles: (Pick<ExperienceItem, 'id' | 'credential' | 'position' | 'startDate' | 'endDate' | 'description'> & {
		organization: string
	})[]
	stack: { category: SkillCategory; label: string; skills: SkillChip[] }[]
	projects: (Pick<Project, 'id' | 'title' | 'description' | 'startDate' | 'endDate'> & {
		cover: string
		live?: string
		/** Explicit client organisation if set (e.g. MONOMax), else the delivering role's organisation. */
		client: string | null
		via: string | null
		activeSkills: SkillChip[]
		retiredSkills: SkillChip[]
	})[]
}

const humanize = (value: string) =>
	value
		.split('-')
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')

const PresentationView: React.FC<{ data: PresentationData }> = ({ data }) => {
	const router = useRouter()
	const onExit = React.useCallback(() => router.push('/cv'), [router])

	const slides: { title: string; render: () => React.ReactNode }[] = [
		{
			title: 'Intro',
			render: () => (
				<div className='text-center'>
					<p className='text-brand font-sans text-sm tracking-normal'>Software, robotics & things I build</p>
					<h1 className='font-display mt-4 text-5xl font-bold tracking-tight md:text-8xl'>{data.personal.name}</h1>
					<TitleText
						text={humanize(data.latestPosition)}
						className='text-brand font-display mt-4 inline-block text-2xl font-bold tracking-normal md:text-4xl'
					/>
					<p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-base md:text-lg'>{data.personal.tagline}</p>
				</div>
			)
		},
		{
			title: 'Profile',
			render: () => (
				<div className='mx-auto max-w-3xl'>
					<h2 className='font-display text-brand text-3xl font-bold tracking-normal md:text-5xl'>Profile</h2>
					<p className='text-muted-foreground mt-6 text-lg leading-relaxed'>{data.personal.about.bio}</p>
					<ul className='mt-6 grid gap-3 sm:grid-cols-2'>
						{data.personal.about.highlights.map((h, i) => (
							<li key={i} className='flex gap-2'>
								<span className='bg-brand mt-2 size-1.5 shrink-0' />
								<span className='text-sm'>{h}</span>
							</li>
						))}
					</ul>
				</div>
			)
		},
		{
			title: 'Experience',
			render: () => (
				<div className='mx-auto max-w-3xl'>
					<h2 className='font-display text-brand text-3xl font-bold tracking-normal md:text-5xl'>Experience</h2>
					<div className='mt-6 space-y-4'>
						{data.roles.map(item => (
							<div key={item.id} className='surface rounded-lg p-4'>
								<div className='flex flex-wrap items-baseline justify-between gap-2'>
									<h3 className='font-display text-lg font-bold tracking-normal'>
										{item.credential ?? humanize(item.position)}
										<span className='text-brand'> @ {item.organization}</span>
									</h3>
									<span className='text-muted-foreground font-sans text-xs'>
										{formatExperienceDuration(item.startDate, item.endDate)}
									</span>
								</div>
								<p className='text-muted-foreground mt-2 line-clamp-2 text-sm'>{item.description}</p>
							</div>
						))}
					</div>
				</div>
			)
		},
		{
			title: 'Stack',
			render: () => (
				<div className='mx-auto max-w-4xl'>
					<h2 className='font-display text-brand text-3xl font-bold tracking-normal md:text-5xl'>Core Stack</h2>
					<div className='mt-6 grid gap-5 sm:grid-cols-2'>
						{data.stack.map(group => {
							return (
								<div key={group.category} className='surface rounded-lg p-4'>
									<h3 className='text-brand mb-3 font-sans text-xs tracking-normal'>{group.label}</h3>
									<div className='flex flex-wrap gap-2'>
										{group.skills.map(a => (
											<span key={a.name} className='inline-flex items-center gap-1.5 text-sm'>
												<Icon icon={a.icon} className='size-4' />
												{a.name}
											</span>
										))}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)
		},
		...data.projects.map(p => {
			const { client, via } = p
			return {
				title: p.title,
				render: () => (
					<div className='mx-auto grid max-h-[80vh] w-full max-w-5xl gap-8 md:grid-cols-[0.95fr_1.05fr]'>
						{/* Left: banner + meta + grouped tech */}
						<div className='flex min-h-0 flex-col gap-4 overflow-y-auto pr-1'>
							<div className='surface relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl'>
								<img src={p.cover} alt={p.title} className='h-full w-full object-cover' />
								<div className='from-background/90 absolute inset-0 bg-gradient-to-t to-transparent' />
							</div>

							<div className='grid grid-cols-2 gap-3 font-sans text-xs'>
								<div>
									<p className='text-brand tracking-normal'>Client</p>
									<p className='mt-1'>{client ?? 'Independent'}</p>
								</div>
								{via && (
									<div>
										<p className='text-brand tracking-normal'>Seconded To</p>
										<p className='mt-1'>{via}</p>
									</div>
								)}
								<div>
									<p className='text-brand tracking-normal'>Timeline</p>
									<p className='mt-1'>{formatExperienceDuration(p.startDate, p.endDate)}</p>
								</div>
								{p.live && (
									<div>
										<p className='text-brand tracking-normal'>Live</p>
										<p className='mt-1'>{p.live.replace(/^https?:\/\//, '').replace(/\/+$/, '')}</p>
									</div>
								)}
							</div>

							<div>
								<p className='text-brand mb-2 font-sans text-xs tracking-normal'>Tech Stack</p>
								<div className='flex flex-wrap gap-1.5'>
									{p.activeSkills.map(s => (
										<span
											key={s.name}
											className='border-border inline-flex items-center gap-1 border px-2 py-0.5 text-xs'>
											<Icon icon={s.icon} className='size-3.5' />
											{s.name}
										</span>
									))}
									{p.retiredSkills.map(s => (
										<span
											key={s.name}
											className='border-border/40 text-muted-foreground inline-flex items-center gap-1 border px-2 py-0.5 text-xs opacity-60'>
											<Icon icon={s.icon} className='size-3.5' />
											<span className='line-through'>{s.name}</span>
										</span>
									))}
								</div>
							</div>
						</div>

						{/* Right: title + scrollable description */}
						<div className='flex min-h-0 flex-col'>
							<h2 className='font-display text-brand text-2xl font-bold tracking-normal md:text-4xl'>{p.title}</h2>
							<p className='text-muted-foreground mt-4 min-h-0 overflow-y-auto pr-2 text-sm leading-relaxed md:text-base'>
								{p.description}
							</p>
						</div>
					</div>
				)
			}
		}),
		{
			title: 'Contact',
			render: () => (
				<div className='text-center'>
					<h2 className='font-display text-brand text-4xl font-bold tracking-normal md:text-6xl'>Keep in touch</h2>
					{/* The deck's one ask — the same email link as every hire button on the site. */}
					<a href={data.personal.contactAction.url} className={cn(actionVariants({ size: 'lg' }), 'mt-8')}>
						<Icon icon='mdi:handshake-outline' className='size-5' />
						{data.personal.contactAction.label}
						<Icon icon='mdi:arrow-top-right' className='size-4' />
					</a>
					<div className='mt-8 flex flex-col items-center gap-3 font-sans text-sm'>
						<span className='inline-flex items-center gap-2'>
							<Icon icon='mdi:email-outline' className='text-brand size-5' />
							{data.personal.email}
						</span>
						<span className='inline-flex items-center gap-2'>
							<Icon icon='mdi:web' className='text-brand size-5' /> {data.personal.website}
						</span>
						<span className='inline-flex items-center gap-2'>
							<Icon icon='mdi:translate' className='text-brand size-5' />
							{data.personal.languages.map(l => `${l.name} (${l.level})`).join(' · ')}
						</span>
					</div>
				</div>
			)
		}
	]

	const [index, setIndex] = React.useState(0)
	const next = React.useCallback(() => setIndex(i => Math.min(i + 1, slides.length - 1)), [slides.length])
	const prev = React.useCallback(() => setIndex(i => Math.max(i - 1, 0)), [])

	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onExit()
				return
			}
			if ((e.target as HTMLElement)?.closest('button,select,input,a')) return
			if (e.key === 'ArrowRight' || e.key === ' ') {
				e.preventDefault()
				next()
			} else if (e.key === 'ArrowLeft') prev()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [next, prev, onExit])

	const slide = slides[index]

	return (
		<div className='presentation-deck bg-background fixed inset-0 z-[200] flex flex-col'>
			{/* Top bar */}
			<div className='border-foreground relative z-10 flex items-center justify-between gap-4 border-b-2 bg-white px-5 py-3'>
				<span className='text-brand font-sans text-xs tracking-normal'>
					{/* The slide's position, not a hand-numbered code — those collided once the
					    project slides grew past three. */}
					{String(index).padStart(2, '0')} // {slide.title}
				</span>
				<button
					onClick={onExit}
					className='text-muted-foreground hover:text-danger inline-flex min-h-11 items-center gap-2 font-sans text-xs tracking-normal transition-colors'>
					Exit <X aria-hidden='true' className='size-4' />
				</button>
			</div>

			{/* Slide */}
			<div
				role='region'
				aria-label='Slide content'
				tabIndex={0}
				className='relative z-10 flex min-h-0 flex-1 items-start overflow-y-auto px-5 py-6'>
				<ContentBlock key={index} className='presentation-slide w-full'>
					{slide.render()}
				</ContentBlock>
			</div>

			{/* Controls */}
			<div className='border-foreground relative z-10 flex shrink-0 items-center justify-between gap-3 border-t-2 bg-white px-5 py-3'>
				<button
					onClick={prev}
					aria-label='Previous slide'
					disabled={index === 0}
					className='comic-action text-foreground flex size-11 shrink-0 items-center justify-center bg-white disabled:opacity-40'>
					<ChevronLeft aria-hidden='true' className='size-6' />
				</button>

				<label className='flex min-w-0 items-center gap-2 text-sm'>
					<span className='sr-only'>Choose slide</span>
					<select
						value={index}
						onChange={event => setIndex(Number(event.target.value))}
						className='border-foreground min-h-11 max-w-[48vw] border-2 bg-white px-3'>
						{slides.map((item, i) => (
							<option key={i} value={i}>
								{i + 1} / {slides.length} · {item.title}
							</option>
						))}
					</select>
				</label>

				<button
					onClick={next}
					aria-label='Next slide'
					disabled={index === slides.length - 1}
					className='comic-action text-foreground flex size-11 shrink-0 items-center justify-center bg-white disabled:opacity-40'>
					<ChevronRight aria-hidden='true' className='size-6' />
				</button>
			</div>
		</div>
	)
}

export default PresentationView
