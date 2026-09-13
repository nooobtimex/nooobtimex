import type { SkillNote } from '../interfaces'
import { blockTexts, blockWords, extractRefs, postsBySkill, refLabel } from './posts'
import { projectsData } from './projects'
import { skillNotes } from './skill-notes'
import { type SkillId, skillsData } from './skills'

/**
 * Index coverage — which detail pages carry enough substance of their own to be indexed.
 *
 * ONE source read by both the page's robots metadata and `app/sitemap.ts`, so the two
 * cannot drift: a page is either indexable and listed, or `noindex, follow` and absent.
 * `scripts/seo/check.ts` holds the build to that.
 *
 * It exists because 61 of the sitemap's 124 URLs were skill pages whose only prose of
 * their own was a one-sentence description; the rest was a stat grid and cards repeating
 * text that lives on other pages. That is the page type AdSense's "Low value content" and
 * Search's thin-content guidance describe. Such a page still renders, still links out and
 * still passes equity — it just stops competing in the index until it has something to say.
 *
 * Lives here, not in `skills.ts`, because it reads the post and project indexes, and both
 * of those modules import `skills.ts`.
 */

export interface SkillCoverage {
	/** Published Journal posts that reference the skill — typed `skills` or an inline `[[skill:id]]`. */
	posts: number
	/** Projects that list the skill. */
	projects: number
	/** Words in the skill's field note (code included, as reading time counts it); 0 without one. */
	noteWords: number
}

export function skillCoverage(id: SkillId): SkillCoverage {
	const note = skillNotes[id]
	return {
		posts: postsBySkill[id]?.length ?? 0,
		projects: projectsData.filter(p => p.skills.some(s => s.id === id)).length,
		noteWords: note ? note.body.reduce((sum, b) => sum + blockWords(b), 0) : 0
	}
}

/**
 * Whether `/skills/<id>` earns a place in the index.
 *
 * TODO(human): this is the placeholder rule — a field note of any length, or at least one
 * Journal post. Counting posts indexes 36 of 61 pages today, but a page that qualifies only
 * through posts is really a tag page: ~20 words of its own plus post cards. Raising the bar
 * (posts >= 2 → 25 pages, >= 3 → 18) or counting only notes (0 until one is written)
 * trades index breadth for how much substance each indexed page carries.
 */
export function isSkillIndexable(c: SkillCoverage): boolean {
	return c.noteWords > 0 || c.posts >= 1
}

export const indexableSkillIds: ReadonlySet<SkillId> = new Set(
	skillsData.map(s => s.id as SkillId).filter(id => isSkillIndexable(skillCoverage(id)))
)

// Field notes are prose the site publishes, so they meet the same bar as a post body:
// a real date, a non-empty body, and every `[[kind:id]]` resolving to something.
for (const [id, note] of Object.entries(skillNotes) as [SkillId, SkillNote][]) {
	const fail = (msg: string): never => {
		throw new Error(`[skill-notes] "${id}": ${msg}`)
	}
	if (!/^\d{4}-\d{2}-\d{2}$/.test(note.updatedAt)) fail(`updatedAt "${note.updatedAt}" is not YYYY-MM-DD`)
	if (note.body.length === 0) fail('body is empty')
	for (const text of blockTexts(note.body))
		for (const ref of extractRefs(text))
			if (!refLabel(ref.kind, ref.id)) fail(`[[${ref.kind}:${ref.id}]] does not resolve — check the id`)
}
