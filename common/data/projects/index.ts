import type { Project, ProjectDef } from '../../interfaces'
import { sortByDateDesc } from '../../utils'
import { type SkillId, skillById } from '../skills'
import { floodProject } from './flood-project'
import { looklookPet } from './looklook-pet'
import { monomaxEplPortal } from './monomax-epl-portal'
import { onlinePokerGame } from './online-poker-game'
import { portfolio } from './portfolio'
import { prettierConfig } from './prettier-config'
import { qrFood } from './qr-food'
import { rsAward } from './rs-award'
import { rsEservice } from './rs-eservice'
import { rsMedal } from './rs-medal'
import { rsTrophy } from './rs-trophy'
import { rsTrophyAdmin } from './rs-trophy-admin'
import { wangpa } from './wangpa'

/**
 * The project registry + resolver.
 *
 * Authoring happens in one file per project in this folder (filename === `id`, so
 * `/projects/<id>` maps to `<id>.ts`). `defs` below lists them; `resolveProject` folds each
 * one's timeline into its skill roster, and `projectsData` is what routes consume.
 */

/** Tooling used on every project — always active, never retired, so it lives here not per-project. */
const commonTooling: SkillId[] = ['typescript', 'git-github', 'prettier', 'eslint']

const defs: ProjectDef[] = [
	wangpa,
	monomaxEplPortal,
	rsTrophy,
	rsTrophyAdmin,
	rsEservice,
	looklookPet,
	onlinePokerGame,
	floodProject,
	prettierConfig,
	rsAward,
	rsMedal,
	portfolio,
	qrFood
]

/**
 * Event-source each project's skills: fold the timeline (oldest→newest) over the starting stack +
 * common tooling to derive the currently-active set; the full roster is the union of everything ever
 * used (start + tooling + every add/remove); retired = roster − active. Milestone id deltas are
 * resolved to Skill objects for the timeline UI.
 */
const resolveProject = (d: ProjectDef): Project => {
	const events = [...(d.timeline ?? [])].sort((a, b) => a.date.localeCompare(b.date))
	// Union roster in first-appearance order: starting stack, then timeline deltas, then tooling.
	const roster: SkillId[] = []
	const seen = new Set<SkillId>()
	const see = (id: SkillId) => {
		if (!seen.has(id)) {
			seen.add(id)
			roster.push(id)
		}
	}
	d.skills.forEach(see)
	for (const m of events) {
		m.addedSkills?.forEach(see)
		m.removedSkills?.forEach(see)
	}
	commonTooling.forEach(see)
	// Active = starting stack + tooling, folded through the timeline's adds/removes.
	const active = new Set<SkillId>([...d.skills, ...commonTooling])
	for (const m of events) {
		m.addedSkills?.forEach(id => active.add(id))
		m.removedSkills?.forEach(id => active.delete(id))
	}
	const toSkill = (id: SkillId) => skillById[id]

	// Fail loudly on a highlight that isn't actually active. `SkillId` already catches
	// typos; what it can't catch is naming a RETIRED skill (e.g. 'nats' on looklook-pet),
	// which is a perfectly valid id that would silently rank nothing.
	const highlights = d.highlightSkills ?? []
	for (const id of highlights) {
		if (!active.has(id)) {
			throw new Error(
				`[projects] "${d.id}" highlights "${id}", which is not in its active stack. `
					+ `Highlight only active skills — retired ones cannot lead the loadout.`
			)
		}
	}

	/**
	 * Display order, three tiers: highlighted signature tech first (in the order authored),
	 * then the rest of the real stack, then `commonTooling` last. Ties keep roster order, so
	 * the sort is stable and predictable.
	 *
	 * A highlight outranks the tooling demotion — that is what lets `portfolio` lead with
	 * Tailwind, where a custom v4 design system genuinely IS the product, while Tailwind
	 * stays demoted everywhere else.
	 */
	const rank = (id: SkillId): number => {
		const highlighted = highlights.indexOf(id)
		if (highlighted !== -1) return highlighted
		return commonTooling.includes(id) ? 2_000_000 : 1_000_000
	}
	const forDisplay = (ids: SkillId[]) =>
		ids
			.map((id, i) => ({ id, i }))
			.sort((a, b) => rank(a.id) - rank(b.id) || a.i - b.i)
			.map(e => e.id)

	return {
		...d,
		skills: roster.map(toSkill),
		// Sorted for display; `skills` above stays in first-appearance (historical) order.
		activeSkills: forDisplay(roster.filter(id => active.has(id))).map(toSkill),
		retiredSkills: roster.filter(id => !active.has(id)).map(toSkill),
		// The date-sorted `events`, not the authored array: `ProjectTimeline` only reverses what
		// it is given, so a milestone written out of order would otherwise render out of place.
		// The sort is stable, so same-day milestones keep their authored order.
		timeline:
			d.timeline
			&& events.map(m => ({
				...m,
				addedSkills: m.addedSkills?.map(toSkill),
				removedSkills: m.removedSkills?.map(toSkill)
			}))
	}
}

// Resolve each project, then sort newest first.
export const projectsData: Project[] = defs.map(resolveProject).sort(sortByDateDesc)

/** Hand-picked projects for the home page (in this order). Edit to curate. */
const featuredProjectIds = ['wangpa', 'monomax-epl-portal', 'rs-trophy', 'looklook-pet']
export const featuredProjects: Project[] = featuredProjectIds
	.map(id => projectsData.find(p => p.id === id))
	.filter((p): p is Project => Boolean(p))
