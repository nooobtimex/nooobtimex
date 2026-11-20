'use client'

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'

/** Dark-on-white QR with a four-module quiet zone for reliable scanning. */
const FG = '#222A35'
const BG = '#FFFFFF'

interface ContactQRProps {
	/** Encoded verbatim. Never normalise or trim — see the WeChat payload note in the data layer. */
	value: string
	/** Accessible name, e.g. 'WeChat QR — scan in WeChat to add Wongsaphat Puangsorn'. */
	title: string
	size?: number
	className?: string
}

const ContactQR: React.FC<ContactQRProps> = ({ value, title, size = 200, className }) => {
	return (
		// The QR needs its own unclipped, unbracketed plate: `rounded-xl` and `hud-corners`
		// cut exactly the corners the finder patterns live in. Put decoration on a wrapper
		// outside this padding, never on the code itself.
		<div
			className={cn('inline-block p-4', className)}
			style={{ backgroundColor: BG, width: size + 32, maxWidth: '100%' }}>
			<QRCodeSVG
				value={value}
				size={size}
				style={{ width: '100%', height: 'auto' }}
				level='M'
				fgColor={FG}
				bgColor={BG}
				// qrcode.react v4 defaults marginSize to 0. ISO/IEC 18004 §6.3.8 mandates a
				// 4-module quiet zone — without it many scanners will not lock on at all.
				marginSize={4}
				title={title}
			/>
		</div>
	)
}

export default ContactQR
