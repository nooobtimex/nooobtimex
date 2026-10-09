import React from 'react'
import Link from 'next/link'
import WrittenAbout from '@/components/blog/WrittenAbout'
import Container from '@/components/cyber/Container'
import CyberIcon from '@/components/cyber/CyberIcon'
import CyberTag from '@/components/cyber/CyberTag'
import MotionReveal from '@/components/cyber/MotionReveal'
import NeonPanel from '@/components/cyber/NeonPanel'
import ProjectCard from '@/components/projects/ProjectCard'
import { cn, formatExperienceDuration } from '@/lib/utils'
import {
	ExperienceCategory,
	type ExperienceItem,
	entitiesData,
	experiencesData,
	postsByExperience,
	projectsData
} from '@/common'

interface ExperienceDetailProps {
	item: ExperienceItem
}

const humanize = (value: string) =>
	value
		.split('-')
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')

const categoryAccent: Record<ExperienceCategory, string> = {
	work: 'text-cyber-cyan',
	education: 'text-cyber-yellow'
}

const ExperienceDetail: React.FC<ExperienceDetailProps> = ({ item }) => {
	// Active-today role (started, not yet ended).
	const now = new Date()
	const isNow =
		experiencesData.find(r => new Date(r.startDate) <= now && (!r.endDate || new Date(r.endDate) >= now))?.id
		=== item.id
	// Only gigs delivered under THIS role — not everything at the organization.
	const relatedProjects = projectsData.filter(p => p.linkedExperienceIds?.includes(item.id))
	// Link the org name only when it has a company page — education-only orgs (a
	// university) live as a const but aren't in `entitiesData`, so they'd 404.
	const hasCompanyPage = entitiesData.some(o => o.id === item.organization.id)

	return (
		<Container className='py-10'>
			<Link
				href='/career'
				className='text-muted-foreground hover:text-cyber-cyan inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors'>
				<CyberIcon icon='mdi:arrow-left' className='size-4' /> Career
			</Link>

			<NeonPanel
				className={cn(
					'clip-notch mt-6 flex flex-col gap-5 p-6 sm:flex-row sm:items-center',
					isNow && 'neon-panel-yellow'
				)}>
				{item.organization.logo && (
					<span className='relative size-16 shrink-0 overflow-hidden rounded-sm bg-white/90'>
						<img
							src={item.organization.logo}
							alt={item.organization.name}
							loading='lazy'
							decoding='async'
							className='absolute inset-0 size-full object-contain p-1.5'
						/>
					</span>
				)}
				<div className='flex-1'>
					<span className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// Role</span>
					<h1 className='font-display text-3xl font-bold tracking-wide uppercase md:text-4xl'>
						{item.credential ?? humanize(item.position)}
					</h1>
					{hasCompanyPage ?
						<Link
							href={`/companies/${item.organization.id}` as never}
							className='text-cyber-yellow hover:text-cyber-cyan inline-block text-lg transition-colors'>
							{item.organization.name}
						</Link>
					:	<span className='text-cyber-yellow inline-block text-lg'>{item.organization.name}</span>}
					<p className='text-muted-foreground mt-1 font-mono text-xs tracking-wider uppercase'>
						{formatExperienceDuration(item.startDate, item.endDate)}
					</p>
				</div>
				{isNow && (
					<span className='bg-cyber-yellow now-pulse self-start px-2 py-0.5 font-mono text-[0.65rem] font-bold tracking-widest text-black uppercase'>
						Now
					</span>
				)}
			</NeonPanel>

			<div className='mt-6 flex flex-wrap gap-2'>
				<CyberTag icon='mdi:briefcase-outline'>{humanize(item.type)}</CyberTag>
				<CyberTag icon='mdi:map-marker-outline' tone='yellow'>
					{humanize(item.organization.location)}
				</CyberTag>
				<CyberTag icon='mdi:shape-outline' tone='magenta'>
					{humanize(item.category)}
				</CyberTag>
			</div>

			<section className='mt-8'>
				<h2 className={cn('font-mono text-xs tracking-[0.3em] uppercase', categoryAccent[item.category])}>
					// Summary
				</h2>
				<p className='text-muted-foreground mt-3 leading-relaxed'>{item.description}</p>
				{item.organization.url && (
					<a
						href={item.organization.url}
						target='_blank'
						rel='noopener noreferrer'
						className='text-cyber-cyan hover:text-cyber-yellow mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors'>
						<CyberIcon icon='mdi:open-in-new' className='size-4' /> Visit Organization
					</a>
				)}
			</section>

			{relatedProjects.length > 0 && (
				<section className='mt-10'>
					<div className='mb-6 flex items-center gap-3'>
						<h2 className='font-display text-xl font-bold tracking-wide uppercase'>Projects</h2>
						<span className='bg-border h-px flex-1' />
						<span className='text-muted-foreground font-mono text-xs'>{relatedProjects.length}</span>
					</div>
					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{relatedProjects.map((p, i) => (
							<MotionReveal key={p.id} delay={(i % 3) * 0.08}>
								<ProjectCard project={p} index={i} />
							</MotionReveal>
						))}
					</div>
				</section>
			)}

			{/* Journal entries from or about this role */}
			<WrittenAbout posts={postsByExperience[item.id]} />
		</Container>
	)
}

export default ExperienceDetail
