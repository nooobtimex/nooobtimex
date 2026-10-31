---
name: design
description: The Cyberpunk 2077 design system of the NooobtimeX profile site — plain-English copy on a neon theme, the signal colour utilities, the components/cyber primitives, utility classes, the React Compiler lint rules, the three icon surfaces and the plain-`<img>` image rules. Use when adding or editing any .tsx or .css file, a component under components/cyber, a page layout, an icon, an image under public/, or when asked how the UI should look or be built here.
paths:
  - '**/*.tsx'
  - '**/*.css'
  - 'components/cyber/**'
---

# NooobtimeX design system

Persistent design memory for the UI: build it from these primitives, not raw markup, and treat them as hard
constraints. It surfaces when a `.tsx`, a `.css` or a `components/cyber/` file is touched; a pure-data session
(`common/`) does not need it. Neighbours: the root [`AGENTS.md`](../../../AGENTS.md) for the repo facts, and the
[`app-conventions`](../app-conventions/SKILL.md) skill for routes and page composition.

## 1. Identity

A personal profile (a freelance-hire funnel) with a **Cyberpunk 2077** visual theme — neon signal colours on dark
surfaces, notched/HUD framing, glitch and scanline accents. The feeling is high-contrast and "in-world", not
generic SaaS.

### Copy: the theme is visual, the words are plain

The site's reader is a client deciding whether to hire, not a player. The in-world feel lives in **colour,
notches, neon, glitch and the `//` eyebrow mark** — never in words a visitor has to decode.

- Every title, label, button and nav item is plain English: "Projects", not "Gig Board"; "Tech used", not
  "Loadout"; "Company facts", not "Dossier"; "Page not found", not "Signal Lost". A `//` eyebrow is fine; what
  follows it must say what the thing is.
- A nav label and the H1 of the page it opens are the same word.
- **No numbered section codes** (`03 //`). They meant nothing to a visitor and drifted out of step — two index
  pages both said 05, and home skipped 07 when a section was absent. `SectionHeader` has no `code` prop; its
  accent rule is purely visual. (A slide counter in `/cv/presentation` is the exception — it is derived from the
  slide's position.)
- Journal post text is out of scope — authorial voice, not UI.

## 2. Signal colours — Tailwind utilities, not raw hex

Use the named signal utilities; don't hand-write the hex. They are defined in `app/globals.css`
(`--cyber-*` variables, exposed as `--color-cyber-*`).

| Utility                         | Hex       | Role                       |
| ------------------------------- | --------- | -------------------------- |
| `bg-cyber-yellow` (and `text-`) | `#FCEE0A` | **Primary** — CTAs, accent |
| `text-cyber-cyan`               | `#00F0FF` | Links, info, highlights    |
| `cyber-magenta`                 | `#FF003C` | Danger / glitch            |
| `cyber-green`                   | `#39FF14` | Success / positive         |
| `cyber-purple`                  | `#B026FF` | Secondary accent           |

The `next/og` (Satori) cards cannot read CSS variables, so they use the literal-hex `OG` palette in
`lib/og-palette.ts`, which mirrors these colours.

## 3. Build from `components/cyber/`, not raw markup

These are the design-system primitives — reach for them before writing a `<div>`:

- **`Container`** — the **one** page-width wrapper (`mx-auto w-full max-w-7xl px-4 md:px-6`). Wrap every
  page/section in it; change site width in one place. Has `as` (`div | section | main`) + `className`.
- **`NeonPanel`** — the panel surface (`variant` `cyan | yellow`, `notch`, `corners`).
- **`SectionHeader`** — accent rule + `title` + `subtitle` + `action` (+ `as='h1'` on index pages).
- **`CyberButton`** — variants `solid | outline | danger | ghost`; renders a `<button>`, an internal `<Link>`, an
  external `<a>` or — for `mailto:`, `tel:` and `download` — a plain `<a>`, based on `href` + `external` (and
  casts internal hrefs to `Route` for you).
- **`CyberTag`**, **`CyberTooltip`**, **`GlitchText`**, **`ScanlineOverlay`**, **`MotionReveal`** (scroll-in
  reveal), **`CyberIcon`** (server-side icons, §6).

## 4. Utility classes

`clip-notch` / `clip-notch-sm` (notched corners), `neon-text-yellow`, `perk-node` — all in `app/globals.css`.

## 5. React Compiler rules are enforced (the compiler itself is not on)

`next.config.ts` never sets `reactCompiler` — what is on is `eslint-plugin-react-hooks` v7, whose `recommended`
config ships the compiler-derived rules as errors (`purity`, `set-state-in-effect`,
`preserve-manual-memoization`, …). Practical effect is the same: avoid patterns the compiler rejects —
hand-rolled `useCallback` / `useMemo`, synchronous setState in effects — and write plain components.

## 6. Icons — three surfaces, and they are not interchangeable

Store icon names as **strings in the data layer** (a skill's `icon`), never as imported components. Which
resolver renders a name depends on who renders it; the table, the numbers and the post-mortems are in
[`references/icons.md`](references/icons.md).

- **Server component** → `<CyberIcon icon="logos:react" />` (inlines the SVG into the HTML).
- **Client component** (`'use client'`) → `@iconify/react`'s `<Icon>`.
- **Satori cards and README SVGs** → `resolveIcon()` / `iconDataUri()` from `lib/`.
- **Never import `CyberIcon` into anything reachable from a `'use client'` boundary** (it ships the whole icon
  subset to the browser) — which is why `CyberTag` stays on `@iconify/react`.
- **Never `import { icons } from '@iconify-json/…'` in `app/`, `components/` or `lib/`** — only
  `scripts/icons/collections.ts` may.
- A literal icon name hard-coded in a server component goes into `EXTRA_ICONS` in `scripts/icons/required.ts`;
  a new or changed `icon:` in `common/data` means `bun run icons:generate`. `bun run icons:check` gates the build.

## 7. Images are plain `<img>` — `next/image` is not used

`images: { unoptimized: true }` in `next.config.ts` and `@next/next/no-img-element` off in `eslint.config.mjs`.
The `fill` idiom is `absolute inset-0 size-full` on a `relative` parent. `loading='eager' fetchPriority='high'`
for above-the-fold LCP images, `loading='lazy' decoding='async'` everywhere else. Run `bun run images:optimize`
after adding to `public/`. **Never hand-shrink a file below its floor** — the sizing formula, the markup example
and the floor table (covers, `logo.webp`, the org marks) are in [`references/images.md`](references/images.md).

## 8. Checklist

- [ ] Plain-English copy, no section codes; signal utilities, no raw hex
- [ ] Built from `components/cyber/`; page wrapped in `Container`
- [ ] Icon resolver matches the surface (§6); `icons:generate` run when an `icon:` changed
- [ ] Plain `<img>` with the right loading hints; no image under its floor
- [ ] `bun run gate` green
