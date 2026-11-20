import { OG } from '@/lib/og-palette'

export const CARD_SIZE = 1080

export const alpha = (hex: string, a: number): string => {
	const h = hex.replace('#', '')
	const n = parseInt(
		h.length === 3 ?
			h
				.split('')
				.map(c => c + c)
				.join('')
		:	h,
		16
	)
	return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

export const gridBackground = () => ({ backgroundColor: OG.bg }) as const

export const truncate = (text: string, max: number) =>
	text.length <= max ? text : text.slice(0, max - 1).trimEnd() + '…'
