import type { PostDef } from '../../../interfaces'

/** Sources: common/data/projects.ts (rsAward timeline; rsMedal, rsTrophy), common/data/experiences.ts (part-time role, Thammasat), common/data/entities.ts (ruamsukPlating). */
export const firstClientWorkWasWordpress: PostDef = {
	id: 'first-client-work-was-wordpress',
	title: 'My first client work was WordPress, and that was the right call',
	happenedAt: '2022-03-01',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'student',
	category: 'engineering',
	description:
		"Seven months into my CS degree, I built my family's award-catalog site on WordPress instead of custom code. Why the boring choice was the right one.",
	tldr: "My first client build — a plaque-and-award catalog for my family's trophy factory — shipped on **WordPress** in three months in 2022, solo and part-time. Custom code would have shipped later and served the business worse. The stack was a bridge, and it held for almost four years before the Next.js remake.",
	faqs: [
		{
			q: 'Is WordPress a good choice for a first client website?',
			a: 'It was for mine. In 2022 I was a first-year CS student building solo and part-time, and the client needed a catalog site with editable content, Thai-language SEO, and ad landing pages — not a custom application. WordPress shipped that in three months. A custom build would have shipped later and served the business worse.'
		},
		{
			q: 'Should a small manufacturer use WordPress or a custom-coded site for a product catalog?',
			a: 'Start from who maintains it. A catalog of pages, photos, SEO copy, and ad landing pages fits a CMS well, and a solo part-time maintainer fits it even better. Custom code starts paying off when the requirements outgrow themes and plugins — localization, structured data, performance — which is why this site was eventually remade in Next.js.'
		},
		{
			q: 'How long did the WordPress build of rs-award.com take?',
			a: 'Three months, part-time: scoping and setup in March 2022, a brand-aligned showcase theme in April, the catalog and CMS content in May, and a June go-live with on-page SEO, analytics, and ad tracking wired in.'
		},
		{
			q: 'How long did the WordPress version of the site last?',
			a: 'It went live in June 2022 and served the plaque and award catalog until December 2025, when a ground-up Next.js remake with structured data and Thai localization began replacing it — about three and a half years in production.'
		}
	],
	body: [
		{
			kind: 'p',
			text: "March 2022. Seven months earlier I had started two things in the same month: a Computer Science degree at [[career:thammasat-bs-cs]] and a part-time developer job at my family's trophy factory, which had been making and plating awards in Pathum Thani since 2006. The factory wanted a proper site for its plaque and award line. That build became [[project:rs-award]] — my first real client project, even though the client shared my last name."
		},
		{
			kind: 'p',
			text: 'I was a first-year student who wanted to write code, and I chose not to. I picked WordPress — hosting, a theme, [a plugin stack](https://developer.wordpress.org/plugins/hooks/) — and I have spent time since then deciding whether that was a cop-out. It was not. It was the right call, and I want to be precise about why, because the honest reasons are less flattering than "the best tool for the job".'
		},
		{ kind: 'h2', text: 'Why WordPress, when I was studying to write code' },
		{
			kind: 'p',
			text: 'The honest inventory of March 2022: one developer, working [[career:ruamsuk-software-engineer-part-time]] hours around a full course load, inside a business that had been selling awards for sixteen years and still ran most of its workflows manually. Nobody was waiting on an application. The business needed a catalog it could sell against — pages, photos, Thai-language copy, and search visibility. Written as requirements, the job looked like this:'
		},
		{
			kind: 'list',
			items: [
				'A browsable catalog of plaques, shields, and award products',
				'Content pages the business could update without a code deploy',
				'Thai-language copy with on-page SEO that could rank for real buyer searches',
				'Landing pages for Google Ads campaigns to point at',
				'A stack one part-time student could stand up, run, and not break during exam weeks'
			]
		},
		{
			kind: 'p',
			text: "Nothing on that list is an application. There is no login, no checkout, no data model worth owning. In 2022 I could have turned it into one anyway — spent months learning a JavaScript framework, a deployment pipeline, and a CMS integration on the company's time — and delivered a worse catalog, later. WordPress collapsed almost all of it into configuration plus a theme."
		},
		{ kind: 'h2', text: 'Three months, four milestones' },
		{
			kind: 'p',
			text: "The build ran on a monthly cadence, because that is what part-time hours allow. March was discovery and setup: hosting, the theme base, and the plugin stack. April was design — a showcase theme aligned to the factory's brand, and the site structure. May was the build-out: the award catalog, the content pages, and the CMS workflows for keeping them current. June was launch, with on-page SEO, analytics, and ad tracking wired in from day one. That launch scope was deliberate: the site's whole job was to be found. A catalog nobody searches for is a brochure, so the go-live checklist was more marketing than engineering — titles and descriptions that matched how Thai buyers actually search for plaques, analytics to prove whether any of it worked, and tracking so the ad spend could be judged instead of guessed at."
		},
		{
			kind: 'stat',
			value: '3 months',
			label: 'from scoping rs-award.com to go-live — solo, part-time, around a full course load',
			source: 'RS Award project timeline'
		},
		{
			kind: 'code',
			lang: 'php',
			code: '// child-theme/functions.php — customize here, never in the parent\nadd_action("wp_enqueue_scripts", function () {\n\twp_enqueue_style(\n\t\t"parent-style",\n\t\tget_template_directory_uri() . "/style.css"\n\t);\n});',
			caption:
				"Illustrative — the child-theme pattern: load the parent's styles, keep every override in your own layer."
		},
		{
			kind: 'p',
			text: 'The discipline that mattered most was barely code at all: keep every customization in a child theme and treat the parent theme and the plugins as replaceable vendor parts, so updates stay boring. Most of what I actually shipped was closer to information architecture than engineering — deciding how a customer asks for a plaque, and making the catalog answer in those terms.'
		},
		{ kind: 'h2', text: 'The part that felt like a step backward' },
		{
			kind: 'p',
			text: 'I want to argue against my own title for a moment, because the costs were real. WordPress taught me very little of what my degree was busy teaching — I assembled more than I engineered. The stack had a performance ceiling I could feel and a plugin surface I did not fully control. And the endgame was already written: every WordPress build I shipped for the company was eventually replaced. This one lasted until December 2025, when I began remaking it ground-up in [[skill:next-js]] with structured data and Thai localization, and retired WordPress from the project entirely.'
		},
		{
			kind: 'p',
			text: 'But the fair comparison is not WordPress versus the remake. The remake was built by someone with years of shipped storefronts behind him. The March 2022 version of me did not exist yet as an engineer — he existed as a student with a factory that needed a website. WordPress versus what I could actually build then was not a close contest.'
		},
		{ kind: 'h2', text: 'What the boring stack bought' },
		{
			kind: 'p',
			text: 'It held. The WordPress build carried rs-award.com from the March 2022 start until the remake began — about three years and nine months — and the playbook proved repeatable: [[project:rs-medal]] followed on the same foundation five months later, and a WooCommerce storefront for the trophy line came in 2023. Three storefronts, one boring recipe.'
		},
		{
			kind: 'p',
			text: 'It also taught the layer that outlived it. On-page [[skill:seo]], analytics, and Google Ads were learned against real Thai search traffic, on sites whose rankings the business felt directly. The frameworks I use changed completely between 2022 and now. The SEO work transferred untouched. And the site was never really the point on its own — it was the first visible piece of a longer job, moving a business that had run manually for sixteen years onto web-based systems, one workflow at a time. A catalog the factory could update itself was a small step in that direction, but it was the first one that customers could see.'
		},
		{
			kind: 'p',
			text: "Right call never meant best stack. It meant the stack whose failure modes matched my situation: limited hours, a real business waiting, and a first-year student's skills. I have made fancier technology decisions since. Few of them were as correct."
		}
	],
	lessons: [
		'Match the tool to the operator I was, not the operator I wanted to become. One part-time student was the real constraint, and the stack had to survive my exam weeks.',
		'Embarrassment is not a cost; shipping late is. No customer who bought a plaque ever asked what the site ran on.',
		'Treat a CMS build as a bridge and keep customizations in replaceable layers. This one was always temporary — and it still held for almost four years before the Next.js remake.',
		'Learn the durable layer on top of the disposable one. The SEO and ads practice outlived the stack it was practiced on.'
	],
	skills: ['wordpress', 'seo', 'google-ads'],
	relatedProjectIds: ['rs-award', 'rs-medal', 'rs-trophy'],
	relatedExperienceIds: ['ruamsuk-software-engineer-part-time', 'thammasat-bs-cs'],
	relatedEntityIds: ['ruamsuk-plating'],
	sources: [
		{ title: 'WordPress Plugin Handbook — Hooks', url: 'https://developer.wordpress.org/plugins/hooks/' },
		{ title: 'RS Award — the live site this post is about', url: 'https://www.rs-award.com' }
	]
}
