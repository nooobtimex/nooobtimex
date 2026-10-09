import React from 'react'
import Container from '@/components/cyber/Container'
import MotionReveal from '@/components/cyber/MotionReveal'
import SectionHeader from '@/components/cyber/SectionHeader'
import ProjectCard from '@/components/projects/ProjectCard'
import { projectsData } from '@/common'

const ProjectsContent: React.FC = () => {
	return (
		<Container className='py-12 md:py-16'>
			<SectionHeader
				as='h1'
				title='Projects'
				subtitle={`${projectsData.length} builds — systems architected, shipped, and maintained.`}
			/>

			<div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
				{projectsData.map((p, i) => (
					<MotionReveal key={p.id} delay={(i % 3) * 0.08}>
						<ProjectCard project={p} index={i} />
					</MotionReveal>
				))}
			</div>
		</Container>
	)
}

export default ProjectsContent
