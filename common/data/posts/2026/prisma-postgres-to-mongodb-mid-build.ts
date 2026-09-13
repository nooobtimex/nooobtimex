import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (rsAward timeline — 2025-12-04 remake on Prisma/Postgres, 2026-01-28 MongoDB migration, 2026-01-30 design system + Thai, 2026-02-10 client-side search), experiences.ts, entities.ts. */
export const prismaPostgresToMongodbMidBuild: PostDef = {
	id: 'prisma-postgres-to-mongodb-mid-build',
	title: 'Switching from Prisma/Postgres to MongoDB mid-build',
	happenedAt: '2026-01-28',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'scale',
	category: 'engineering',
	description:
		'Eight weeks into a Next.js catalog rebuild I replaced Prisma and Postgres with MongoDB. What forced it, what it cost, and why Postgres was not the problem.',
	tldr: 'On 28 January 2026, fifty-five days into the Next.js remake of [[project:rs-award]], I ripped out [[skill:prisma]] and [[skill:postgresql]] and moved the data layer to [[skill:mongodb]]. The reason was not scale or performance — it was that the content model was still moving, and every shape change cost a migration on a schema I did not yet believe in. **A read-mostly catalog is a document store wearing a relational costume.** The honest version is that Postgres was not failing; my certainty about the schema was.',
	skills: ['mongodb', 'prisma', 'postgresql', 'next-js'],
	relatedProjectIds: ['rs-award'],
	relatedEntityIds: ['ruamsuk-plating'],
	sources: [
		{ title: 'Prisma ORM — MongoDB connector', url: 'https://www.prisma.io/docs/orm/overview/databases/mongodb' },
		{ title: 'RS Award', url: 'https://www.rs-award.com' }
	],
	body: [
		{
			kind: 'p',
			text: "28 January 2026. Fifty-five days earlier I had started a ground-up Next.js remake of [[project:rs-award]] — the plaque and award catalog for one of my family's brands at [[company:ruamsuk-plating]], a factory that has been casting, engraving and plating awards since 2006. The site had run on WordPress since June 2022. The remake had shipped SEO metadata, structured data, robots and a sitemap on day one, on top of Prisma and Postgres."
		},
		{
			kind: 'p',
			text: 'This was not my day job. In January 2026 I was six months into a full-time role at [[company:jasmine-technology-solution]], and the catalog rebuild happened around it. That matters to the story only because it set the budget: the amount of friction I could absorb per change was small, and anything that made a schema edit expensive got noticed fast.'
		},
		{ kind: 'h2', text: 'Why Prisma and Postgres were there on day one' },
		{
			kind: 'p',
			text: 'I did not agonise over the choice on 4 December, and that is the first honest thing to say. Prisma with Postgres was my default. It gives a typed client generated from the schema, migrations with a history you can read, and a modelling language that makes you state relationships out loud. For a product catalog — products, categories, images — the relational fit looks obvious on a whiteboard.'
		},
		{
			kind: 'p',
			text: 'It stayed obvious for about a month. Then the parts of the project that were not the database started moving, and the schema had to move with them.'
		},
		{ kind: 'h2', text: 'The schema would not hold still' },
		{
			kind: 'p',
			text: 'A plaque catalog is not a uniform set of rows. An acrylic award, a wooden plaque and a crystal piece do not share an attribute set — some have a base, some have an engraving plate, some have a size chart with three variants and some have one. In a relational schema you pick a lane early: a wide table with a lot of nullable columns, a set of joined attribute tables, or a JSON column that quietly admits the first two were wrong.'
		},
		{
			kind: 'code',
			lang: 'prisma',
			caption:
				'Illustrative — the shape the model kept drifting toward. Nullable columns for attributes only some products have.',
			code: 'model Product {\n\tid          String  @id @default(cuid())\n\tslug        String  @unique\n\tnameTh      String\n\tnameEn      String\n\tbaseType    String? // only wooden plaques\n\tplateWidth  Int?    // only engraved pieces\n\tcrystalGrade String? // only crystal\n\tspecs       Json?   // where the honesty went to hide\n}'
		},
		{
			kind: 'p',
			text: 'Two days after the migration, on 30 January, the project adopted a new design system and localized the UI to Thai. That work was already in motion in January, and it doubled the number of fields that were text: every label the design needed became a pair. None of that is hard in Postgres. All of it is a migration, and I was writing migrations against a content model I could not yet describe accurately.'
		},
		{
			kind: 'callout',
			tone: 'info',
			title: 'The distinction that decided it',
			text: 'Migrations are a feature when the schema is settled and the data is precious. They are a tax when the schema is a hypothesis and the data is a catalog you can regenerate from source files. rs-award was firmly in the second category, and I had picked tooling built for the first.'
		},
		{ kind: 'h2', text: 'What the site actually needed from a database' },
		{
			kind: 'p',
			text: 'The clarifying question was not "which database is better" but "what does this application ask of storage". rs-award is a showcase. It has no cart, no orders, no checkout, no concurrent writers, and no transaction that spans two tables. It reads a catalog, renders pages, and gets crawled. Every write comes from me.'
		},
		{
			kind: 'p',
			text: 'Read that list back and the relational guarantees I was paying for — constraints across tables, transactional integrity, joins — were not being used. Two weeks later, on 10 February, the catalog shipped with product pages and client-side search, which means the whole browsable set gets handed to the browser anyway. That is the shape the January decision was pointing at, even though I would be overstating my foresight to claim I had it fully worked out on the day.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the same product as a document. Variable attributes stop being nullable columns.',
			code: "{\n\tslug: 'crystal-award-c12',\n\tname: { th: '...', en: 'Crystal Award C12' },\n\tcategory: 'crystal',\n\tattributes: { grade: 'A', heightMm: 220 }, // whatever this product has\n\tvariants: [{ sku: 'C12-S', heightMm: 180 }, { sku: 'C12-L', heightMm: 260 }]\n}"
		},
		{
			kind: 'p',
			text: 'The migration itself was small, and I want to be clear that this is a fact about the project rather than about [MongoDB](https://www.prisma.io/docs/orm/overview/databases/mongodb). There were no foreign keys to unpick, no live traffic to cut over, no production data to preserve — the catalog is authored content. Swapping the storage layer on a read-mostly site with a single writer is a different exercise from swapping it under a running business, and nothing I learned that day transfers to the second case.'
		},
		{
			kind: 'stat',
			value: '55 days',
			label: 'from the Next.js remake kickoff on 4 December 2025 to tearing out Prisma and Postgres on 28 January 2026',
			source: 'rs-award.com project timeline'
		},
		{ kind: 'h2', text: 'The case against the switch' },
		{
			kind: 'p',
			text: 'Postgres was not failing. It had never been under load, never been near a limit, never lost a row. I ran it for eight weeks on a catalog small enough that either database would have been irrelevant to performance, so I have no operational evidence for the change at all — only ergonomics, and ergonomics is the argument people reach for when the real reason is that they changed their mind.'
		},
		{
			kind: 'p',
			text: 'I also gave up things I liked. Prisma generates a client from the schema, so queries were type-checked against the model and a bad field name failed at compile time. Migration files gave the schema a readable history. Losing both meant the shape of a document now lives in application code and in my head, and keeping those two in agreement is a discipline rather than a guarantee. If I had understood the content model on 4 December, the correct decision would have been to model it properly in Postgres and never write this post.'
		},
		{
			kind: 'p',
			text: 'The defence is narrower than the change looks. I did not conclude that document stores beat relational ones. I concluded that I had chosen storage by habit, that the habit was tuned for applications with transactions and multiple writers, and that this site had neither. The migration cost a day. Continuing to write migrations against a schema I did not believe in would have cost more than that, spread thinly enough that I would never have noticed paying it.'
		}
	],
	lessons: [
		'Pick storage from what the application asks of it, not from what I reach for by default. rs-award had no transactions, no concurrent writers and no cross-table integrity to protect, and I still spent eight weeks paying for all three.',
		'Migrations are a feature when the schema is settled and a tax when it is a hypothesis. Mid-build, on authored content I can regenerate, that tax is the wrong one to pay.',
		'I lost the typed client and the migration history, and those were real. Document flexibility moves the schema into application code and into my discipline, which is weaker than a compiler.',
		'This migration was easy because the data was authored and the traffic was zero. I should not generalise from it to any system with real users, and I have tried not to.'
	],
	faqs: [
		{
			q: 'When should you switch from Postgres to MongoDB mid-project?',
			a: 'When the application is not using what relational storage is for. If there are no multi-table transactions, no concurrent writers and no cross-table integrity constraints, and the schema is still changing weekly, the migration cost is low and the friction saved is real. If any of those exist, fix the model in Postgres instead.'
		},
		{
			q: 'Is MongoDB a good fit for a product catalog?',
			a: 'It fits catalogs where products have genuinely different attribute sets — a wooden plaque and a crystal award do not share fields — because a document holds only what that product has. A relational model handles the same thing with nullable columns, attribute tables or a JSON escape hatch. For a read-mostly showcase with one author, the document version stayed simpler.'
		},
		{
			q: 'What do you lose by dropping Prisma?',
			a: 'The generated, type-checked client and the readable migration history. With Prisma a wrong field name fails at compile time; without it, the document shape lives in application code and stays correct by discipline rather than by the compiler. That is a real regression and worth naming before you make the trade.'
		},
		{
			q: 'How hard is a Prisma/Postgres to MongoDB migration?',
			a: 'It depends almost entirely on the data, not the databases. Mine took a day because the catalog was authored content with no live traffic, no foreign keys to unpick and a single writer. Under a running system with production data and real users it is a different exercise, and nothing about the easy version transfers.'
		},
		{
			q: 'Why not just use a JSON column in Postgres?',
			a: 'That is the honest alternative and it works. A JSONB column gives variable attributes inside a relational database, keeping migrations, constraints and joins for the parts that are uniform. I did not take it because the rest of the model — no transactions, no concurrent writers — meant I was keeping the relational machinery for one feature.'
		}
	]
}
