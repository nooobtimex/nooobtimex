# Local sync map

NooobtimeX's half of [`/update-docs`](SKILL.md). It is not stamped — edit it freely. Beyond the generic cases
in `SKILL.md` §6, when this repo's code changes:

- **A new or renamed route** → the `CLAUDE.md` repository map, [`/app-conventions`](../app-conventions/SKILL.md)
  §4 for a detail route, and `bun run links:check` (it fails on any internal href the build did not emit).
- **A new kind of content in `common/`** → [`/common-conventions`](../common-conventions/SKILL.md) and the
  matching recipe in [`/add-content`](../add-content/SKILL.md).
- **A new icon, image or post** → regenerate and commit the artifact (`icons:generate`, `images:optimize`,
  `llms:generate`) — the list is in `CLAUDE.md` under Delivery contract.
- **A new design primitive in `components/cyber/`** → [`design-system.md`](../../rules/design-system.md).
- **A new SEO trap found live** → [`seo-invariants.md`](../../rules/seo-invariants.md).
