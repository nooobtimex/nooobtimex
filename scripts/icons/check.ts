/**
 * The drift gate. Run: `bun run icons:check` — wired into `bun run build`.
 *
 * Fails when `common/data` references an icon that `lib/og-icons.generated.json` does
 * not carry, i.e. someone added a skill and forgot `bun run icons:generate`. Without
 * this the failure is silent and remote: a blank slot on a social card nobody looks at
 * until it is already shared.
 *
 * Deliberately does NOT import `./collections` — this runs on every build, and pulling
 * in 26.7 MB of icon JSON to check 175 strings would reintroduce the cost this whole
 * pipeline exists to remove. It compares two key sets, nothing more.
 *
 * Compares PARSED CONTENT, not bytes: `bun run lint` runs `bun fmt` with no `.prettierignore`
 * entry for it, so the artifact gets reformatted and a byte comparison would flap.
 */
import generated from '@/lib/og-icons.generated.json'
import { requiredIcons } from './required'

function main(): void {
	const required = requiredIcons()
	const present = new Set(Object.keys(generated))

	const missing = required.filter(n => !present.has(n))
	const orphaned = [...present].filter(n => !required.includes(n)).sort()

	if (missing.length > 0) {
		throw new Error(
			`${missing.length} icon(s) referenced in common/data are missing from lib/og-icons.generated.json:\n`
				+ `  ${missing.join('\n  ')}\n\n`
				+ `Run \`bun run icons:generate\` and commit the result.`
		)
	}

	// Orphans are stale, not broken — they only waste a few KB, so warn rather than fail.
	if (orphaned.length > 0) {
		console.warn(
			`icons:check — ${orphaned.length} unused icon(s) in the subset; `
				+ `run \`bun run icons:generate\` to prune:\n  ${orphaned.join('\n  ')}`
		)
	}

	console.log(`icons:check — ${required.length} icons OK`)
}

main()
