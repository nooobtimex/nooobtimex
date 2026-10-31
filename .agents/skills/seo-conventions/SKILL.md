---
name: seo-conventions
description: The five SEO invariants the NooobtimeX build depends on — no root `alternates`, `dynamicParams = false` on every `[...id]` route, two sources for a post that shows code, detail URLs keyed by `id`, and no Suspense around page content or route-level `loading.tsx`. Use when editing a route or layout under app/, lib/seo.ts, a Journal post under common/data/posts, the links:check or seo:check scripts, or when a page shows a soft-404, a wrong canonical or empty HTML to crawlers.
paths:
  - 'app/**'
  - 'lib/seo.ts'
  - 'common/data/posts/**'
  - 'scripts/links/**'
  - 'scripts/seo/**'
---

# SEO — five invariants the build depends on

These encode bugs that were live on nooobtimex.me and produced **no error anywhere**.

1. **Never set `alternates` in `app/layout.tsx`.** Metadata `alternates` is _inherited_ by every child segment
   that does not override it, so a root `canonical: '/'` made all 90 routes declare themselves duplicates of the
   home page — the whole site asking Google not to index it. Canonicals come from `pageMetadata()` in
   [`lib/seo.ts`](../../../lib/seo.ts), which every route calls. It also omits `openGraph.images` on purpose so
   the file-convention `opengraph-image.tsx` still resolves per segment.

2. **Every `[...id]` route needs `export const dynamicParams = false`.** It rejects an unknown slug at the
   routing layer, before anything renders. A page's own `notFound()` is not enough: any Suspense boundary above
   the page flushes response headers at **200** first, so the 404 UI lands inside an already-committed 200. The
   old root `app/loading.tsx` did exactly that, and every mistyped slug became an indexable soft-404 titled
   "… Not Found".

3. **A post that shows code cites at least two sources.** `resolvePost` in `common/data/posts/index.ts` fails the
   build otherwise, and `bun run links:external` fetches every one of them — because
   [`scripts/links/check.ts`](../../../scripts/links/check.ts) only validates hrefs starting with `/`, so a
   citation URL that 404s, or one that was never real, passes every other gate and ships inside a published
   article. Posts with no code block are exempt: a narrative does not get more true by linking a doc at it.

4. **Detail-route URLs are keyed by `id`, never `slugify(name)`.** They agreed for 60 of 61 skills — `Vue.js`
   slugified to `vue-js` while its id is `vue`, so every Vue link _and the sitemap_ pointed at a 200-status
   "Skill Not Found" page. [`scripts/links/check.ts`](../../../scripts/links/check.ts) now fails the build on any
   internal href the build did not emit.

5. **No Suspense boundary may wrap page content — so no route-level `loading.tsx`.** React 19.2 _outlines_ any
   completed boundary larger than 500 B once the response passes 12,800 B: the fallback is written in place and
   the real content moves into a `<div hidden id="S:0">` that an inline script swaps in after parse. Nothing has
   to suspend. The root `app/loading.tsx` did this to 123 of 126 prerendered pages, so anything reading the HTML
   without JavaScript saw one word, "Loading…", on every URL — while AdSense rated the site "Low value content".
   Scope a boundary to something whose absence from the HTML costs nothing, never to a page. The site has none
   today: the `/github` stats, the last one, went when every year became a prerendered `/github/[year]`.
   [`scripts/seo/check.ts`](../../../scripts/seo/check.ts) fails the build on any prerendered page with readable
   text inside such a segment.

## Checklist

- [ ] No `alternates` in the root layout; every route builds its metadata through `pageMetadata()`
- [ ] Every new `[...id]` route exports `dynamicParams = false` and builds its hrefs from `id`
- [ ] A new post with a code block carries two real sources (the [`write-post`](../write-post/SKILL.md) skill covers how to verify them)
- [ ] No `loading.tsx` and no Suspense boundary around page content
- [ ] `bun run gate` green
