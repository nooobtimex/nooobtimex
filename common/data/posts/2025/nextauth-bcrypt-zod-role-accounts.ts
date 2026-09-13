import type { PostDef } from '../../../interfaces'

/** Sources: the flood-project entry + its 2025-02-07 and 2025-02-13 milestones in common/data/projects.ts, the freelance role in common/data/experiences.ts, skill descriptions in common/data/skills.ts. */
export const nextauthBcryptZodRoleAccounts: PostDef = {
	id: 'nextauth-bcrypt-zod-role-accounts',
	title: 'Role-based accounts with NextAuth, bcrypt and Zod — the whole flow',
	happenedAt: '2025-02-07',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'nextjs',
	description:
		"Day two of a 13-day freelance build: NextAuth credentials with bcrypt, one Zod schema validated on both sides, and where a user's role actually lives.",
	tldr: "NextAuth's Credentials provider gives you a session and nothing else — the user lookup, the `bcrypt.compare`, and the decision to return a user or `null` are all code you write yourself. I shipped it on day two of a 13-day freelance build with one [[skill:zod]] schema used twice, on the client through [[skill:react-hook-form]] for the error messages and again on the server as the actual trust boundary. The harder half was not hashing passwords; it was deciding where a user's **role** lives once someone can change it from an admin screen.",
	skills: ['nextauth', 'zod', 'react-hook-form', 'next-js', 'prisma'],
	relatedProjectIds: ['flood-project'],
	relatedExperienceIds: ['freelance'],
	body: [
		{
			kind: 'p',
			text: "On 6 February 2025 I scaffolded a flood and water-level monitoring dashboard for a freelance client — [[project:flood-project]], a [[career:freelance]] build with a fortnight-shaped window. On the 7th, day two, I built the account system. The whole thirteen days ran alongside the final semester of my Computer Science degree and my part-time engineering job at my family's trophy factory, which is a scheduling story of its own."
		},
		{
			kind: 'p',
			text: "The product had two kinds of human in it: operators who watch station gauges, and someone above them who decides who gets to be an operator. That is not a Google-sign-in audience. These are named staff accounts issued by an organisation, so [[skill:nextauth]]'s Credentials provider was the right shape — and Credentials is the one provider NextAuth hands you mostly empty."
		},
		{ kind: 'h2', text: 'Credentials is the provider you write yourself' },
		{
			kind: 'p',
			text: 'With an OAuth provider, [NextAuth](https://next-auth.js.org/configuration/options) owns the handshake. With Credentials it owns the session cookie and the callback plumbing, and everything inside `authorize()` is yours: parse the input, find the user, compare the hash, return a user object or `null`. There is no framework opinion in there at all, which is exactly why it is worth writing carefully once.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the shape of a Credentials authorize(), not the client project file.',
			code: 'async authorize(raw) {\n\tconst parsed = signInSchema.safeParse(raw)\n\tif (!parsed.success) return null\n\n\tconst { email, password } = parsed.data\n\tconst user = await prisma.user.findUnique({ where: { email } })\n\tif (!user) return null\n\n\tconst ok = await bcrypt.compare(password, user.passwordHash)\n\tif (!ok) return null\n\n\treturn { id: user.id, email: user.email, role: user.role }\n}'
		},
		{
			kind: 'p',
			text: "Three things in that block are load-bearing. The hash column is the only place the password exists, and bcrypt's cost factor is a knob you set deliberately — it is supposed to be slow, and the right value is the largest one your sign-in latency budget tolerates. The returned object is the seed of the session, so anything you put there is something you have chosen to publish to the client; the hash never appears in it. And both failure paths return the same `null`, so a wrong password and a nonexistent account are indistinguishable from outside."
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'Same answer, different cost',
			text: 'Returning the same `null` is only half of it. The missing-user path skips `bcrypt.compare` entirely, so it answers measurably faster than the wrong-password path — an account-enumeration oracle made of timing. The standard fix is to compare against a dummy hash when no user is found, so both branches pay the same cost.'
		},
		{ kind: 'h2', text: 'One schema, two boundaries' },
		{
			kind: 'p',
			text: 'The sign-in form was [[skill:react-hook-form]] with a [[skill:zod]] resolver. The part worth stating plainly: the schema is not a form feature. It is a value object that the form borrows. The same schema runs again inside `authorize()`, because the form is a courtesy to the person typing and the server is the only thing standing between the database and the open internet.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — one schema, inferred type, two consumers.',
			code: 'export const signInSchema = z.object({\n\temail: z.string().email(),\n\tpassword: z.string().min(8)\n})\n\nexport type SignInInput = z.infer<typeof signInSchema>\n\n// client — the same object drives field errors\nconst form = useForm<SignInInput>({ resolver: zodResolver(signInSchema) })'
		},
		{
			kind: 'p',
			text: 'The payoff is that `SignInInput` is derived, never declared. When a field changes, the type changes with it and every consumer that has drifted stops compiling. That is the whole argument for schema-first validation in [[skill:typescript]]: not fewer bad inputs, but no second copy of the truth to forget to update.'
		},
		{ kind: 'h2', text: 'A role is one column; role-based access is a system' },
		{
			kind: 'p',
			text: "Adding `role` to the user record costs one line. Making it mean something costs more, because every request needs to know it. NextAuth's answer is the callback pair: copy the role onto the token when the user signs in, then copy it from the token onto the session on every read."
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'Illustrative — the standard NextAuth callback pair for carrying a role.',
			code: 'callbacks: {\n\tasync jwt({ token, user }) {\n\t\tif (user) token.role = user.role\n\t\treturn token\n\t},\n\tasync session({ session, token }) {\n\t\tsession.user.role = token.role\n\t\treturn session\n\t}\n}'
		},
		{
			kind: 'p',
			text: "This is the cheap option and I want to name what it costs. The role is now a snapshot taken at sign-in. Six days later, on 13 February, I added the operator management screen — the place where one person changes another person's role — and at that moment the staleness stopped being theoretical. A demoted operator keeps their old powers until their token refreshes. The alternative, reading the role from the database on every request, is always correct and puts a query in front of every page load. For a dashboard with a small, known roster of staff, I would rather pay the query than explain why a revoked account still works."
		},
		{
			kind: 'p',
			text: 'What actually shipped on day two was narrow on purpose: hashed credentials, a validated sign-in, a session that carries who you are and what you are. No admin dashboard, no user management, no password reset. Those arrived on the 13th, once the [[project:flood-project]] map and readings had proved the product was worth having accounts for. Auth is infrastructure — it earns nothing on its own, and on a thirteen-day build the only defensible order is to build the smallest correct version and go back to the thing the client is actually paying for.'
		}
	],
	lessons: [
		'Credentials auth is not hard, it is unattended — no provider is checking your work. I now treat `authorize()` as security-critical code and read it line by line, because a missing `return null` there is a login bypass with no error message anywhere.',
		'Validate on the client for the error messages, on the server because it is the boundary. Same schema, two runs. If I ever find myself writing the second copy by hand, I have already lost.',
		'Putting the role in the token was the fast call on day two and the one I had to think hardest about on day eight. Decide up front how a permission change reaches a live session — the admin screen that makes it possible always ships later than the field that allows it.'
	],
	faqs: [
		{
			q: 'How do I use bcrypt with the NextAuth Credentials provider?',
			a: 'Store a bcrypt hash on the user record and compare inside `authorize()`: look the user up by email, run `await bcrypt.compare(password, user.passwordHash)`, and return a minimal user object on success or `null` on any failure. Never return the hash in that object — whatever you return becomes the session. Set the bcrypt cost factor as high as your sign-in latency budget allows, since the slowness is the point.'
		},
		{
			q: 'Where should a user role live — in the JWT or the database?',
			a: 'In the token it is one lookup-free field, but it is a snapshot from sign-in, so a role change does not reach an existing session until the token refreshes. Read it from the database per request and it is always current, at the cost of a query on every page load. Choose by how fast a revocation has to take effect: an admin screen that changes roles makes the stale-token window a real security question, not a performance one.'
		},
		{
			q: 'Do I still need server-side validation if the form uses Zod and react-hook-form?',
			a: 'Yes. Client-side validation is a user-experience feature — it produces good error messages next to the right field. Anyone can post directly to your endpoint and skip it entirely. Export the schema once, use it in the resolver and again on the server, and derive the TypeScript type from it with `z.infer` so the two can never disagree.'
		},
		{
			q: 'Why does returning null for both a wrong password and a missing user still leak information?',
			a: 'Because the two paths cost different amounts of time. The missing-user branch returns before `bcrypt.compare` runs, so it answers faster, and that difference is measurable over enough requests — it tells an attacker which email addresses have accounts. Compare against a dummy hash when no user is found so both branches do the same work.'
		}
	],
	sources: [
		{
			title: 'NextAuth.js — Configuration options',
			url: 'https://next-auth.js.org/configuration/options'
		},
		{
			title: 'Zod — TypeScript-first schema validation',
			url: 'https://zod.dev/'
		},
		{
			title: 'React Hook Form — Documentation',
			url: 'https://react-hook-form.com/docs'
		}
	]
}
