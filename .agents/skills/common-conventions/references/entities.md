# Projects, experiences, entities and personal data

Detail behind [`common-conventions`](../SKILL.md) §5. Everything here lives in `common/data/` and is re-exported
through `@/common`; the recipes for adding one are in the [`add-content`](../../add-content/SKILL.md) skill.

## Projects — author a `ProjectDef`, ids resolve to `Skill`s

In [`common/data/projects.ts`](../../../../common/data/projects.ts) a project is a `ProjectDef`: the `Project`
interface from [`common/interfaces.ts`](../../../../common/interfaces.ts) without the derived fields (`skills`,
`activeSkills`, `retiredSkills`, `timeline`), plus

- `skills: SkillId[]` — the **starting** stack, as id strings (typed and autocompleted);
- `highlightSkills?: SkillId[]` — the signature tech, most representative first. It may name only skills that are
  _active_ for the project; the resolver throws on a retired one;
- `timeline?: MilestoneDef[]` — milestones whose `addedSkills` / `removedSkills` are `SkillId[]` too.

`resolveProject` turns that into a `Project`: it folds the timeline's adds and removes into the full historical
roster (`skills`), the display-ordered `activeSkills` and `retiredSkills`, and adds `commonTooling` (always active,
never retired) to every project. Ids become full `Skill`s through `skillById`.

- Add the const to the `defs` array; `projectsData` is `defs` resolved and sorted newest-first by
  `sortByDateDesc`. Feature a project on the home page by adding its `id` to `featuredProjectIds`
  (→ `featuredProjects`). `id` is url-safe → `/projects/<id>`.
- Besides the skills: `title`, `description`, `images` (`cover` and `photos`, both from `assets.*`), `accent`,
  `links` (`{ live?: string }`), `startDate` and — unless it is ongoing — `endDate`. `accent` is the project's real
  brand colour as hex; it drives the generated `cover.webp` and the share card.
- Tie a project to the work behind it with `linkedExperienceIds` (role ids, primary first), and with
  `clientOrganizationId` / `viaOrganizationId` (`EntityId`) when the client or the delivering organisation is not
  the one the role implies.
- `stage: 'in-development'` only when the derived status — Live or Archived, from `links.live` — would mislead.

## Experiences & entities

- [`common/data/experiences.ts`](../../../../common/data/experiences.ts) — author `ExperienceItem` consts: the
  `organization` object, a `position`, a `type` (`EmploymentType`), `category: 'work' | 'education'`,
  `YYYY-MM-DD` dates (omit `endDate` for a current role) and, for education, a `credential` headline. Include each
  in the `all` array → `experiencesData` (sorted desc) plus the `workExperienceData` / `educationData` slices
  (and `latestRole`, the newest work item). Add the role's `id` to the `ExperienceId` union in
  [`enums.ts`](../../../../common/enums.ts) before a project links it.
- [`common/data/entities.ts`](../../../../common/data/entities.ts) — `Organization` consts; the ones listed in
  `entitiesData` get a `/companies/<id>` page. Add the org **and** its `EntityId` to
  [`enums.ts`](../../../../common/enums.ts) before linking it.

## Personal data

[`common/data/personal.ts`](../../../../common/data/personal.ts) holds `personalData` (`PersonalData`): name,
`title`, `heroRole`, `pitch`, `tagline`, avatar, `about`, `contact`, `languages`, `socialLinks`, `hire` and the
`contactChannels`. `socialLinks` is an array of `{ platform: SocialPlatform, url, icon, username? }`. `hire.url`
is the site's one hire route — a `mailto:` that every "Hire me" control reads. Avatar and og paths come from
`assets.*`.
