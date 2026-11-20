import Link from 'next/link'
import Container from '@/components/site/Container'
import { personalData } from '@/common'
import { FOOTER_LINKS, LEGAL_LINKS } from './links'

export default function NavFooter() {
	return (
		<footer className='comic-footer mt-16'>
			<Container className='grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]'>
				<div>
					<Link href='/' className='text-lg font-semibold tracking-tight'>
						NooobtimeX<span className='text-brand'>.</span>
					</Link>
					<p className='text-muted-foreground mt-3 max-w-xs text-sm'>
						Software, robots, and things I’m figuring out along the way. Built by Kwan, in Thailand.
					</p>
				</div>
				<nav aria-label='Footer navigation' className='grid grid-cols-2 content-start gap-x-6 gap-y-2'>
					{FOOTER_LINKS.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className='text-muted-foreground hover:text-brand w-fit py-1 text-sm'>
							{link.label}
						</Link>
					))}
				</nav>
				<div>
					<p className='mb-3 text-sm font-medium'>Find me elsewhere</p>
					<div className='flex flex-wrap gap-x-5 gap-y-3'>
						{personalData.socialLinks
							.filter(s => ['github', 'linkedin', 'youtube', 'instagram'].includes(s.platform))
							.map(s => (
								<a
									key={s.platform}
									href={s.url}
									target='_blank'
									rel='noopener noreferrer'
									className='text-muted-foreground hover:text-brand py-1 text-sm capitalize'>
									{s.platform === 'github' ?
										'GitHub'
									: s.platform === 'linkedin' ?
										'LinkedIn'
									: s.platform === 'youtube' ?
										'YouTube'
									:	'Instagram'}{' '}
									↗
								</a>
							))}
					</div>
				</div>
			</Container>
			<Container className='text-muted-foreground flex flex-wrap justify-between gap-3 border-t py-5 text-xs'>
				<span>
					© {new Date().getFullYear()} {personalData.name}
				</span>
				<div className='flex gap-5'>
					{LEGAL_LINKS.map(l => (
						<Link key={l.href} href={l.href}>
							{l.label}
						</Link>
					))}
					<span>Made with care, kept in progress.</span>
				</div>
			</Container>
		</footer>
	)
}
