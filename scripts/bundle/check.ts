/**
 * The client-bundle leak gate. Run: `bun run bundle:check` — wired into `bun run build`.
 *
 * Fails when a browser chunk contains Journal post text.
 *
 * It exists because that leak is invisible. The `@/common` barrel is safe on the server and
 * ruinous in the browser: its post registry validates at import time, so a `'use client'`
 * module that imports ANY value from it — `personalData` for a vCard — ships the whole data
 * layer, every post's body, TL;DR, FAQs and sources included. Three client components did,
 * and /contact and /cv/presentation each loaded a 436 KB chunk of articles on first paint,
 * while the ⌘K palette pulled the same chunk on open. The build, lint and types were silent.
 *
 * Client components get data as props from a server parent (VCardPanel, PresentationView)
 * or fetch a prerendered file (the palette's /search-index.json) — never from the barrel.
 *
 * Probes are ASCII-only windows of each published post's TL;DR, so a minifier escaping a
 * quote or a dash cannot hide a match. Like the other post-build gates, it reads the build
 * output rather than the import graph: what matters is what the browser actually downloads.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { postsData } from '../../common'

const CHUNKS_DIR = '.next/static/chunks'
const PROBE_LENGTH = 40

function walk(dir: string): string[] {
	if (!existsSync(dir)) return []
	return readdirSync(dir).flatMap(name => {
		const full = join(dir, name)
		return statSync(full).isDirectory() ? walk(full) : [full]
	})
}

function main(): void {
	const chunks = walk(CHUNKS_DIR).filter(f => f.endsWith('.js'))
	if (chunks.length === 0) throw new Error(`No client chunks found in ${CHUNKS_DIR}. Run \`next build\` first.`)

	const probes = postsData
		.map(p => ({
			id: p.id,
			text: (p.tldr.match(new RegExp(`[A-Za-z0-9 ,.]{${PROBE_LENGTH},}`))?.[0] ?? '').slice(0, PROBE_LENGTH)
		}))
		.filter(p => p.text.length === PROBE_LENGTH)

	const leaks: string[] = []
	let largest = { file: '', size: 0 }
	for (const file of chunks) {
		const source = readFileSync(file, 'utf8')
		const size = statSync(file).size
		if (size > largest.size) largest = { file, size }
		const hits = probes.filter(p => source.includes(p.text))
		if (hits.length > 0)
			leaks.push(
				`  ${relative(CHUNKS_DIR, file)} (${size.toLocaleString('en-US')} B) — text from ${hits.length} post(s): `
					+ `${hits
						.slice(0, 3)
						.map(h => h.id)
						.join(', ')}${hits.length > 3 ? ', …' : ''}`
			)
	}

	if (leaks.length > 0) {
		throw new Error(
			`${leaks.length} client chunk(s) contain Journal post text:\n${leaks.join('\n')}\n\n`
				+ `A 'use client' module imports a value from @/common, which drags the whole data layer\n`
				+ `into the browser. Pass the data as props from a server parent, or fetch a prerendered\n`
				+ `file. See scripts/bundle/check.ts for why this gate exists.`
		)
	}

	console.log(
		`bundle:check — ${chunks.length} chunks, ${probes.length} post probes, no post text in the browser `
			+ `(largest chunk ${largest.size.toLocaleString('en-US')} B).`
	)
}

main()
