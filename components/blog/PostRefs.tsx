import React from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import CyberTag from '@/components/cyber/CyberTag'
import { type Post, entitiesData, experiencesData, projectsData, skillById } from '@/common'

/**
 * Sidebar rail: everything this post references in the site's own graph — skills,
 * projects, roles, companies — as linked chips. The reverse direction (each detail
 * page listing its posts) is `WrittenAbout`.
 */
const PostRefs: React.FC<{ post: Post }> = ({ post }) => {
	const skills = (post.skills ?? []).map(id => skillById[id])
	const projects = (post.relatedProjectIds ?? []).flatMap(id => projectsData.filter(p => p.id === id))
	const roles = (post.relatedExperienceIds ?? []).flatMap(id => experiencesData.filter(e => e.id === id))
	const orgs = (post.relatedEntityIds ?? []).flatMap(id => entitiesData.filter(o => o.id === id))
	if (skills.length + projects.length + roles.length + orgs.length === 0) return null

	const rows: { href: string; label: string; icon?: string }[] = [
		...skills.map(s => ({ href: `/skills/${s.id}`, label: s.name, icon: s.icon })),
		...projects.map(p => ({ href: `/projects/${p.id}`, label: p.title })),
		...roles.map(r => ({ href: `/career/${r.id}`, label: r.organization.name })),
		...orgs.map(o => ({ href: `/companies/${o.id}`, label: o.name }))
	]

	return (
		<div className='neon-panel clip-notch-sm p-4'>
			<h3 className='text-cyber-cyan mb-3 font-mono text-xs tracking-widest uppercase md:text-xs'>// Related</h3>
			<div className='flex flex-wrap gap-1.5'>
				{rows.map(row => (
					<Link key={row.href} href={row.href as Route}>
						<CyberTag icon={row.icon}>{row.label}</CyberTag>
					</Link>
				))}
			</div>
		</div>
	)
}

export default PostRefs
