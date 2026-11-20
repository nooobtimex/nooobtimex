import React from 'react'
import ProjectCard from '@/components/projects/ProjectCard'
import Container from '@/components/site/Container'
import ContentBlock from '@/components/site/ContentBlock'
import SectionHeader from '@/components/site/SectionHeader'
import { projectsData } from '@/common'

const ProjectsContent: React.FC = () => {
	return (
		<Container className='py-12 md:py-16'>
			<SectionHeader
				as='h1'
				title='Projects'
				subtitle={`${projectsData.length} builds — systems architected, shipped, and maintained.`}
			/>

			<div className='mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3'>
				{projectsData.map((p, i) => (
					<ContentBlock key={p.id} delay={(i % 3) * 0.08}>
						<ProjectCard project={p} index={i} />
					</ContentBlock>
				))}
			</div>
		</Container>
	)
}

export default ProjectsContent
