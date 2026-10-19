# NooobtimeX — Claude Code guide

> Wongsaphat Puangsorn's personal profile — a content-driven site with a **Cyberpunk 2077** visual theme
> whose one job is winning freelance work: every "Hire me" control opens his Fastwork link
> (`personalData.hire.url`). Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 7 (paired with TS 6)
> · Tailwind v4 · shadcn/ui on Base UI · Bun. Fonts: Rajdhani (display), JetBrains Mono (mono), Noto Thai.
> Deployed on **Railway** only. This repo is **public**.

## Safety

- **Railway is the only deploy target** — `railway.toml` (config-as-code, overrides the dashboard) and the
  root `Dockerfile`. There is no CI, so the Dockerfile's gates are the deploy gate: a failing gate fails the
  deploy.
- **Never let `.env` into the image.** `.dockerignore` excludes it because Next copies `.env` into
  `.next/standalone/`, and a committed `PORT` there would shadow Railway's `$PORT` and hang the healthcheck.
  Runtime config (the optional `GITHUB_TOKEN`) lives in Railway service variables, not build args.
- **The runtime never loads sharp.** `images: { unoptimized: true }`, and `lib/og-assets.ts` imports sharp
  lazily inside `pngDataUri` (OG prerender only). A top-level `import sharp` reachable from `app/` puts libvips
  back in the container (~23 MB RSS, a 50 MB cache, a worker thread per host core).
- The `readme-assets` workflow runs **weekly + manual dispatch only — never add a `push` trigger**: its commit
  would land mid-deploy and every code push would build twice. `watchPatterns` is an allowlist for the same
  reason.

## Delivery contract

- Base branch: `main`. Generic rules: [`.claude/rules/delivery.md`](.claude/rules/delivery.md).
- Gate: `bun run gate` = `lint` (`eslint . --fix && prettier . --write`) → `build` (`icons:check` →
  `typecheck` → `next build` → `links:check` → `seo:check` → `bundle:check`) → `check:agents`. Use
  `bun run build`, never `bun build` (Bun's own bundler builtin).
- **Indentation is tabs** (Prettier `useTabs`).
- **Docker:** bun installs (`oven/bun:1-slim`), node builds (`node:26-slim` with the bun binary copied in) and
  node serves — never serve on Bun (the standalone server leaks RSS, oven-sh/bun#27514). `MALLOC_ARENA_MAX`
  and `NODE_OPTIONS=--max-old-space-size` (0.6–0.75 × the service memory limit) are set in the runner only;
  the builder stays uncapped. Railway Root Directory stays `/`. Check a change the way Railway runs it:
  `docker build -t nooobtimex . && docker run --rm -e PORT=7788 -p 7788:7788 nooobtimex`.
- **TypeScript 6 + 7 — the alias pair is deliberate.** TS 7 ships `tsc` but no compiler API, and
  typescript-eslint caps `typescript` at `<6.1.0`, so `"typescript": "npm:@typescript/typescript6@…"` (bin
  `tsc6`) and `"@typescript/native": "npm:typescript@^7…"` (bin `tsc`). **Do not "fix" `typescript` back to
  `typescript@7`** until typescript-eslint supports TS 7 — that bump shipped once and was reverted (`f9d1f92`).
  `next.config.ts` sets `typescript.ignoreBuildErrors`, so the type gate is `bun run typecheck` — never call
  `next build` alone. If `node_modules/typescript/package.json` is not `@typescript/typescript6`,
  `bun remove typescript` and re-add the alias.
- Artifacts to regenerate and commit: `icons:generate` after an `icon:` change in `common/data`,
  `images:optimize` after adding to `public/`, `llms:generate` for `public/llms.txt`. `links:external` fetches
  every blog citation — run it before shipping a post; it is not in `build`.

## Read before you edit

| Rule in `.claude/rules/`                               | Loads on                                                                             | Carries                                                                                               |
| :----------------------------------------------------- | :----------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| [`delivery.md`](.claude/rules/delivery.md)             | every session                                                                        | Bun only, never push unasked, branch → PR, commit order, docs with code                               |
| [`design-system.md`](.claude/rules/design-system.md)   | `**/*.tsx`, `**/*.css`, `components/cyber/**`                                        | the Cyberpunk design system — signal colours, notch/HUD, React Compiler, Iconify                      |
| [`seo-invariants.md`](.claude/rules/seo-invariants.md) | `app/**`, `lib/seo.ts`, `common/data/posts/**`, `scripts/links/**`, `scripts/seo/**` | five SEO invariants that once failed silently — alternates, `dynamicParams`, citations, ids, Suspense |

| Skill in `.claude/skills/`                                          | Loads on                             | Purpose                                                                         |
| :------------------------------------------------------------------ | :----------------------------------- | :------------------------------------------------------------------------------ |
| [`/common-conventions`](.claude/skills/common-conventions/SKILL.md) | `common/**`                          | the data layer — barrel imports, enums, `skill()`/`SkillId`, `assets`, projects |
| [`/app-conventions`](.claude/skills/app-conventions/SKILL.md)       | `app/**`                             | route groups, typed routes, page composition, `[...id]` routes, GitHub ISR      |
| [`/add-content`](.claude/skills/add-content/SKILL.md)               | listed                               | recipes: add a project, skill, role, organization, social link or image         |
| [`/write-post`](.claude/skills/write-post/SKILL.md)                 | listed                               | a Journal post — the AEO contract, citations, the series gap rule, voice        |
| [`/make-cover`](.claude/skills/make-cover/SKILL.md)                 | listed                               | an on-brand 16:9 project cover from the HTML template, without a screenshot     |
| [`/update-docs`](.claude/skills/update-docs/SKILL.md)               | `CLAUDE.md`, `docs/**`, `.claude/**` | the repo-kit standard — where an instruction belongs, budgets, skills           |

## Repository map

```text
app/
  (main)/          the site — NavBar + footer via (main)/layout.tsx
    page.tsx       home · projects/ · skills/ · career/ · companies/ · blog/ · github/ (+ [...id] detail routes, github/[year])
  cv/ · cv/presentation/   standalone, OUTSIDE the (main) layout
  layout.tsx       root (fonts, metadata, global overlays)
common/            the data layer — the single source of truth for all content
components/cyber/  the design system · plus feature folders + ui/ (shadcn)
lib/utils.ts       cn() + slugify/unslugify/formatExperienceDuration · lib/github.ts (token-free ISR)
lib/icon-data.ts   server-side icon lookup → lib/og-icons.generated.json (see scripts/icons/)
scripts/icons/     generates that subset · the ONLY place @iconify-json/* may be imported
```

Dev server: `bun run dev` on **port 1000**.

## Further reading

- [`README.md`](README.md) — the public face of the repo (regenerated assets in `.github/assets/`).
