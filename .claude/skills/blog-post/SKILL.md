---
name: blog-post
description: >-
  Use when writing, promoting or editing a post in the NooobtimeX Journal
  (`/blog`, `common/data/posts/<year>/`) — promoting a `draft: true` stub to a full
  post, adding citations to an existing one, or planning a series. Covers the
  full-tier AEO contract, the outbound-citation rules (what to cite, how to verify
  it, inline vs. `sources`), the series gap rule, the voice spec, and the ship gate.
  Use proactively whenever a request is "write the next article", "เขียนบทความ",
  "promote a stub", or "add references/sources to a post".
---

# Writing a Journal post

The Journal is typed data, not MDX. One post is one `PostDef` object in
`common/data/posts/<year>/<id>.ts`, where **filename === `id`** and the export is the
camelCase of it. Registration is `<year>/index.ts` (the year of `happenedAt`, ordered by
`happenedAt`, then `id`) → `posts/index.ts`.

**`draft: false` IS publishing.** There is no scheduler. Merging a non-draft post puts it
on nooobtimex.me, in the sitemap, in `llms.txt` and in the OG card route. Finish it before
the flag flips.

## 1. Choosing what to write — check the stub is not already written

Stubs were reserved in bulk, long before the posts were. As posts got written they
absorbed neighbouring topics, which silently orphaned later stubs. **Two of the four
remaining `container-diet` stubs turned out to duplicate posts already published.**

Before writing, grep the published corpus for the stub's subject. If a published post
already tells that story, do not write it — retire the stub, or re-scope it to what the
published post did _not_ cover, and say which in the commit.

**Series:** `series: { id, part }`. `resolvePost` requires the **published** parts to be
`1..n` with no gaps — so you cannot publish part 5 while 3 is a draft. Dropping a part
means renumbering the ones after it. "Part N of M" is computed from published posts only.

## 2. Where the material comes from

Posts are written from **this repo's own history**, not from memory:

- `git log -S "<symbol>"` and the full commit message — the reasoning is usually already
  written there, in prose, by the person who did the work.
- Comments in tracked config (`next.config.ts`, `Dockerfile`, `railway.toml`) — often the
  only surviving explanation, and worth quoting.
- `git show <sha>` for the diff that is the subject.

**Numbers are load-bearing and never invented.** If a number is not in a commit, a config
file or something Kwan stated, it does not go in the post. `[NEED NUMBER]` over a guess.
If a measurement moved several variables at once, say so and state the weaker claim it
actually supports.

## 3. Citations — the part that is enforced

### The gate

`resolvePost` **fails the build** when a post containing any `code` block has fewer than
**2** `sources`. Posts with no code — a career turn, a decision about people — are exempt
on purpose: forcing a doc link into a narrative invents authority instead of showing it.

Also enforced: `https` only, non-empty title, no duplicate URL within a post.

### What to cite, in order of preference

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

### Verification is mandatory

```bash
bun run links:external
```

Fetches every `sources[].url` and every inline external link in prose, and exits 1 on
anything that does not answer. **Run it before every commit that touches citations.**

It is deliberately not in `bun run build`: a network call inside the deploy gate turns a
vendor's brief outage into a failed deploy, which trains everyone to bypass the gate.

Two rules that follow from this:

- **Never write a URL you have not fetched.** A post written from a commit log can invent
  exactly two things, a number and a link, and the link is the one nothing else catches.
  `links:check` only validates hrefs starting with `/`.
- **Cite the URL that answers, not the one that redirects.** Docs sites restructure
  constantly; the script prints `-> final` so you can record the destination.

### Inline links vs. `sources`

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

## 4. The full-tier contract

Required always: `id`, `title`, `happenedAt`, `chapter`. Required once `draft` is off,
each one a build error:

| Field         | Rule                                                                      |
| :------------ | :------------------------------------------------------------------------ |
| `publishedAt` | the go-live day — `happenedAt` ≤ `publishedAt` ≤ today                    |
| `description` | ≤ 155 chars                                                               |
| `tldr`        | ≥ 120 chars — the direct answer; the ONLY thing `llms.txt` emits per post |
| `faqs`        | ≥ 3, query-shaped questions — feeds FAQPage JSON-LD                       |
| `body`        | non-empty                                                                 |
| `sources`     | ≥ 2 when the body has a `code` block                                      |
| `category`    | `nextjs \| infrastructure \| commerce \| seo-aeo \| engineering`          |

- **Two dates, never one standing in for the other.** `happenedAt` is **the real date of
  the event** — a milestone, a commit, a role date — however far back; it orders the
  archive and renders as "Happened". `publishedAt` is **the day the post goes live** (the
  commit that removes `draft`); it is what `datePublished`, `article:published_time` and
  the sitemap report. Google's byline-date guidance forbids giving "the date of the action
  described on the page" as the publication date — the single-date rule did exactly that,
  and 30 posts written on 2026-08-25 claimed to be from as early as 2021.
- `updatedAt` is the last reader-visible revision **after** going live — omit it until
  there is one. The resolver rejects `updatedAt ≤ publishedAt`.
- `title` is query-shaped — how someone would search it, not a clever headline.
- Inline format is exactly four forms: `` `code` ``, `**bold**`, `[text](href)`,
  `[[kind:id]]` where kind is `skill|project|career|company`. **Single-star `*italics*`
  throws.** Every `[[ref]]` must resolve.
- Blocks: `p`, `h2`, `h3`, `code`, `list`, `callout` (`info|warn|danger|success`),
  `quote`, `image`, `stat`, `table`. `h2` drives the TOC. `readingMinutes` is derived.
- Code snippets ≤ ~15 lines, 2–4 blocks. Never employer code — mark illustrative
  snippets as such in the `caption`.

## 5. Voice

- Lead with the collision — the concrete thing that broke, dated.
- First person, past tense, specific. Short sentences.
- **Argue against your own case.** Every post carries a section that states the honest
  counterargument, the cost paid, or the thing the author got wrong. A post with no
  self-criticism is not finished.
- English only. Respect the editorial risk rules in project memory (no ventures, no
  private family matters, no money or health figures, no client names beyond what the
  site already publishes).

## 6. Ship

In the same commit that removes `draft: true`, set `publishedAt` to that day's date.
Revising an already-published post? Set `updatedAt` to the day of the revision.

```bash
bun run lint && bun run build && bun run links:external && bun run llms:generate
```

`build` is `icons:check` → `next build` → `links:check` → `seo:check`. `llms:generate` is
**not** in the build — regenerate and commit `public/llms.txt`, or it goes stale silently.

Then verify what actually shipped: published count rose, the series strip reads
"Part N of M", `/sitemap.xml` holds exactly the non-draft posts, and the new slugs render.
