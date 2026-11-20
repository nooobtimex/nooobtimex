/**
 * GET /card/hire — the downloadable 1080×1080 profile card at its existing URL.
 *
 * Sibling of `(main)` for the same reason as the project cards; see
 * `app/card/projects/[id]/route.tsx`.
 */
import { ImageResponse } from 'next/og'
import HireSquareCard from '@/components/og/HireSquareCard'
import { CARD_SIZE } from '@/components/og/card-primitives'

export const dynamic = 'force-static'

export function GET() {
	return new ImageResponse(<HireSquareCard />, {
		width: CARD_SIZE,
		height: CARD_SIZE
	})
}
