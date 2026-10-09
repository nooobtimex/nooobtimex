import React from 'react'

/**
 * Global fixed overlay: CRT scanlines + corner vignette.
 * Purely decorative, non-interactive, hidden in print.
 *
 * z-30 puts it over the page content but under the chrome: the tab bar (z-40), the sticky
 * header and every dialog (z-50). At z-100 it sat on top of all of them, so the corner
 * vignette dimmed the header's Hire button — the site's one call to action — and the
 * corner tabs, and striped every open dialog.
 */
const ScanlineOverlay: React.FC = () => {
	return (
		<div aria-hidden className='pointer-events-none fixed inset-0 z-30 print:hidden'>
			<div className='scanlines absolute inset-0 opacity-50' />
			<div
				className='absolute inset-0'
				style={{
					background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)'
				}}
			/>
		</div>
	)
}

export default ScanlineOverlay
