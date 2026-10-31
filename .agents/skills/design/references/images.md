# Images are plain `<img>` — `next/image` is not used

Detail behind [`design`](../SKILL.md) §7. `images: { unoptimized: true }` in `next.config.ts`, and
`@next/next/no-img-element` is off in `eslint.config.mjs`. Every asset in `public/` is already WebP at a sane
size, so the optimizer bought nothing while dragging sharp/libvips into the runtime container.

The `fill` idiom translates to `absolute inset-0 size-full` on a `relative` parent:

```tsx
<span className='relative size-12 overflow-hidden'>
	<img
		src={org.logo}
		alt={org.name}
		loading='lazy'
		decoding='async'
		className='absolute inset-0 size-full object-contain p-1'
	/>
</span>
```

Use `loading='eager' fetchPriority='high'` for above-the-fold LCP images (the home avatar, a project cover),
`loading='lazy' decoding='async'` everywhere else.

## Sizing — no srcset means source size _is_ delivered size

```
target width = min(source width, 2 × the largest CSS px it ever renders at)
```

`bun run images:optimize` (`scripts/images/optimize.ts`) applies this across `public/`. It only rewrites a file
that is oversized or over-encoded (>0.22 bytes/px), stamps an EXIF marker, and skips anything already marked — so
re-running is safe and will not stack generational loss. Adding a new asset? Run it; it will leave everything else
alone.

**Never hand-shrink a file below these floors — each one fails silently:**

| Floor                       | Applies to             | Set by                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1200 px** (1080 absolute) | `issue/*/cover.webp`   | `pngDataUri(cover, CARD_SIZE)` in `app/card/projects/[id]/route.tsx` (`CARD_SIZE` = 1080, `components/og/card-primitives.tsx`) uses `withoutEnlargement: true`, so a smaller source is stretched into the 1080×608 share card, blurry, no error. Plus A4 print in `app/cv/page.tsx` (182 mm) and JSON-LD `image` |
| **512×512**                 | `logo/logo.webp`       | `app/manifest.ts` declares the size to Chrome (it must match the real file) — keep the two in step                                                                                                                                                                                                               |
| **112×112**                 | the `logo/*` org marks | JSON-LD `Organization.logo` (`app/(main)/companies/[...id]/page.tsx`)                                                                                                                                                                                                                                            |

Only the gallery photos under `issue/*/photo-*.webp` have no non-browser consumer.
