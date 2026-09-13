import React from 'react'
import Link from 'next/link'
import PostBody from '@/components/blog/PostBody'
import WrittenAbout from '@/components/blog/WrittenAbout'
import Container from '@/components/cyber/Container'
import CyberIcon from '@/components/cyber/CyberIcon'
import MotionReveal from '@/components/cyber/MotionReveal'
import NeonPanel from '@/components/cyber/NeonPanel'
import ProjectCard from '@/components/projects/ProjectCard'
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
		<p className='text-muted-foreground font-mono text-[0.6rem] tracking-widest uppercase'>{label}</p>
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
				className='text-muted-foreground hover:text-cyber-cyan inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors'>
				<CyberIcon icon='mdi:arrow-left' className='size-4' /> Skill Tree
			</Link>

			{/* Skill header node */}
			<NeonPanel className='clip-notch mt-6 flex items-center gap-5 p-6'>
				<span
					className={cn(
						'perk-node clip-notch-sm flex size-20 shrink-0 items-center justify-center',
						skill.whiteBg && 'bg-white/90'
					)}>
					<CyberIcon icon={skill.icon} className='size-12' />
				</span>
				<div>
					<span className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>// {meta.label} branch</span>
					<h1 className='font-display text-3xl font-bold tracking-wide uppercase md:text-5xl'>{skill.name}</h1>
				</div>
			</NeonPanel>

			{/* The page's only prose. Everything below is derived from other data, so without
			    this a skill page opened straight into a stat grid. */}
			{skill.description && (
				<p className='text-muted-foreground mt-6 max-w-3xl text-base leading-relaxed'>{skill.description}</p>
			)}

			{/* Stat readout */}
			<NeonPanel className='clip-notch-sm mt-6 grid grid-cols-2 gap-4 p-4 sm:grid-cols-4'>
				<StatCell label='Branch'>{meta.label}</StatCell>
				<StatCell label='Deployed'>
					<span className='text-cyber-cyan'>{deployedIn.length} gigs</span>
				</StatCell>
				<StatCell label='First Fielded'>
					{firstFielded ?
						<span className='text-cyber-yellow'>{new Date(firstFielded.startDate).getFullYear()}</span>
					:	'—'}
				</StatCell>
				<StatCell label='Roles'>{fieldRecord.length}</StatCell>
			</NeonPanel>

			{/* Field notes — the original write-up that earns this page its place in the index
			    (common/data/coverage.ts). Everything else on the page is derived from other data. */}
			{note && (
				<section className='mt-10'>
					<div className='mb-6 flex items-center gap-3'>
						<h2 className='font-display text-xl font-bold tracking-wide uppercase'>Field Notes</h2>
						<span className='bg-border h-px flex-1' />
						<time dateTime={note.updatedAt} className='text-muted-foreground font-mono text-xs'>
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
						<h2 className='font-display text-xl font-bold tracking-wide uppercase'>Field Record</h2>
						<span className='bg-border h-px flex-1' />
						<span className='text-muted-foreground font-mono text-xs'>{fieldRecord.length}</span>
					</div>
					<div className='grid gap-4 sm:grid-cols-2'>
						{fieldRecord.map(({ role, gigs }, i) => (
							<MotionReveal key={role.id} delay={(i % 2) * 0.06}>
								<Link
									href={`/career/${role.id}` as never}
									className='group neon-panel clip-notch-sm hover:border-cyber-yellow/60 block p-4 transition-colors'>
									<div className='flex items-start justify-between gap-2'>
										<div className='min-w-0'>
											<h3 className='group-hover:text-cyber-yellow leading-tight font-bold tracking-wide uppercase transition-colors'>
												{humanize(role.position)}
											</h3>
											<p className='text-cyber-cyan truncate text-sm'>{role.organization.name}</p>
										</div>
										{i === 0 && (
											<span className='bg-cyber-yellow shrink-0 px-2 py-0.5 font-mono text-[0.6rem] font-bold tracking-widest text-black uppercase'>
												First Contact
											</span>
										)}
									</div>
									<p className='text-muted-foreground mt-2 font-mono text-[0.65rem] tracking-wider uppercase'>
										{formatExperienceDuration(role.startDate, role.endDate)} · {gigs.length}{' '}
										{gigs.length === 1 ? 'gig' : 'gigs'}
									</p>
								</Link>
							</MotionReveal>
						))}
					</div>
				</section>
			)}

			<section className='mt-10'>
				<div className='mb-6 flex items-center gap-3'>
					<h2 className='font-display text-xl font-bold tracking-wide uppercase'>Deployed In</h2>
					<span className='bg-border h-px flex-1' />
					<span className='text-muted-foreground font-mono text-xs'>{deployedIn.length}</span>
				</div>

				{deployedIn.length > 0 ?
					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{deployedIn.map((p, i) => (
							<MotionReveal key={p.id} delay={(i % 3) * 0.08}>
								<ProjectCard project={p} index={i} />
							</MotionReveal>
						))}
					</div>
				:	<p className='text-muted-foreground font-mono text-sm'>No public gigs tagged with this perk yet.</p>}
			</section>

			{/* Journal entries that reference this skill — the reverse side of post cross-refs */}
			<WrittenAbout posts={postsBySkill[skill.id as SkillId]} />
		</Container>
	)
}

export default SkillDetail
