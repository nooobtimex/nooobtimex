import React from 'react'
import Link from 'next/link'
import PostBody from '@/components/blog/PostBody'
import PostChapterNav from '@/components/blog/PostChapterNav'
import PostFaq from '@/components/blog/PostFaq'
import PostRefs from '@/components/blog/PostRefs'
import PostTldr from '@/components/blog/PostTldr'
import PostToc from '@/components/blog/PostToc'
import Container from '@/components/site/Container'
import SiteIcon from '@/components/site/SiteIcon'
import { InlineText } from '@/lib/inline'
import { formatMilestoneDate } from '@/lib/utils'
import { type Post, categoryMetadataPosts, chapterMetadata } from '@/common'

const StatCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<div className='border-border/60 border-l-2 pl-3'>
		<p className='text-muted-foreground font-sans text-xs tracking-normal'>{label}</p>
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
				className='text-muted-foreground hover:text-brand inline-flex items-center gap-2 font-sans text-xs tracking-normal transition-colors'>
				<SiteIcon icon='mdi:arrow-left' className='size-4' /> Writing
			</Link>

			{/* Hero */}
			<header className='comic-detail-heading'>
				<span className='text-brand font-sans text-xs tracking-normal'>
					{chapterMetadata[post.chapter].label} · {chapterMetadata[post.chapter].span}
				</span>
				<h1 className='font-display mt-3 text-3xl leading-tight font-bold tracking-normal normal-case md:text-4xl'>
					{post.title}
				</h1>
				<p className='text-muted-foreground mt-3 max-w-3xl leading-relaxed'>{post.description}</p>
			</header>

			{/* Meta strip. The event and the write-up are different dates, and only the second is
			    the page's publication date — it matches `datePublished` in the JSON-LD. "Happened"
			    is plain month text, not a <time>, so it is never read as the byline date. */}
			<div className='comic-detail-meta'>
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
				<StatCell label='Category'>
					<span className='text-brand'>{categoryMetadataPosts[post.category].label}</span>
				</StatCell>
			</div>

			<div className='reading-layout'>
				{/* Article */}
				<article className='comic-prose min-w-0 space-y-8'>
					<PostTldr tldr={post.tldr} />
					<PostBody body={post.body} adAfter={adAfter} />

					{post.lessons && post.lessons.length > 0 && (
						<section>
							<h2 className='text-brand font-sans text-xs tracking-normal md:text-xs'>What I'd Do Differently</h2>
							<ul className='mt-3 space-y-2'>
								{post.lessons.map((lesson, i) => (
									<li key={i} className='border-brand/60 text-muted-foreground border-l-2 pl-3 leading-relaxed'>
										<InlineText text={lesson} />
									</li>
								))}
							</ul>
						</section>
					)}

					<PostFaq faqs={post.faqs} />

					{post.sources && post.sources.length > 0 && (
						<section>
							<h2 className='text-brand font-sans text-xs tracking-normal md:text-xs'>Sources</h2>
							<ul className='mt-3 space-y-1.5'>
								{post.sources.map(s => (
									<li key={s.url}>
										<a
											href={s.url}
											target='_blank'
											rel='noopener noreferrer'
											className='text-muted-foreground hover:text-brand text-sm underline underline-offset-4 transition-colors'>
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
