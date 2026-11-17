# Local tooling map

NooobtimeX's half of [`tooling-conventions`](SKILL.md). It is not stamped — edit it freely. A single Next.js app, no
workspaces, no CI gate; Railway builds the root `Dockerfile`.

## Pinned versions

- Bun `1.4.4`, named in `package.json` › `packageManager` and the `Dockerfile` installer stage
  (`oven/bun:1.4.4-slim`). The `readme-assets` workflow's `oven-sh/setup-bun` reads `packageManager`, so it has no
  `bun-version` of its own. There is no `.tool-versions`, `engines.bun` or `@types/bun`.
- Node `26`, named in `package.json` › `engines.node` (`26.x`) and the `Dockerfile` builder and runner stages
  (`node:26-slim`).
- TypeScript is a deliberate pair: `typescript` is the `npm:@typescript/typescript6` alias (bin `tsc6`, what
  `typescript-eslint` and `next build` load) and `@typescript/native` is `npm:typescript@^7` (bin `tsc`). Do not
  "fix" `typescript` back to `typescript@7` until `typescript-eslint` supports TS 7 — that bump shipped once and was
  reverted (`f9d1f92`). If `node_modules/typescript/package.json` is not `@typescript/typescript6`,
  `bun remove typescript` and re-add the alias.
- No cross-check script: a Bun bump is `packageManager` plus the `oven/bun` tag, by hand, in one commit.
- `bunfig.toml` › `[install] minimumReleaseAge = "3d"` (the string form).

## Dockerfile

- Three stages: **installer** (`oven/bun:1.4.4-slim`, `bun install --frozen-lockfile` from the manifests only),
  **builder** (`node:26-slim` with the bun binary copied in, runs the gates and `next build`), **runner**
  (`node:26-slim`, `node server.js`). Never serve on Bun: the standalone server leaks RSS (oven-sh/bun#27514).
- `MALLOC_ARENA_MAX` and `NODE_OPTIONS=--max-old-space-size` (0.6–0.75 × the service memory limit) are set in the
  runner only; the builder stays uncapped.
- The builder runs `bun run icons:check && bun run typecheck && npx next build && bun run links:check && bun run
  seo:check && bun run bundle:check` — the same sequence as `bun run build`. The repo has no CI, so this is the only
  place the post-build gates are guaranteed to run, and a failing gate fails the deploy.
- `.dockerignore` (one, at the root) excludes `.env`, `**/.env.local`, `.agents`, `.claude`, `AGENTS.md` and
  `CLAUDE.md`. Next copies `.env` into `.next/standalone/`, and a committed `PORT` there would shadow Railway's
  `$PORT` and hang the healthcheck. Runtime config (the optional `GITHUB_TOKEN`) is a runtime variable, never a
  build arg.
- Railway Root Directory stays `/`. `railway.toml` `watchPatterns` is an allowlist: anything the build reads must be
  listed, and the `readme-assets` commit under `.github/assets/` must not be.
- Check a change the way Railway runs it: `docker build -t nooobtimex . && docker run --rm -e PORT=7788 -p 7788:7788
  nooobtimex`.

## CI

- One workflow, `.github/workflows/readme-assets.yml`: weekly plus manual dispatch, **never a `push` trigger** — its
  commit would land mid-deploy and every code push would build twice.

## Extra checks

- `scripts/` is Bun TypeScript. The one `.sh` file, `.agents/skills/make-cover/assets/render.sh`, is a manual
  cover-rendering helper outside every gate.
- `bun run projects:check` is gate-only: it reads the `make-cover` table, and `.dockerignore` keeps `.agents/` out of
  the Railway build. The gate chain, `bun run build` versus `bun build`, and the ports are in `AGENTS.md` ›
  Delivery contract.
