'use client'

import React, { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT_ID } from '@/lib/adsense'

declare global {
	interface Window {
		adsbygoogle?: Record<string, unknown>[]
	}
}

/**
 * One in-article AdSense unit — ported from prettier-config's `AdSlot` (3bde9c4), where the
 * defensive parts below were learned in production.
 *
 * No reserved height on purpose. Reserving space removes layout shift when an ad fills, but
 * an unfilled unit is collapsed by the `[data-ad-container]` rule in `app/globals.css` — and
 * behind an ad blocker the unit never gets a status at all, so a reservation would leave a
 * permanent blank gap mid-article for exactly the readers who already opted out.
 */
const AdSlot: React.FC<{ slot: string }> = ({ slot }) => {
	const insRef = useRef<HTMLModElement>(null)
	const pushed = useRef(false)

	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') return
		const ins = insRef.current
		if (!ins) return

		const fill = () => {
			if (pushed.current) return true
			// Set by adsbygoogle.js once it claims an element. It survives Strict Mode's
			// double-mount, where a second push into the same <ins> throws a TagError.
			if (ins.getAttribute('data-adsbygoogle-status')) {
				pushed.current = true
				return true
			}
			// A push into a zero-width container makes AdSense bail with `availableWidth=0`
			// and never retry, so wait until layout gives the slot a width.
			if (ins.getBoundingClientRect().width === 0) return false

			try {
				;(window.adsbygoogle = window.adsbygoogle ?? []).push({})
			} catch (error) {
				// Ad blockers stub the global; nothing here recovers by retrying.
				console.error('[AdSlot] adsbygoogle.push failed', error)
			}
			pushed.current = true
			return true
		}

		if (fill()) return

		const observer = new ResizeObserver(() => {
			if (fill()) observer.disconnect()
		})
		observer.observe(ins)
		return () => observer.disconnect()
	}, [slot])

	return (
		// `data-ad-container` is the hook for the unfilled-unit collapse in app/globals.css.
		<aside data-ad-container='' aria-label='Advertisement' className='w-full'>
			{/* Google requires ads to be distinguishable from content. A quiet label does that
			    without inviting a click. */}
			<span className='text-muted-foreground/60 mb-1 block text-center font-mono text-[0.6rem] tracking-[0.3em] uppercase'>
				Advertisement
			</span>
			{process.env.NODE_ENV === 'production' ?
				<ins
					ref={insRef}
					// `adsbygoogle` is the class the loader scans for — never rename it.
					className='adsbygoogle w-full'
					style={{ display: 'block', textAlign: 'center' }}
					data-ad-client={ADSENSE_CLIENT_ID}
					data-ad-slot={slot}
					data-ad-layout='in-article'
					data-ad-format='fluid'
				/>
			:	<div className='border-border text-muted-foreground/60 flex min-h-24 w-full items-center justify-center border border-dashed font-mono text-xs'>
					in-article slot {slot}
				</div>
			}
		</aside>
	)
}

export default AdSlot
