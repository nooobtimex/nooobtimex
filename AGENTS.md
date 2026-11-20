# NooobtimeX — agent guide

> Wongsaphat Puangsorn’s personal site — get to know Kwan, explore his work, and follow what he is building.
> The site uses a white Comic design with ink borders, offset shadows and responsive panels.
> The homepage combines a three-column profile/work/notes layout with interactive 3D. Next.js 16 · React 19 · TypeScript 7 (paired with TS 6) · Tailwind v4 · Base UI · Bun.
> Fonts: Space Grotesk (display), Inter, JetBrains Mono (code), Noto Sans Thai.
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
- Gate: `bun run gate` = `lint` (`eslint . --fix && bun fmt`) → `projects:check` → `build` (`icons:check` →
  `typecheck` → `next build` → `links:check` → `seo:check` → `bundle:check`) → `check:agents`. Use
  `bun run build`, never `bun build` (Bun's own bundler builtin). `projects:check` is gate-only: it reads the
  `make-cover` table, and `.dockerignore` keeps `.agents/` out of the Railway build.
- **Indentation is tabs** (`useTabs` in `.prettierrc`, which `bun fmt` reads — import order and Tailwind class order
  are built in, so no Prettier package is installed).
- **Bun 1.4.4 is pinned** in `packageManager` and the Dockerfile's `oven/bun:1.4.4-slim` tag — move them together
  (the `readme-assets` workflow's `setup-bun` reads `packageManager`). `bunfig.toml` holds `minimumReleaseAge = "3d"`,
  so an install refuses a package version published less than 3 days ago.
- **Docker:** bun installs, node builds and node serves — never serve on Bun. Stages, memory caps, `.dockerignore`
  and the local `docker build` check: [`tooling-conventions`](.agents/skills/tooling-conventions/local.md).
- **Ports:** this repo is `RR = 11`, so the web app is on `11000` (`bun run dev` and `bun run start` default to it) and the
  preview `start` server on `11800`. A worktree `n` runs `PORT=1100n bun run dev`.
- **TypeScript 6 + 7 — the alias pair is deliberate.** Do **not** "fix" `typescript` back to `typescript@7`; why, and
  how to repair it: [`tooling-conventions`](.agents/skills/tooling-conventions/local.md). `next.config.ts` sets
  `typescript.ignoreBuildErrors`, so the type gate is `bun run typecheck` (`next typegen && bun check`) — never call
  `next build` alone.
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
- **Context costs money on every turn.** One task per session; start a fresh one for unrelated work and compact
  at a natural break. Plan first only for multi-file work, then go. Choose the model and effort at the start —
  switching mid-session drops the prompt cache.
- **Delegate only what would flood the context:** a wide search, long logs, a test run. Read known files
  yourself, never fan out parallel agents to write code, and give every subagent a `model:` that fits the job
  (`update-docs` §6).
- **Ports are five digits and unique across every repo:** `RRSWW` is the repo (`RR`, handed out by the repo-kit
  repo), the service (`S`, with `8` kept for test runs) and the worktree (`WW`, `00` for the main checkout). A
  deployed service uses the same number for its `PORT` and its domain's target port. This repo's numbers are in
  its `AGENTS.md`.

<!-- repo-kit: version=2026.11.17 hash=7fb9e3c5777d -->

## Read before you edit

Invoke the skill for the area before editing in it.

- [`design`](.agents/skills/design/SKILL.md) — `**/*.tsx`, `**/*.css`, `components/site/**`
- [`seo-conventions`](.agents/skills/seo-conventions/SKILL.md) — `app/**`, `lib/seo.ts`, `common/data/posts/**`,
  `scripts/links/**`, `scripts/seo/**`
- [`common-conventions`](.agents/skills/common-conventions/SKILL.md) — `common/**`
- [`app-conventions`](.agents/skills/app-conventions/SKILL.md) — `app/**`
- [`tooling-conventions`](.agents/skills/tooling-conventions/SKILL.md) — `**/package.json`, `scripts/**`,
  `.github/workflows/**`, `**/Dockerfile`, `**/bunfig.toml`, `.gitattributes`
- [`add-content`](.agents/skills/add-content/SKILL.md) — adding or editing content
- [`write-post`](.agents/skills/write-post/SKILL.md) — a Journal post
- [`make-cover`](.agents/skills/make-cover/SKILL.md) — a project cover image
- [`update-docs`](.agents/skills/update-docs/SKILL.md) — `AGENTS.md`, `CLAUDE.md`, `README.md`, `.agents/**`,
  `.claude/**`; this repo's sync map is [`local.md`](.agents/skills/update-docs/local.md)

## Repository map

```text
app/
  (main)/          the site — NavBar + footer via (main)/layout.tsx
    page.tsx       home · projects/ · skills/ · career/ · companies/ · blog/ · github/ · contact/ · privacy/
                   (+ [...id] detail routes, github/[year])
  cv/ · cv/presentation/   standalone, OUTSIDE the (main) layout
  card/            next/og share-card routes (hire, projects, og/blog, og/projects) · opengraph-image.tsx
  layout.tsx       root (fonts, metadata, providers)
common/            the data layer — the single source of truth for all content
components/site/  the shared design system · home/ owns the three-column homepage and 3D scene · plus feature folders + ui/ (shadcn)
lib/utils.ts       cn() + slugify/unslugify/formatExperienceDuration · lib/github.ts (token-free ISR)
lib/icon-data.ts   server-side icon lookup → lib/og-icons.generated.json (see scripts/icons/)
scripts/icons/     generates that subset · the ONLY place @iconify-json/* may be imported
.agents/skills/    the skills every AI tool loads (linked into .claude/skills for Claude Code)
.claude/           Claude Code's launch.json and local settings
```

Dev server: `bun run dev` on **port 11000**.

## Further reading

- [`README.md`](README.md) — the public face of the repo (regenerated assets in `.github/assets/`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
