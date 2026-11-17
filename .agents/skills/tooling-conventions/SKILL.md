---
name: tooling-conventions
description: "Standards for package.json scripts, repo tooling under scripts/, GitHub workflows, Dockerfiles, bunfig.toml and .gitattributes — macOS local dev versus Linux CI/Docker, Bun-only, Bun TypeScript scripts, one pinned Bun release moved everywhere, frozen-lockfile installs and Colima. Use when editing a package.json script, anything under scripts/, a CI workflow, a Dockerfile, bunfig.toml or .gitattributes, bumping Bun or a dependency, or when a command works locally but not in CI."
paths:
    - '**/package.json'
    - 'scripts/**'
    - '.github/workflows/**'
    - '**/Dockerfile'
    - '**/bunfig.toml'
    - '.gitattributes'
---

# Tooling conventions — macOS local, Linux CI and Docker

Local development targets macOS; CI and production run on Linux. This skill is the standard every repo shares and is
copied verbatim from repo-kit. This repo's own pins, Dockerfile rules, CI specifics and extra checks are in
[`local.md`](local.md); read it too. For Railway deploys and the Docker build-versus-runtime split, invoke the
`railway-deploy` skill instead of repeating it here.

## 1. Environment tiers

- **Tier A (local macOS):** `package.json` scripts, `scripts/` and local tooling. Assume Bun and Git, nothing else.
- **Tier B (Linux CI and Docker):** GitHub Actions `run:` steps and Docker `RUN` layers, on `ubuntu-latest` and Linux
  images (`bash`, `curl`, `tar`, `gh`, `jq`). A command that passes on macOS can still fail here: check both before
  calling a script done.

## 2. Rules

1. **Bun only.** `bun install` and `bun run …`; never npm, yarn or pnpm. `package.json` scripts run through Bun's shell
   (`&&`, `||`, `|`, env-var prefixes, globs).
2. **Repo tooling is Bun TypeScript.** Write scripts as `scripts/<name>.ts` and run them as `bun scripts/<name>.ts`.
   No `.sh` files in the gate.
3. **No extra external CLIs in Tier A scripts.** Put the logic in Bun TypeScript or an ESLint rule. A check about
   `.ts` / `.tsx` symbols belongs in ESLint (it joins `bun run lint` for free); a standalone script is for files ESLint
   cannot see (`package.json`, markdown, a Dockerfile, a coverage report).
4. **One script form for a workspace:** `bun run --cwd <path> <script>`.
5. **Build paths with `node:path`** (`path.join`, `path.resolve`), never string concatenation with `/` or `\`.
6. **Line endings.** `.gitattributes` normalizes text files (`* text=auto`, and `eol=lf` where the repo needs LF on
   every checkout).
7. **One pinned Bun, moved together.** Pin Bun to an exact release (no range) and make every place that names it
   agree: `packageManager` in the root `package.json`, `.tool-versions`, the `oven/bun` tag in every Dockerfile, the CI
   `bun-version`, and `@types/bun`. A Bun bump changes all of them in one commit; `local.md` lists the current
   places and the script that cross-checks them.
8. **Colima, not Docker Desktop.** Local databases in containers (MongoDB, Redis) run on Colima
   (`brew install colima`). Docker Desktop's VM kernel can make `mongod` refuse to start, so the container crash-loops.
9. **Dependency edits.** Re-run `bun install` right after editing a dependency so `bun.lock` changes with it. Dockerfiles
   and CI install with `bun install --frozen-lockfile`, which never re-resolves. Never delete and regenerate `bun.lock`.
10. **Bun formats and type-checks.** `bun fmt` (reads `.prettierrc`; the Prettier CLI is not installed) and
    `bun check` (the same errors as `tsc --noEmit`). `typescript` stays installed for `next build` and
    `typescript-eslint`.
11. **Install supply-chain guard.** `bunfig.toml` sets `[install] minimumReleaseAge` to three days, so `bun install`
    and `bun add` refuse a version published less than three days ago; a same-day security fix needs a wait or an
    explicit exclusion. Frozen installs never re-resolve, so the guard does not touch CI or Docker.
12. **Dockerfile install order.** `COPY` the root `package.json`, `bun.lock` and every workspace `package.json` first,
    then `bun install --frozen-lockfile`, then the sources, so the install layer caches until a manifest changes.

## 3. Checklist

- [ ] The script runs on macOS with only Bun and Git, and its CI step runs on Linux
- [ ] No `.sh` file and no new external CLI in a gate script
- [ ] A dependency change is locked by `bun install` in the same commit
- [ ] A Bun bump touched every place in rule 7
- [ ] `bun fmt` and `bun check` are clean
- [ ] The repo gate passes; a Dockerfile change also builds with `docker build` (see [`local.md`](local.md))

<!-- repo-kit: version=2026.11.17 hash=bbe65dbfab71 -->
