'use client'

import React, { useState } from 'react'
import { Box } from 'lucide-react'
import Project3DModal from './Project3DModal'

interface Project3DCardButtonProps {
	projectId: string
	projectTitle: string
}

export default function Project3DCardButton({ projectId, projectTitle }: Project3DCardButtonProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<button
				type='button'
				onClick={e => {
					e.preventDefault()
					e.stopPropagation()
					setIsOpen(true)
				}}
				className='border-ink text-ink hover:bg-cobalt absolute top-2.5 right-2.5 z-10 flex items-center gap-1 border-2 bg-white px-2 py-1 text-[11px] font-bold shadow-[2px_2px_0_#17191c] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:text-white'
				aria-label={`Open 3D inspection for ${projectTitle}`}>
				<Box size={13} />
				<span>3D</span>
			</button>

			{isOpen && <Project3DModal projectId={projectId} projectTitle={projectTitle} onClose={() => setIsOpen(false)} />}
		</>
	)
}
