'use client'

import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface ProjectGalleryProps {
	photos: string[]
	title: string
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ photos, title }) => {
	const [active, setActive] = React.useState<string | null>(null)

	if (!photos.length) return null

	return (
		<>
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
				{photos.map((src, i) => (
					<button
						key={`${src}-${i}`}
						onClick={() => setActive(src)}
						className='surface group relative aspect-video overflow-hidden rounded-lg'>
						<img
							src={src}
							alt={`${title} screenshot ${i + 1}`}
							loading='lazy'
							decoding='async'
							className='absolute inset-0 size-full object-cover opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100'
						/>
					</button>
				))}
			</div>

			<Dialog open={!!active} onOpenChange={open => !open && setActive(null)}>
				{/* `sm:max-w-4xl`, not `max-w-4xl` — the shadcn DialogContent base carries
				    `sm:max-w-md`, and tailwind-merge keys max-width by modifier set, so a bare
				    utility cannot displace a prefixed one. A plain `max-w-4xl` here was dead
				    code above 640px and this "lightbox" opened at 448px on a desktop. */}
				<DialogContent className='border-brand/40 bg-popover rounded-none! border p-2 sm:max-w-4xl'>
					<DialogTitle className='sr-only'>{title}</DialogTitle>
					{/* No aspect-video wrapper: `object-contain` inside a fixed 16:9 box letterboxed
					    the tall phone screenshots (665×1440) down to a ~112px sliver. Letting the
					    image size itself against a viewport-height cap keeps portraits readable. */}
					{active && (
						<img
							src={active}
							alt={title}
							loading='eager'
							decoding='async'
							className='max-h-[85vh] w-full object-contain'
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}

export default ProjectGallery
