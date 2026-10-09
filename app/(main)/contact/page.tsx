import React from 'react'
import ContactContent from '@/components/contact/ContactContent'
import JsonLd from '@/components/seo/JsonLd'
import { PERSON_ID } from '@/lib/schema'
import { DISPLAY_NAME, SITE_URL, pageMetadata } from '@/lib/seo'
import { personalData } from '@/common'

export const metadata = pageMetadata({
	path: '/contact',
	// Matches the nav label. "Hire me" is the header button that opens Fastwork directly —
	// one label for two destinations was the confusion this page used to create.
	title: 'Contact',
	description:
		'How to hire me for a web app project through Fastwork, plus a scannable contact card and channels with mainland-China availability marked.'
})

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'ContactPage',
	'url': `${SITE_URL}/contact`,
	/*
	 * `@id` matters more than it looks. Without it this declared a SECOND, unrelated
	 * Person — a different name (personalData.name is ALL CAPS) with no link back to the
	 * one on the home page. A parser building an entity graph saw two people. Referencing
	 * PERSON_ID merges them, which is the whole point of the ids in lib/schema.ts.
	 */
	'mainEntity': {
		'@id': PERSON_ID,
		'@type': 'Person',
		'name': DISPLAY_NAME,
		'url': SITE_URL,
		'email': `mailto:${personalData.contact.email}`,
		'address': {
			'@type': 'PostalAddress',
			'addressLocality': personalData.contact.location,
			'addressCountry': 'TH'
		}
	}
}

const ContactPage: React.FC = () => {
	return (
		<>
			<JsonLd data={jsonLd} />
			<ContactContent />
		</>
	)
}

export default ContactPage
