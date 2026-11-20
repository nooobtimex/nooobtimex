/** Generates the profile README artwork; GitHub failures preserve the previous activity cards. */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getContributions, getProfile, getRepos } from '@/lib/github'
import { featuredProjects, workStories } from '@/common'

const out = join(process.cwd(), '.github', 'assets')
const escape = (s: string) =>
	s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const text = (s: string, x: number, y: number, size = 22, color = '#17191c') =>
	`<text x="${x}" y="${y}" font-size="${size}" fill="${color}">${escape(s)}</text>`
const svg = (label: string, height: number, content: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${height}" role="img" aria-label="${escape(label)}"><style>text{font-family:Arial,sans-serif}</style><rect width="1000" height="${height}" fill="#f6f6f2"/><rect x="4" y="4" width="992" height="${height - 8}" fill="none" stroke="#17191c" stroke-width="4"/><path d="M4 66H996" stroke="#17191c" stroke-width="2"/>${content}</svg>\n`
const write = (file: string, content: string) => {
	writeFileSync(join(out, file), content)
	console.log(`written ${file}`)
}

async function main() {
	mkdirSync(out, { recursive: true })
	write(
		'header.svg',
		svg(
			'Kwan / NooobtimeX — Software, robots, and things that work.',
			320,
			text('NooobtimeX.', 48, 58, 23, '#2845ee')
				+ text('Hi, I’m Kwan.', 48, 148, 62)
				+ text('Software, robots, and things that work.', 48, 205, 34, '#2845ee')
				+ text('CTO at RS TROPHY · Co-founder of Thaibotic · Thailand', 48, 274, 22, '#51565f')
		)
	)
	for (const project of featuredProjects) {
		const story = workStories[project.id]
		write(
			`project-${project.id}.svg`,
			svg(
				project.title,
				220,
				text(story.status, 40, 44, 18, '#51565f')
					+ text(project.title.replace(' — Humanoid Robot Workspace', ''), 40, 96, 32, '#2845ee')
					+ text(story.context, 40, 146, 18)
					+ text('Read the project → nooobtimex.me/projects/' + project.id, 40, 189, 18, '#51565f')
			)
		)
	}
	const [profile, repos, contributions] = await Promise.all([getProfile(), getRepos(), getContributions('last')])
	if (profile && repos && contributions) {
		const values = [
			['Public repositories', profile.repos],
			['Stars', repos.stars],
			['Followers', profile.followers],
			['Contributions', contributions.total]
		] as const
		write(
			'stats.svg',
			svg(
				'GitHub activity',
				180,
				text('On GitHub', 40, 42, 22, '#2845ee')
					+ values
						.map(
							([label, value], i) =>
								text(String(value), 40 + i * 240, 105, 36) + text(label, 40 + i * 240, 145, 17, '#51565f')
						)
						.join('')
			)
		)
	} else console.warn('GitHub stats unavailable; preserved the previous card.')
	if (contributions && contributions.days.length) {
		const days = contributions.days
		const max = Math.max(...days.map(d => d.count), 1)
		const colors = ['#e8ebef', '#c4d4ea', '#91aed3', '#5c82b1', '#2845ee']
		const cells = days
			.map(
				(d, i) =>
					`<rect x="${40 + Math.floor(i / 7) * 17}" y="${70 + (i % 7) * 17}" width="13" height="13" rx="2" fill="${colors[d.count === 0 ? 0 : Math.min(4, 1 + Math.floor((d.count / max) * 3))]}"><title>${escape(d.date)}: ${d.count}</title></rect>`
			)
			.join('')
		write(
			'contributions.svg',
			svg('Contributions over the last year', 220, text('A year of building', 40, 40, 22, '#2845ee') + cells)
		)
	} else console.warn('GitHub contributions unavailable; preserved the previous card.')
}
main().catch(error => {
	console.error(error)
	process.exit(1)
})
