/**
 * React renderer for the post inline micro-format — the JSX half of
 * `common/data/posts/inline.ts` (which owns parsing, and stays JSX-free so build
 * scripts can flatten the same strings).
 *
 * `[[kind:id]]` refs resolve their label from the data layer and link by `id` — the
 * exact value each detail route's `generateStaticParams` emits, so `links:check` can
 * never flag one (`seo-conventions` invariant 4, held structurally). Unknown ids never reach here:
 * `resolvePost` fails the build first.
 */
import React from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { refHref, refLabel, tokenizeInline } from '@/common'

export const InlineText: React.FC<{ text: string }> = ({ text }) => (
	<>
		{tokenizeInline(text).map((t, i) => {
			switch (t.type) {
				case 'code':
					return (
						<code key={i} className='bg-muted text-cyber-cyan px-1 py-0.5 font-mono text-[0.85em]'>
							{t.text}
						</code>
					)
				case 'bold':
					return (
						<strong key={i} className='text-foreground font-semibold'>
							{t.text}
						</strong>
					)
				case 'link':
					return t.href.startsWith('/') ?
							<Link
								key={i}
								href={t.href as Route}
								className='text-cyber-cyan hover:text-cyber-yellow underline underline-offset-4 transition-colors'>
								{t.text}
							</Link>
						:	<a
								key={i}
								href={t.href}
								target='_blank'
								rel='noopener noreferrer'
								className='text-cyber-cyan hover:text-cyber-yellow underline underline-offset-4 transition-colors'>
								{t.text}
							</a>
				case 'ref':
					return (
						<Link
							key={i}
							href={refHref(t.kind, t.id) as Route}
							className='text-cyber-yellow hover:text-cyber-cyan underline decoration-dotted underline-offset-4 transition-colors'>
							{refLabel(t.kind, t.id)}
						</Link>
					)
				default:
					return <React.Fragment key={i}>{t.text}</React.Fragment>
			}
		})}
	</>
)
