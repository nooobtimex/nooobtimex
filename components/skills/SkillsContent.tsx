import React from 'react'
import Container from '@/components/site/Container'
import ContentBlock from '@/components/site/ContentBlock'
import SectionHeader from '@/components/site/SectionHeader'
import SiteIcon from '@/components/site/SiteIcon'
import SkillNode from '@/components/skills/SkillNode'
import { SkillCategory, categoryMetadata, skillsData } from '@/common'

const ORDER: SkillCategory[] = ['frontend', 'backend', 'infrastructure', 'growth-management']

const SkillsContent: React.FC = () => {
	return (
		<Container className='py-12 md:py-16'>
			<SectionHeader
				as='h1'
				title='Skills'
				subtitle={`${skillsData.length} skills across frontend, backend, infrastructure, and growth.`}
			/>

			<div className='mt-12 space-y-12'>
				{ORDER.map((category, idx) => {
					const meta = categoryMetadata[category]
					const items = skillsData.filter(s => s.category === category)
					if (items.length === 0) return null

					return (
						<section key={category}>
							<div className='mb-5 flex items-center gap-3'>
								<span className='text-brand font-sans text-xs tracking-normal'>{String(idx + 1).padStart(2, '0')}</span>
								<SiteIcon icon={meta.icon} className='text-brand size-5' />
								<h3 className='font-display text-xl font-bold tracking-normal'>{meta.label}</h3>
								<span className='bg-border h-px flex-1' />
								<span className='text-muted-foreground font-sans text-xs'>{items.length}</span>
							</div>

							<p className='text-muted-foreground mb-6 max-w-3xl text-sm leading-relaxed'>{meta.description}</p>

							<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
								{items.map((skill, i) => (
									<ContentBlock key={skill.name} delay={(i % 5) * 0.04}>
										<SkillNode skill={skill} />
									</ContentBlock>
								))}
							</div>
						</section>
					)
				})}
			</div>
		</Container>
	)
}

export default SkillsContent
