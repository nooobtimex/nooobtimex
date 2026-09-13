---
name: common-conventions
description: >-
  Conventions for the `common/` data layer in the NooobtimeX repo — the single
  source of truth for all site content. Covers barrel imports from `@/common`,
  string-literal enums, the `skill()`/`SkillId` invariant, the central `assets`
  map, the `ProjectDef`→`Project` resolution, experiences/entities/personal, and
  the lint+build gate. Use when adding or editing a skill, project, experience,
  organization, social link, asset, or enum, or when a reviewer asks how the data
  layer "should" look here.
---

# Common conventions (`common/`, the data layer)

The single source of truth for everything the site renders. It is barrel-exported
from `@/common`; pages/components only **map over** this data, so a content change
is almost always a data-file edit, never a component edit. When these conflict with
a quick fix, follow these — they encode the type-safety invariants the build relies
on. Cross-references: root [`CLAUDE.md`](../../../CLAUDE.md),
[`/app-conventions`](../app-conventions/SKILL.md),
[`/portfolio-content`](../portfolio-content/SKILL.md) (the task recipes), and the
UI rule [`.claude/rules/design-system.md`](../../rules/design-system.md).

Match the existing style: **tabs** indentation and one `const` per item.

## 1. Import from `@/common` — never deep paths

Everything is re-exported through the barrel. Import the public surface, not a file.

```ts
// ✅ RIGHT
import { skillById, projectsData, type SkillId } from '@/common'
// ❌ WRONG — deep path
import { skillById } from '@/common/data/skills'
```

**Never import a value from `@/common` in a `'use client'` module — types only.** The
barrel's post registry validates at import time, so a client import of anything at all
(`personalData` for a vCard) ships the whole data layer to the browser, every Journal
post's body included: /contact and /cv/presentation once loaded a 436 KB chunk of
articles on first paint. Give client components their data as props from a server parent
(`VCardPanel` ← `ContactContent`, `PresentationView` ← its page), or fetch a prerendered
file (the ⌘K palette reads `/search-index.json`). `bun run build` fails via
`bundle:check` if post text reaches a browser chunk.

```tsx
// ✅ RIGHT — server parent resolves, client child receives plain props
import type { PersonalData } from '@/common'
// ❌ WRONG — inside a 'use client' file
import { personalData } from '@/common'
```

## 2. Enums are string-literal unions, not TS `enum`s

Small fixed sets live in [`common/enums.ts`](../../../common/enums.ts) as plain
unions — they keep autocomplete + typo safety without the `Enum.Member` ceremony:
`SkillCategory`, `ExperienceCategory`, `EntityType`, `EmploymentType`, `Location`,
`Position`, `SocialPlatform`, `EntityId`. Add a new fixed value by widening the
union, never by introducing a TS `enum`.

```ts
// ✅ RIGHT — extend the union
export type Position = 'product-engineer' | 'developer' | 'designer'
// ❌ WRONG
export enum Position {
	ProductEngineer,
	Developer
}
```

## 3. The `skill()` identity helper & `SkillId`

In [`common/data/skills.ts`](../../../common/data/skills.ts), every skill is built
with `const skill = <const T extends Skill>(s) => s` and collected into the
`allSkills` **literal tuple**. `SkillId` is derived from that tuple
(`(typeof allSkills)[number]['id']`), and it's what gives every project's `skills`
list autocomplete + typo errors. **Never widen the literal** — a `Skill[]`-typed
entry or a non-literal id collapses `SkillId` to `string` and breaks type safety
repo-wide.

```ts
// ✅ RIGHT
const vitest = skill({ id: 'vitest', name: 'Vitest', icon: 'logos:vitest', category: 'frontend' })
// …then add `vitest` to the `allSkills` tuple (in its category group).
// ❌ WRONG — widening kills SkillId
const skills: Skill[] = [/* … */]
```

`skillsData` = `allSkills`; `skillById` is the id→`Skill` lookup; `featuredSkills`
is a hand-picked curation list. `whiteBg: true` flags a logo that needs a light chip.

**A new or changed `icon:` needs `bun run icons:generate`.** Server-side renderers —
the Satori social cards and the README SVGs — cannot fetch, so they read a curated
subset committed at [`lib/og-icons.generated.json`](../../../lib/og-icons.generated.json)
rather than the 26.7 MB `@iconify-json/*` packages. The same applies to any `icon:` in
`personal.ts` (social links, contact channels) or a project's `timeline`. Forgetting
fails `bun run build` with the missing name — see §8.

## 4. `assets.ts` is the single source of every image path

[`common/data/assets.ts`](../../../common/data/assets.ts) is an `as const` map
(`assets.site | personal | logos | projects`). Every image is **`.webp`** (except
favicon / apple-touch / og-image). Put the file under `public/…`, add its path to
the right group, and reference it as `assets.*` — never inline a string in a data
file or component.

```ts
// ✅ RIGHT
images: {
	banner: assets.projects.rsTrophy.banner
}
// ❌ WRONG — inline path, invisible to the asset map
images: {
	banner: '/issue/rs-trophy/banner.webp'
}
```

## 5. Projects — author a `ProjectDef`, ids resolve to `Skill`s

In [`common/data/projects.ts`](../../../common/data/projects.ts) a project is a
`ProjectDef` (`Omit<Project, 'skills'> & { skills: SkillId[] }`). List `skills` as
**id strings** — they resolve to full `Skill`s via `skillById` when `projectsData`
is built (and sorted newest-first by `sortByDateDesc`). Set `linkedOrganizationId`
to an `EntityId` to tie a project to a company. Add the const to the `defs` array;
feature it on the home page by adding its `id` to `featuredProjectIds`. `id` is
url-safe → `/projects/<id>`.

## 6. Experiences & entities

- [`common/data/experiences.ts`](../../../common/data/experiences.ts) — author
  `ExperienceItem` consts (with `category: 'work' | 'education'`,
  `YYYY-MM-DD` dates, omit `endDate` for a current role) and include each in the
  source array → `experiencesData` (sorted desc) plus the
  `workExperienceData` / `educationData` slices.
- [`common/data/entities.ts`](../../../common/data/entities.ts) — `Organization`
  consts → `entitiesData`, referenced by a project's `linkedOrganizationId`
  (`EntityId`). Add the org **and** its `EntityId` to [`enums.ts`](../../../common/enums.ts) before linking.

## 7. Personal data

[`common/data/personal.ts`](../../../common/data/personal.ts) holds `personalData`
(name, title, tagline, avatar, `socialLinks` keyed by `SocialPlatform`). Avatar/og
paths come from `assets.*`.

## 8. Pre-PR checklist

Touched an `icon:` anywhere in `common/data`? Regenerate the subset first:

```bash
bun run icons:generate
```

Then the usual gate:

```bash
bun run lint && bun run build
```

`build` is the type gate — a bad `SkillId`, a missing `assets.*` key, a widened
`skill()` literal, or a union typo fails here. It also runs `icons:check` first, which
fails if `common/data` references an icon missing from
[`lib/og-icons.generated.json`](../../../lib/og-icons.generated.json). If you renamed an
id/route and the types look stale, `rm -rf .next` and rebuild.
