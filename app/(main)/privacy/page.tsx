import React from 'react'
import PostBody from '@/components/blog/PostBody'
import Container from '@/components/cyber/Container'
import SectionHeader from '@/components/cyber/SectionHeader'
import { pageMetadata } from '@/lib/seo'
import { privacyPolicy } from '@/common'

export const metadata = pageMetadata({
	path: '/privacy',
	title: 'Privacy Policy',
	description:
		'What nooobtimex.me collects — nothing of its own — and how Google Analytics, AdSense ads on Journal posts, and the hosting providers handle your data.'
})

/**
 * The policy text lives in `common/data/privacy.ts` and renders through the Journal's block
 * renderer, so it takes no markup of its own and inherits the article typography.
 */
const PrivacyPage: React.FC = () => (
	<Container className='py-12 md:py-16'>
		<SectionHeader as='h1' code='00' title='Privacy Policy' subtitle='How this site handles your data.' />
		<p className='text-muted-foreground mt-4 font-mono text-xs tracking-widest uppercase'>
			Last updated <time dateTime={privacyPolicy.updatedAt}>{privacyPolicy.updatedAt}</time>
		</p>
		<div className='mt-10 max-w-3xl'>
			<PostBody body={privacyPolicy.body} />
		</div>
	</Container>
)

export default PrivacyPage
