---
name: portfolio-content
description: >-
  Use when adding or editing portfolio CONTENT in the NooobtimeX repo — a
  project, skill, experience/role, organization, social link, or image asset.
  Covers the common/ data layer recipes, the SkillId/asset invariants, and the
  lint+build gate so the change ships clean. Use proactively whenever a request
  is "add my new project/role/skill" or "update my … on the site".
---

# Portfolio content

The task recipes for adding/editing site content. All content lives in the
`common/` data layer and is barrel-exported from `@/common`; pages only render it,
so a content change is a data-file edit, almost never a component edit. Match the
**tabs** indentation and the existing const-per-item style.

This skill is the "how do I add my new …" entry point. For the underlying type-safety
rules (the `skill()`/`SkillId` invariant, the `assets` map, `ProjectDef` resolution),
see [`/common-conventions`](../common-conventions/SKILL.md); for routing/pages see
[`/app-conventions`](../app-conventions/SKILL.md); for UI components see the rule
[`.claude/rules/design-system.md`](../../rules/design-system.md).

## Map: what lives where

| Want to add/edit…      | File                         | Then it flows into…                         |
| ---------------------- | ---------------------------- | ------------------------------------------- |
| A skill/technology     | `common/data/skills.ts`      | `skillsData`, `skillById`, `featuredSkills` |
| A project/build        | `common/data/projects.ts`    | `projectsData`, `featuredProjects`          |
| A job/role/education   | `common/data/experiences.ts` | `experiencesData`, `workExperienceData`, …  |
| A company/university   | `common/data/entities.ts`    | `entitiesData` (referenced by projects)     |
| Name/title/socials     | `common/data/personal.ts`    | `personalData`                              |
| An image path          | `common/data/assets.ts`      | `assets.*`                                  |
| A new fixed value type | `common/enums.ts`            | the union (e.g. add a `Position`)           |

## Recipes

### Add a skill

1. In `skills.ts`, add `const x = skill({ id: 'kebab-id', name: '…', icon: 'logos:…', category: 'frontend'|'backend'|'infrastructure'|'growth-management' })`.
2. Add `x` to the `allSkills` tuple (this is what derives `SkillId` — keep it a literal list).
3. Optionally add to `featuredSkills` if it should show on the home Stack section.
4. `id` must be url-safe (it becomes `/skills/<id>`). `icon` is an `@iconify` name; set `whiteBg: true` if the logo needs a light chip.
5. Expect the new page to be `noindex, follow` and absent from the sitemap: a skill page is indexed only once `isSkillIndexable` in `common/data/coverage.ts` says it has substance of its own. To earn it a place, write a field note — `common/data/skill-notes/<id>.ts` exporting a `SkillNote`, registered in that folder's `index.ts` — or a Journal post that references the skill. Nothing else to update; `seo:check` keeps the sitemap and robots tags in agreement.

### Add a project

1. Make sure every banner/photo path exists in `assets.ts` first (as `.webp`).
2. In `projects.ts`, add `export const x: ProjectDef = { … }`. List `skills` as
   **`SkillId[]`** (string ids) — they resolve to full `Skill`s via `skillById`.
   Set `linkedOrganizationId` to an `EntityId` if it ties to a company.
3. Add `x` to the `defs` array. To feature it, add its id to `featuredProjectIds`.
4. `id` is url-safe → `/projects/<id>`.

### Add an experience/role

1. Ensure the `Organization` exists in `entities.ts`. Add a **company** to
   `entitiesData` so it gets a `/companies` page; keep an **education-only** org
   (e.g. a university) as a const referenced by the experience but **not** in
   `entitiesData` — it shouldn't render on `/companies` (the experience detail
   renders such an org's name as plain text, not a link).
2. In `experiences.ts`, add an `ExperienceItem` const and include it in the `all` array.
   Use `category: 'work'|'education'`. Omit `endDate` for a current role
   (it renders as "Present"); dates are `YYYY-MM-DD` strings.

### Add an image asset

- Put the file under `public/…` as **`.webp`**, then add its path to the right
  group in `assets.ts` (`site` / `personal` / `logos` / `projects`). Reference it
  as `assets.…`, never an inline string in a component or data file.

## Invariants (do not skip)

The canonical rules live in [`/common-conventions`](../common-conventions/SKILL.md)
§3–4. The short version:

- **Never** hardcode an image path outside `assets.ts` (§4).
- **Never** widen the `skill()` literal — `SkillId` is derived from `allSkills` (§3).
- New enums/types go in `enums.ts` as a **string-literal union**, not a TS `enum` (§2).
- Don't edit a page/component to show new content — wire it through the data list it already maps over.

## Finish — the gate

Run both and confirm green before declaring done:

```bash
bun run lint && bun run build
```

`build` is the type check; a bad `SkillId`, missing asset key, or union typo
fails here. If you renamed an id/route and types look stale, `rm -rf .next` and rebuild.
