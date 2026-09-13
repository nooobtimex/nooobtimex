import React from 'react'
import Link from 'next/link'
import MotionReveal from '@/components/cyber/MotionReveal'
import { formatMilestoneDate } from '@/lib/utils'
import type { Post } from '@/common'

/**
 * The reverse side of post cross-references — dropped into the skill / project /
 * career / company detail pages. Renders nothing when the list is empty, so pages
 * without posts are untouched. Fed by the `postsBy*` indexes, which are built from
 * `postsData` — drafts can never leak through here.
 */
const WrittenAbout: React.FC<{ posts?: Post[] }> = ({ posts }) => {
	if (!posts || posts.length === 0) return null

	return (
		<section className='mt-10'>
			<div className='mb-6 flex items-center gap-3'>
				<h2 className='font-display text-xl font-bold tracking-wide uppercase md:text-xl'>Written About</h2>
				<span className='bg-border h-px flex-1' />
				<span className='text-muted-foreground font-mono text-xs'>{posts.length}</span>
			</div>
			<div className='grid gap-4 sm:grid-cols-2'>
				{posts.map((p, i) => (
					<MotionReveal key={p.id} delay={(i % 2) * 0.06}>
						<Link
							href={`/blog/${p.id}` as never}
							className='group neon-panel clip-notch-sm hover:border-cyber-yellow/60 block p-4 transition-colors'>
							<h3 className='group-hover:text-cyber-yellow leading-tight font-bold tracking-wide transition-colors'>
								{p.title}
							</h3>
							<p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed'>{p.description}</p>
							<p className='text-muted-foreground mt-2 font-mono text-[0.65rem] tracking-wider uppercase'>
								{formatMilestoneDate(p.happenedAt)} · {p.readingMinutes} min
							</p>
						</Link>
					</MotionReveal>
				))}
			</div>
		</section>
	)
}

export default WrittenAbout
