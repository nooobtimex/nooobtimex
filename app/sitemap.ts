import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import {
	type SkillId,
	entitiesData,
	experiencesData,
	indexableSkillIds,
	postsData,
	privacyPolicy,
	projectsData,
	skillsData
} from '@/common'

/**
 * Stable `lastModified` on purpose.
 *
 * This used to be `new Date()`, which re-stamped all 90 URLs on every deploy —
 * including README-asset commits that change nothing user-facing. Google learns to
 * distrust a `lastmod` that is always "now", so bump this date only when the
 * content behind these routes actually changes.
 */
const CONTENT_LAST_MODIFIED = new Date('2026-08-24')

const entry = (
	path: string,
	priority: number,
	changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'
): MetadataRoute.Sitemap[number] => ({
	url: `${SITE_URL}${path}`,
	lastModified: CONTENT_LAST_MODIFIED,
	changeFrequency,
	priority
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		entry('', 1),
		entry('/projects', 0.8),
		entry('/skills', 0.8),
		entry('/career', 0.8),
		entry('/companies', 0.7),
		// No /github: it is `noindex` (a dashboard of API numbers), and a sitemap must only
		// nominate pages that ask to be indexed — scripts/seo/check.ts fails the build otherwise.
		entry('/cv', 0.6),
		entry('/contact', 0.7),
		// The journal gets fresh entries between content bumps, so it dates itself.
		entry('/blog', 0.8, 'weekly'),
		// Listed so a crawler — and an ad reviewer — finds the policy the way it finds everything
		// else. Dated by the policy itself, not the site-wide stamp.
		{ ...entry('/privacy', 0.3, 'yearly'), lastModified: new Date(privacyPolicy.updatedAt) },
		// Detail routes are keyed by `id` — the same value each route's
		// `generateStaticParams` emits, so a sitemap URL can never 404.
		...projectsData.map(p => entry(`/projects/${p.id}`, 0.7)),
		// Only skills with substance of their own — the same set their pages' robots tags use.
		...skillsData.filter(s => indexableSkillIds.has(s.id as SkillId)).map(s => entry(`/skills/${s.id}`, 0.5)),
		...experiencesData.map(e => entry(`/career/${e.id}`, 0.6)),
		...entitiesData.map(o => entry(`/companies/${o.id}`, 0.6)),
		// Posts carry REAL per-post dates — the one deliberate divergence from the frozen
		// site-wide stamp above, because a post's updatedAt/publishedAt is a content date,
		// not deploy noise. `postsData` is draft-filtered, so a stub can never enter here.
		...postsData.map(p => ({
			url: `${SITE_URL}/blog/${p.id}`,
			lastModified: new Date(p.updatedAt ?? p.publishedAt),
			changeFrequency: 'yearly' as const,
			priority: 0.6
		}))
	]
}
