import type { Route } from 'next'
import Link from 'next/link'
import CompanyGrid from '@/components/companies/CompanyGrid'
import Container from '@/components/site/Container'
import SectionHeader from '@/components/site/SectionHeader'
import { formatExperienceDuration, formatPosition } from '@/lib/utils'
import { currentFocus, experiencesData, personalData } from '@/common'

export default function ExperienceContent() {
	return (
		<Container className='py-14 md:py-20'>
			<SectionHeader as='h1' title='About' subtitle='Kwan / ขวัญ · Wongsaphat Puangsorn · NooobtimeX' />
			<div className='mt-10 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-14'>
				<img
					src={personalData.avatar}
					alt='Kwan, Wongsaphat Puangsorn'
					width={640}
					height={640}
					className='aspect-square w-full max-w-xs rounded-lg object-cover'
				/>
				<div>
					<p className='text-lg leading-relaxed'>{personalData.about.bio}</p>
					<ul className='mt-6 space-y-3 border-t pt-6'>
						{personalData.about.highlights.map(h => (
							<li key={h} className='text-muted-foreground flex gap-3 text-base'>
								<span aria-hidden className='text-brand'>
									↗
								</span>
								{h}
							</li>
						))}
					</ul>
				</div>
			</div>
			<section className='section-space'>
				<SectionHeader title='Where my attention is' />
				<div className='mt-8 grid gap-8 md:grid-cols-3'>
					{currentFocus.map(item => (
						<div key={item.title}>
							<p className='text-muted-foreground text-xs'>{item.role}</p>
							<h3 className='mt-2 text-xl'>
								{'href' in item ?
									<Link href={item.href as Route} className='text-brand hover:underline'>
										{item.title} ↗
									</Link>
								:	item.title}
							</h3>
							<p className='text-muted-foreground mt-3 text-base'>{item.description}</p>
						</div>
					))}
				</div>
			</section>
			<section className='border-t pt-12'>
				<SectionHeader title='The path here' subtitle='Work, independent projects, and education.' />
				<div className='mt-6'>
					{experiencesData.map(item => (
						<Link
							key={item.id}
							href={`/career/${item.id}` as Route}
							className='group grid gap-3 border-b py-6 md:grid-cols-[12rem_1fr] md:gap-8'>
							<p className='text-muted-foreground text-sm'>{formatExperienceDuration(item.startDate, item.endDate)}</p>
							<div>
								<h3 className='group-hover:text-brand text-lg'>{item.credential ?? formatPosition(item.position)} ↗</h3>
								<p className='text-brand mt-1 text-sm'>{item.organization.name}</p>
								<p className='text-muted-foreground mt-3 line-clamp-3 text-base leading-relaxed'>{item.description}</p>
							</div>
						</Link>
					))}
				</div>
			</section>
			<div className='text-brand mt-8 flex flex-wrap gap-6 text-sm'>
				<Link href='/cv'>View CV →</Link>
				<Link href='/skills'>Tools I use →</Link>
				<Link href='/github'>GitHub activity →</Link>
			</div>
			<CompanyGrid />
		</Container>
	)
}
