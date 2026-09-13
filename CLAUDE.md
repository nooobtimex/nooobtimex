# NooobtimeX

Wongsaphat Puangsorn's personal portfolio — a content-driven marketing site with a
**Cyberpunk 2077** visual theme. Deployed on **Railway** via `railway.toml` and the root
`Dockerfile` (Vercel is no longer a deploy target).

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **shadcn/ui on Base UI** (`@base-ui/react`)
- Package manager: **bun** (`bun.lock`) — `bun install`; run scripts with `bun run <script>`.
- Fonts: Rajdhani (display), JetBrains Mono (mono), Noto Thai.

```
app/
  (main)/          # the site — shares NavBar + footer via (main)/layout.tsx
    page.tsx       # home · projects/ · skills/ · experience/ · github/ (+ [...id] detail routes)
  cv/ · cv/presentation/   # standalone, OUTSIDE the (main) layout
  layout.tsx       # root (fonts, metadata, global overlays)
common/            # the data layer — single source of truth for all content
components/cyber/   # the design system · plus feature folders + ui/ (shadcn)
lib/utils.ts       # cn() + slugify/unslugify/formatExperienceDuration · lib/github.ts (token-free ISR)
lib/icon-data.ts   # server-side icon lookup → lib/og-icons.generated.json (see scripts/icons/)
scripts/icons/     # generates that subset · the ONLY place @iconify-json/* may be imported
```

## Commands

| Task   | Command                   | Notes                                                                                               |
| ------ | ------------------------- | --------------------------------------------------------------------------------------------------- |
| Dev    | `bun run dev`             | serves on **port 1000**                                                                             |
| Build  | `bun run build`           | the type-check gate. `icons:check` → `next build` → `links:check` → `seo:check` → `bundle:check`    |
| Lint   | `bun run lint`            | `eslint . --fix && prettier . --write`                                                              |
| Icons  | `bun run icons:generate`  | after any `icon:` change in `common/data` — commit the artifact                                     |
| Links  | `bun run links:check`     | post-build gate: every internal `href` must resolve. Needs a build first                            |
| SEO    | `bun run seo:check`       | post-build gate: no content hidden in a streamed segment; sitemap ⇄ robots agree. Needs a build too |
| Bundle | `bun run bundle:check`    | post-build gate: no Journal post text in any browser chunk. Needs a build too                       |
| Images | `bun run images:optimize` | after adding anything to `public/` — idempotent, commit the result                                  |
| LLMs   | `bun run llms:generate`   | regenerates `public/llms.txt` from `common/` — commit the artifact                                  |
| Cites  | `bun run links:external`  | fetches every blog citation. Run before shipping a post; NOT in `build`                             |

**Definition of done for any code change: `bun run lint` then `bun run build`, both
green.** Run them before declaring work complete.

## Deployment

**Railway is the only deploy target.** It uses `railway.toml` (config-as-code, overrides
the dashboard) + the root `Dockerfile`, mirroring `rs-trophy.com`:

- **bun installs, node builds and serves.** Stage 1 installs on `oven/bun:1-slim`; stage 2
  builds on `node:26-slim` with the bun binary copied in, which runs the same gates as
  `bun run build` (`icons:check`, then `links:check` + `seo:check` + `bundle:check` after
  `next build`) — there is no CI, so a failing gate fails the deploy. Stage 3 serves on
  `node:26-slim`.
  Serving on Bun is deliberately avoided — the Next standalone server leaks RSS under
  Bun's Node-compat HTTP layer (oven-sh/bun#27514), which on a long-lived container reads
  as a slow OOM.
- `output: 'standalone'` in `next.config.ts` is what makes stage 3 install-free.
- **The runtime never loads sharp.** `images: { unoptimized: true }` — the site uses
  plain `<img>`, so there is no `/_next/image` route — and `lib/og-assets.ts` imports
  sharp lazily inside `pngDataUri`, which only runs while prerendering the OG cards.
  Keep it that way: a top-level `import sharp` anywhere reachable from `app/` puts
  libvips back in the container (~23 MB RSS, a 50 MB native cache, and a worker thread
  per **host** core — libvips reads the host, not the cgroup).
- `MALLOC_ARENA_MAX` and `NODE_OPTIONS=--max-old-space-size` are set in the runner
  stage only. Size the heap cap at 0.6–0.75 × the Railway service's memory limit; the
  builder must stay uncapped, since Turbopack + 107 prerenders is heap-hungry.
- **Never let `.env` into the image.** `.dockerignore` excludes it because Next copies
  `.env` into `.next/standalone/`, and a committed `PORT` there would shadow Railway's
  injected `$PORT` and hang the healthcheck. Runtime config (e.g. optional
  `GITHUB_TOKEN`) belongs in Railway service variables, not build args.
- Railway service **Root Directory stays `/`** — the Dockerfile expects the repo root as
  its build context. `watchPatterns` is an allowlist so the `readme-assets` workflow
  committing regenerated `.github/assets/*.svg` doesn't trigger a site rebuild.

Verify a Railway change locally the way Railway runs it — injected port, no `.env`:

```bash
docker build -t nooobtimex . && docker run --rm -e PORT=7788 -p 7788:7788 nooobtimex
```

## Global conventions

- Use **`bun run build`**, not `bun build` — `build` is Bun's own bundler builtin,
  so the package script must be run with explicit `bun run`.
- **Indentation is tabs** (Prettier `useTabs`). Match the surrounding style.
- **Commit messages** end with:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
  Only commit/push when asked; branch first if on `main` and unsure.

## SEO — five invariants the build depends on

These encode bugs that were live on nooobtimex.me and produced **no error anywhere**.

1. **Never set `alternates` in `app/layout.tsx`.** Metadata `alternates` is _inherited_ by
   every child segment that does not override it, so a root `canonical: '/'` made all 90
   routes declare themselves duplicates of the home page — the whole site asking Google not
   to index it. Canonicals come from `pageMetadata()` in [`lib/seo.ts`](lib/seo.ts), which
   every route calls. It also omits `openGraph.images` on purpose so the file-convention
   `opengraph-image.tsx` still resolves per segment.

2. **Every `[...id]` route needs `export const dynamicParams = false`.** It rejects an
   unknown slug at the routing layer, before anything renders. A page's own `notFound()`
   is not enough: any Suspense boundary above the page flushes response headers at **200**
   first, so the 404 UI lands inside an already-committed 200. The old root
   `app/loading.tsx` did exactly that, and every mistyped slug became an indexable
   soft-404 titled "… Not Found".

3. **A post that shows code cites at least two sources.** `resolvePost` fails the build
   otherwise, and `bun run links:external` fetches every one of them — because
   [`scripts/links/check.ts`](scripts/links/check.ts) only validates hrefs starting with
   `/`, so a citation URL that 404s, or one that was never real, passes every other gate
   and ships inside a published article. Posts with no code block are exempt: a narrative
   does not get more true by linking a doc at it.

4. **Detail-route URLs are keyed by `id`, never `slugify(name)`.** They agreed for 60 of 61
   skills — `Vue.js` slugified to `vue-js` while its id is `vue`, so every Vue link _and
   the sitemap_ pointed at a 200-status "Skill Not Found" page.
   [`scripts/links/check.ts`](scripts/links/check.ts) now fails the build on any internal
   href the build did not emit.

5. **No Suspense boundary may wrap page content — so no route-level `loading.tsx`.** React
   19.2 _outlines_ any completed boundary larger than 500 B once the response passes
   12,800 B: the fallback is written in place and the real content moves into a
   `<div hidden id="S:0">` that an inline script swaps in after parse. Nothing has to
   suspend. The root `app/loading.tsx` did this to 123 of 126 prerendered pages, so
   anything reading the HTML without JavaScript saw one word, "Loading…", on every URL —
   while AdSense rated the site "Low value content". Scope a boundary to something whose
   absence from the HTML costs nothing (the `/github` stats), never to a page.
   [`scripts/seo/check.ts`](scripts/seo/check.ts) fails the build on any prerendered page
   with readable text inside such a segment.

## Conventions live in skills

Detailed, domain-scoped rules live in the skills below — they auto-load on demand
and encode the type-safety invariants the build relies on. **Read the relevant
reference before adding or changing code in that area.**

- The `common/` data layer (content, enums, the `skill()`/`SkillId` invariant, the
  `assets` map, projects/experiences/entities/personal) →
  [`/common-conventions`](.claude/skills/common-conventions/SKILL.md).
- The `app/` App Router (route groups & layouts, typed routes, page composition,
  `[...id]` routes, token-free + ISR GitHub data) →
  [`/app-conventions`](.claude/skills/app-conventions/SKILL.md).
- Adding/editing content — the "add my new project / skill / role" task recipes →
  [`/portfolio-content`](.claude/skills/portfolio-content/SKILL.md).
- Writing a Journal post (`/blog`) — the full-tier AEO contract, the outbound-citation
  rules and the series gap rule → [`/blog-post`](.claude/skills/blog-post/SKILL.md).
- UI / design — the Cyberpunk design system (`components/cyber/`, signal colors,
  notch/HUD utilities, React Compiler, Iconify) →
  [`.claude/rules/design-system.md`](.claude/rules/design-system.md) — a
  **path-scoped rule** that auto-loads when you edit `.tsx` / `.css` files.

More skills live under [`.claude/skills/`](.claude/skills/).

> **This file is the single source of truth.** `AGENTS.md` is a **symlink** to it,
> so any agent that reads `AGENTS.md` gets the same content — edit only `CLAUDE.md`.
