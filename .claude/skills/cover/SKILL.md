---
name: cover
description: >-
  Generate on-brand Cyberpunk project cover images (the 16:9 `cover.webp` hero
  used on project cards + detail pages) for the NooobtimeX portfolio, without a
  screenshot. Renders a parameterized HTML template with headless Chrome and
  converts to webp. Use when adding a new project that has no cover, when a
  project's thumbnail is weak (a logo/placeholder), or when the user asks to
  "make a cover / banner / thumbnail like the flood-project one". Also documents
  moving a real screenshot into the project's gallery so it isn't lost.
---

# Cover generator

Produces the stylized 1600×900 covers used as each project's `images.cover`
(the card thumbnail + detail-page hero). Matches the site's Cyberpunk 2077 theme:
dark base, neon signal colors, HUD frame, scanlines, a faint per-project motif,
big glitch-glow title, and a mono stack strip. See the flood-project / rs-trophy
covers for the look.

## Files (in `assets/`)

- **`cover-template.html`** — the parameterized template. Reads its content from
  URL query params (so one file renders every cover). Self-contained: system
  fonts only, inline SVG motifs, no network.
- **`render.sh`** — render one cover: `render.sh <out.webp> "<url-encoded query>"`.

## Pipeline

Headless Chrome renders the template at 2× → PNG → `cwebp` resizes to 1600×900.
Requires Google Chrome + `cwebp` (both present on this machine; no Pillow / magick /
rsvg). One-liner per banner:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --virtual-time-budget=2500 --window-size=1600,900 --default-background-color=ff06070d \
  --screenshot=/tmp/b.png "file://<ABS_PATH>/cover-template.html?<QUERY>"
cwebp -quiet -resize 1600 900 -q 88 /tmp/b.png -o public/issue/<id>/cover.webp
```

To batch many, loop in a Node/bun script building the query with
`encodeURIComponent` per value (see the git history of this skill for a
`gen-all.mjs` example). Prefer `render.sh` for one-offs.

## Query params (the "prompt")

All optional; URL-encode values.

| param      | meaning                                                                                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accent`   | hex signal color, e.g. `#00F0FF` (cyan), `#FCEE0A` (yellow), `#FF003C` (red), `#B14FFF` (purple), `#39FF14` (green). Drives glow, tags, grid, motif tint.                                                      |
| `kicker`   | mono eyebrow, e.g. `// DEV TOOL`, `// MARKETPLACE`.                                                                                                                                                            |
| `title`    | big title. Use `\|` for a line break: `Online\|Poker`. Long single-word lines auto-shrink.                                                                                                                     |
| `subtitle` | one-line descriptor under the title.                                                                                                                                                                           |
| `tags`     | comma-separated stack, rendered as `STACK // a · b · c`.                                                                                                                                                       |
| `motif`    | background graphic: `waves` (chart/water) · `bars` · `dots` (default) · `rings` (target/medal) · `hex` (mesh) · `qr` (matrix, seeded by title) · `cards` (♠♥♦♣) · `braces` (`{ }` code) · `trophy` · `shield`. |
| `badgeLvl` | top-right line, e.g. `● Live`, `● Archived`, `● SaaS`.                                                                                                                                                         |
| `badgeSub` | small line under the badge, e.g. `Realtime`.                                                                                                                                                                   |
| `meta`     | bottom-right, e.g. `FREELANCE // 2025`.                                                                                                                                                                        |

**`accent` now lives in the data layer.** Each project carries an `accent` hex in
`common/data/projects.ts`; it drives BOTH this cover and the 1:1 share card's chrome
(`components/og/`). Read it from there rather than re-picking a colour, and when a
project has a real product behind it, sample the brand off the live site instead of
inventing one — looklook-pet, prettier-config and monomax-epl-portal were corrected
this way. Update both this table and `projects.ts` together.

Keep `accent`/`motif` distinct per project so the set reads as a cohesive family,
not clones. Match `badgeLvl` to the status the site derives (`projectStatus()` in
`lib/utils.ts`): `● Live` for a live link, `● In Development` for a project with
`stage: 'in-development'`, otherwise `● Archived`.

## Wiring it into the data (`common/data/`)

Naming convention: the generated hero is always `cover.webp`; real screenshots are
`photo-1.webp`, `photo-2.webp`, … (primary screenshot first). Everything is `.webp`.

1. Save the generated file as `public/issue/<id>/cover.webp`. If a real screenshot
   currently sits at `banner.webp`, rename it into the `photo-N.webp` sequence
   (`git mv`, primary first) so no file is named `banner.webp`.
2. In `assets.ts` set the project's `cover` to the new file and **keep the
   screenshot(s) in `gallery`** so nothing is lost:
   `foo: { cover: '/issue/foo/cover.webp', gallery: ['/issue/foo/photo-1.webp'] }`.
3. In `projects.ts` show the real screenshot(s) in the detail gallery:
   `images: { cover: assets.projects.foo.cover, photos: [...assets.projects.foo.gallery] }`
   (use `photos: []` for a cover-only project with no screenshot).
4. `bun run lint && bun run build`, then eyeball `/projects` + `/projects/<id>`.

## Notes

- **There is no image optimizer.** `next.config.ts` sets `images: { unoptimized: true }`
  and the site uses plain `<img>` — `/issue/.../cover.webp` is served byte-for-byte, so
  it is both the source of truth and what visitors download. (The old
  `qualities: [100]` / `/_next/image` advice is gone.)
- **1600×900 is a floor, not just a fit.** Three consumers pin it:
  `pngDataUri(cover, 1080)` in `app/card/projects/[id]/route.tsx` uses
  `withoutEnlargement: true`, so anything under 1080 gets stretched into the 1080×608
  share card and goes quietly blurry; `app/cv/page.tsx` prints covers on A4 at 182 mm
  (1600 px = 223 DPI); and JSON-LD `image` wants ≥1200. `bun run images:optimize`
  deliberately leaves covers untouched for this reason — never hand-shrink one.
- Cards crop `object-cover` on a 16:9 box (`ProjectCard.tsx`), but the **detail hero is
  `aspect-[16/8]`** (`ProjectDetail.tsx`), which trims ~6% off the top and bottom of a
  16:9 source. Keep anything load-bearing out of those bands.
- The template's fonts fall back to macOS system fonts (Avenir Next Condensed /
  Menlo) since Rajdhani/JetBrains-Mono aren't installed — that's expected and looks
  right in raster.

## Per-project config used for the current set (reuse / tweak these)

`tags` is recorded here on purpose. It used to live ONLY as pixels inside the rendered
`cover.webp`, so nothing kept it honest — and it drifted: `rs-medal` advertised MongoDB it
has never used (copy-pasted from `rs-award`), and `looklook-pet` kept advertising NATS for
months after a milestone retired it. **Tags must name only skills that are ACTIVE for that
project** — cross-check `activeSkills` in `common/data/projects.ts`, and prefer drawing them
from that project's `highlightSkills`, which is already the curated signature list.

```
whenwe              accent #3AD198  motif dots     title When|We             kicker // GROUP SCHEDULING     badge ● In Development  tags Expo,React Native,Elysia,MongoDB
                    subtitle Free-time heatmap · No calendars shared  badgeSub Pre-Beta  meta FREELANCE // 2026
monomax-epl-portal  accent #EE5E25  motif qr       title MONOMax|EPL Portal  kicker // LICENSING SAAS       badge ● SaaS      tags Next.js,MongoDB,Better-Auth,Docker
rs-trophy           accent #FCEE0A  motif trophy   title RS|Trophy           kicker // E-COMMERCE PLATFORM  badge ● Live      tags Bun,Next.js,Elysia,MongoDB,R2
looklook-pet        accent #FF7D5A  motif hex      title LOOKLOOK|Pet        kicker // MARKETPLACE          badge ● Live      tags NestJS,Medusa,Omise,Next.js
online-poker-game   accent #FF003C  motif cards    title Online|Poker        kicker // REALTIME GAME        badge ● Archived  tags Next.js,SSE,PostgreSQL,Redis
flood-project       accent #00F0FF  motif waves    title Flood|Project       kicker // WATER-LEVEL MONITORING                 tags Next.js,Prisma,Leaflet,Recharts,NextAuth
prettier-config     accent #55B3B4  motif braces   title Prettier|Config     kicker // DEV TOOL             badge ● Live      tags Next.js,CodeMirror,Tailwind
rs-medal            accent #8AD8FF  motif rings    title RS|Medal            kicker // E-COMMERCE           badge ● Live      tags Next.js,JSON-LD,SEO
rs-award            accent #FFB020  motif shield   title RS|Award            kicker // E-COMMERCE           badge ● Live      tags Next.js,MongoDB,SEO
portfolio           accent #FCEE0A  motif hex      title Portfolio|v2.077    kicker // PERSONAL SITE        badge ● Live      tags Next.js,Tailwind,shadcn,Railway
qr-food             accent #39FF14  motif qr       title QR|Food             kicker // SENIOR THESIS        badge ● Thesis    tags Nuxt,Vue,Prisma,Supabase
```
