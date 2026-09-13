import type { Route } from 'next'

/**
 * The ⌘K palette's data contract — types only, so the `'use client'` palette can import it
 * without bundling a byte of `@/common`. The server builds the index
 * (`lib/search-index.ts`) and serves it prerendered at `/search-index.json`.
 */

export type SearchKind = 'post' | 'project' | 'skill' | 'career' | 'company'

export interface SearchItem {
	kind: SearchKind
	id: string
	/** The row's label — a post or project title, a skill, company or organisation name. */
	title: string
	/** Career rows only: the position shown after the organisation. */
	detail?: string
	/** Skill rows only: the skill's own Iconify name. Every other kind uses its group's icon. */
	icon?: string
	href: Route
}
