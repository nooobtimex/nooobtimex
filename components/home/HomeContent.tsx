import type { Route } from 'next'
import Link from 'next/link'
import Action from '@/components/site/Action'
import ContentBlock from '@/components/site/ContentBlock'
import { formatMilestoneDate } from '@/lib/utils'
import { assets, currentFocus, featuredProjects, heroModes, personalData, postsData, workStories } from '@/common'
import HeroExperience from './HeroExperience'
import WorkImage from './WorkImage'
import styles from './home.module.css'

export default function HomeContent() {
	return (
		<div className={styles.home}>
			<div className={styles.shell}>
				<div className={styles.lobby}>
					<aside className={styles.profile} aria-label='Meet Kwan'>
						<ContentBlock>
							<div className={styles.portraitFrame}>
								<img
									src={personalData.avatar}
									alt='Kwan, Wongsaphat Puangsorn'
									width={640}
									height={640}
									loading='eager'
									fetchPriority='high'
								/>
								<span className={styles.portraitTag}>Hi, I’m Kwan.</span>
							</div>
						</ContentBlock>
						<div className={styles.profileText}>
							<p className={styles.handle}>NooobtimeX</p>
							<h2>
								Kwan<span>.</span>
							</h2>
							<p className={styles.fullName}>
								Wongsaphat Puangsorn
								<br />
								วงศพัทธ์ พวงซ้อน
							</p>
							<p className={styles.bio}>
								CTO at{' '}
								<a href={personalData.employer.profileUrl} target='_blank' rel='noopener noreferrer'>
									RS TROPHY
								</a>{' '}
								and co-founder of <Link href='/companies/thaibotic'>Thaibotic</Link>. I build software, work with
								robots, and make games.
							</p>
							<p className={styles.location}>Nonthaburi, Thailand · Thai / English</p>
							<Action href='/career' variant='outline' className='mt-5 w-full'>
								Get to know me ↗
							</Action>
						</div>
						<div className={styles.socials}>
							{personalData.socialLinks
								.filter(s => ['github', 'linkedin', 'youtube', 'instagram'].includes(s.platform))
								.map(s => (
									<a key={s.platform} href={s.url} target='_blank' rel='noopener noreferrer'>
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
					</aside>

					<section className={styles.center} aria-labelledby='home-title'>
						<div className={styles.heroCaption}>
							<span className={styles.spark} aria-hidden='true'>
								✳
							</span>
							<span>Software. Robots. A little room to play.</span>
						</div>
						<h1 id='home-title' className={styles.title}>
							Always
							<br />
							<span>building.</span>
						</h1>
						<p className={styles.lead}>
							A personal collection of the things I make, the problems I work on, and what I learn along the way.
						</p>
						<div className={styles.stage}>
							<HeroExperience modes={heroModes} />
						</div>
						<div className={styles.stageFoot}>
							<span>Different things. The same curiosity.</span>
							<a href='#selected-work'>See the work ↓</a>
						</div>
					</section>

					<aside className={styles.intel} aria-label='Current work and latest writing'>
						<section className={styles.now}>
							<h2>On my workbench</h2>
							{currentFocus.map(item => (
								<article key={item.title}>
									<p>{item.role}</p>
									<h3>
										{'href' in item ?
											<Link href={item.href as Route}>{item.title} ↗</Link>
										:	item.title}
									</h3>
									<p className={styles.focusDescription}>{item.description}</p>
								</article>
							))}
						</section>
						<section className={styles.notes}>
							<h2>Fresh from the notes</h2>
							{postsData.slice(0, 2).map(post => (
								<Link key={post.id} href={`/blog/${post.id}` as Route}>
									<span>
										{formatMilestoneDate(post.happenedAt)} · {post.readingMinutes} min
									</span>
									<h3>{post.title}</h3>
								</Link>
							))}
							<Link className={styles.allNotes} href='/blog'>
								All writing ↗
							</Link>
						</section>
					</aside>
				</div>

				<section id='selected-work' className={styles.work} aria-labelledby='work-title'>
					<div className={styles.sectionTop}>
						<h2 id='work-title'>
							Selected work<span aria-hidden='true'>↗</span>
						</h2>
						<Link href='/projects'>Explore all projects →</Link>
					</div>
					<div className={styles.workGrid}>
						{featuredProjects.map((project, index) => {
							const story = workStories[project.id]
							const image =
								project.id === 'unitree-g1' ? assets.projects.unitreeG1.gallery[0]
								: project.id === 'looklook-pet' ? assets.projects.looklookPet.gallery[1]
								: assets.projects.rsTrophy.preview
							return (
								<ContentBlock key={project.id} delay={index * 0.06}>
									<Link href={`/projects/${project.id}` as Route} className={styles.workCard}>
										<WorkImage>
											<img src={image} alt={project.title} loading='lazy' decoding='async' />
										</WorkImage>
										<div className={styles.workBody}>
											<p className={styles.workStatus}>{story.status}</p>
											<h3>{project.id === 'unitree-g1' ? 'A robot, made usable.' : project.title}</h3>
											<p>
												{story.context} {story.responsibility}
											</p>
										</div>
									</Link>
								</ContentBlock>
							)
						})}
					</div>
				</section>

				<section className={styles.contact}>
					<div>
						<p>Ideas, questions, or just a hello.</p>
						<h2>
							Keep in touch<span>.</span>
						</h2>
					</div>
					<Action href='/contact' size='lg'>
						Say hello ↗
					</Action>
				</section>
			</div>
		</div>
	)
}
