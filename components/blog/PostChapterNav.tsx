import React from 'react'
import Link from 'next/link'
import SiteIcon from '@/components/site/SiteIcon'
import { type Post, chapterMetadata, postsData, postsInSeries } from '@/common'

/**
 * Journey navigation: previous/next within the chapter (by the date the work
 * happened), plus the series strip when the post belongs to one.
 */
const PostChapterNav: React.FC<{ post: Post }> = ({ post }) => {
	// Chapter timeline runs oldest → newest, the direction the journey is read in.
	const chapter = postsData
		.filter(p => p.chapter === post.chapter)
		.sort((a, b) => a.happenedAt.localeCompare(b.happenedAt))
	const at = chapter.findIndex(p => p.id === post.id)
	const prev = at > 0 ? chapter[at - 1] : undefined
	const next = at < chapter.length - 1 ? chapter[at + 1] : undefined
	const series = post.series ? postsInSeries(post.series.id) : []

	return (
		<div className='space-y-6'>
			{series.length > 1 && (
				<div className='surface rounded-lg p-4'>
					<h3 className='text-brand mb-3 font-sans text-xs tracking-normal md:text-xs'>
						Series · Part {post.series!.part} of {series.length}
					</h3>
					<ol className='space-y-2'>
						{series.map(s => (
							<li key={s.id}>
								{s.id === post.id ?
									<span className='text-brand block text-sm leading-snug'>
										<span className='mr-1.5 font-sans text-xs'>{String(s.series!.part).padStart(2, '0')}</span>
										{s.title}
									</span>
								:	<Link
										href={`/blog/${s.id}` as never}
										className='text-muted-foreground hover:text-brand block text-sm leading-snug transition-colors'>
										<span className='text-brand mr-1.5 font-sans text-xs'>
											{String(s.series!.part).padStart(2, '0')}
										</span>
										{s.title}
									</Link>
								}
							</li>
						))}
					</ol>
				</div>
			)}

			{(prev || next) && (
				<div className='surface rounded-lg p-4'>
					<h3 className='text-brand mb-3 font-sans text-xs tracking-normal md:text-xs'>
						{chapterMetadata[post.chapter].label}
					</h3>
					<div className='space-y-3'>
						{prev && (
							<Link
								href={`/blog/${prev.id}` as never}
								className='text-muted-foreground hover:text-brand group flex items-start gap-2 text-sm leading-snug transition-colors'>
								<SiteIcon icon='mdi:arrow-left' className='mt-0.5 size-4 shrink-0' />
								<span>{prev.title}</span>
							</Link>
						)}
						{next && (
							<Link
								href={`/blog/${next.id}` as never}
								className='text-muted-foreground hover:text-brand group flex items-start gap-2 text-sm leading-snug transition-colors'>
								<SiteIcon icon='mdi:arrow-right' className='mt-0.5 size-4 shrink-0' />
								<span>{next.title}</span>
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default PostChapterNav
