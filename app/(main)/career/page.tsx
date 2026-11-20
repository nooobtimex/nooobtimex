import React from 'react'
import ExperienceContent from '@/components/experience/ExperienceContent'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
	path: '/career',
	title: 'About',
	description:
		'Meet Kwan (NooobtimeX): CTO at RS TROPHY, co-founder of Thaibotic, and a software engineer building systems, robots, and a Roblox game.'
})

const ExperiencePage: React.FC = () => {
	return <ExperienceContent />
}

export default ExperiencePage
