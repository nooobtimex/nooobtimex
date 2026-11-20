---
name: make-cover
description: 'Generates an on-brand light 16:9 project cover (cover.webp) from a parameterized HTML template rendered with headless Chrome, without a screenshot, and files a real screenshot into the project gallery. Use when adding a project that has no cover, when a project thumbnail is weak (a logo or placeholder), or when asked to "make a cover / banner / thumbnail like the flood-project one".'
---

# Cover generator

Creates white Comic typographic 1600×900 WebP project covers. The shared template uses white/paper, thick ink frames, offset blue shadows,
plain titles and active technology names. Real screenshots/photos are preferred in homepage work previews.

- [HTML template](assets/cover-template.html): `title`, `subtitle`, `tags`, and `badgeLvl` query parameters.
- [Render helper](assets/render.sh): headless Chrome screenshot converted with `cwebp`.

Use `assets/` paths from `common/data/assets.ts`, preserve the 1600×900 cover floor, run `bun run images:optimize`
and `bun run gate` after regenerating. The table below records project brand accents and active cover tags;
`projects:check` validates them against the data layer. Legacy motif fields are historical and ignored by the
light template. Brand accents remain project metadata; the template itself uses the shared blue.

## Per-project config used for the current set (reuse / tweak these)

`tags` is recorded here on purpose. It used to live ONLY as pixels inside the rendered
`cover.webp`, so nothing kept it honest — and it drifted: `rs-medal` advertised MongoDB it
has never used (copy-pasted from `rs-award`), and `looklook-pet` kept advertising NATS for
months after a milestone retired it. **Tags must name only skills that are ACTIVE for that
project** — cross-check `activeSkills` from `common/data/projects/`, and prefer drawing them
from that project's `highlightSkills`, which is already the curated signature list.
`bun run projects:check` (in `gate`) enforces this table: a row per project, its `accent` equal to the
project's, every tag an active skill, and a status badge that matches `projectStatus()`. A failure there
means re-render the cover and update its row.

```
unitree-g1          accent #2EC4B6  motif hex      title Unitree|G1          kicker // HUMANOID ROBOTICS     badge ● In Development  tags Python,C++,MuJoCo,ROS 2,FastAPI,WebSocket
                    subtitle Sim, safety gate, show control and a Thai/English voice  badgeSub Robotics  meta THAIBOTIC // 2026
thaibotic           accent #2EC4B6  motif dots     title Thaibotic           kicker // ROBOT EVENTS WEBSITE  badge ● Live      tags Next.js,Tailwind,SEO,JSON-LD,Railway
                    subtitle Bilingual site for a humanoid robot at your event  badgeSub TH / EN  meta THAIBOTIC // 2026
wangpa              accent #5CCF95  motif dots     title ว่างป่ะ|Wangpa      kicker // GROUP SCHEDULING ON LINE  badge ● In Development  tags LINE LIFF,Next.js,Elysia,MongoDB
                    subtitle Who is free, inside LINE · Busy-only privacy  badgeSub Launch Nov 2026  meta FREELANCE // 2026
monomax-epl-portal  accent #EE5E25  motif qr       title MONOMax|EPL Portal  kicker // LICENSING SAAS       badge ● SaaS      tags Next.js,MongoDB,Better-Auth,Docker
rs-trophy           accent #FCEE0A  motif trophy   title RS|Trophy           kicker // E-COMMERCE PLATFORM  badge ● Live      tags Bun,Next.js,Elysia,MongoDB,R2
rs-trophy-admin     accent #C5A059  motif bars     title RS Trophy|Admin     kicker // STAFF CONSOLE        badge ● Internal  tags Next.js,Elysia,Better-Auth,Recharts
                    subtitle Social publishing · AI data assistant  badgeSub Staff only  meta RS TROPHY // 2026
rs-eservice         accent #ECD399  motif qr       title RS|eService         kicker // STAFF WORKSPACE      badge ● Internal  tags Next.js,Elysia,Base UI,Bun
                    subtitle Requests · Approvals · E-signed documents  badgeSub PWA  meta RS TROPHY // 2026
looklook-pet        accent #FF7D5A  motif hex      title LOOKLOOK|Pet        kicker // MARKETPLACE          badge ● Live      tags NestJS,Medusa,Omise,Next.js
online-poker-game   accent #FF003C  motif cards    title Online|Poker        kicker // REALTIME GAME        badge ● Archived  tags Next.js,SSE,MongoDB,Redis
                    subtitle Multiplayer Texas Hold'em · SSE  badgeSub Realtime  meta FREELANCE // 2025
flood-project       accent #00F0FF  motif waves    title Flood|Project       kicker // WATER-LEVEL MONITORING                 tags Next.js,Prisma,Leaflet,Recharts,NextAuth
prettier-config     accent #55B3B4  motif braces   title Prettier|Config     kicker // DEV TOOL             badge ● Live      tags Next.js,CodeMirror,Tailwind
rs-medal            accent #8AD8FF  motif rings    title RS|Medal            kicker // E-COMMERCE           badge ● Archived  tags Next.js,JSON-LD,SEO
                    subtitle Medals Storefront  badgeSub Storefront  meta RS MEDAL // 2022–2026
rs-award            accent #FFB020  motif shield   title RS|Award            kicker // E-COMMERCE           badge ● Archived  tags Next.js,MongoDB,SEO
                    subtitle Awards Storefront  badgeSub Storefront  meta RS AWARD // 2022–2026
portfolio           accent #244C85  motif hex      title Profile|v2.077      kicker // PERSONAL SITE        badge ● Live      tags Next.js,Tailwind,shadcn,Railway
qr-food             accent #39FF14  motif qr       title QR|Food             kicker // SENIOR THESIS        badge ● Thesis    tags Nuxt,Vue,Prisma,Supabase
```
