'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import CyberQR from '@/components/contact/CyberQR'
import CyberButton from '@/components/cyber/CyberButton'
import NeonPanel from '@/components/cyber/NeonPanel'

interface VCardPanelProps {
	/** Display name, for the QR's accessible title. */
	name: string
	/** The CORE vCard — what the QR encodes. */
	qrPayload: string
	/** The RICH vCard — what the .vcf download contains. */
	filePayload: string
	filename: string
}

/**
 * The business-card panel: scan the QR to be offered "Add contact", or download the .vcf.
 *
 * The QR carries the CORE vCard (name, title, company, phone, email, site) — the fields
 * people actually use, kept lean so the code stays scannable. The downloadable file adds
 * the rich extras (address, birthday, socials, photo, note).
 *
 * The payloads are built by the server parent (`ContactContent`) and arrive as strings.
 * This component used to import `personalData` from `@/common` to build them itself, and a
 * client import of that barrel shipped the whole data layer — every Journal post's body —
 * in /contact's first-load JavaScript.
 */
const VCardPanel: React.FC<VCardPanelProps> = ({ name, qrPayload, filePayload, filename }) => {
	const handleDownload = () => {
		const blob = new Blob([filePayload], { type: 'text/vcard;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = filename
		document.body.appendChild(anchor)
		anchor.click()
		anchor.remove()
		// Do NOT revoke synchronously — iOS Safari has been observed writing a 0-byte file
		// when the object URL disappears before the download is handed off.
		setTimeout(() => URL.revokeObjectURL(url), 10_000)
	}

	return (
		<NeonPanel corners className='flex flex-col items-center gap-5 p-6 text-center'>
			<div>
				<h3 className='font-display text-2xl font-bold tracking-wide'>Digital Business Card</h3>
				<p className='text-muted-foreground mt-1 text-sm'>
					Scan to save me as a contact — name, title, company, phone, email and site. The .vcf download adds socials,
					birthday and more.
				</p>
			</div>

			{/* Larger than the WeChat code because a vCard needs far more modules. 248px is
			    the widest that still fits a 375px viewport once Container, panel and plate
			    padding are subtracted. */}
			<CyberQR value={qrPayload} title={`Contact card QR for ${name}`} size={248} />

			<CyberButton variant='outline' size='lg' onClick={handleDownload}>
				<Icon icon='mdi:download' />
				Download .vcf
			</CyberButton>
		</NeonPanel>
	)
}

export default VCardPanel
