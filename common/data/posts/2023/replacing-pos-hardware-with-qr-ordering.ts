import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (qrFood def + timeline), common/data/experiences.ts (thammasat-bs-cs, ruamsuk-software-engineer-part-time), common/data/entities.ts (ruamsukPlating, thammasatUniversity), commits 8f36e6c and 3047806. */
export const replacingPosHardwareWithQrOrdering: PostDef = {
	id: 'replacing-pos-hardware-with-qr-ordering',
	title: 'Replacing restaurant POS hardware with QR ordering: scoping a senior thesis',
	happenedAt: '2023-08-01',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'student',
	category: 'engineering',
	description:
		'Scoping my Thammasat senior thesis in August 2023: replacing restaurant POS hardware with QR ordering — three surfaces, a Prisma schema, a Nuxt 3 bet.',
	tldr: 'In August 2023 I scoped my senior thesis at Thammasat: **QR Food**, a full-stack system replacing expensive restaurant POS hardware with QR-code ordering on the customer’s own phone. The first month produced objectives and a Prisma schema on PostgreSQL (Supabase) — no screens — plus a deliberate bet on Nuxt 3, still the only non-React project in my portfolio. Sixteen months later I defended a 38-endpoint system covering table ordering, kitchen workflow, and multi-branch management.',
	skills: ['nuxt-js', 'vue', 'prisma', 'postgresql', 'supabase'],
	relatedProjectIds: ['qr-food'],
	relatedExperienceIds: ['thammasat-bs-cs'],
	body: [
		{
			kind: 'p',
			text: 'In August 2023 I started the final long project of my Computer Science degree at [[career:thammasat-bs-cs]]. My weeks were already split in two: classes at Thammasat’s Rangsit campus, and part-time development work at [[company:ruamsuk-plating]] — my family’s trophy business in Pathum Thani, running since 2006. The degree and the part-time job had started in the same month of 2021, so by the time the senior thesis needed a topic I had two years of shipping real software alongside the coursework, and no interest in defending a paper. I wanted to defend a working system.'
		},
		{
			kind: 'p',
			text: 'The topic fit in one sentence: replace expensive restaurant POS hardware with QR-code ordering. A point-of-sale setup — terminals, handheld order pads, the licensed software tied to them — is real capital cost for a small restaurant. Meanwhile every customer walks in carrying a capable computer. If a QR code on the table can turn that phone into the order terminal, most of the dedicated hardware stops being necessary. That sentence became [[project:qr-food]], the system I defended at the end of 2024.'
		},
		{ kind: 'h2', text: 'What “replace the POS” had to mean in scope' },
		{
			kind: 'p',
			text: 'A POS terminal is not one feature; it is the meeting point of three different jobs. So the honest version of the objective was not one app but three surfaces, and I scoped all of them up front:'
		},
		{
			kind: 'list',
			items: [
				'**Customer table ordering** — scan a table-specific QR code, browse the live menu, customize dishes with add-ons, build a real-time cart, place the order, call staff, and watch the bill update.',
				'**Staff and kitchen portal** — take orders directly at the table, manage the order queue, track preparation statuses, and close a table out with a printed bill.',
				'**Multi-branch admin console** — manage branches, configure owner and staff roles, toggle menu items per branch, edit food sections and add-on options, and read real-time sales statistics.'
			]
		},
		{
			kind: 'p',
			text: 'For a solo thesis, that is arguably over-scoped. A single customer ordering flow would have satisfied the degree requirement, demoed cleanly, and left my evenings alone. I kept all three surfaces anyway, because the claim I wanted to defend was about the whole restaurant: an ordering page without a kitchen view does not replace anything — it just adds one more screen for staff to ignore.'
		},
		{ kind: 'h2', text: 'August was a database month' },
		{
			kind: 'p',
			text: 'The inception milestone produced exactly two artifacts: written objectives, and [a database schema](https://www.prisma.io/docs/orm/data-modeling) — designed in [[skill:prisma]] against PostgreSQL on [[skill:supabase]]. No screens, no framework code. That ordering was deliberate. Everything the system promises is relational: branches own tables and menus, menu items own add-ons, orders join a table to items and to the staff member who closes them, and roles gate who can touch what. Get those keys wrong and every surface built on top inherits the mistake.'
		},
		{
			kind: 'code',
			lang: 'prisma',
			caption:
				'Illustrative — the branch-and-table core of the schema scoped in August 2023. The real schema lives in the private QR-Food repo.',
			code: 'model Table {\n\tid       String  @id @default(cuid())\n\tnumber   Int\n\tqrToken  String  @unique // what the printed QR encodes\n\tbranchId String\n\tbranch   Branch  @relation(fields: [branchId], references: [id])\n\torders   Order[]\n\n\t@@unique([branchId, number])\n}'
		},
		{
			kind: 'p',
			text: 'The one modeling decision I still think about is what the QR code actually is. It is not a link to a menu; it is identity. Each printed code carries a token that resolves to one branch and one table, and the entire customer session — the cart, the call-staff button, the live bill — hangs off that row. Once the QR is identity, features stop being special cases and become queries.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — every customer session starts by resolving the token the table QR carries.',
			code: 'const table = await prisma.table.findUnique({\n\twhere: { qrToken },\n\tinclude: { branch: true }\n})\n// One token -> one branch, one table. The cart, the\n// call-staff button and the live bill all hang off this row.'
		},
		{ kind: 'h2', text: 'Arguing against my own stack' },
		{
			kind: 'p',
			text: 'I planned the build on [[skill:nuxt-js]] 3 and Vue 3 with Tailwind CSS, Docker for containers, and Vercel to host. It is, to this day, the only project in my portfolio not built on React.'
		},
		{
			kind: 'p',
			text: 'The defensible argument for that bet: a senior thesis is the rare project with no client and no production users, which makes it the cheapest possible place to learn a second ecosystem properly — the only stakeholder is a grading committee. The argument against it was just as real: I gave up every component, habit, and debugging reflex I had built, on the one project whose demo would be graded. A framework I was still learning made every feature slower, and slower features against a fixed defense date is a genuine risk, not a personality trait. I would make the bet again — but only because the project was low-stakes by construction, not because the cost was small.'
		},
		{ kind: 'h2', text: 'What “replacing the hardware” honestly delivers' },
		{
			kind: 'p',
			text: 'The thesis title promised elimination. The scope I actually wrote down promised something more modest, and I think more true: QR ordering removes the dedicated order-taking hardware and shrinks what remains to commodity devices. Staff and kitchen views run in a browser on whatever the restaurant already owns. A cash drawer, and whatever a tax authority expects on paper, are outside a web app’s reach.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The printer survived my own scope',
			text: 'Even in my own scope, the staff portal closes a table “with bill printing”. The one piece of hardware my thesis set out to eliminate that made it straight back in was the printer. Worth being honest about: the realistic claim is a smaller, cheaper POS — not zero hardware.'
		},
		{
			kind: 'stat',
			value: '38',
			label: 'endpoints in the system I presented at the final thesis defense, 24 December 2024',
			source: 'QR Food project timeline'
		},
		{
			kind: 'p',
			text: 'August 2023 itself shipped nothing a customer could touch: objectives and a schema. The Nuxt application — table QR scanning, live menus, staff authentication, order management, a sales dashboard — landed in early 2024; multi-branch management and real-time call-staff alerts followed that August; and on 24 December 2024 I defended the finished system at Thammasat. The repository is private and the project is archived now, but nearly everything that made the defense work was decided in that first month, in a schema file, before a single screen existed.'
		}
	],
	lessons: [
		'Schema first was the right order for a relational product. Spending the first month on objectives and a Prisma schema before any UI meant three separate front-ends never disagreed about what a table, an order, or a branch meant.',
		'I would still over-scope it — but knowingly. Three surfaces made the thesis a system instead of a demo; if I had to cut, I would drop the admin analytics before the staff portal, because the claim lives or dies in the kitchen.',
		'A low-stakes project is the only right place to bet on a new ecosystem. Learning Vue and Nuxt cost me speed exactly where speed was cheap; I would not have made the same bet on a client project.',
		'“Replace the hardware” was a better thesis title than an engineering claim. What the system honestly delivers is a POS shrunk to commodity devices — the printer never left.'
	],
	faqs: [
		{
			q: 'Can QR-code ordering fully replace a restaurant POS system?',
			a: 'Mostly, but not entirely. QR ordering on the customer’s phone removes dedicated order-taking terminals and handheld pads, and staff or kitchen views can run in a browser on hardware the restaurant already owns. Receipt printing, cash handling, and anything a tax authority requires on paper still need a physical device, so the honest goal is shrinking the POS to commodity hardware rather than eliminating it.'
		},
		{
			q: 'What should the QR code on a restaurant table actually encode?',
			a: 'Identity, not content. Each table’s code should carry a unique token that resolves to one branch and one table in the database, so the menu, the cart, call-staff requests, and the live bill all attach to that session. A QR that merely links to a static menu cannot support ordering, because the system never learns where the order came from.'
		},
		{
			q: 'Why design the database schema before the UI in a food-ordering app?',
			a: 'Because everything in a multi-branch ordering system is relational: branches own tables and menus, items own add-ons, and orders join tables to items to the staff who close them. Mistakes in those keys propagate into every screen built on top. In QR Food I spent the first month on a Prisma schema over PostgreSQL before writing any interface code, and the three separate front-ends never disagreed about what an order was.'
		},
		{
			q: 'Is Nuxt 3 a good choice for a QR ordering web app?',
			a: 'It carried QR Food from scoping in 2023 to a 38-endpoint system defended in late 2024, so it is certainly sufficient. Server-rendered pages suit the use case, since the customer flow has to load fast on any phone straight from a QR scan. But the framework mattered less than the schema — I chose Nuxt 3 mainly to learn a second ecosystem on a low-stakes project, and accepted slower delivery as the price.'
		},
		{
			q: 'What was the QR Food senior thesis project?',
			a: 'QR Food was my senior thesis at Thammasat University: a full-stack QR-code ordering and multi-branch restaurant management web application, built solo with Nuxt 3, Vue 3, Prisma, and PostgreSQL on Supabase. Customers scan a table QR to order and call staff, staff manage queues and close tables, and owners manage branches and sales statistics. I scoped it in August 2023 and defended it in December 2024.'
		}
	],
	sources: [
		{
			title: 'Nuxt — Introduction',
			url: 'https://nuxt.com/docs/getting-started/introduction'
		},
		{
			title: 'Prisma ORM — Data modeling',
			url: 'https://www.prisma.io/docs/orm/data-modeling'
		}
	]
}
