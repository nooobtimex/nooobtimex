'use client'

import React, { useState } from 'react'
import { Box, Image as ImageIcon } from 'lucide-react'
import Project3DViewer from '@/components/3d/Project3DViewer'
import { hasProject3D } from '@/components/3d/registry'

interface ProjectMediaHeroProps {
	projectId: string
	title: string
	image: string
}

export default function ProjectMediaHero({ projectId, title, image }: ProjectMediaHeroProps) {
	const has3D = hasProject3D(projectId)
	const [activeView, setActiveView] = useState<'photo' | '3d'>('photo')

	if (!has3D) {
		return (
			<img
				src={image}
				alt={title}
				loading='eager'
				fetchPriority='high'
				decoding='async'
				className='comic-detail-image mt-8'
			/>
		)
	}

	return (
		<div className='mt-8 space-y-3'>
			<div className='flex items-center justify-end gap-2'>
				<button
					type='button'
					onClick={() => setActiveView('photo')}
					aria-pressed={activeView === 'photo'}
					className={`border-ink flex items-center gap-1.5 border-2 px-3 py-1.5 text-xs font-bold transition-all ${
						activeView === 'photo' ?
							'bg-cobalt translate-x-[-1px] translate-y-[-1px] text-white shadow-[2px_2px_0_#17191c]'
						:	'text-ink bg-white hover:bg-neutral-100'
					}`}>
					<ImageIcon size={14} />
					<span>Photo Cover</span>
				</button>
				<button
					type='button'
					onClick={() => setActiveView('3d')}
					aria-pressed={activeView === '3d'}
					className={`border-ink flex items-center gap-1.5 border-2 px-3 py-1.5 text-xs font-bold transition-all ${
						activeView === '3d' ?
							'bg-cobalt translate-x-[-1px] translate-y-[-1px] text-white shadow-[2px_2px_0_#17191c]'
						:	'text-ink bg-white hover:bg-neutral-100'
					}`}>
					<Box size={14} />
					<span>Interactive 3D</span>
				</button>
			</div>

			{activeView === '3d' ?
				<div className='aspect-[16/10] min-h-[380px] w-full sm:min-h-[480px]'>
					<Project3DViewer projectId={projectId} className='size-full' />
				</div>
			:	<img
					src={image}
					alt={title}
					loading='eager'
					fetchPriority='high'
					decoding='async'
					className='comic-detail-image'
				/>
			}
		</div>
	)
}
