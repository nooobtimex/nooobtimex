import React from 'react'
import Link from 'next/link'
import PostBody from '@/components/blog/PostBody'
import PostChapterNav from '@/components/blog/PostChapterNav'
import PostFaq from '@/components/blog/PostFaq'
import PostRefs from '@/components/blog/PostRefs'
import PostTldr from '@/components/blog/PostTldr'
import PostToc from '@/components/blog/PostToc'
import Container from '@/components/cyber/Container'
import CyberIcon from '@/components/cyber/CyberIcon'
import NeonPanel from '@/components/cyber/NeonPanel'
import { InlineText } from '@/lib/inline'
import { formatMilestoneDate } from '@/lib/utils'
import { type Post, categoryMetadataPosts, chapterMetadata } from '@/common'

const StatCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<div className='border-border/60 border-l-2 pl-3'>
		<p className='text-muted-foreground font-mono text-[0.6rem] tracking-widest uppercase'>{label}</p>
		<p className='mt-0.5 text-sm font-semibold'>{children}</p>
	</div>
)

/**
 * The article page. Order is the AEO contract from the plan: title → TL;DR (the
 * answer, first) → the narrative body → lessons → FAQ. The `h1` deliberately keeps
 * the display treatment but caps its size — post titles are full sentences, and the
 * global `text-5xl md:text-7xl` is sized for two-word HUD headings.
 */
const PostDetail: React.FC<{ post: Post; adAfter?: Readonly<Record<number, string>> }> = ({ post, adAfter }) => {
	return (
		<Container className='py-10'>
			<Link
				href='/blog'
				className='text-muted-foreground hover:text-cyber-cyan inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors'>
				<CyberIcon icon='mdi:arrow-left' className='size-4' /> Journal
			</Link>

			{/* Hero */}
			<NeonPanel className='clip-notch relative mt-6 overflow-hidden p-6 md:p-8'>
				<span className='text-cyber-cyan font-mono text-[0.65rem] tracking-[0.3em] uppercase'>
					// {chapterMetadata[post.chapter].label} · {chapterMetadata[post.chapter].span}
				</span>
				<h1 className='font-display mt-3 text-3xl leading-tight font-bold tracking-wide normal-case md:text-4xl'>
					{post.title}
				</h1>
				<p className='text-muted-foreground mt-3 max-w-3xl leading-relaxed'>{post.description}</p>
			</NeonPanel>

			{/* Meta strip. The event and the write-up are different dates, and only the second is
			    the page's publication date — it matches `datePublished` in the JSON-LD. "Happened"
			    is plain month text, not a <time>, so it is never read as the byline date. */}
			<NeonPanel className='clip-notch-sm mt-6 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-5'>
				<StatCell label='Happened'>{formatMilestoneDate(post.happenedAt)}</StatCell>
				<StatCell label='Published'>
					<time dateTime={post.publishedAt}>{post.publishedAt}</time>
				</StatCell>
				<StatCell label='Updated'>
					{post.updatedAt ?
						<time dateTime={post.updatedAt}>{post.updatedAt}</time>
					:	'—'}
				</StatCell>
				<StatCell label='Read Time'>{post.readingMinutes} min</StatCell>
				<StatCell label='Channel'>
					<span style={{ color: post.accent }}>{categoryMetadataPosts[post.category].label}</span>
				</StatCell>
			</NeonPanel>

			<div className='mt-8 grid gap-8 md:grid-cols-[1fr_260px]'>
				{/* Article */}
				<article className='min-w-0 space-y-8'>
					<PostTldr tldr={post.tldr} />
					<PostBody body={post.body} adAfter={adAfter} />

					{post.lessons && post.lessons.length > 0 && (
						<section>
							<h2 className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase md:text-xs'>
								// What I'd Do Differently
							</h2>
							<ul className='mt-3 space-y-2'>
								{post.lessons.map((lesson, i) => (
									<li key={i} className='border-cyber-yellow/60 text-muted-foreground border-l-2 pl-3 leading-relaxed'>
										<InlineText text={lesson} />
									</li>
								))}
							</ul>
						</section>
					)}

					<PostFaq faqs={post.faqs} />

					{post.sources && post.sources.length > 0 && (
						<section>
							<h2 className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase md:text-xs'>// Sources</h2>
							<ul className='mt-3 space-y-1.5'>
								{post.sources.map(s => (
									<li key={s.url}>
										<a
											href={s.url}
											target='_blank'
											rel='noopener noreferrer'
											className='text-muted-foreground hover:text-cyber-cyan text-sm underline underline-offset-4 transition-colors'>
											{s.title}
										</a>
									</li>
								))}
							</ul>
						</section>
					)}
				</article>

				{/* Rail */}
				<aside className='space-y-6'>
					<PostToc body={post.body} />
					<PostRefs post={post} />
					<PostChapterNav post={post} />
				</aside>
			</div>
		</Container>
	)
}

export default PostDetail
