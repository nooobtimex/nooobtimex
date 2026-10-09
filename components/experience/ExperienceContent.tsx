/**
 * A server component — see the note on HomeContent. It was `'use client'` purely for the
 * `new Date()` that picked the NOW node; that now arrives as the `nowId` prop.
 */
import React from 'react'
import CompanyGrid from '@/components/companies/CompanyGrid'
import Container from '@/components/cyber/Container'
import MotionReveal from '@/components/cyber/MotionReveal'
import SectionHeader from '@/components/cyber/SectionHeader'
import TraceNode from '@/components/experience/TraceNode'
import { experiencesData } from '@/common'

interface ExperienceContentProps {
	/** Resolved on the server — see `currentEntryId` for why it is not computed here. */
	nowId?: string
}

const ExperienceContent: React.FC<ExperienceContentProps> = ({ nowId }) => {
	return (
		<Container className='py-12 md:py-16'>
			<SectionHeader
				as='h1'
				code='03'
				title='Career Trace'
				subtitle='Chronological lifepath — roles, freelance work, and education.'
			/>

			<div className='relative mt-12'>
				{/* central spine */}
				<span className='spine-line absolute top-0 bottom-0 left-5 w-px lg:left-1/2 lg:-translate-x-1/2' />

				<div className='space-y-8'>
					{experiencesData.map((item, i) => (
						<MotionReveal key={item.id} delay={(i % 2) * 0.06}>
							<TraceNode item={item} side={i % 2 === 0 ? 'left' : 'right'} isNow={item.id === nowId} />
						</MotionReveal>
					))}
				</div>
			</div>

			<CompanyGrid />
		</Container>
	)
}

export default ExperienceContent
