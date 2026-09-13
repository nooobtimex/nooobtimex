import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AdSenseScript from '@/components/ads/AdSenseScript'
import PostDetail from '@/components/blog/PostDetail'
import JsonLd from '@/components/seo/JsonLd'
import { inArticleAds } from '@/lib/ad-breaks'
import { blogPostingSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { categoryMetadataPosts, flattenPostText, postsData } from '@/common'

interface PostPageProps {
	params: Promise<{ id: string[] }>
}

export async function generateStaticParams() {
	// `postsData` is already draft-filtered, so a draft's URL is never prerendered —
	// with `dynamicParams = false` below it is a real 404, not a soft-404.
	return postsData.map(p => ({ id: [p.id] }))
}

/**
 * Unknown slugs must 404 at the routing layer, not render.
 *
 * A page's own `notFound()` is only a real 404 while nothing above the page streams —
 * any Suspense boundary flushes response headers at 200 first. The old root
 * `app/loading.tsx` did exactly that and turned every mistyped detail slug into an
 * indexable soft-404 titled "… Not Found". With `generateStaticParams` above and
 * `dynamicParams` false, Next never enters the segment for an unknown param, so the
 * status no longer depends on what wraps the page.
 */
export const dynamicParams = false

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
	const { id } = await params
	const post = postsData.find(p => p.id === id?.[0])

	if (!post) return { title: 'Post Not Found', robots: { index: false, follow: false } }

	return pageMetadata({
		path: `/blog/${post.id}`,
		title: post.title,
		description: post.description,
		ogImage: `/card/og/blog/${post.id}`,
		article: {
			publishedTime: post.publishedAt,
			...(post.updatedAt && { modifiedTime: post.updatedAt }),
			section: categoryMetadataPosts[post.category].label,
			tags: post.skills
		}
	})
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
	const { id } = await params
	const post = postsData.find(p => p.id === id?.[0])

	if (!post) notFound()

	const posting = blogPostingSchema({
		id: post.id,
		title: post.title,
		description: post.description,
		publishedAt: post.publishedAt,
		updatedAt: post.updatedAt,
		happenedAt: post.happenedAt,
		section: categoryMetadataPosts[post.category].label,
		keywords: post.skills ?? [],
		wordCount: post.readingMinutes * 200,
		image: `/card/og/blog/${post.id}`,
		sources: post.sources
	})

	// FAQ answers are flattened to plain prose — JSON-LD must not carry `[[ref]]` markup.
	const faqs = faqSchema(post.faqs.map(f => ({ q: flattenPostText(f.q), a: flattenPostText(f.a) })))

	const breadcrumbs = breadcrumbSchema([
		{ name: 'Home', path: '/' },
		{ name: 'Journal', path: '/blog' },
		{ name: post.title, path: `/blog/${post.id}` }
	])

	// Journal posts are the only pages that carry ads. With no unit configured, or no break the
	// placement rule accepts, the post gets no slot and never loads the ad script at all.
	const ads = inArticleAds(post.body)
	const hasAds = Object.keys(ads).length > 0

	return (
		<>
			<JsonLd data={posting} />
			<JsonLd data={faqs} />
			<JsonLd data={breadcrumbs} />
			<PostDetail post={post} adAfter={hasAds ? ads : undefined} />
			{hasAds && <AdSenseScript />}
		</>
	)
}

export default PostPage
