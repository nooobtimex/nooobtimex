import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (qrFood def, description + the 2023-08-01 inception and 2024-03-15 Phase 1 milestones), common/data/experiences.ts (thammasat-bs-cs), common/data/skills.ts (prisma, postgresql, supabase). */
export const multiBranchRestaurantSchemaInPrisma: PostDef = {
	id: 'multi-branch-restaurant-schema-in-prisma',
	title: 'Designing a multi-branch restaurant schema in Prisma',
	happenedAt: '2024-03-15',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'student',
	category: 'engineering',
	description:
		'Modelling multiple restaurant locations in Prisma for my 2024 senior thesis: one branch root, composite keys, and the cost of designing for two.',
	tldr: 'By 15 March 2024 the first working version of [[project:qr-food]] ran on a [[skill:prisma]] schema I had designed seven months earlier, before a single screen existed. Every table, menu section, add-on and staff role hung off one `branchId`, so a second restaurant location was a row rather than a migration. The cost was real and I underrated it: for most of the build there was one branch, and every query carried a filter that protected nothing yet.',
	skills: ['prisma', 'postgresql', 'supabase', 'nuxt-js'],
	relatedProjectIds: ['qr-food'],
	relatedExperienceIds: ['thammasat-bs-cs'],
	body: [
		{
			kind: 'p',
			text: "On 15 March 2024 the first phase of my senior thesis actually worked. [[project:qr-food]] had table QR scanning, live menu rendering, staff authentication, order management and a sales dashboard — a Nuxt 3 application sitting on PostgreSQL. I was in my third year at [[career:thammasat-bs-cs]], still working part-time as a developer at [[company:ruamsuk-plating]], my family's trophy factory in Pathum Thani, and building this one alone in the gaps."
		},
		{
			kind: 'p',
			text: 'None of the multi-branch screens existed yet. The admin console for managing several locations did not land until August. But the schema underneath had been multi-branch since the first month of the project, in August 2023, when the only artifacts were written objectives and a [[skill:prisma]] file. That is the decision this post is about — not the console, the keys.'
		},
		{ kind: 'h2', text: 'One root, and everything hangs off it' },
		{
			kind: 'p',
			text: 'A restaurant chain is a tenancy problem wearing an apron. Two locations of the same brand share a name, a look and often a menu, and share almost nothing else: their tables are different physical objects, their staff are different people, their orders must never mix, and their sales figures are the entire reason an owner logs in. So the first question was not which tables to create but where the boundary between locations lives.'
		},
		{
			kind: 'p',
			text: 'I put it in a column. Every row that belongs to a location carries a `branchId` [foreign key](https://www.prisma.io/docs/orm/data-modeling/relational-databases) back to a `Branch`, and `Branch` is the only node in the graph with no parent above the restaurant itself. One database, one schema, one row-scoped boundary.'
		},
		{
			kind: 'code',
			lang: 'prisma',
			caption: 'Illustrative — the branch root as I scoped it. The real schema lives in the private QR-Food repo.',
			code: 'model Branch {\n\tid       String        @id @default(cuid())\n\tname     String\n\ttables   Table[]\n\tsections MenuSection[]\n\tmembers  BranchMember[]\n\torders   Order[]\n}'
		},
		{
			kind: 'p',
			text: 'The immediate consequence is that uniqueness is never global. Table 5 exists in every branch and always will, so a unique constraint on the table number is wrong; the constraint that means something is the pair. The same applies to a menu section named Drinks, or a staff role. Every natural key in the system is a composite key with the branch in it, and writing them that way early is what stops a second location from arriving as a migration and a week of repair.'
		},
		{
			kind: 'callout',
			tone: 'danger',
			title: 'The failure mode of a column boundary',
			text: 'Row-level tenancy has exactly one catastrophic bug: a query that forgets its `where` clause. Nothing in the database stops branch A from reading branch B — only the discipline of never writing an unscoped read. That is a real, permanent tax on a shared-schema design, and it is the honest counterargument to the convenience I was buying.'
		},
		{ kind: 'h2', text: 'Roles belong to a branch, not to a person' },
		{
			kind: 'p',
			text: 'The console I eventually built lets an owner configure staff roles per location, owner or staff. Modelling that as a `role` field on the user is the version that feels obvious and breaks on the first real chain, because the same human is an owner at one branch and a helper at another during a busy week. The membership is the thing that carries the role, not the account.'
		},
		{
			kind: 'code',
			lang: 'prisma',
			caption: 'Illustrative — membership carries the role, so one account can hold different roles per location.',
			code: 'model BranchMember {\n\tuserId   String\n\tbranchId String\n\trole     Role   // OWNER | STAFF\n\tuser     User   @relation(fields: [userId], references: [id])\n\tbranch   Branch @relation(fields: [branchId], references: [id])\n\n\t@@id([userId, branchId])\n}'
		},
		{
			kind: 'p',
			text: 'This is also what makes authorization a lookup instead of a policy engine. Every staff-facing endpoint answers the same question — does this account hold a membership in this branch, and is the role sufficient — and that question is one indexed read on a composite primary key. Thirty-something endpoints later, none of them needed anything cleverer.'
		},
		{ kind: 'h2', text: 'The three ways to draw the boundary' },
		{
			kind: 'p',
			text: 'I considered the usual alternatives before settling. They are not ranked; they trade the same difficulty against different surfaces.'
		},
		{
			kind: 'table',
			head: ['Boundary', 'What it buys', 'What it costs'],
			rows: [
				[
					'Database per branch',
					'Isolation you cannot forget to apply',
					'Migrations times N, and cross-branch reporting becomes a separate problem'
				],
				[
					'Schema per branch',
					'Strong separation, one server',
					'Connection and migration complexity a solo student does not want to own'
				],
				['`branchId` column', 'One migration, trivial cross-branch queries', 'Every read must scope itself, forever']
			]
		},
		{
			kind: 'p',
			text: 'The deciding feature was the owner dashboard. The whole point of the admin console is looking at several locations at once — sales across branches, which items move where. Under a database-per-branch design that view is an application-level join across connections; under a `branchId` column it is a `GROUP BY`. When your most valuable screen is the cross-tenant one, do not pick the boundary that makes cross-tenant expensive.'
		},
		{ kind: 'h2', text: 'Arguing against myself: I designed for a chain I did not have' },
		{
			kind: 'p',
			text: 'Here is the part I would push back on if someone showed me this schema today. In August 2023 I wrote multi-branch keys into a thesis project with no client, no production users and no second location anywhere on the horizon. That is speculative generality — building the abstraction before the requirement shows up — and it is normally the wrong call. Every query I wrote through the spring carried a filter for a scenario that did not exist yet.'
		},
		{
			kind: 'stat',
			value: '7 months',
			label: 'between the Prisma schema in August 2023 and the first working screens on 15 March 2024',
			source: 'QR Food project timeline'
		},
		{
			kind: 'p',
			text: 'What makes me keep defending it is the asymmetry, not the elegance. Adding a `branchId` to an eight-table schema afterwards is not one migration; it is a backfill, a new unique constraint on every natural key, and an audit of every query in the codebase to find the reads that were silently global. Doing it up front cost me a keystroke per query and about a day of thinking. Structural decisions that are cheap now and expensive later deserve the benefit of the doubt — and I would still not extend that benefit to a feature, only to a key. The order of work is what actually paid: three separate front-ends, customer, staff and owner, inherited one definition of a branch, a table and an order, so when Phase 2 added the multi-branch console in August 2024 it was screens over a shape that already existed.'
		}
	],
	lessons: [
		'Put the tenant key in the schema before the tenancy exists, but only the key. Retrofitting `branchId` means a backfill plus an audit of every read in the codebase; retrofitting a screen means writing a screen.',
		'Let the most valuable query pick the boundary. My highest-value view was the cross-branch owner dashboard, which is a `GROUP BY` under a column boundary and a distributed join under any other — that decided it more than any isolation argument.',
		'Roles belong on the membership, not the account. Modelling one branch per user would have been simpler for months and wrong the first time a person worked two locations.',
		'Row-level tenancy makes correctness a habit rather than a constraint, and I should have compensated for that. A shared query helper that could not be called without a branch would have cost an hour and removed the whole class of unscoped reads.'
	],
	faqs: [
		{
			q: 'How do you model multiple restaurant branches in a Prisma schema?',
			a: 'Make a `Branch` model the root of ownership and give every location-owned row a `branchId` foreign key back to it — tables, menu sections, add-ons, staff memberships and orders. Then make every natural key composite, so a table number or a section name is unique per branch rather than globally. That keeps a second location as a row instead of a migration.'
		},
		{
			q: 'Should each restaurant branch get its own database?',
			a: 'Only if isolation matters more than reporting. A database per tenant gives you separation you cannot forget to apply, but it multiplies migrations and turns any cross-branch view into an application-level join. For an owner dashboard that compares locations, a shared schema with a `branchId` column keeps that view a single grouped query, which is why I chose it for my thesis.'
		},
		{
			q: 'What is the main risk of row-level multi-tenancy?',
			a: "A query that forgets to filter by tenant. Nothing in the database prevents one branch from reading another's orders — the boundary exists only in the code that writes the `where` clause. The mitigation is structural rather than moral: route reads through a helper that cannot be called without a branch id, so an unscoped query is impossible to write by accident."
		},
		{
			q: 'Where should a staff role live in a multi-branch schema?',
			a: 'On the membership joining a user to a branch, not on the user record. The same person can be an owner at one location and ordinary staff at another, so a single `role` column on the account cannot express reality. A join model with a composite primary key of user and branch also makes every authorization check one indexed read.'
		},
		{
			q: 'Is it premature to design for multiple tenants before you have them?',
			a: 'For features, usually yes. For keys, usually no — the two are not the same decision. Adding a tenant column later means backfilling data, adding unique constraints across the schema and auditing every existing query for silently global reads, while adding it up front costs one field and one filter per query. Design the key early, build the tenant-facing screens when someone asks.'
		}
	],
	sources: [
		{
			title: 'Prisma ORM — Data modeling',
			url: 'https://www.prisma.io/docs/orm/data-modeling'
		},
		{
			title: 'Prisma ORM — Relations in relational databases',
			url: 'https://www.prisma.io/docs/orm/data-modeling/relational-databases'
		}
	]
}
