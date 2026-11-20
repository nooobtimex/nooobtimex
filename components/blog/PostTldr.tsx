import React from 'react'
import { InlineText } from '@/lib/inline'

/**
 * The answer block — always the FIRST content element of a post. This is the
 * paragraph an answer engine lifts, which is why it renders before any narrative:
 * most LLM citations come from the first third of a page.
 */
const PostTldr: React.FC<{ tldr: string }> = ({ tldr }) => (
	<section className='surface surface-emphasis rounded-xl p-5'>
		<h2 className='text-brand font-sans text-xs tracking-normal md:text-xs'>TL;DR</h2>
		<p className='text-foreground/90 mt-3 text-base leading-relaxed'>
			<InlineText text={tldr} />
		</p>
	</section>
)

export default PostTldr
