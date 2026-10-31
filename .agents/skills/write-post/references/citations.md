# Citations — what to cite and how to link it

Detail behind [`write-post`](../SKILL.md) §3 (the gate and the verification step stay there).

## What to cite, in order of preference

1. **A real GitHub issue or PR** for a bug or upstream behaviour (`oven-sh/bun#27514`).
   This is the strongest citation the Journal can carry — a named, dated, third-party
   record that the problem was real and not a misconfiguration.
2. **Official documentation**, deep-linked to the exact section
   (`…/api-reference/components/image#qualities`). Fragments are wanted, not stripped.
3. **A specification** — WHATWG, MDN, schema.org, ICU, RFC.
4. **A canonical primary article** where the idea has one (Nygard on ADRs, Fowler on TDD).

Never cite a blog aggregator, an SEO-farm rewrite, or a Stack Overflow answer when the
doc it paraphrases exists.

**Finding a real issue** — search the API, never guess a number:

```bash
curl -s "https://api.github.com/search/issues?q=$(python3 -c "import urllib.parse;print(urllib.parse.quote('repo:vercel/next.js notFound loading.tsx status 200 in:title,body type:issue'))")&per_page=5"
```

Then fetch the issue and read its title, body, state and author before citing it. An issue
filed by **someone else** is worth more than one you filed: it is independent evidence the
behaviour is real rather than a misconfiguration on this side, and it is worth saying so in
the prose ("filed by someone I have never met"). If no issue matches the specific claim,
cite nothing — an adjacent bug presented as the same one is a worse error than a missing
link, because it reads as verified.

## Inline links vs. `sources`

Do both. They are not the same job.

- **Inline** `[plain text](https://…)` in the sentence that makes the claim. This is what
  an answer engine reads as "this specific assertion is grounded". Anchor on words that
  name the thing — `[Server-Sent Events](…) is exactly that shape`, `made it
[a 200 instead of a 404](…)`.
  **Link text must be plain.** The renderer does not tokenize inside link text, so
  ``[`next-intl`](…)`` renders literal backticks.
- **`sources`** is the reference list at the foot of the post, and feeds the
  `citation` array of the `BlogPosting` JSON-LD (`lib/schema.ts`). Without it a reference
  list is a visual footer only — a human sees the post is grounded and a machine sees an
  unsourced opinion.

Both render with `target="_blank" rel="noopener noreferrer"` automatically. Do not add
`nofollow`: citing authoritative docs is the point.
