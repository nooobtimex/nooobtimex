import type { Route } from 'next'
import Link from 'next/link'
import WrittenAbout from '@/components/blog/WrittenAbout'
import ProjectGallery from '@/components/projects/ProjectGallery'
import ProjectMediaHero from '@/components/projects/ProjectMediaHero'
import ProjectTimeline from '@/components/projects/ProjectTimeline'
import Action from '@/components/site/Action'
import Container from '@/components/site/Container'
import ContentBlock from '@/components/site/ContentBlock'
import Panel from '@/components/site/Panel'
import { formatExperienceDuration, formatPosition, projectStatus } from '@/lib/utils'
import { type Project, assets, entitiesData, experiencesData, postsByProject, workStories } from '@/common'

export default function ProjectDetail({ project }: { project: Project }) {
	const roles = (project.linkedExperienceIds ?? []).flatMap(id => {
		const role = experiencesData.find(e => e.id === id)
		return role ? [role] : []
	})
	const client =
		(project.clientOrganizationId ? entitiesData.find(e => e.id === project.clientOrganizationId) : undefined)
		?? roles[0]?.organization
	const via = entitiesData.find(e => e.id === project.viaOrganizationId)
	const story = workStories[project.id]
	const image =
		project.id === 'rs-trophy' ? assets.projects.rsTrophy.preview
		: project.id === 'unitree-g1' ? project.images.photos[0]
		: project.images.cover
	const photos = project.images.photos.filter(src => src !== image && src !== project.images.cover)
	return (
		<Container className='py-10 md:py-14'>
			<Link href='/projects' className='text-brand inline-flex min-h-11 items-center text-sm'>
				← All projects
			</Link>
			<ContentBlock>
				<header className='comic-detail-heading'>
					<p className='text-brand mb-4 text-sm'>Project notes</p>
					<h1>{project.title}</h1>
					<p className='text-muted-foreground mt-6 text-lg leading-relaxed'>
						{story?.context ?? project.summary ?? project.resumeSummary}
					</p>
				</header>
			</ContentBlock>
			<dl className='comic-detail-meta'>
				<div>
					<dt>Organization</dt>
					<dd>
						{client ?
							entitiesData.some(e => e.id === client.id) ?
								<Link href={`/companies/${client.id}` as Route}>{client.name} ↗</Link>
							:	client.name
						:	'Independent'}
					</dd>
				</div>
				<div>
					<dt>Status</dt>
					<dd className='capitalize'>{projectStatus(project).replaceAll('-', ' ')}</dd>
				</div>
				<div>
					<dt>Started</dt>
					<dd>{new Date(project.startDate).getFullYear()}</dd>
				</div>
				{via && (
					<div>
						<dt>Delivered via</dt>
						<dd>
							<Link href={`/companies/${via.id}` as Route}>{via.name} ↗</Link>
						</dd>
					</div>
				)}
			</dl>
			<ProjectMediaHero projectId={project.id} title={project.title} image={image} />
			<div className='reading-layout'>
				<div className='space-y-12'>
					{story && (
						<section>
							<h2 className='comic-section-label'>My part in it</h2>
							<p className='text-lg leading-relaxed'>{story.responsibility}</p>
							<p className='text-muted-foreground mt-4 text-base leading-relaxed'>{story.outcome}</p>
						</section>
					)}
					<section>
						<h2 className='comic-section-label'>The work</h2>
						<p className='comic-prose text-muted-foreground'>{project.description}</p>
					</section>
					{project.timeline?.length ?
						<section>
							<h2 className='comic-section-label'>How it evolved</h2>
							<ProjectTimeline items={project.timeline} />
						</section>
					:	null}
					{photos.length ?
						<section>
							<h2 className='comic-section-label'>Gallery</h2>
							<ProjectGallery photos={photos} title={project.title} />
						</section>
					:	null}
				</div>
				<aside className='space-y-7'>
					<div className='flex flex-col gap-4'>
						{project.links.live && (
							<Action href={project.links.live} external>
								Visit project ↗
							</Action>
						)}
						<Action href={`/card/projects/${project.id}`} download={`${project.id}-card.png`} variant='outline'>
							Download share card
						</Action>
					</div>
					<Panel className='p-5'>
						<h2 className='mb-4 text-lg'>Tools used</h2>
						<div className='flex flex-wrap gap-2'>
							{project.activeSkills.map(skill => (
								<Link
									key={skill.id}
									href={`/skills/${skill.id}` as Route}
									className='comic-tag hover:bg-accent inline-flex min-h-9 items-center px-2.5 py-1 text-xs'>
									{skill.name}
								</Link>
							))}
						</div>
						{project.retiredSkills.length > 0 && (
							<>
								<h3 className='mt-6 mb-3 text-sm'>Previously used</h3>
								<div className='flex flex-wrap gap-2'>
									{project.retiredSkills.map(skill => (
										<Link
											key={skill.id}
											href={`/skills/${skill.id}` as Route}
											className='text-muted-foreground inline-flex min-h-9 items-center text-xs underline underline-offset-4'>
											{skill.name}
										</Link>
									))}
								</div>
							</>
						)}
					</Panel>
					{roles.length > 0 && (
						<Panel className='p-5'>
							<h2 className='mb-4 text-lg'>Where it fits</h2>
							{roles.map(role => (
								<div key={role.id} className='mt-4'>
									<Link href={`/career/${role.id}` as Route} className='text-brand text-base'>
										{formatPosition(role.position)} ↗
									</Link>
									<p className='text-muted-foreground mt-2 text-xs'>
										{role.organization.name}
										<br />
										{formatExperienceDuration(role.startDate, role.endDate)}
									</p>
								</div>
							))}
						</Panel>
					)}
				</aside>
			</div>
			<WrittenAbout posts={postsByProject[project.id]} />
		</Container>
	)
}
