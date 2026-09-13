import React from 'react'
import AdSlot from '@/components/ads/AdSlot'
import { InlineText } from '@/lib/inline'
import { slugify } from '@/lib/utils'
import type { PostBlock } from '@/common'

/**
 * The block renderer.
 *
 * Headings carry EXPLICIT classes because `app/globals.css` forces every `h1`–`h6`
 * site-wide to uppercase display type at `text-4xl md:text-6xl` — correct for HUD
 * pages, unreadable mid-article. Every heading here must restate its own size, the
 * same discipline `ProjectDetail`'s `// Label` micro-headings apply.
 *
 * `h2` ids are derived by `slugify` — the TOC derives the same ids from the same
 * blocks, so anchors can never drift from headings.
 */
const calloutTone = {
	info: 'border-cyber-cyan text-cyber-cyan',
	warn: 'border-cyber-yellow text-cyber-yellow',
	danger: 'border-cyber-magenta text-cyber-magenta',
	success: 'border-cyber-green text-cyber-green'
} as const

const Block: React.FC<{ block: PostBlock }> = ({ block }) => {
	switch (block.kind) {
		case 'p':
			return (
				<p className='text-muted-foreground text-base leading-relaxed'>
					<InlineText text={block.text} />
				</p>
			)
		case 'h2':
			return (
				<h2
					id={slugify(block.text)}
					className='font-display scroll-mt-20 pt-4 text-2xl font-bold tracking-wide normal-case md:text-2xl'>
					<span className='text-cyber-cyan mr-2 font-mono text-sm tracking-[0.3em]'>//</span>
					{block.text}
				</h2>
			)
		case 'h3':
			return <h3 className='font-display pt-2 text-lg font-bold tracking-wide normal-case md:text-lg'>{block.text}</h3>
		case 'code':
			return (
				<figure className='neon-panel clip-notch-sm overflow-hidden'>
					<pre className='overflow-x-auto p-4 font-mono text-[0.8rem] leading-relaxed'>
						<code>{block.code}</code>
					</pre>
					{block.caption && (
						<figcaption className='border-border/60 text-muted-foreground border-t px-4 py-2 font-mono text-[0.65rem] tracking-wider'>
							<InlineText text={block.caption} />
						</figcaption>
					)}
				</figure>
			)
		case 'list':
			return block.ordered ?
					<ol className='text-muted-foreground marker:text-cyber-cyan list-decimal space-y-2 pl-5 text-base leading-relaxed'>
						{block.items.map((item, j) => (
							<li key={j}>
								<InlineText text={item} />
							</li>
						))}
					</ol>
				:	<ul className='text-muted-foreground space-y-2 text-base leading-relaxed'>
						{block.items.map((item, j) => (
							<li key={j} className='border-cyber-cyan/40 border-l-2 pl-3'>
								<InlineText text={item} />
							</li>
						))}
					</ul>
		case 'callout':
			return (
				<aside className={`neon-panel clip-notch-sm border-l-2 p-4 ${calloutTone[block.tone].split(' ')[0]}`}>
					{block.title && (
						<p className={`mb-1 font-mono text-xs tracking-[0.3em] uppercase ${calloutTone[block.tone].split(' ')[1]}`}>
							{block.title}
						</p>
					)}
					<p className='text-muted-foreground text-sm leading-relaxed'>
						<InlineText text={block.text} />
					</p>
				</aside>
			)
		case 'quote':
			return (
				<blockquote className='border-cyber-yellow/60 border-l-2 pl-4'>
					<p className='text-foreground/90 text-base leading-relaxed italic'>
						<InlineText text={block.text} />
					</p>
					{block.cite && (
						<cite className='text-muted-foreground mt-1 block font-mono text-xs not-italic'>— {block.cite}</cite>
					)}
				</blockquote>
			)
		case 'image':
			return (
				<figure className='neon-panel clip-notch-sm overflow-hidden'>
					<img src={block.src} alt={block.alt} loading='lazy' decoding='async' className='w-full' />
					{block.caption && (
						<figcaption className='border-border/60 text-muted-foreground border-t px-4 py-2 font-mono text-[0.65rem] tracking-wider'>
							<InlineText text={block.caption} />
						</figcaption>
					)}
				</figure>
			)
		case 'stat':
			return (
				<div className='neon-panel clip-notch-sm flex flex-col gap-1 p-5'>
					<span className='text-cyber-yellow font-display text-3xl font-bold tracking-wide'>{block.value}</span>
					<span className='text-muted-foreground text-sm'>{block.label}</span>
					{block.source && (
						<span className='text-muted-foreground/70 font-mono text-[0.65rem] tracking-wider uppercase'>
							Source: {block.source}
						</span>
					)}
				</div>
			)
		case 'table':
			return (
				<div className='neon-panel clip-notch-sm overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-border/60 border-b'>
								{block.head.map((h, j) => (
									<th
										key={j}
										className='text-cyber-cyan px-4 py-2 text-left font-mono text-xs tracking-wider uppercase'>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{block.rows.map((row, j) => (
								<tr key={j} className='border-border/40 border-b last:border-0'>
									{row.map((cell, k) => (
										<td key={k} className='text-muted-foreground px-4 py-2 leading-relaxed'>
											<InlineText text={cell} />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)
	}
}

/**
 * `adAfter` maps a block index to an in-article slot ID (see `inArticleAds` in
 * `lib/ad-breaks.ts`); the unit renders directly after that block, inside the article's
 * own rhythm. Omitted everywhere except Journal posts, so notes and the privacy policy,
 * which share this renderer, never carry ads.
 */
const PostBody: React.FC<{ body: PostBlock[]; adAfter?: Readonly<Record<number, string>> }> = ({ body, adAfter }) => (
	<div className='space-y-5'>
		{body.map((block, i) => (
			<React.Fragment key={i}>
				<Block block={block} />
				{adAfter?.[i] && <AdSlot slot={adAfter[i]} />}
			</React.Fragment>
		))}
	</div>
)

export default PostBody
