# Local sync map

NooobtimeX's half of [`update-docs`](SKILL.md). It is not stamped — edit it freely. Beyond the generic cases
in `SKILL.md` §7, when this repo's code changes:

- **A new or renamed route** → the `AGENTS.md` repository map, the
  [`app-conventions`](../app-conventions/SKILL.md) skill §4 for a detail route (a new `[...id]` route also
  exports `dynamicParams = false` — [`seo-conventions`](../seo-conventions/SKILL.md)), and `bun run links:check`
  (it fails on any internal href the build did not emit).
- **A new kind of content in `common/`** → the [`common-conventions`](../common-conventions/SKILL.md) skill (and
  its [`references/entities.md`](../common-conventions/references/entities.md)) and the matching recipe in
  [`add-content`](../add-content/SKILL.md).
- **A new icon, image or post** → regenerate and commit the artifact (`icons:generate`, `images:optimize`,
  `llms:generate`) — the list is in `AGENTS.md` under Delivery contract.
- **A new design primitive in `components/cyber/`** → the [`design`](../design/SKILL.md) skill (its
  `references/icons.md` and `references/images.md` for the icon and image rules).
- **A new SEO trap found live** → the [`seo-conventions`](../seo-conventions/SKILL.md) skill.
- **A change to the Journal contract** (`resolvePost` in `common/data/posts/index.ts`) → the
  [`write-post`](../write-post/SKILL.md) skill and its [`references/citations.md`](../write-post/references/citations.md).
- Not ours: `next dev` upserts its "This is NOT the Next.js you know" block into the root `AGENTS.md` (this is a
  single-app repo). Keep it there; the checker does not count it.
