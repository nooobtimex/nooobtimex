import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	// Emits `.next/standalone` — a self-contained server.js plus only the traced
	// node_modules. That is what lets the Railway image serve from a bare
	// `node:26-slim` stage with no install step. Required by the deploy: see the
	// Deployment section in CLAUDE.md before changing it.
	output: 'standalone',
	// No `next/image` anywhere — every asset in public/ is already WebP at a sane size,
	// so the optimizer's main job was a no-op while it pulled sharp/libvips into the
	// runtime container (~23 MB RSS on require, a 50 MB native cache, and a worker
	// thread per HOST core — libvips reads the host, not the cgroup). Components use
	// plain <img>; see the Images section in .claude/rules/design-system.md.
	//
	// This also retires a trap: `qualities: [100]` made every request near-lossless.
	// No call site passed a `quality` prop, so Next defaulted to 75 and then snapped it
	// to the only allowed value — 100 — re-encoding the whole set every 60s.
	images: { unoptimized: true },
	typedRoutes: true,
	// NOT "ignore type errors" — the type gate moved, it did not go away. `bun run build`
	// (and the Dockerfile) runs `bun run typecheck` — TypeScript 7's native `tsc` — before
	// `next build`. Left on, Next would type-check a second time with TypeScript 6: the
	// `typescript` package is aliased to @typescript/typescript6 because typescript-eslint
	// still needs the compiler API TS 7 does not ship. Anything that calls `next build`
	// directly must run `typecheck` first. See "TypeScript 6 + 7" in CLAUDE.md.
	typescript: { ignoreBuildErrors: true },
	async redirects() {
		// Only single-segment detail routes are redirected. Deeper paths (e.g.
		// /issue/<slug>/banner.png) are public image assets and must NOT redirect.
		return [
			// Removed project — folded into LOOKLOOK PET
			{ source: '/projects/tencent-railway-migration', destination: '/projects', permanent: true },
			{ source: '/issue/tencent-railway-migration', destination: '/projects', permanent: true },
			{ source: '/projects/looklook-partner-portal', destination: '/projects/looklook-pet', permanent: true },
			{ source: '/projects/looklook-mercur-marketplace', destination: '/projects/looklook-pet', permanent: true },
			// Removed project — legacy WordPress build merged into the unified RS TROPHY entry
			{ source: '/projects/rs-trophy-v1', destination: '/projects/rs-trophy', permanent: true },
			{ source: '/issue/rs-trophy-v1', destination: '/projects/rs-trophy', permanent: true },
			// Renamed experience id — Product Engineer role became CTO
			{ source: '/experience/ruamsuk-product-engineer', destination: '/career/ruamsuk-cto', permanent: true },
			// GitHub years moved from ?year= (rendered per request) to prerendered /github/<year>
			{
				source: '/github',
				has: [{ type: 'query', key: 'year', value: '(?<year>\\d{4})' }],
				destination: '/github/:year',
				permanent: true
			},
			// Career section moved — /experience/* now lives at /career/*
			{ source: '/experience', destination: '/career', permanent: true },
			{ source: '/experience/:id', destination: '/career/:id', permanent: true },
			{ source: '/issue', destination: '/projects', permanent: true },
			{ source: '/issue/:id', destination: '/projects/:id', permanent: true },
			{ source: '/ability', destination: '/skills', permanent: true },
			{ source: '/ability/:id', destination: '/skills/:id', permanent: true },
			{ source: '/affiliation', destination: '/career', permanent: true },
			// The /companies index merged into /career; each /companies/:id page stays
			{ source: '/companies', destination: '/career#organizations', permanent: true },
			{ source: '/affiliation/:id', destination: '/career/:id', permanent: true }
		]
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					},
					{
						// Cloudflare terminates TLS but was not sending HSTS, so a first visit over
						// http:// was still a redirect an attacker could sit in front of.
						// `preload` is deliberately omitted: submitting to the browser preload list
						// is effectively irreversible, and that is the owner's call, not a default.
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains'
					}
				]
			}
		]
	}
}

export default nextConfig
