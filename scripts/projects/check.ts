/**
 * The project drift gate. Run: `bun run projects:check` — wired into `bun run gate`.
 *
 * Fails on two kinds of drift that nothing else catches:
 *
 * 1. **File names.** Each project lives in `common/data/projects/<id>.ts`; the file name is
 *    how a person finds `/projects/<id>` in the tree. A renamed id with a stale file name
 *    still builds.
 * 2. **Cover table.** The `make-cover` skill's per-project table is the only record of what a
 *    rendered `cover.webp` says, and the covers are pixels nobody re-reads. The
 *    online-poker-game cover kept advertising PostgreSQL after a milestone retired it. Every
 *    project needs a row; its `accent` must match the project's; its tags must name skills
 *    that are still ACTIVE for that project; a status badge must match `projectStatus()`.
 *
 * Runs in `gate`, not in `build`: `.dockerignore` keeps `.agents/` out of the image, so the
 * Railway build cannot read the skill's table.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { type ProjectStatus, projectStatus } from '@/lib/utils'
import { type Project, projectsData } from '@/common'

const PROJECTS_DIR = 'common/data/projects'
const COVER_TABLE = '.agents/skills/make-cover/SKILL.md'

/** The cover badge wording for each derived status. Other badges (`● SaaS`, `● Thesis`) are free text. */
const BADGE: Record<ProjectStatus, string> = {
	'live': 'Live',
	'in-development': 'In Development',
	'internal': 'Internal',
	'archived': 'Archived'
}

/** Loose name match: `Next.js` ~ `Next.js`, `Bun` ~ `Bun.js`, `R2` ~ `Cloudflare R2`, `shadcn` ~ `Shadcn/ui`. */
const norm = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '')
		.replace(/js$/, '')
const tagNamesSkill = (tag: string, skillName: string) => {
	const t = norm(tag)
	const n = norm(skillName)
	return t === n || (t.length >= 2 && n.includes(t))
}

async function checkFileNames(errors: string[]): Promise<void> {
	const files = readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts')
	const fileIds = new Set<string>()
	for (const file of files) {
		const mod: Record<string, unknown> = await import(join(process.cwd(), PROJECTS_DIR, file))
		const ids = Object.values(mod)
			.filter((v): v is { id: string } => typeof v === 'object' && v !== null && 'id' in v)
			.map(v => v.id)
		const expected = basename(file, '.ts')
		if (ids.length !== 1) errors.push(`${file}: exports ${ids.length} projects — one per file`)
		else if (ids[0] !== expected) errors.push(`${file}: defines "${ids[0]}" — rename the file to ${ids[0]}.ts`)
		fileIds.add(expected)
	}
	for (const p of projectsData) {
		if (!fileIds.has(p.id)) errors.push(`"${p.id}" has no ${PROJECTS_DIR}/${p.id}.ts`)
	}
}

function checkCoverTable(errors: string[]): void {
	const rows = new Map<string, { accent?: string; badge?: string; tags: string[] }>()
	for (const line of readFileSync(COVER_TABLE, 'utf8').split('\n')) {
		const m = line.match(/^([a-z0-9-]+)\s+accent (#[0-9A-Fa-f]{6})\s/)
		if (!m) continue
		const badge = line.match(/\bbadge ● (.+?)(?:\s{2,}|$)/)?.[1]
		const tags =
			line
				.match(/\btags (.+)$/)?.[1]
				.split(',')
				.map(t => t.trim()) ?? []
		rows.set(m[1], { accent: m[2], badge, tags })
	}

	const byId = new Map<string, Project>(projectsData.map(p => [p.id, p]))
	for (const id of rows.keys()) {
		if (!byId.has(id)) errors.push(`${COVER_TABLE}: row "${id}" matches no project`)
	}
	for (const p of projectsData) {
		const row = rows.get(p.id)
		if (!row) {
			errors.push(`"${p.id}" has no row in the ${COVER_TABLE} table`)
			continue
		}
		if (row.accent?.toLowerCase() !== p.accent.toLowerCase()) {
			errors.push(`"${p.id}": cover accent ${row.accent} ≠ project accent ${p.accent}`)
		}
		for (const tag of row.tags) {
			if (!p.activeSkills.some(s => tagNamesSkill(tag, s.name))) {
				errors.push(`"${p.id}": cover tag "${tag}" is not an active skill — re-render the cover`)
			}
		}
		const status = projectStatus(p)
		if (row.badge && Object.values(BADGE).includes(row.badge) && row.badge !== BADGE[status]) {
			errors.push(`"${p.id}": cover badge "● ${row.badge}" but the site says "${BADGE[status]}"`)
		}
	}
}

async function main(): Promise<void> {
	const errors: string[] = []
	await checkFileNames(errors)
	checkCoverTable(errors)
	if (errors.length > 0) {
		throw new Error(`projects:check — ${errors.length} problem(s):\n  ${errors.join('\n  ')}`)
	}
	console.log(`projects:check — ${projectsData.length} projects, file names and cover table agree.`)
}

await main()
