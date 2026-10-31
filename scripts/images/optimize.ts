/**
 * Normalizer for `public/**\/*.webp`. Run: `bun run images:optimize`, commit the result.
 * NOT a build step — the artifacts are committed.
 *
 * Why this exists: the site serves plain `<img>` with `images: { unoptimized: true }`,
 * so there is no srcset and **the source file's dimensions are exactly what every
 * visitor downloads**. Nothing right-sizes these at request time any more.
 *
 * Most of the weight here was over-ENCODING, not over-sizing: the looklook-pet gallery
 * shipped 0.36–0.45 bytes/px where a good WebP photo is 0.10–0.20, at dimensions that
 * were already correct. So resizing is the exception (see `TARGETS`) and re-encoding the
 * genuinely bloated files is the rule.
 *
 * A file is only rewritten when there is a REASON to — it is oversized, or it is
 * over-encoded. Re-encoding something already near target buys a few percent and costs a
 * generation of quality, so files that are already fine are left completely alone. That
 * matters most for the project covers, three of which are printed on A4 (see FLOORS).
 */
import { readdirSync, renameSync, statSync, unlinkSync } from 'node:fs'
import { join, relative } from 'node:path'
import sharp from 'sharp'

const PUBLIC = join(process.cwd(), 'public')

/**
 * Matches `.agents/skills/make-cover/assets/render.sh` (`cwebp -q 88`), so generated covers
 * and normalized ones stay consistent. Measured against the previous encodes at 39.0 dB
 * PSNR — indistinguishable from q92, which costs 15% more bytes for nothing.
 */
const QUALITY = 88

/**
 * Stamped into EXIF on write, and checked before doing anything. This — not a
 * size comparison — is what makes re-runs safe: WebP→WebP at the same quality usually
 * yields a marginally *smaller* file while still losing a generation, so "only replace
 * when smaller" silently degrades images on every run. Verified to round-trip through
 * sharp's WebP encoder at zero byte cost.
 */
const MARKER = 'nooobtimex:optimized:v1'

/** Above this, a file is over-encoded for its pixel count and worth re-encoding. */
const MAX_BYTES_PER_PIXEL = 0.22

/**
 * Square resize targets, keyed by path under `public/`. Anything absent keeps its native
 * dimensions. Each value is `2 × the largest CSS px the file ever renders at`, rounded
 * up and clamped by the floors below.
 *
 * ⚠️ HARD FLOORS — going under any of these breaks something with no error:
 *   - every `cover.webp` under `issue/` ≥ 1080: `pngDataUri(cover, CARD_SIZE)` in
 *     app/card/projects/[id]/route.tsx resizes with `withoutEnlargement: true`, so a
 *     smaller source is NOT upscaled — Satori stretches it across the 1080×608 slot and
 *     the share card goes quietly blurry. Google's structured-data guidance wants ≥1200,
 *     and app/cv/page.tsx prints three of them on A4 at 182mm (1600px = 223 DPI).
 *     No cover appears below for exactly this reason.
 *   - `logo/logo.webp` ≥ 512: app/manifest.ts declares its size to Chrome. Keep the two
 *     in step.
 *   - the `logo/*` org marks ≥ 112: JSON-LD `Organization.logo` minimum.
 */
const TARGETS: Record<string, number> = {
	// Home avatar peaks at 318 CSS px (HomeContent.tsx, `lg:size-80`) → 636 at DPR 2.
	// Also the manifest icon, apple-touch-icon, vCard PHOTO and JSON-LD `Person.image`.
	// The source is 1467×1468 — not square — so `fit: 'cover'` trims 1px and makes the
	// manifest's declared size honest for the first time.
	'logo/logo.webp': 640,
	// Largest render anywhere is 52 CSS px (CompanyDetail/ExperienceDetail, `size-16`
	// minus `p-1.5`). 1800×1800 was 34× oversized.
	'logo/RSTROPHY.webp': 256,
	'logo/tu-logo.webp': 256,
	// Byte-identical copies of logo/RSTROPHY.webp sitting in three project galleries as
	// if they were screenshots. Kept (the galleries look unchanged) but sized for the
	// lightbox rather than for print. Worth replacing with real screenshots one day.
	'issue/rs-trophy/photo-1.webp': 1024,
	'issue/rs-medal/photo-1.webp': 1024,
	'issue/rs-award/photo-1.webp': 1024
}

function walk(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
		const full = join(dir, e.name)
		if (e.isDirectory()) return walk(full)
		return e.isFile() && e.name.endsWith('.webp') ? [full] : []
	})
}

const kb = (n: number) => `${(n / 1024).toFixed(0)}K`

async function main(): Promise<void> {
	const files = walk(PUBLIC).sort()
	let before = 0
	let after = 0
	const changed: string[] = []
	const skipped: string[] = []

	console.log(`${'file'.padEnd(40)} ${'from'.padEnd(18)} ${'to'.padEnd(18)} reason`)
	console.log('-'.repeat(96))

	for (const file of files) {
		const key = relative(PUBLIC, file)
		const original = statSync(file).size
		const meta = await sharp(file).metadata()
		before += original
		after += original

		const from = `${meta.width}×${meta.height} ${kb(original)}`
		const keep = (why: string) => {
			skipped.push(key)
			console.log(`${key.padEnd(40)} ${from.padEnd(18)} ${'—'.padEnd(18)} ${why}`)
		}

		if (meta.exif?.toString('latin1').includes(MARKER)) {
			keep('already optimized')
			continue
		}

		const target = TARGETS[key]
		const oversized = target !== undefined && target < meta.width
		const overEncoded = original / (meta.width * meta.height) > MAX_BYTES_PER_PIXEL

		if (!oversized && !overEncoded) {
			keep('already within budget')
			continue
		}

		const tmp = `${file}.tmp`
		let pipeline = sharp(file)
		// Never upscale — that only adds bytes and invents nothing.
		if (oversized) pipeline = pipeline.resize({ width: target, height: target, fit: 'cover' })

		// Take the output dimensions from `toFile`'s own result. Re-reading the path after
		// the rename returns STALE values — sharp keeps a file-level metadata cache keyed
		// by path, so overwriting in place fools it.
		const out = await pipeline
			.webp({ quality: QUALITY, effort: 6 })
			.withMetadata({ exif: { IFD0: { ImageDescription: MARKER } } })
			.toFile(tmp)

		const size = statSync(tmp).size
		// A tiny source (128×128) re-encodes LARGER. Leave it, and leave it unmarked so
		// the reason check above keeps rejecting it for free.
		if (size >= original) {
			unlinkSync(tmp)
			keep('re-encode was larger')
			continue
		}

		renameSync(tmp, file)
		after += size - original
		changed.push(key)
		console.log(
			`${key.padEnd(40)} ${from.padEnd(18)} ${`${out.width}×${out.height} ${kb(size)}`.padEnd(18)} `
				+ `${oversized ? 'resized' : 'over-encoded'} → ${Math.round((size / original) * 100)}%`
		)
	}

	console.log('-'.repeat(96))
	console.log(`rewrote ${changed.length} · left alone ${skipped.length}`)
	console.log(
		`public/  ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024 / 1024).toFixed(2)} MB`
			+ `  (saves ${((before - after) / 1024 / 1024).toFixed(2)} MB, ${Math.round(100 - (after / before) * 100)}% smaller)`
	)
}

main()
