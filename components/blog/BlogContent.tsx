import React from 'react'
import PostCard from '@/components/blog/PostCard'
import Container from '@/components/cyber/Container'
import MotionReveal from '@/components/cyber/MotionReveal'
import SectionHeader from '@/components/cyber/SectionHeader'
import { type PostChapter, chapterMetadata, postsData } from '@/common'

/**
 * The /blog index — posts grouped by the YEAR THE WORK HAPPENED (`happenedAt`, not the
 * day a post went live), newest year first, using the grouped-section rule from
 * `SkillsContent`. The archive reads as a journal of the work, which is the whole framing
 * of the blog.
 */
const BlogContent: React.FC = () => {
	const years = [...new Set(postsData.map(p => p.happenedAt.slice(0, 4)))].sort((a, b) => b.localeCompare(a))
	// Every card names its chapter; this legend says what each chapter was. Chapters with no
	// published entry yet are left out rather than advertised.
	const chapters = (Object.keys(chapterMetadata) as PostChapter[])
		.map(id => ({ id, ...chapterMetadata[id], count: postsData.filter(p => p.chapter === id).length }))
		.filter(c => c.count > 0)

	return (
		<Container className='py-12 md:py-16'>
			<SectionHeader
				as='h1'
				code='08'
				title='Journal'
				subtitle={`${postsData.length} entries — the engineering journey, written up with the numbers.`}
			/>

			<section aria-label='Chapters' className='mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3'>
				{chapters.map(c => (
					<div key={c.id} className='border-border/60 border-l-2 pl-3'>
						<p className='text-cyber-cyan font-mono text-[0.65rem] tracking-[0.3em] uppercase'>// {c.span}</p>
						<p className='font-display mt-1 font-bold tracking-wide uppercase'>
							{c.label} <span className='text-muted-foreground font-mono text-xs normal-case'>· {c.count}</span>
						</p>
						<p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{c.description}</p>
					</div>
				))}
			</section>

			{years.map((year, idx) => {
				const items = postsData.filter(p => p.happenedAt.startsWith(year))
				return (
					<section key={year} className='mt-12'>
						<div className='mb-5 flex items-center gap-3'>
							<span className='text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase'>
								{String(idx + 1).padStart(2, '0')}
							</span>
							<h2 className='font-display text-xl font-bold tracking-wide uppercase'>{year}</h2>
							<span className='bg-border h-px flex-1' />
							<span className='text-muted-foreground font-mono text-xs'>{items.length}</span>
						</div>
						<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
							{items.map((p, i) => (
								<MotionReveal key={p.id} delay={(i % 3) * 0.08}>
									<PostCard post={p} index={i} />
								</MotionReveal>
							))}
						</div>
					</section>
				)
			})}
		</Container>
	)
}

export default BlogContent
