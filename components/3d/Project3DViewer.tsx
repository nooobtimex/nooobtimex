'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { getProject3DMeta } from './registry'
import type { ViewerController } from './types'
import styles from './viewer.module.css'

interface Project3DViewerProps {
	projectId: string
	className?: string
	showControls?: boolean
}

export default function Project3DViewer({ projectId, className, showControls = true }: Project3DViewerProps) {
	const hostRef = useRef<HTMLDivElement>(null)
	const controllerRef = useRef<ViewerController | null>(null)
	const [paused, setPaused] = useState(false)
	const [failed, setFailed] = useState(false)
	const [ready, setReady] = useState(false)

	const meta = getProject3DMeta(projectId)

	useEffect(() => {
		let cancelled = false
		let active: ViewerController | null = null
		const host = hostRef.current

		if (!host || !meta) return

		setFailed(false)
		setReady(false)

		void import('./viewer-core')
			.then(async ({ createProjectViewer }) => {
				if (cancelled) return
				try {
					active = await createProjectViewer(host, meta.factory, () => {
						setFailed(true)
						active?.dispose()
						controllerRef.current = null
					})
					if (cancelled) {
						active.dispose()
						return
					}
					controllerRef.current = active
					setReady(true)
				} catch {
					setFailed(true)
				}
			})
			.catch(() => {
				if (!cancelled) setFailed(true)
			})

		return () => {
			cancelled = true
			active?.dispose()
			controllerRef.current = null
		}
	}, [projectId, meta])

	const handleTogglePause = () => {
		const next = !paused
		setPaused(next)
		controllerRef.current?.setPaused(next)
	}

	const handleResetCamera = () => {
		controllerRef.current?.resetCamera()
	}

	if (!meta) return null

	return (
		<div className={`${styles.container} ${className ?? ''}`}>
			<div className={styles.overlayTop}>
				<div className={styles.badge}>
					<span className={styles.badgeDot} />
					{meta.badge}
				</div>
			</div>

			<div className={styles.canvasHost} ref={hostRef} data-ready={ready ? 'true' : undefined} />

			{!ready && (
				<div className={styles.fallback}>
					{failed ?
						<p className='text-muted-foreground text-xs font-semibold'>3D preview is unavailable on this device.</p>
					:	<div className={styles.spinner} />}
				</div>
			)}

			{showControls && (
				<div className={styles.overlayBottom}>
					<span className={styles.hint}>Drag to rotate 360° · Scroll to zoom</span>
					<div className={styles.controls}>
						<button
							type='button'
							className={styles.btn}
							aria-label={paused ? 'Resume rotation' : 'Pause rotation'}
							onClick={handleTogglePause}>
							{paused ?
								<Play size={16} />
							:	<Pause size={16} />}
						</button>
						<button type='button' className={styles.btn} aria-label='Reset camera view' onClick={handleResetCamera}>
							<RotateCcw size={16} />
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
