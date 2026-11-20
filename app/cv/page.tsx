import type { Route } from 'next'
import Link from 'next/link'
import CvControls from '@/components/cv/CvControls'
import Container from '@/components/site/Container'
import { formatExperienceDuration, formatPosition } from '@/lib/utils'
import { educationData, featuredProjects, featuredSkills, personalData, workExperienceData } from '@/common'

export default function CVPage() {
	return (
		<Container className='cv-document max-w-4xl py-12 pb-28 print:max-w-none print:p-0'>
			<style>{`@page { size: A4; margin: 16mm; } @media print { body { background: white; font-size: 11pt; } h1 { font-size: 28pt !important; } h2 { font-size: 18pt !important; } h3 { font-size: 13pt !important; } .cv-entry { break-inside: avoid; } a { color: inherit; } }`}</style>
			<Link href='/career' className='text-brand text-sm print:hidden'>
				← About Kwan
			</Link>
			<header className='mt-8 border-b pb-8'>
				<p className='eyebrow'>Kwan / NooobtimeX</p>
				<h1 className='mt-3 text-4xl md:text-5xl'>{personalData.name}</h1>
				<p className='text-brand mt-4 text-lg'>CTO at RS TROPHY · Co-founder of Thaibotic</p>
				<p className='text-muted-foreground mt-5 max-w-3xl text-base'>{personalData.tagline}</p>
				<div className='mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm'>
					<a href={personalData.contactAction.url}>{personalData.contact.email}</a>
					<a href='https://nooobtimex.me'>nooobtimex.me</a>
					<span>Nonthaburi, Thailand</span>
				</div>
			</header>
			<section className='mt-10'>
				<h2 className='text-2xl'>Experience</h2>
				<div className='mt-6 space-y-7'>
					{workExperienceData.map(item => (
						<article key={item.id} className='cv-entry'>
							<h3 className='text-lg'>
								{formatPosition(item.position)} · {item.organization.name}
							</h3>
							<p className='text-muted-foreground mt-1 text-sm'>
								{formatExperienceDuration(item.startDate, item.endDate)}
							</p>
							<p className='mt-3 text-base leading-relaxed'>{item.description}</p>
						</article>
					))}
				</div>
			</section>
			<section className='mt-10 border-t pt-8'>
				<h2 className='text-2xl'>Selected work</h2>
				<div className='mt-6 space-y-6'>
					{featuredProjects.map(project => (
						<article key={project.id} className='cv-entry'>
							<h3 className='text-lg'>
								<Link href={`/projects/${project.id}` as Route}>{project.title} ↗</Link>
							</h3>
							<p className='text-muted-foreground mt-2 text-base'>
								{project.resumeSummary ?? project.summary ?? project.description}
							</p>
						</article>
					))}
				</div>
			</section>
			<section className='cv-entry mt-10 border-t pt-8'>
				<h2 className='text-2xl'>Tools I work with</h2>
				<p className='mt-4 text-base'>{featuredSkills.map(s => s.name).join(' · ')}</p>
			</section>
			<section className='cv-entry mt-10 border-t pt-8'>
				<h2 className='text-2xl'>Education & languages</h2>
				{educationData.map(item => (
					<div key={item.id} className='mt-4'>
						<h3 className='text-lg'>
							{item.credential} · {item.organization.name}
						</h3>
						<p className='text-muted-foreground text-sm'>{formatExperienceDuration(item.startDate, item.endDate)}</p>
					</div>
				))}
				<p className='mt-4 text-base'>{personalData.languages.map(l => `${l.name} (${l.level})`).join(' · ')}</p>
			</section>
			<CvControls />
		</Container>
	)
}
