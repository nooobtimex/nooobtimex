import React from 'react'
import Container from '@/components/cyber/Container'
import CyberIcon from '@/components/cyber/CyberIcon'
import MotionReveal from '@/components/cyber/MotionReveal'
import SectionHeader from '@/components/cyber/SectionHeader'
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
								<span className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>
									{String(idx + 1).padStart(2, '0')}
								</span>
								<CyberIcon icon={meta.icon} className='text-cyber-yellow size-5' />
								<h3 className='font-display text-xl font-bold tracking-wide uppercase'>{meta.label}</h3>
								<span className='bg-border h-px flex-1' />
								<span className='text-muted-foreground font-mono text-xs'>{items.length}</span>
							</div>

							<p className='text-muted-foreground mb-6 max-w-3xl text-sm leading-relaxed'>{meta.description}</p>

							<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
								{items.map((skill, i) => (
									<MotionReveal key={skill.name} delay={(i % 5) * 0.04}>
										<SkillNode skill={skill} />
									</MotionReveal>
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
