import React from 'react'
import HireBand from '@/components/hire/HireBand'
import HomeContent from '@/components/home/HomeContent'
import JsonLd from '@/components/seo/JsonLd'
import { yearsShipping } from '@/lib/profile-stats'
import { PERSON_ID, WEBSITE_ID, personRef, websiteSchema } from '@/lib/schema'
import { DISPLAY_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL, pageMetadata } from '@/lib/seo'
import { formatPosition } from '@/lib/utils'
import { currentEntryId, educationData, latestRole, personalData, skillsData, workExperienceData } from '@/common'

export const metadata = pageMetadata({
	path: '/',
	title: 'Profile',
	absoluteTitle: `${DISPLAY_NAME} — Freelance Full-Stack Software Engineer`,
	description: SITE_DESCRIPTION
})

const alma = educationData[0]?.organization

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	'@id': PERSON_ID,
	// DISPLAY_NAME, not personalData.name — the latter is ALL CAPS for the HUD headings,
	// and this string is what surfaces in a knowledge panel or an AI answer.
	'name': DISPLAY_NAME,
	'alternateName': 'NooobtimeX',
	'url': SITE_URL,
	'image': `${SITE_URL}${personalData.avatar}`,
	'jobTitle': formatPosition(latestRole.position),
	'description': personalData.tagline,
	'email': `mailto:${personalData.contact.email}`,
	'birthDate': personalData.birthDate,
	'address': {
		'@type': 'PostalAddress',
		'addressLocality': personalData.contact.location,
		'addressCountry': 'TH'
	},
	// The Fastwork profile, not the BYOB hire link: `sameAs` names an identity page.
	'sameAs': [
		...personalData.socialLinks.filter(s => s.platform !== 'email').map(s => s.url),
		personalData.hire.profileUrl
	],
	'knowsLanguage': personalData.languages.map(l => ({
		'@type': 'Language',
		'name': l.name,
		'alternateName': l.code
	})),
	'knowsAbout': skillsData.map(s => s.name),
	...(alma && {
		alumniOf: {
			'@type': 'CollegeOrUniversity',
			'name': alma.name,
			...(alma.url && { sameAs: alma.url })
		}
	}),
	'worksFor': {
		'@type': 'Organization',
		'name': latestRole.organization.name,
		...(latestRole.organization.url && { sameAs: latestRole.organization.url })
	}
}

const profilePageLd = {
	'@context': 'https://schema.org',
	'@type': 'ProfilePage',
	'url': SITE_URL,
	'name': SITE_NAME,
	'isPartOf': { '@id': WEBSITE_ID },
	'mainEntity': personRef(),
	'inLanguage': 'en'
}

const Home: React.FC = () => {
	// One "now" for every date-derived value on the page. Prerendered, so this is the build.
	const now = new Date()
	return (
		<>
			<JsonLd data={jsonLd} />
			<JsonLd data={websiteSchema()} />
			<JsonLd data={profilePageLd} />
			<HomeContent
				nowId={currentEntryId(workExperienceData, now)}
				yearsShipping={yearsShipping(workExperienceData, now)}
			/>
			<HireBand code='07' />
		</>
	)
}

export default Home
