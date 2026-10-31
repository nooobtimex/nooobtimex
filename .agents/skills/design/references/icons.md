# Icons — three surfaces, and they are not interchangeable

Detail behind [`design`](../SKILL.md) §6. Store icon names as **strings in the data layer** (e.g. a skill's
`icon`), never as imported components. Where that string is resolved depends on who renders it:

| Surface                                                                       | Resolver                                         | Reach                                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| **Server** components                                                         | `<CyberIcon icon="logos:react" />`               | only what is in `lib/og-icons.generated.json`         |
| **Client** components                                                         | `@iconify/react` — `<Icon icon="logos:react" />` | any icon, fetched from the Iconify API in the browser |
| **Server** — Satori cards (`components/og/`), README SVGs (`scripts/readme/`) | `resolveIcon()` / `iconDataUri()` from `lib/`    | only what is in `lib/og-icons.generated.json`         |

`resolveIcon()` is in `lib/icon-data.ts`, `iconDataUri()` in `lib/og-assets.ts`, `CyberIcon` in
`components/cyber/CyberIcon.tsx`.

**Prefer `CyberIcon` in anything that is not `'use client'`.** It inlines the SVG, so the icon is in the
prerendered HTML. `@iconify/react`'s `Icon` fetches from api.iconify.design _after mount_ — before this component
existed the built HTML contained **zero** inline `<svg>` across 69 render sites, so every icon was blank until a
third-party round-trip finished, and absent entirely wherever that host is blocked. Preloading the data does not
help: `Icon` emits `<span></span>` under `renderToString` even when the icon is registered via `addIcon`.

> **Never import `CyberIcon` into anything reachable from a `'use client'` boundary.** It pulls
> `lib/og-icons.generated.json` (~160 KB) with it. That is why `CyberTag` — a shared primitive rendered from
> `contact/`'s client components — deliberately stays on `@iconify/react`. Server-only components get inlined SVG;
> anything a client component can import stays on the API.

A literal icon name hard-coded in a server component must be added to `EXTRA_ICONS` in
`scripts/icons/required.ts` (an explicit list — never a scan; see that file's rationale) and regenerated.
`CyberIcon` throws on an unknown name rather than rendering nothing, so the failure is loud at build time instead
of an invisible icon in production.

None of the server paths can fetch at render time, so they all read the same **curated local subset** (174 icons,
~160 KB when last measured) — generated from `common/data` plus the `EXTRA_ICONS` list, and committed. The counts
are measurements, not rules: re-measure `lib/og-icons.generated.json` if they look off.

> **Never `import { icons } from '@iconify-json/…'` in `app/`, `components/`, or `lib/`.** Those six packages are
> 26.7 MB / 32,844 icons. They used to be imported by `lib/og-assets.ts`, and Turbopack inlined the whole payload
> into two server chunks loaded by every page — ~275 MB of resident RSS in production for icons that were provably
> dead in the page graph. They now live in devDependencies, quarantined behind `scripts/icons/collections.ts`. See
> `lib/og-palette.ts` for the post-mortem.

**Adding or changing an `icon:` in `common/data` means `bun run icons:generate`.** Forgetting is caught —
`bun run icons:check` gates `bun run build` and fails with the missing name. Need an icon from a collection we do
not carry? Add the collection to `scripts/icons/collections.ts` and regenerate.
