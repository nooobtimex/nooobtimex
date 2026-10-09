---
paths:
  - '**/*.tsx'
  - '**/*.css'
  - 'components/cyber/**'
---

# NooobtimeX — Design System Reference

> Persistent design memory. **Path-scoped rule** — auto-loads when you edit UI
> files (`.tsx` / `.css` / `components/cyber`); it is not loaded on pure-data
> sessions. Build UI from these primitives, not raw markup. Treat them as hard
> constraints. Cross-references: root [`CLAUDE.md`](../../CLAUDE.md),
> [`/app-conventions`](../skills/app-conventions/SKILL.md).

## 1. Identity

A personal profile (a freelance-hire funnel) with a **Cyberpunk 2077** visual theme — neon signal colors
on dark surfaces, notched/HUD framing, glitch and scanline accents. The feeling is
high-contrast and "in-world", not generic SaaS.

### Copy: the theme is visual, the words are plain

The site's reader is a client deciding whether to hire, not a player. The in-world feel
lives in **color, notches, neon, glitch and the `//` eyebrow mark** — never in words a
visitor has to decode.

- Every title, label, button and nav item is plain English: "Projects", not "Gig Board";
  "Tech used", not "Loadout"; "Company facts", not "Dossier"; "Page not found", not
  "Signal Lost". A `//` eyebrow is fine; what follows it must say what the thing is.
- A nav label and the H1 of the page it opens are the same word.
- **No numbered section codes** (`03 //`). They meant nothing to a visitor and drifted out
  of step — two index pages both said 05, and home skipped 07 when a section was absent.
  `SectionHeader` has no `code` prop; its accent rule is purely visual. (A slide counter in
  `/cv/presentation` is the exception — it is derived from the slide's position.)
- Journal post text is out of scope — authorial voice, not UI.

## 2. Signal colors — Tailwind utilities, not raw hex

Use the named signal utilities; don't hand-write the hex.

| Utility                         | Hex       | Role                       |
| ------------------------------- | --------- | -------------------------- |
| `bg-cyber-yellow` (and `text-`) | `#FCEE0A` | **Primary** — CTAs, accent |
| `text-cyber-cyan`               | `#00F0FF` | Links, info, highlights    |
| `cyber-magenta`                 | `#FF003C` | Danger / glitch            |
| `cyber-green`                   | —         | Success / positive         |
| `cyber-purple`                  | —         | Secondary accent           |

## 3. Build from `components/cyber/`, not raw markup

These are the design-system primitives — reach for them before writing a `<div>`:

- **`Container`** — the **one** page-width wrapper (`mx-auto max-w-7xl px-4 md:px-6`).
  Wrap every page/section in it; change site width in one place. Has `as` + `className`.
- **`NeonPanel`** — the panel surface.
- **`SectionHeader`** — accent rule + `title` + `subtitle` + `action` (+ `as='h1'` on index pages).
- **`CyberButton`** — variants `solid | outline | danger | ghost`; renders a
  `<button>`, an internal `<Link>`, or an external `<a>` based on `href` + `external`
  (and casts internal hrefs to `Route` for you).
- **`CyberTag`**, **`CyberTooltip`**, **`GlitchText`**, **`ScanlineOverlay`**,
  **`MotionReveal`** (scroll-in reveal).

## 4. Utility classes

`clip-notch` / `clip-notch-sm` (notched corners), `neon-text-yellow`, `perk-node`.

## 5. React Compiler RULES are enforced (the compiler itself is not on)

`next.config.ts` never sets `reactCompiler` — what is on is `eslint-plugin-react-hooks`
v7, whose `recommended` config ships the compiler-derived rules as errors (`purity`,
`set-state-in-effect`, `preserve-manual-memoization`, …). Practical effect is the same:
avoid patterns the compiler rejects — hand-rolled `useCallback` / `useMemo`, synchronous
setState in effects — and write plain components.

## 6. Icons — three surfaces, and they are not interchangeable

Store icon names as **strings in the data layer** (e.g. a skill's `icon`), never as
imported components. Where that string is resolved depends on who renders it:

| Surface                                                                       | Resolver                                         | Reach                                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| **Server** components                                                         | `<CyberIcon icon="logos:react" />`               | only what is in `lib/og-icons.generated.json`         |
| **Client** components                                                         | `@iconify/react` — `<Icon icon="logos:react" />` | any icon, fetched from the Iconify API in the browser |
| **Server** — Satori cards (`components/og/`), README SVGs (`scripts/readme/`) | `resolveIcon()` / `iconDataUri()` from `lib/`    | only what is in `lib/og-icons.generated.json`         |

**Prefer `CyberIcon` in anything that is not `'use client'`.** It inlines the SVG, so the
icon is in the prerendered HTML. `@iconify/react`'s `Icon` fetches from
api.iconify.design _after mount_ — before this component existed the built HTML
contained **zero** inline `<svg>` across 69 render sites, so every icon was blank until
a third-party round-trip finished, and absent entirely wherever that host is blocked.
Preloading the data does not help: `Icon` emits `<span></span>` under `renderToString`
even when the icon is registered via `addIcon`.

> **Never import `CyberIcon` into anything reachable from a `'use client'` boundary.** It
> pulls `lib/og-icons.generated.json` (~143 KB) with it. That is why `CyberTag` — a
> shared primitive rendered from `contact/`'s client components — deliberately stays on
> `@iconify/react`. Server-only components get inlined SVG; anything a client component
> can import stays on the API.

A literal icon name hard-coded in a server component must be added to `EXTRA_ICONS` in
`scripts/icons/required.ts` (an explicit list — never a scan; see that file's rationale)
and regenerated. `CyberIcon` throws on an unknown name rather than rendering nothing,
so the failure is loud at build time instead of an invisible icon in production.

None of the server paths can fetch at render time, so they all read the same **curated
local subset** (154 icons, ~146 KB) — generated from `common/data` plus the
`EXTRA_ICONS` list, and committed.

> **Never `import { icons } from '@iconify-json/…'` in `app/`, `components/`, or
> `lib/`.** Those six packages are 26.7 MB / 32,844 icons. They used to be imported by
> `lib/og-assets.ts`, and Turbopack inlined the whole payload into two server chunks
> loaded by every page — ~275 MB of resident RSS in production for icons that were
> provably dead in the page graph. They now live in devDependencies, quarantined behind
> `scripts/icons/collections.ts`. See `lib/og-palette.ts` for the post-mortem.

**Adding or changing an `icon:` in `common/data` means `bun run icons:generate`.**
Forgetting is caught — `bun run icons:check` gates `bun run build` and fails with the
missing name. Need an icon from a collection we do not carry? Add the collection to
`scripts/icons/collections.ts` and regenerate.

## 7. Images are plain `<img>` — `next/image` is not used

`images: { unoptimized: true }` in `next.config.ts`, and `@next/next/no-img-element` is
off in `eslint.config.mjs`. Every asset in `public/` is already WebP at a sane size, so
the optimizer bought nothing while dragging sharp/libvips into the runtime container.

The `fill` idiom translates to `absolute inset-0 size-full` on a `relative` parent:

```tsx
<span className='relative size-12 overflow-hidden'>
	<img
		src={org.logo}
		alt={org.name}
		loading='lazy'
		decoding='async'
		className='absolute inset-0 size-full object-contain p-1'
	/>
</span>
```

Use `loading='eager' fetchPriority='high'` for above-the-fold LCP images (the home
avatar, a project cover), `loading='lazy' decoding='async'` everywhere else.

### Sizing — no srcset means source size _is_ delivered size

```
target width = min(source width, 2 × the largest CSS px it ever renders at)
```

`bun run images:optimize` applies this across `public/`. It only rewrites a file that is
oversized or over-encoded (>0.22 bytes/px), stamps an EXIF marker, and skips anything
already marked — so re-running is safe and will not stack generational loss. Adding a
new asset? Run it; it will leave everything else alone.

**Never hand-shrink a file below these floors — each one fails silently:**

| Floor                       | Applies to             | Set by                                                                                                                                                                                                      |
| --------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1200 px** (1080 absolute) | `issue/*/cover.webp`   | `pngDataUri(cover, 1080)` uses `withoutEnlargement: true`, so a smaller source is stretched into the 1080×608 share card, blurry, no error. Plus A4 print in `app/cv/page.tsx` (182 mm) and JSON-LD `image` |
| **512×512**                 | `logo/logo.webp`       | `app/manifest.ts` declares the size to Chrome — keep the two in step                                                                                                                                        |
| **112×112**                 | the `logo/*` org marks | JSON-LD `Organization.logo`                                                                                                                                                                                 |

Only the gallery photos under `issue/*/photo-*.webp` have no non-browser consumer.
