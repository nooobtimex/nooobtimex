import React from 'react'
import ExperienceContent from '@/components/experience/ExperienceContent'
import { pageMetadata } from '@/lib/seo'
import { currentEntryId, experiencesData } from '@/common'

export const metadata = pageMetadata({
	path: '/career',
	title: 'Career',
	description:
		'Professional roles, freelance work, and education across the timeline — and the organizations behind them.'
})

const ExperiencePage: React.FC = () => {
	return <ExperienceContent nowId={currentEntryId(experiencesData, new Date())} />
}

export default ExperiencePage
