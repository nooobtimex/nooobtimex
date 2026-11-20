import React from 'react'
import Link from 'next/link'
import PostBody from '@/components/blog/PostBody'
import WrittenAbout from '@/components/blog/WrittenAbout'
import ProjectCard from '@/components/projects/ProjectCard'
import Container from '@/components/site/Container'
import ContentBlock from '@/components/site/ContentBlock'
import Panel from '@/components/site/Panel'
import SiteIcon from '@/components/site/SiteIcon'
import { cn, formatExperienceDuration } from '@/lib/utils'
import {
	type Skill,
	type SkillId,
	categoryMetadata,
	experiencesData,
	postsBySkill,
	projectsData,
	skillNotes
} from '@/common'

const humanize = (value: string) =>
	value
		.split('-')
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')

interface SkillDetailProps {
	skill: Skill
}

const StatCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<div className='border-border/60 border-l-2 pl-3'>
		<p className='text-muted-foreground font-sans text-xs tracking-normal'>{label}</p>
		<p className='mt-0.5 text-sm font-semibold'>{children}</p>
	</div>
)

const SkillDetail: React.FC<SkillDetailProps> = ({ skill }) => {
	const meta = categoryMetadata[skill.category]
	const note = skillNotes[skill.id as SkillId]
	const deployedIn = projectsData.filter(p => p.skills.some(s => s.id === skill.id))

	// Roles that fielded this skill (via linked projects), oldest first — the
	// earliest is where the skill was first put to work.
	const fieldRecord = experiencesData
		.filter(role => deployedIn.some(p => p.linkedExperienceIds?.includes(role.id)))
		.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
		.map(role => ({
			role,
			gigs: deployedIn.filter(p => p.linkedExperienceIds?.includes(role.id))
		}))
	const firstFielded = fieldRecord[0]?.role

	return (
		<Container className='py-10'>
			<Link
				href='/skills'
				className='text-muted-foreground hover:text-brand inline-flex items-center gap-2 font-sans text-xs tracking-normal transition-colors'>
				<SiteIcon icon='mdi:arrow-left' className='size-4' /> All skills
			</Link>

			{/* Skill header node */}
			<Panel className='comic-detail-heading mt-6 flex flex-wrap items-center gap-5 rounded-xl p-6'>
				<span
					className={cn(
						'skill-node flex size-20 shrink-0 items-center justify-center rounded-lg',
						skill.whiteBg && 'bg-white/90'
					)}>
					<SiteIcon icon={skill.icon} className='size-12' />
				</span>
				<div>
					<span className='text-brand font-sans text-xs tracking-normal'>{meta.label} skill</span>
					<h1 className='font-display text-3xl font-bold tracking-normal md:text-5xl'>{skill.name}</h1>
				</div>
			</Panel>

			{/* The page's only prose. Everything below is derived from other data, so without
			    this a skill page opened straight into a stat grid. */}
			{skill.description && (
				<p className='text-muted-foreground mt-6 max-w-3xl text-base leading-relaxed'>{skill.description}</p>
			)}

			{/* Stat readout */}
			<Panel className='mt-6 grid grid-cols-2 gap-4 rounded-lg p-4 sm:grid-cols-4'>
				<StatCell label='Category'>{meta.label}</StatCell>
				<StatCell label='Projects'>
					<span className='text-brand'>{deployedIn.length}</span>
				</StatCell>
				<StatCell label='First used'>
					{firstFielded ?
						<span className='text-brand'>{new Date(firstFielded.startDate).getFullYear()}</span>
					:	'—'}
				</StatCell>
				<StatCell label='Roles'>{fieldRecord.length}</StatCell>
			</Panel>

			{/* Field notes — the original write-up that earns this page its place in the index
			    (common/data/coverage.ts). Everything else on the page is derived from other data. */}
			{note && (
				<section className='mt-10'>
					<div className='mb-6 flex items-center gap-3'>
						<h2 className='font-display text-xl font-bold tracking-normal'>Notes</h2>
						<span className='bg-border h-px flex-1' />
						<time dateTime={note.updatedAt} className='text-muted-foreground font-sans text-xs'>
							{note.updatedAt}
						</time>
					</div>
					<div className='max-w-3xl'>
						<PostBody body={note.body} />
					</div>
				</section>
			)}

			{/* Field record — which role first put this skill to work, and every role since */}
			{fieldRecord.length > 0 && (
				<section className='mt-10'>
					<div className='mb-6 flex items-center gap-3'>
						<h2 className='font-display text-xl font-bold tracking-normal'>Used in roles</h2>
						<span className='bg-border h-px flex-1' />
						<span className='text-muted-foreground font-sans text-xs'>{fieldRecord.length}</span>
					</div>
					<div className='grid gap-4 sm:grid-cols-2'>
						{fieldRecord.map(({ role, gigs }, i) => (
							<ContentBlock key={role.id} delay={(i % 2) * 0.06}>
								<Link
									href={`/career/${role.id}` as never}
									className='group surface hover:border-brand/60 block rounded-lg p-4 transition-colors'>
									<div className='flex items-start justify-between gap-2'>
										<div className='min-w-0'>
											<h3 className='group-hover:text-brand leading-tight font-bold tracking-normal transition-colors'>
												{humanize(role.position)}
											</h3>
											<p className='text-brand truncate text-sm'>{role.organization.name}</p>
										</div>
										{i === 0 && (
											<span className='bg-brand text-primary-foreground shrink-0 px-2 py-0.5 font-sans text-xs font-bold tracking-normal'>
												First used
											</span>
										)}
									</div>
									<p className='text-muted-foreground mt-2 font-sans text-xs tracking-normal'>
										{formatExperienceDuration(role.startDate, role.endDate)} · {gigs.length}{' '}
										{gigs.length === 1 ? 'project' : 'projects'}
									</p>
								</Link>
							</ContentBlock>
						))}
					</div>
				</section>
			)}

			<section className='mt-10'>
				<div className='mb-6 flex items-center gap-3'>
					<h2 className='font-display text-xl font-bold tracking-normal'>Used in projects</h2>
					<span className='bg-border h-px flex-1' />
					<span className='text-muted-foreground font-sans text-xs'>{deployedIn.length}</span>
				</div>

				{deployedIn.length > 0 ?
					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{deployedIn.map((p, i) => (
							<ContentBlock key={p.id} delay={(i % 3) * 0.08}>
								<ProjectCard project={p} index={i} />
							</ContentBlock>
						))}
					</div>
				:	<p className='text-muted-foreground font-sans text-sm'>No public projects use this skill yet.</p>}
			</section>

			{/* Journal entries that reference this skill — the reverse side of post cross-refs */}
			<WrittenAbout posts={postsBySkill[skill.id as SkillId]} />
		</Container>
	)
}

export default SkillDetail
