import type { Route } from 'next'
import Link from 'next/link'
import { formatMilestoneDate } from '@/lib/utils'
import { type Post, categoryMetadataPosts } from '@/common'

export default function PostCard({ post }: { post: Post; index?: number }) {
	return (
		<Link href={`/blog/${post.id}` as Route} className='comic-card group flex h-full flex-col p-6'>
			<div className='mb-5 flex flex-wrap items-center justify-between gap-2'>
				<span className='comic-card-label'>{categoryMetadataPosts[post.category].label}</span>
				<span className='text-muted-foreground text-xs'>{formatMilestoneDate(post.happenedAt)}</span>
			</div>
			<h3 className='group-hover:text-brand text-xl leading-snug'>{post.title}</h3>
			<p className='text-muted-foreground mt-4 text-base leading-relaxed'>{post.description}</p>
			<p className='text-muted-foreground mt-auto flex justify-between gap-3 border-t pt-5 text-xs'>
				{post.readingMinutes} min read{' '}
				<span aria-hidden='true' className='text-brand text-lg'>
					↗
				</span>
			</p>
		</Link>
	)
}
