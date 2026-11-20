import React from 'react'
import { InlineText } from '@/lib/inline'
import type { PostFaq as Faq } from '@/common'

/**
 * The visible half of the FAQ contract. The route emits `faqSchema(faqs)` from the
 * SAME array, so the page and its FAQPage JSON-LD can never disagree — schema for
 * content a page does not show reads as spam.
 */
const PostFaq: React.FC<{ faqs: Faq[] }> = ({ faqs }) => (
	<section className='mt-10'>
		<div className='mb-6 flex items-center gap-3'>
			<h2 className='font-display text-xl font-bold tracking-normal md:text-xl'>FAQ</h2>
			<span className='bg-border h-px flex-1' />
			<span className='text-muted-foreground font-sans text-xs'>{faqs.length}</span>
		</div>
		<div className='space-y-4'>
			{faqs.map((f, i) => (
				<details key={i} className='surface group rounded-lg p-4' open={i === 0}>
					<summary className='cursor-pointer list-none font-semibold'>
						<span className='text-brand mr-2 font-sans text-xs'>Q{i + 1} //</span>
						{f.q}
					</summary>
					<p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
						<InlineText text={f.a} />
					</p>
				</details>
			))}
		</div>
	</section>
)

export default PostFaq
