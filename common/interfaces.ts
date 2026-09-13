/**
 * Core interfaces for the NooobtimeX project. All domain models live here.
 */
// Type-only — erased at compile time, so the interfaces → data/skills → interfaces
// cycle never exists at runtime. It buys `Post.skills` the same typo safety projects get.
import type { SkillId } from './data/skills'
import {
	EmploymentType,
	EntityId,
	EntityType,
	ExperienceCategory,
	ExperienceId,
	Location,
	Position,
	PostCategory,
	PostChapter,
	SkillCategory,
	SocialPlatform
} from './enums'

// --- Base ---

/** Social media link configuration */
export interface SocialLink {
	platform: SocialPlatform
	url: string
	icon: string // Icon name for @iconify/react
	username?: string
}

/**
 * A direct messaging channel — business-card style, deliberately separate from
 * `SocialLink`. Social links are profile URLs and get fed to JSON-LD `sameAs`, the footer
 * grid and the README generator; a LINE/WeChat handle is none of those things.
 */
export interface ContactChannel {
	id: string // 'phone' | 'whatsapp' | 'line' | 'wechat' — free-form, no union to widen
	label: string // Display name, e.g. 'WeChat'
	icon: string // Icon name for @iconify/react
	/** The handle/number shown on the card and copied to the clipboard. */
	value: string
	/** Deep link, when the vendor publishes one. Absent for channels that have none. */
	url?: string
	/** Payload to render as a QR — for channels reachable only by scanning. */
	qr?: string
	/** Reachable from inside mainland China? Drives the availability badge. */
	inChina: boolean
	/** ISO date the `qr` payload was last confirmed working — rendered as a staleness cue. */
	verifiedOn?: string
	note?: string
}

/** A spoken/written language and proficiency */
export interface Language {
	name: string // Display name, e.g. 'English'
	level: string // Proficiency, e.g. 'Native' or 'Professional working'
	code: string // BCP-47 tag for JSON-LD knowsLanguage, e.g. 'en'
}

// --- Domain ---

/** A technical skill */
export interface Skill {
	id: string // url-safe id, e.g. 'next-js'
	name: string
	category: SkillCategory
	icon: string // Icon name for @iconify/react
	whiteBg?: boolean
	/**
	 * What the technology is, in one or two sentences.
	 *
	 * Optional so a newly added skill is never blocked on copy. Renders as the intro on
	 * `/skills/<id>`, which otherwise opens straight into derived stats — the page had no
	 * prose of its own at all, only the cross-referenced projects beneath it.
	 */
	description?: string
}

/** An organization, university, or entity */
export interface Organization {
	id: EntityId
	name: string
	logo?: string
	location: Location
	type: EntityType
	url?: string
	/** Short blurb shown on the company card. */
	description?: string
	// --- Detailed dossier (company detail page) — all optional, render when present ---
	/** Longer multi-sentence write-up. */
	about?: string
	industry?: string
	/** Founding / established year, e.g. '1995'. */
	founded?: string
	/** Specific HQ, e.g. 'Pak Kret, Nonthaburi, Thailand'. */
	headquarters?: string
	/** Scale descriptor, e.g. 'SET-listed public company'. */
	size?: string
	/** Parent company / group, e.g. 'Jasmine International PCL (SET: JAS)'. */
	parentGroup?: string
	/** Stock listing, e.g. 'SET: JTS'. */
	stockTicker?: string
	/** Notable products / brands / services. */
	products?: string[]
	/** Short notable facts. */
	highlights?: string[]
}

/** A role/experience period at an organization */
export interface ExperienceItem {
	id: ExperienceId // url-safe id
	organization: Organization
	position: Position
	/** Education-only headline, e.g. 'B.S. Computer Science' — rendered instead of `position`. */
	credential?: string
	description: string
	type: EmploymentType
	category: ExperienceCategory
	startDate: string
	endDate?: string
}

/** A single milestone on a project's evolution timeline */
export interface Milestone {
	date: string // YYYY-MM-DD
	title: string
	description?: string
	icon?: string // Iconify name, e.g. 'simple-icons:cloudflare'
	/** Skills introduced at this milestone — resolved from ids at build time. */
	addedSkills?: Skill[]
	/** Skills retired at this milestone — resolved from ids at build time. */
	removedSkills?: Skill[]
}

/** A project / build */
export interface Project {
	id: string // url-safe id
	title: string
	description: string
	/** Short resume-style blurb (1–2 lines) for the CV / presentation; falls back to `description`. */
	resumeSummary?: string
	/**
	 * Card copy, ≤ 180 chars. Optional: cards fall back to `excerpt(description)` — the
	 * leading whole sentences that fit. Set it only when those sentences say too little
	 * (a description that opens with context rather than with what the project is).
	 */
	summary?: string
	images: {
		cover: string
		photos: string[]
	}
	/**
	 * The project's signal color, as hex. Sampled from the real product's brand — the
	 * live site's logo/UI where there is one — NOT invented. Drives the generated
	 * `cover.webp` (see the `/cover` skill) and the 1:1 share card's chrome, so the
	 * two always agree. Keep them distinct so the set reads as a family.
	 */
	accent: string
	/** Full historical roster — every skill ever used (starting stack + all timeline deltas + tooling). */
	skills: Skill[]
	/** Currently-active stack — derived by folding the timeline's add/remove events. */
	activeSkills: Skill[]
	/** Skills used then dropped (roster − active) — shown but marked retired. */
	retiredSkills: Skill[]
	links: {
		live?: string
	}
	startDate: string // YYYY-MM-DD
	endDate?: string // YYYY-MM-DD, or undefined if ongoing
	/** Role(s) this project was delivered under — primary role first. */
	linkedExperienceIds?: ExperienceId[]
	/** Client/partner the work was delivered for — overrides the role-derived "Client". */
	clientOrganizationId?: EntityId
	/** Org the work was seconded to / delivered via — a credit, not an employer. */
	viaOrganizationId?: EntityId
	timeline?: Milestone[]
}

// --- Blog ---

/**
 * One block of a post body. A discriminated union rather than markdown/MDX on purpose:
 * blocks stay serialisable strings (so `scripts/llms/generate.ts` can flatten them),
 * the renderer stays a plain switch, and no markdown pipeline enters the runtime
 * container. Inline text supports exactly four forms, resolved by `common/data/posts/inline.ts`:
 * `` `code` ``, `**bold**`, `[text](href)`, and `[[kind:id]]` cross-references.
 */
export type PostBlock =
	| { kind: 'p'; text: string }
	| { kind: 'h2'; text: string } // TOC anchors are derived from these, never authored
	| { kind: 'h3'; text: string }
	| { kind: 'code'; lang: string; code: string; caption?: string }
	| { kind: 'list'; ordered?: boolean; items: string[] }
	| { kind: 'callout'; tone: 'info' | 'warn' | 'danger' | 'success'; title?: string; text: string }
	| { kind: 'quote'; text: string; cite?: string }
	| { kind: 'image'; src: string; alt: string; caption?: string }
	| { kind: 'stat'; value: string; label: string; source?: string }
	| { kind: 'table'; head: string[]; rows: string[][] }

/** A question a reader actually asks — rendered visibly AND emitted as FAQPage JSON-LD. */
export interface PostFaq {
	q: string
	a: string
}

/**
 * Authoring shape for a blog post. Two validation tiers, enforced by `resolvePost`:
 *
 * - **Stub** (`draft: true`): only `id`, `title`, `happenedAt`, `chapter` are needed.
 *   Renders nowhere — not prerendered, not in the sitemap, llms.txt or ⌘K, and its URL
 *   is a real 404 (`dynamicParams = false`). The backlog lives in the repo as stubs.
 * - **Full** (no `draft`): every AEO field below is required and validated. Flipping
 *   `draft` off IS publishing — there is no scheduler.
 *
 * Two dates, never one standing in for the other:
 * - `happenedAt` is the date of the event the post is about — a milestone, a commit, a role
 *   date — however far back. It orders the journey: the archive, chapters, "Happened".
 * - `publishedAt` is the day the post went live — the commit that removed `draft`. It is
 *   what `datePublished`, `article:published_time` and the sitemap report, because Google's
 *   byline-date guidance says a page must not claim "the date of the action described on the
 *   page" as its publication date. The two used to be one field, and 30 posts written on
 *   2026-08-25 claimed to have been published as early as 2021.
 */
export interface PostDef {
	id: string // url-safe id — /blog/<id>. NEVER slugify(title); see scripts/links/check.ts.
	title: string // query-shaped — how someone would SEARCH it, not a clever headline
	happenedAt: string // YYYY-MM-DD — the REAL date of the event this post is about (milestone, commit, role date). Orders the journey; same-day ties sort by registry order.
	chapter: PostChapter
	draft?: boolean
	// --- Required once draft is off (resolvePost enforces) ---
	publishedAt?: string // YYYY-MM-DD — the day the post went live (set it in the commit that removes `draft`). Never before happenedAt, never future.
	description?: string // <= 155 chars — the meta description
	tldr?: string // 2-3 sentences, THE direct answer. Rendered first; what an engine cites.
	category?: PostCategory
	faqs?: PostFaq[] // >= 3 — feeds FAQPage JSON-LD, rendered visibly by PostFaq
	body?: PostBlock[]
	// --- Optional either way ---
	updatedAt?: string // YYYY-MM-DD — last reader-visible revision after going live; > publishedAt, or omitted
	series?: { id: string; part: number } // cross-chapter topic cluster, e.g. 'container-diet'
	lessons?: string[] // the "what I'd do differently" bullets
	skills?: SkillId[] // cross-links to /skills/<id> — typo-checked at compile time
	relatedProjectIds?: string[] // cross-links to /projects/<id> — validated by resolvePost
	relatedExperienceIds?: ExperienceId[] // cross-links to /career/<id>
	relatedEntityIds?: EntityId[] // cross-links to /companies/<id>
	sources?: { title: string; url: string }[] // outbound citations
	accent?: string // hex for the OG card — defaults per category; mirrors Project.accent
	cover?: string // from assets, when a post earns one
}

/** A resolved, publishable post — every AEO field present, `readingMinutes` derived. */
export interface Post extends PostDef {
	publishedAt: string
	description: string
	tldr: string
	category: PostCategory
	faqs: PostFaq[]
	body: PostBlock[]
	accent: string
	/** Derived by `resolvePost` at 200 wpm — never authored. */
	readingMinutes: number
}

/**
 * An original write-up for one skill — the prose `/skills/<id>` otherwise lacks, and what
 * earns that page a place in the index (see `isSkillIndexable` in `data/coverage.ts`).
 *
 * Deliberately NOT a field on `Skill`: skills are declared through `skill()`, whose
 * `const` type parameter keeps `SkillId` a literal union, and a note there would be
 * inferred as literal types inside that tuple too. Notes live in `data/skill-notes/`.
 */
export interface SkillNote {
	updatedAt: string // YYYY-MM-DD — when the note was last written
	body: PostBlock[] // the Journal's typed blocks and inline format, rendered by PostBody
}

/** Global personal information */
export interface PersonalData {
	name: string
	title: string
	/** Freelance-facing headline for the homepage hero — a hireable role, deliberately
	 *  decoupled from `title`/the career timeline's latest position (e.g. a C-suite
	 *  title there reads as "not for hire" to a freelance client browsing the hero). */
	heroRole: string
	tagline: string
	avatar: string
	about: {
		bio: string
		highlights: string[]
	}
	contact: {
		email: string
		location: string
		availability: string
		/** E.164 phone for the vCard `TEL`, e.g. '+66855877024'. Scoped to the vCard/QR. */
		phone?: string
		/** Free-text locality for the vCard `ADR`, e.g. 'Nonthaburi'. */
		locality?: string
		/** Free-text country for the vCard `ADR`, e.g. 'Thailand'. */
		country?: string
		/** ASCII romanised given name — vCard `N` must not depend on the display name. */
		givenName?: string
		/** ASCII romanised family name. */
		familyName?: string
	}
	birthDate: string
	languages: Language[]
	socialLinks: SocialLink[]
	/** Direct messaging channels rendered on /contact. Optional — omit an entry to hide it. */
	contactChannels?: ContactChannel[]
}
