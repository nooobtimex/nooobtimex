---
name: design
description: "The NooobtimeX visual system: white Comic components and an interactive three-column homepage, responsive 3D, accessible motion, icon boundaries and plain images. Use when editing TSX, CSS, page layouts, components/site, components/home, icons or images, or discussing the site's design."
paths:
  - '**/*.tsx'
  - '**/*.css'
  - 'components/site/**'
  - 'components/home/**'
---

# NooobtimeX design

The site introduces Kwan and the things he builds. It is not a freelance sales funnel. English UI copy stays
plain; Thai names and authored articles retain their language. Root context: [AGENTS.md](../../../AGENTS.md).

## 1. Shared surfaces

`app/globals.css` owns the white Comic palette, Space Grotesk headings, Inter body text, focus and reduced motion.
Use white surfaces, ink borders, small square corners and hard offset shadows. Blue is the accent; decorative
halftone belongs in the 3D stage, never behind long text. Body copy is at least 16px on reading surfaces.
Use `components/site/`: `Container`, `Action` / `actionVariants`, `Panel`, `SectionHeader`, `Tag`, `Hint`,
`TitleText`, `ContentBlock` and `SiteIcon`. `ContentBlock` renders visible HTML immediately and adds a transform-only entrance when in view; reduced motion
skips the entrance. Actions and cards respond to hover only with a fine pointer; focus stays visible.
No neon, HUD corners, scanlines, glitch, forced dark mode or game jargon. Do not restore age/birthday data or
freelance availability from the historical reference.

## 2. Homepage and detail pages

`components/home/HomeContent.tsx` stays on the server; `home.module.css` owns its layout.
The reference is the pre-Cyberpunk Comic design (`149cd00`), adapted to current content and a white theme.
At 1280px and above: profile left, 3D/work center, current work/writing right. At 768–1279px: two columns with
context below. Below 768px: stack without nested scroll areas or viewport-height locking.

`HeroExperience` owns Systems / Robotics / Play selection (Robotics first), pause and the SVG fallback.
It dynamically imports `scene.ts`, which owns Three.js rendering, camera fit, procedural geometry and disposal.
Robotics is a procedural Unitree G1 form study based on the official product silhouette and existing owner photos,
not a manufacturer CAD model. Play groups a Roblox-inspired block avatar, controller, PC, phone and tablet.
Systems connects a dashboard, API/server core, database and workflow through animated data paths.
The SVG fallback reflects all three compositions. Content and navigation work before the scene loads.
`WorkImage` adds desktop-only parallax. Client modules import only types from `@/common`; data comes as props.

Use `SectionHeader` for index headings, `.comic-detail-heading` for detail heroes, `.comic-card` for linked work,
and `.reading-layout` for prose plus a rail (rail moves below below 1024px). Long text is limited to 76–78ch.
Article code and tables scroll inside their own frame. Preserve article content, citations, routes and metadata.
CV uses the same typography and blue accent, with shadows removed for print. Presentation uses the same frame
and animated slide changes, a labelled slide selector and keyboard controls. QR codes remain dark on white.

## 3. Responsive motion

- Main controls have at least 44px targets. Touch scroll remains native; mouse effects require hover/fine pointer.
- Reduced motion removes parallax, hover transforms and continuous 3D; mode changes render immediately.
- Resize the scene drawing buffer from its container and cap resolution. Stop rendering offscreen/in hidden tabs.
- Dispose geometry, materials, environment, observers, listeners and renderer on unmount.
- Preserve a static fallback for loading, failed imports, unavailable WebGL and lost contexts.
- Verify all generated pages at mobile/desktop widths, plus each page type at 360, 390, 768, 1024, 1440 and 1920.
- Check landscape, reflow/zoom, no-JS, touch, search, gallery, presentation, contact download and CV print.

## 4. Icons and images

Server components use `SiteIcon`. Client components use `@iconify/react` or the existing Lucide package, never
`SiteIcon` or the server icon JSON. `Tag` deliberately uses the client-safe Iconify resolver.
Only `scripts/icons/collections.ts` may import `@iconify-json/*`. New icon strings require
`bun run icons:generate`; see [icon details](references/icons.md).

Images use plain `<img>`, never `next/image`. Paths live in `common/data/assets.ts`; eager/high-priority loading
is for above-the-fold content and lazy/async for lower images. See [image sizing](references/images.md).
Satori cards use import-free `lib/og-palette.ts` and inline styles. Keep sharp lazy in build-only asset rendering.

## 5. Verification

Run `bun run gate`; inspect the rendered page as well as exit codes. Check browser errors, clipping, contrast,
mode changes, pause, fallback, reduced motion and that server content is readable without JavaScript.
