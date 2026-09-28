/**
 * Shared string-literal types. Small fixed sets that used to be enums — using plain
 * unions keeps autocomplete + typo safety without the `Enum.Member` ceremony.
 */

export type SkillCategory = 'frontend' | 'backend' | 'infrastructure' | 'growth-management'

export type ExperienceCategory = 'work' | 'education'

export type EntityType = 'company' | 'university'

export type EmploymentType = 'freelance' | 'part-time' | 'full-time'

export type Location = 'remote' | 'nonthaburi-thailand' | 'pathumthani-thailand'

export type Position = 'chief-technology-officer' | 'developer' | 'student'

export type SocialPlatform = 'github' | 'linkedin' | 'instagram' | 'youtube' | 'website' | 'email'

/** Organization ids — referenced by `Organization.id`. */
export type EntityId =
	'jasmine-technology-solution' | 'jas-tv' | 'monomax' | 'ruamsuk-plating' | 'freelance' | 'thammasat-university'

/** Experience/role ids — referenced by projects (`linkedExperienceIds`). */
export type ExperienceId =
	| 'jasmine-tech'
	| 'ruamsuk-software-engineer-part-time'
	| 'ruamsuk-software-engineer-full-time'
	| 'ruamsuk-cto'
	| 'freelance'
	| 'thammasat-bs-cs'

/**
 * Where a project stands, for the one case its status can't be derived. Live/Archived comes
 * from `links.live`, so a private build with no public URL reads "Archived" — true for a
 * delivered job, false for one still being built.
 */
export type ProjectStage = 'in-development'

/**
 * Blog journey chapters — the career phase a post belongs to. Spans mirror the exact
 * dates in `common/data/experiences.ts`; `freelance` runs underneath the others.
 */
export type PostChapter = 'origins' | 'student' | 'bridge' | 'scale' | 'ownership' | 'freelance'

/** Blog topic categories — the technical axis, orthogonal to `PostChapter`. */
export type PostCategory = 'nextjs' | 'infrastructure' | 'commerce' | 'seo-aeo' | 'engineering'
