import React from 'react'
import Link from 'next/link'
import WrittenAbout from '@/components/blog/WrittenAbout'
import ProjectCard from '@/components/projects/ProjectCard'
import Container from '@/components/site/Container'
import ContentBlock from '@/components/site/ContentBlock'
import Panel from '@/components/site/Panel'
import SiteIcon from '@/components/site/SiteIcon'
import Tag from '@/components/site/Tag'
import { formatExperienceDuration } from '@/lib/utils'
import { type Organization, experiencesData, postsByEntity, projectsData } from '@/common'

interface CompanyDetailProps {
	organization: Organization
}

const humanize = (value: string) =>
	value
		.split('-')
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')

const StatCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<div className='border-border/60 border-l-2 pl-3'>
		<p className='text-muted-foreground font-sans text-xs tracking-normal'>{label}</p>
		<p className='mt-0.5 text-sm font-semibold'>{children}</p>
	</div>
)

const InfoRow: React.FC<{ icon: string; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
	<div className='border-brand/40 bg-brand/[0.04] flex items-start gap-3 border-l-2 p-3'>
		<SiteIcon icon={icon} className='text-brand mt-0.5 size-4 shrink-0' />
		<div className='min-w-0'>
			<p className='text-muted-foreground font-sans text-xs tracking-normal'>{label}</p>
			<p className='mt-0.5 text-sm font-semibold'>{children}</p>
		</div>
	</div>
)

/** Dossier attributes, each with its own icon — rendered only when present on the org. */
const DOSSIER_FIELDS: {
	key: 'industry' | 'founded' | 'headquarters' | 'size' | 'parentGroup' | 'stockTicker'
	label: string
	icon: string
}[] = [
	{ key: 'industry', label: 'Industry', icon: 'mdi:office-building-outline' },
	{ key: 'founded', label: 'Founded', icon: 'mdi:calendar-star' },
	{ key: 'headquarters', label: 'Headquarters', icon: 'mdi:map-marker-outline' },
	{ key: 'size', label: 'Size', icon: 'mdi:account-group-outline' },
	{ key: 'parentGroup', label: 'Parent Group', icon: 'mdi:sitemap-outline' },
	{ key: 'stockTicker', label: 'Ticker', icon: 'mdi:chart-line-variant' }
]

const CompanyDetail: React.FC<CompanyDetailProps> = ({ organization }) => {
	// Roles held here (newest first, matching experiencesData order).
	const roles = experiencesData.filter(e => e.organization.id === organization.id)
	// Dossier rows present on this org (each field carries its own icon).
	const dossier = DOSSIER_FIELDS.filter(f => organization[f.key])
	// Gigs delivered under any of those roles.
	const gigs = projectsData.filter(
		p =>
			p.clientOrganizationId === organization.id
			|| p.viaOrganizationId === organization.id
			|| p.linkedExperienceIds?.some(id => roles.some(r => r.id === id))
	)
	// Skill rollup across those gigs (unique by name) — active tech only, retired skills excluded.
	const skills = Array.from(new Map(gigs.flatMap(g => g.activeSkills).map(s => [s.name, s])).values())
	// Tenure span: earliest role start → latest end (Present if any role is open).
	const tenureStart = roles.length > 0 ? roles.reduce((a, b) => (a.startDate < b.startDate ? a : b)).startDate : null
	const hasOpenRole = roles.some(r => !r.endDate)
	const tenureEnd =
		hasOpenRole ? undefined : (
			roles.reduce<string | undefined>(
				(max, r) => (r.endDate && (!max || r.endDate > max) ? r.endDate : max),
				undefined
			)
		)

	return (
		<Container className='py-10'>
			<Link
				href={'/career#organizations' as never}
				className='text-muted-foreground hover:text-brand inline-flex items-center gap-2 font-sans text-xs tracking-normal transition-colors'>
				<SiteIcon icon='mdi:arrow-left' className='size-4' /> About
			</Link>

			{/* Company header */}
			<Panel className='comic-detail-heading mt-6 flex flex-col gap-5 rounded-xl p-6 sm:flex-row sm:items-center'>
				{organization.logo && (
					<span className='relative size-16 shrink-0 overflow-hidden rounded-sm bg-white/90'>
						<img
							src={organization.logo}
							alt={organization.name}
							loading='lazy'
							decoding='async'
							className='absolute inset-0 size-full object-contain p-1.5'
						/>
					</span>
				)}
				<div className='flex-1'>
					<span className='text-brand font-sans text-xs tracking-normal'>Company</span>
					<h1 className='font-display text-3xl font-bold tracking-normal md:text-4xl'>{organization.name}</h1>
					{organization.description && (
						<p className='text-muted-foreground mt-2 max-w-3xl leading-relaxed'>{organization.description}</p>
					)}
				</div>
			</Panel>

			<div className='mt-6 flex flex-wrap gap-2'>
				<Tag icon='mdi:domain'>{humanize(organization.type)}</Tag>
				<Tag icon='mdi:map-marker-outline' tone='yellow'>
					{humanize(organization.location)}
				</Tag>
				{organization.url && (
					<a href={organization.url} target='_blank' rel='noopener noreferrer'>
						<Tag icon='mdi:open-in-new' tone='magenta'>
							Website
						</Tag>
					</a>
				)}
			</div>

			{dossier.length > 0 && (
				<>
					<h2 className='text-brand mt-8 font-sans text-xs tracking-normal'>Company facts</h2>
					<Panel className='mt-3 grid grid-cols-1 gap-3 rounded-lg p-4 sm:grid-cols-2'>
						{dossier.map(f => (
							<InfoRow key={f.key} icon={f.icon} label={f.label}>
								{organization[f.key]}
							</InfoRow>
						))}
					</Panel>
				</>
			)}

			{organization.about && (
				<section className='mt-8'>
					<h2 className='text-brand font-sans text-xs tracking-normal'>About</h2>
					<p className='text-muted-foreground mt-3 leading-relaxed'>{organization.about}</p>
				</section>
			)}

			{organization.products && organization.products.length > 0 && (
				<section className='mt-8'>
					<h2 className='text-brand font-sans text-xs tracking-normal'>Products &amp; Brands</h2>
					<div className='mt-3 flex flex-wrap gap-2'>
						{organization.products.map(p => (
							<Tag key={p} icon='mdi:package-variant-closed' tone='yellow'>
								{p}
							</Tag>
						))}
					</div>
				</section>
			)}

			{organization.highlights && organization.highlights.length > 0 && (
				<section className='mt-8'>
					<h2 className='text-brand font-sans text-xs tracking-normal'>Highlights</h2>
					<ul className='mt-3 space-y-2'>
						{organization.highlights.map(h => (
							<li key={h} className='text-muted-foreground flex items-start gap-2 text-sm leading-relaxed'>
								<SiteIcon icon='mdi:star-four-points-outline' className='text-danger mt-1 size-3.5 shrink-0' />
								<span>{h}</span>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* Stat readout */}
			<Panel className='mt-6 grid grid-cols-2 gap-4 rounded-lg p-4 sm:grid-cols-4'>
				<StatCell label='Roles'>{roles.length}</StatCell>
				<StatCell label='Tenure'>
					{tenureStart ?
						<span className='text-brand'>{formatExperienceDuration(tenureStart, tenureEnd)}</span>
					:	'—'}
				</StatCell>
				<StatCell label='Projects'>
					<span className='text-brand'>{gigs.length}</span>
				</StatCell>
				<StatCell label='Skills used'>{skills.length}</StatCell>
			</Panel>

			{/* Roles held here */}
			{roles.length > 0 && (
				<section className='mt-10'>
					<div className='mb-6 flex items-center gap-3'>
						<h2 className='font-display text-xl font-bold tracking-normal'>Roles</h2>
						<span className='bg-border h-px flex-1' />
						<span className='text-muted-foreground font-sans text-xs'>{roles.length}</span>
					</div>
					<div className='grid gap-4 sm:grid-cols-2'>
						{roles.map((role, i) => (
							<ContentBlock key={role.id} delay={(i % 2) * 0.06}>
								<Link
									href={`/career/${role.id}` as never}
									className='group surface hover:border-brand/60 block rounded-lg p-4 transition-colors'>
									<h3 className='group-hover:text-brand leading-tight font-bold tracking-normal transition-colors'>
										{humanize(role.position)}
									</h3>
									<p className='text-muted-foreground mt-2 font-sans text-xs tracking-normal'>
										{formatExperienceDuration(role.startDate, role.endDate)} · {humanize(role.type)}
									</p>
									<p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed'>{role.description}</p>
								</Link>
							</ContentBlock>
						))}
					</div>
				</section>
			)}

			{/* Gigs delivered here */}
			{gigs.length > 0 && (
				<section className='mt-10'>
					<div className='mb-6 flex items-center gap-3'>
						<h2 className='font-display text-xl font-bold tracking-normal'>Projects</h2>
						<span className='bg-border h-px flex-1' />
						<span className='text-muted-foreground font-sans text-xs'>{gigs.length}</span>
					</div>
					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{gigs.map((p, i) => (
							<ContentBlock key={p.id} delay={(i % 3) * 0.08}>
								<ProjectCard project={p} index={i} />
							</ContentBlock>
						))}
					</div>
				</section>
			)}

			{/* Skill rollup */}
			{skills.length > 0 && (
				<section className='mt-10'>
					<div className='mb-6 flex items-center gap-3'>
						<h2 className='font-display text-xl font-bold tracking-normal'>Tech used</h2>
						<span className='bg-border h-px flex-1' />
						<span className='text-muted-foreground font-sans text-xs'>{skills.length}</span>
					</div>
					<div className='flex flex-wrap gap-2'>
						{skills.map(s => (
							<Link
								key={s.name}
								href={`/skills/${s.id}` as never}
								className='border-border hover:border-brand/60 flex items-center gap-1.5 border px-2 py-1 text-xs transition-colors'>
								<SiteIcon icon={s.icon} className='size-4' />
								{s.name}
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Journal entries that reference this organization */}
			<WrittenAbout posts={postsByEntity[organization.id]} />
		</Container>
	)
}

export default CompanyDetail
