---
name: app-conventions
description: >-
  Conventions for the Next.js 16 App Router in the NooobtimeX repo (anything under
  `app/`) — route groups & layouts, typed routes, page composition with the cyber
  design system, dynamic `[...id]` routes, and the token-free + ISR GitHub data
  layer. Use when adding or editing a route, page, layout, or the GitHub stats
  page, when wiring an external fetch, or when a reviewer asks how `app/` code
  "should" look here.
paths:
  - 'app/**'
---

# App conventions (`app/`, Next.js 16 App Router, port 1000)

The canonical rules for `app/`. Routes are **typed** (`next` typedRoutes), the dev
server runs on **port 1000**, and the whole site renders the `common/` data layer.
When these conflict with a quick fix, follow these. Cross-references: root
[`CLAUDE.md`](../../../CLAUDE.md),
[`/common-conventions`](../common-conventions/SKILL.md) (the data the pages render),
[`/add-content`](../add-content/SKILL.md), and the UI rule
[`.claude/rules/design-system.md`](../../rules/design-system.md).

## 1. Route groups & layouts

- `app/(main)/` **is the site** — every page in it shares the NavBar + footer via
  [`app/(main)/layout.tsx`](<../../../app/(main)/layout.tsx>). Home is `app/(main)/page.tsx`.
- `app/cv/` and `app/cv/presentation/` are **standalone — deliberately outside**
  `(main)`, so they don't inherit the nav/footer chrome.
- Root [`app/layout.tsx`](../../../app/layout.tsx) owns fonts (Rajdhani, JetBrains
  Mono, Noto Thai), global metadata, and global overlays. Per-route metadata is set
  by each page's `metadata` export / `generateMetadata`.

## 2. Typed routes

`typedRoutes` is on, so an internal `<Link href>` to a **dynamic** path needs a
`Route` type or cast — a bare template string won't typecheck.

```tsx
import type { Route } from 'next'

// ✅ RIGHT — cast a computed dynamic href
<Link href={`/projects/${id}` as Route}>…</Link>
// ❌ WRONG — untyped dynamic string fails the build
<Link href={`/projects/${id}`}>…</Link>
```

Static literal hrefs (`/github`, `/skills`) need no cast. `CyberButton` already
casts internally — prefer it for navigation (see the design-system rule).

## 3. Page composition

- Wrap **every** page/section in `Container` — the one page-width wrapper. Never
  re-roll `max-w-… mx-auto px-…`; change width in one place.
- Build UI from `components/cyber/` (`NeonPanel`, `SectionHeader`, `CyberButton`,
  `GlitchText`, …), not raw markup — see [`.claude/rules/design-system.md`](../../rules/design-system.md).
- Use `MotionReveal` for scroll-in reveals.
- Don't edit a page to show new content — add it to the `common/` data list the
  page already maps over ([`/common-conventions`](../common-conventions/SKILL.md)).

## 4. Dynamic routes

The detail routes are catch-alls: `projects/[...id]`, `skills/[...id]`,
`career/[...id]`. An item's `id` is already url-safe → it **is** the route segment —
never `slugify(name)` (the `seo-invariants` rule, invariant 4). `slugify` / `unslugify`
still live in [`lib/utils.ts`](../../../lib/utils.ts) beside `cn` and
`formatExperienceDuration`, but no route uses them.

## 5. GitHub data — token-free + ISR

[`lib/github.ts`](../../../lib/github.ts) is the JSX-free fetch module shared by the
`/github` page (ISR) and the README generator. Every fetcher:

- runs **without a token** (an optional `GITHUB_TOKEN` only raises rate limits),
- caches with `next: { revalidate: REVALIDATE }` (`REVALIDATE = 86400`, daily),
- is wrapped in `try/catch` and returns **`null`** on any failure, so a flaky
  upstream never breaks `bun run build`.

```ts
// ✅ RIGHT — null on failure, ISR cache, keep the module JSX-free
try {
	const res = await fetch(url, { next: { revalidate: REVALIDATE } })
	if (!res.ok) return null
	return (await res.json()) as T
} catch {
	return null
}
```

Render code must handle the `null` (show a fallback), never assume the fetch
succeeded.

## 6. Gotcha — stale `.next` types after a route rename

Renaming a route leaves stale typed-route definitions in `.next`. If `<Link>`
targets or route types look wrong, `rm -rf .next` then rebuild.

## 7. Pre-PR checklist

```bash
bun run gate
```

`build` (~79 routes) is the type-check + prerender gate — an env or data-shape
mistake surfaces there.
