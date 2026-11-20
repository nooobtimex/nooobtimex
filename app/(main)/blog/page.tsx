import React from 'react'
import BlogContent from '@/components/blog/BlogContent'
import JsonLd from '@/components/seo/JsonLd'
import { blogSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { postsData } from '@/common'

export const metadata = pageMetadata({
	path: '/blog',
	title: 'Writing',
	description:
		'The engineering journey, written up with the numbers — from student part-timer to CTO, one real build at a time.'
})

const BlogPage: React.FC = () => {
	return (
		<>
			<JsonLd data={blogSchema(postsData)} />
			<BlogContent />
		</>
	)
}

export default BlogPage
