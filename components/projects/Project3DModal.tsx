'use client'

import React from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import Project3DViewer from '@/components/3d/Project3DViewer'
import { getProject3DMeta } from '@/components/3d/registry'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface Project3DModalProps {
	projectId: string | null
	projectTitle?: string
	onClose: () => void
}

export default function Project3DModal({ projectId, projectTitle, onClose }: Project3DModalProps) {
	if (!projectId) return null

	const meta = getProject3DMeta(projectId)
	const title = projectTitle ?? meta?.title ?? '3D Inspection'

	return (
		<Dialog open={Boolean(projectId)} onOpenChange={open => !open && onClose()}>
			<DialogContent className='border-ink bg-paper max-w-4xl overflow-hidden rounded-none! border-2 p-0 shadow-[8px_8px_0_#17191c]'>
				<DialogTitle className='sr-only'>{title}</DialogTitle>

				<div className='border-ink flex items-center justify-between border-b-2 bg-white px-4 py-3'>
					<div className='flex items-center gap-2'>
						<span className='bg-cobalt size-2.5 rounded-full' />
						<h3 className='font-space text-ink text-base font-bold tracking-tight'>{title}</h3>
					</div>
					<Link
						href={`/projects/${projectId}` as Route}
						className='text-cobalt text-xs font-bold hover:underline'
						onClick={onClose}>
						View project notes →
					</Link>
				</div>

				<div className='bg-paper relative h-[65vh] min-h-[420px] w-full'>
					<Project3DViewer projectId={projectId} className='size-full rounded-none border-none shadow-none' />
				</div>
			</DialogContent>
		</Dialog>
	)
}
