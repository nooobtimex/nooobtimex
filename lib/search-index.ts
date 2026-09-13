import type { Route } from 'next'
import type { SearchItem } from '@/components/search/types'
import { entitiesData, experiencesData, postsData, projectsData, skillsData } from '@/common'

/**
 * The ⌘K index — one row per destination, carrying only what a row shows and where it goes.
 *
 * Built on the server and served prerendered at `/search-index.json`, because the palette
 * used to import these arrays itself. It is a client component, so the whole resolved data
 * layer — every Journal post's body, TL;DR, FAQs and sources — shipped to the browser in a
 * 436 KB chunk for a list of titles. This index is ~14 KB.
 *
 * Order within each kind is the data layer's own order, so the palette lists exactly what
 * it listed before.
 */
export function buildSearchIndex(): SearchItem[] {
	return [
		...postsData.map(p => ({ kind: 'post' as const, id: p.id, title: p.title, href: `/blog/${p.id}` as Route })),
		...projectsData.map(p => ({
			kind: 'project' as const,
			id: p.id,
			title: p.title,
			href: `/projects/${p.id}` as Route
		})),
		...skillsData.map(s => ({
			kind: 'skill' as const,
			id: s.id,
			title: s.name,
			icon: s.icon,
			href: `/skills/${s.id}` as Route
		})),
		...experiencesData.map(e => ({
			kind: 'career' as const,
			id: e.id,
			title: e.organization.name,
			detail: e.position,
			href: `/career/${e.id}` as Route
		})),
		...entitiesData.map(o => ({
			kind: 'company' as const,
			id: o.id,
			title: o.name,
			href: `/companies/${o.id}` as Route
		}))
	]
}
