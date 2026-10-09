import React from 'react'
import { slugify } from '@/lib/utils'
import type { PostBlock } from '@/common'

/** Sidebar TOC — derived from the `h2` blocks with the same `slugify` PostBody uses. */
const PostToc: React.FC<{ body: PostBlock[] }> = ({ body }) => {
	const headings = body.filter((b): b is Extract<PostBlock, { kind: 'h2' }> => b.kind === 'h2')
	if (headings.length < 2) return null

	return (
		<nav aria-label='Table of contents' className='neon-panel clip-notch-sm p-4'>
			<h3 className='text-cyber-cyan mb-3 font-mono text-xs tracking-widest uppercase md:text-xs'>// Contents</h3>
			<ol className='space-y-2'>
				{headings.map((h, i) => (
					<li key={i}>
						<a
							href={`#${slugify(h.text)}`}
							className='text-muted-foreground hover:text-cyber-yellow block text-sm leading-snug transition-colors'>
							<span className='text-cyber-cyan/60 mr-1.5 font-mono text-[0.65rem]'>
								{String(i + 1).padStart(2, '0')}
							</span>
							{h.text}
						</a>
					</li>
				))}
			</ol>
		</nav>
	)
}

export default PostToc
