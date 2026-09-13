import React from 'react'
import Link from 'next/link'
import CyberIcon from '@/components/cyber/CyberIcon'
import { formatMilestoneDate } from '@/lib/utils'
import { type Post, categoryMetadataPosts, chapterMetadata } from '@/common'

interface PostCardProps {
	post: Post
	index?: number
}

/**
 * The blog analogue of `ProjectCard` — same panel, corners and hover grammar, but
 * text-first: most posts carry no cover, so the banner slot is used only when one exists.
 */
const PostCard: React.FC<PostCardProps> = ({ post, index = 0 }) => {
	return (
		<Link
			href={`/blog/${post.id}` as never}
			className='group neon-panel clip-notch hover:border-cyber-yellow/60 relative flex h-full flex-col overflow-hidden transition-colors'>
			{post.cover && (
				<div className='border-border/60 relative aspect-[16/9] w-full overflow-hidden border-b'>
					<img
						src={post.cover}
						alt=''
						loading='lazy'
						decoding='async'
						className='absolute inset-0 size-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100'
					/>
					<div className='from-background/90 via-background/20 absolute inset-0 bg-gradient-to-t to-transparent' />
				</div>
			)}

			<div className='flex flex-1 flex-col gap-3 p-4'>
				<div className='flex items-center justify-between font-mono text-[0.65rem] tracking-widest'>
					<span className='text-cyber-cyan'>{String(index + 1).padStart(2, '0')} //</span>
					{/* When the work happened — the journey order the archive is read in. */}
					<span className='text-muted-foreground'>{formatMilestoneDate(post.happenedAt)}</span>
				</div>
				<h3 className='font-display group-hover:text-cyber-yellow text-xl leading-tight font-bold tracking-wide transition-colors'>
					{post.title}
				</h3>
				<p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>{post.description}</p>
				<p className='text-muted-foreground mt-auto pt-2 font-mono text-[0.65rem] tracking-wider uppercase'>
					{chapterMetadata[post.chapter].label}
					{post.series && ` · Part ${post.series.part}`}
				</p>
			</div>

			<div className='border-border/60 flex items-center justify-between border-t px-4 py-2'>
				<span className='font-mono text-[0.65rem] tracking-widest uppercase' style={{ color: post.accent }}>
					{categoryMetadataPosts[post.category].label}
				</span>
				<span className='text-muted-foreground flex items-center gap-2 font-mono text-[0.65rem] tracking-widest uppercase'>
					{post.readingMinutes} min
					<CyberIcon icon='mdi:arrow-top-right' className='group-hover:text-cyber-yellow size-4 transition-colors' />
				</span>
			</div>
		</Link>
	)
}

export default PostCard
