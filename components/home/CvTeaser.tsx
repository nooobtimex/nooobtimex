import React from 'react'
import Container from '@/components/cyber/Container'
import CyberButton from '@/components/cyber/CyberButton'
import CyberIcon from '@/components/cyber/CyberIcon'
import NeonPanel from '@/components/cyber/NeonPanel'
import SectionHeader from '@/components/cyber/SectionHeader'

/**
 * Home section 05 — a compact teaser for the full CV / presentation routes.
 */
const CvTeaser: React.FC = () => (
	<Container as='section' className='mt-20 pb-10'>
		<SectionHeader code='06' title='CV' subtitle='Print-ready résumé and a slide presentation.' />

		<NeonPanel className='clip-notch mt-8 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between'>
			<div className='flex items-center gap-4'>
				<span className='perk-node clip-notch-sm flex size-14 shrink-0 items-center justify-center'>
					<CyberIcon icon='mdi:file-account-outline' className='text-cyber-yellow size-8' />
				</span>
				<div>
					<h3 className='font-display text-xl font-bold tracking-wide uppercase'>Résumé / CV</h3>
					<p className='text-muted-foreground mt-0.5 text-sm'>
						A six-page A4 dossier plus a full-screen slide presentation.
					</p>
				</div>
			</div>

			<div className='flex flex-wrap gap-3'>
				<CyberButton href='/cv'>
					<CyberIcon icon='mdi:file-document-outline' /> View CV
				</CyberButton>
				<CyberButton href='/cv/presentation' variant='outline'>
					<CyberIcon icon='mdi:presentation' /> Presentation
				</CyberButton>
			</div>
		</NeonPanel>
	</Container>
)

export default CvTeaser
