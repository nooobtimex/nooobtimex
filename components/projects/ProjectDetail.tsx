import React from 'react'
import Link from 'next/link'
import WrittenAbout from '@/components/blog/WrittenAbout'
import Container from '@/components/cyber/Container'
import CyberButton from '@/components/cyber/CyberButton'
import CyberIcon from '@/components/cyber/CyberIcon'
import NeonPanel from '@/components/cyber/NeonPanel'
import ProjectGallery from '@/components/projects/ProjectGallery'
import ProjectTimeline from '@/components/projects/ProjectTimeline'
import { type ProjectStatus, formatExperienceDuration, projectStatus } from '@/lib/utils'
import { type Project, entitiesData, experiencesData, postsByProject } from '@/common'

interface ProjectDetailProps {
	project: Project
}

/** The dossier's wording and signal colour per status — it says "Active" where the card says "Live". */
const STATUS_META = {
	'live': { label: 'Active', className: 'text-cyber-cyan' },
	'in-development': { label: 'In Development', className: 'text-cyber-yellow' },
	'archived': { label: 'Archived', className: 'text-muted-foreground' }
} satisfies Record<ProjectStatus, { label: string; className: string }>

const MetaCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<div className='border-border/60 border-l-2 pl-3'>
		<p className='text-muted-foreground font-mono text-[0.6rem] tracking-widest uppercase'>{label}</p>
		<p className='mt-0.5 text-sm font-semibold'>{children}</p>
	</div>
)

/**
 * Education-only orgs (e.g. Thammasat) are deliberately excluded from `entitiesData`,
 * so they have no /companies page — linking one would be exactly the class of broken
 * internal href `scripts/links/check.ts` fails the build over. Text, not a Link.
 */
const hasCompanyPage = (id: string) => entitiesData.some(e => e.id === id)

const humanize = (value: string) =>
	value
		.split('-')
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
	const year = new Date(project.startDate).getFullYear()
	const status = STATUS_META[projectStatus(project)]
	const tier = Math.min(3, Math.max(1, Math.ceil(project.activeSkills.length / 4)))
	// Role(s) this project was delivered under — primary role first.
	const linkedRoles = (project.linkedExperienceIds ?? []).flatMap(id => {
		const role = experiencesData.find(e => e.id === id)
		return role ? [role] : []
	})
	// Explicit client/partner wins; otherwise fall back to the delivering role's org.
	const client =
		(project.clientOrganizationId ? entitiesData.find(e => e.id === project.clientOrganizationId) : undefined)
		?? linkedRoles[0]?.organization
	// Org the work was seconded to / delivered via — a credit, not an employer.
	const via = project.viaOrganizationId ? entitiesData.find(e => e.id === project.viaOrganizationId) : undefined
	const extraPhotos = project.images.photos.filter(p => p !== project.images.cover)

	return (
		<Container className='py-10'>
			<Link
				href='/projects'
				className='text-muted-foreground hover:text-cyber-cyan inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors'>
				<CyberIcon icon='mdi:arrow-left' className='size-4' /> Gig Board
			</Link>

			{/* Banner */}
			<NeonPanel className='clip-notch relative mt-6 aspect-[16/8] w-full overflow-hidden p-0'>
				<img
					src={project.images.cover}
					alt={project.title}
					loading='eager'
					fetchPriority='high'
					decoding='async'
					className='absolute inset-0 size-full object-cover'
				/>
				<div className='from-background/95 via-background/30 absolute inset-0 bg-gradient-to-t to-transparent' />
				<span className='text-cyber-cyan absolute top-3 left-4 font-mono text-[0.65rem] tracking-[0.3em] uppercase'>
					// Gig Dossier
				</span>
				<div className='absolute bottom-0 left-0 p-6'>
					<h1 className='font-display text-3xl leading-none font-bold tracking-wide uppercase md:text-5xl'>
						{project.title}
					</h1>
				</div>
			</NeonPanel>

			{/* Meta row */}
			<NeonPanel className='clip-notch-sm mt-6 grid grid-cols-2 gap-4 p-4 sm:grid-cols-4'>
				<MetaCell label='Client'>
					{client ?
						hasCompanyPage(client.id) ?
							<Link href={`/companies/${client.id}` as never} className='hover:text-cyber-yellow transition-colors'>
								{client.name}
							</Link>
						:	client.name
					:	'Independent'}
				</MetaCell>
				{via && (
					<MetaCell label='Seconded To'>
						<Link href={`/companies/${via.id}` as never} className='hover:text-cyber-yellow transition-colors'>
							{via.name}
						</Link>
					</MetaCell>
				)}
				<MetaCell label='Tier'>
					<span className='text-cyber-magenta'>{'▲'.repeat(tier)}</span>
				</MetaCell>
				<MetaCell label='Status'>
					<span className={status.className}>{status.label}</span>
				</MetaCell>
				<MetaCell label='Year'>{year}</MetaCell>
			</NeonPanel>

			<div className='mt-8 grid gap-8 md:grid-cols-[1fr_260px]'>
				{/* Main */}
				<div className='space-y-8'>
					<section>
						<h2 className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// Brief</h2>
						<p className='text-muted-foreground mt-3 leading-relaxed'>{project.description}</p>
					</section>

					{project.timeline && project.timeline.length > 0 && (
						<section>
							<h2 className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// Timeline</h2>
							<div className='mt-6'>
								<ProjectTimeline items={project.timeline} />
							</div>
						</section>
					)}

					{extraPhotos.length > 0 && (
						<section>
							<h2 className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// Gallery</h2>
							<div className='mt-3'>
								<ProjectGallery photos={extraPhotos} title={project.title} />
							</div>
						</section>
					)}
				</div>

				{/* Sidebar */}
				<aside className='space-y-6'>
					{project.links.live && (
						<CyberButton href={project.links.live} external className='w-full'>
							<CyberIcon icon='mdi:flash' /> Jack In
						</CyberButton>
					)}

					<CyberButton
						href={`/card/projects/${project.id}`}
						download={`${project.id}-card.png`}
						variant='outline'
						className='w-full'>
						<CyberIcon icon='mdi:download' /> 1:1 Card
					</CyberButton>

					<NeonPanel className='clip-notch-sm p-4'>
						<h3 className='text-cyber-cyan mb-3 font-mono text-xs tracking-widest uppercase'>Loadout</h3>
						<div className='flex flex-wrap gap-2'>
							{project.activeSkills.map(a => (
								<Link
									key={a.name}
									href={`/skills/${a.id}` as never}
									className='border-border hover:border-cyber-cyan/60 flex items-center gap-1.5 border px-2 py-1 text-xs transition-colors'>
									<CyberIcon icon={a.icon} className='size-4' />
									{a.name}
								</Link>
							))}
							{project.retiredSkills.map(a => (
								<Link
									key={a.name}
									href={`/skills/${a.id}` as never}
									title='Retired from this project'
									className='border-border/40 text-muted-foreground hover:border-cyber-magenta/50 flex items-center gap-1.5 border px-2 py-1 text-xs opacity-60 transition-colors'>
									<CyberIcon icon={a.icon} className='size-4' />
									<span className='line-through'>{a.name}</span>
								</Link>
							))}
						</div>
					</NeonPanel>

					{linkedRoles.length > 0 && (
						<NeonPanel className='clip-notch-sm p-4'>
							<h3 className='text-cyber-cyan mb-2 font-mono text-xs tracking-widest uppercase'>
								{linkedRoles.length > 1 ? 'Roles' : 'Role'}
							</h3>
							<div className='space-y-3'>
								{linkedRoles.map(role => (
									<div key={role.id}>
										<Link
											href={`/career/${role.id}` as never}
											className='hover:text-cyber-yellow flex items-center gap-2 text-sm transition-colors'>
											<CyberIcon icon='mdi:account-tie-outline' className='size-4 shrink-0' />
											{humanize(role.position)}
										</Link>
										{hasCompanyPage(role.organization.id) ?
											<Link
												href={`/companies/${role.organization.id}` as never}
												className='text-muted-foreground hover:text-cyber-cyan mt-0.5 block pl-6 font-mono text-[0.65rem] tracking-wider uppercase transition-colors'>
												{role.organization.name} · {formatExperienceDuration(role.startDate, role.endDate)}
											</Link>
										:	<span className='text-muted-foreground mt-0.5 block pl-6 font-mono text-[0.65rem] tracking-wider uppercase'>
												{role.organization.name} · {formatExperienceDuration(role.startDate, role.endDate)}
											</span>
										}
									</div>
								))}
							</div>
						</NeonPanel>
					)}
				</aside>
			</div>

			{/* Journal entries that reference this project */}
			<WrittenAbout posts={postsByProject[project.id]} />
		</Container>
	)
}

export default ProjectDetail
