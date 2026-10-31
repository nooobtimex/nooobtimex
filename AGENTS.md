# NooobtimeX — agent guide

> Wongsaphat Puangsorn's personal profile — a content-driven site with a **Cyberpunk 2077** visual theme
> whose one job is winning freelance work: every "Hire me" control opens an email to him
> (`personalData.hire.url`, a `mailto:`). Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 7 (paired with TS 6)
> · Tailwind v4 · shadcn/ui on Base UI · Bun. Fonts: Rajdhani (display), JetBrains Mono (mono), Noto Thai.
> Deployed on **Railway** only. This repo is **public**.

## Safety

- **This repo is public.** Everything committed is world-readable: no secrets, no client names the site does not
  already publish, nothing private.
- **Railway is the only deploy target** — `railway.toml` (config-as-code, overrides the dashboard) and the
  root `Dockerfile`. There is no CI, so the Dockerfile's gates are the deploy gate: a failing gate fails the
  deploy.
- **Never let `.env` into the image.** `.dockerignore` excludes it because Next copies `.env` into
  `.next/standalone/`, and a committed `PORT` there would shadow Railway's `$PORT` and hang the healthcheck.
  Runtime config (the optional `GITHUB_TOKEN`) is a runtime variable, never a build arg.
- **The runtime never loads sharp.** `images: { unoptimized: true }`, and `lib/og-assets.ts` imports sharp
  lazily inside `pngDataUri` (OG prerender only). A top-level `import sharp` reachable from `app/` puts libvips
  back in the container (~23 MB RSS, a 50 MB cache, a worker thread per host core).
- The `readme-assets` workflow runs **weekly + manual dispatch only — never add a `push` trigger**: its commit
  would land mid-deploy and every code push would build twice. `watchPatterns` is an allowlist for the same
  reason.

## Delivery contract

- Base branch: `main`.
- Gate: `bun run gate` = `lint` (`eslint . --fix && prettier . --write`) → `build` (`icons:check` →
  `typecheck` → `next build` → `links:check` → `seo:check` → `bundle:check`) → `check:agents`. Use
  `bun run build`, never `bun build` (Bun's own bundler builtin).
- **Indentation is tabs** (Prettier `useTabs`).
- **Docker:** bun installs (`oven/bun` slim image), node builds (`node:26-slim` with the bun binary copied in) and
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

<!-- repo-kit:delivery -->

**Shared delivery rules** — the same in every repo on the repo-kit standard; edit them in the repo-kit repo,
never here. The repo-specific half is the rest of this section.

- **Bun for JS and TS:** `bun install` and `bun run …`; never npm, yarn or pnpm. A project in another language
  uses the toolchain its own `AGENTS.md` names, through the root `package.json` scripts.
- **Never push without asking.** Work on a branch (`feat/*`, `fix/*`, `chore/*`), never straight on the base
  branch; open a PR only when Kwan asks.
- **Run `bun run gate` before committing.** It chains the repo's lint, test and build with
  `bun run check:agents`. Read the diff and the test counts, not only the exit code.
- **Split commits by concern, fundamental first:** core change → infra/Docker → CI → tooling → docs.
- **Docs move with the code:** a change updates the docs it makes stale in the same commit — the map is the
  `update-docs` skill ([`.agents/skills/update-docs/SKILL.md`](.agents/skills/update-docs/SKILL.md)).
- **Preserve unrelated changes.** Check `git status` before starting; never discard work you did not make.
- **Production data, migrations, secrets, domains, CORS, auth:** state the blast radius and get Kwan's yes
  first.
- **Never read, print or copy `.env*`, keys, tokens or credentials.**

<!-- repo-kit: version=2026.10.31 hash=9a19d2c92a7e -->

## Read before you edit

Invoke the skill for the area before editing in it.

| Skill in `.agents/skills/`                                         | Covers                                                                               | Purpose                                                                                                                                          |
| :----------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| [`design`](.agents/skills/design/SKILL.md)                         | `**/*.tsx`, `**/*.css`, `components/cyber/**`                                        | the Cyberpunk design system — plain-English copy, signal colours, notch/HUD primitives, React Compiler rules, icons, images                      |
| [`seo-conventions`](.agents/skills/seo-conventions/SKILL.md)       | `app/**`, `lib/seo.ts`, `common/data/posts/**`, `scripts/links/**`, `scripts/seo/**` | five SEO invariants that once failed silently — alternates, `dynamicParams`, citations, ids, Suspense                                            |
| [`common-conventions`](.agents/skills/common-conventions/SKILL.md) | `common/**`                                                                          | the data layer — barrel imports, enums, `skill()`/`SkillId`, `assets`, projects                                                                  |
| [`app-conventions`](.agents/skills/app-conventions/SKILL.md)       | `app/**`                                                                             | route groups, typed routes, page composition, `[...id]` routes, GitHub ISR                                                                       |
| [`add-content`](.agents/skills/add-content/SKILL.md)               | adding or editing content                                                            | recipes: add a project, skill, role, organization, social link or image                                                                          |
| [`write-post`](.agents/skills/write-post/SKILL.md)                 | a Journal post                                                                       | the AEO contract, citations, the series gap rule, voice                                                                                          |
| [`make-cover`](.agents/skills/make-cover/SKILL.md)                 | a project cover image                                                                | an on-brand 16:9 project cover from the HTML template, without a screenshot                                                                      |
| [`update-docs`](.agents/skills/update-docs/SKILL.md)               | `AGENTS.md`, `CLAUDE.md`, `README.md`, `.agents/**`, `.claude/**`                    | the repo-kit standard — where an instruction belongs, budgets, skills; this repo's sync map is [`local.md`](.agents/skills/update-docs/local.md) |

## Repository map

```text
app/
  (main)/          the site — NavBar + footer via (main)/layout.tsx
    page.tsx       home · projects/ · skills/ · career/ · companies/ · blog/ · github/ · contact/ · privacy/
                   (+ [...id] detail routes, github/[year])
  cv/ · cv/presentation/   standalone, OUTSIDE the (main) layout
  card/            next/og share-card routes (hire, projects, og/blog, og/projects) · opengraph-image.tsx
  layout.tsx       root (fonts, metadata, global overlays)
common/            the data layer — the single source of truth for all content
components/cyber/  the design system · plus feature folders + ui/ (shadcn)
lib/utils.ts       cn() + slugify/unslugify/formatExperienceDuration · lib/github.ts (token-free ISR)
lib/icon-data.ts   server-side icon lookup → lib/og-icons.generated.json (see scripts/icons/)
scripts/icons/     generates that subset · the ONLY place @iconify-json/* may be imported
.agents/skills/    the skills every AI tool loads (linked into .claude/skills for Claude Code)
.claude/           Claude Code's launch.json and local settings
```

Dev server: `bun run dev` on **port 1000**.

## Further reading

- [`README.md`](README.md) — the public face of the repo (regenerated assets in `.github/assets/`).
