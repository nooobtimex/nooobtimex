import type { SkillNote } from '../../interfaces'
import type { SkillId } from '../skills'

/**
 * Field notes — original write-ups, one per skill, that give `/skills/<id>` substance of
 * its own. Add a note as `<id>.ts` exporting a `SkillNote`, then register it here.
 *
 * A skill page with too little of its own prose is `noindex, follow` and absent from the
 * sitemap (`isSkillIndexable` in `../coverage.ts`). Writing a note is how a page earns its
 * way back in — there is no second list to update.
 */
export const skillNotes: Partial<Record<SkillId, SkillNote>> = {}
