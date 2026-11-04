import type { PersonalData } from '@/common'

/**
 * vCard 3.0 (RFC 2426) generation.
 *
 * Why 3.0 and not 4.0: Android's AOSP vCard library and iOS's own Contacts export both
 * emit 3.0, and 4.0 import support is inconsistent across Outlook and the Chinese Android
 * skins (MIUI / HarmonyOS / ColorOS) a supplier at Yiwu is most likely to be holding.
 * 3.0 is the version that actually imports everywhere.
 *
 * Two payloads come out of `buildVCard`:
 *   - the CORE (default) is what the QR encodes — the fields people actually use
 *     (name, title, company, email, site). Kept lean on purpose: QR
 *     scannability is the binding constraint, so ~≤300 chars and no photo/socials.
 *   - the RICH set (`rich: true`) is the downloadable .vcf — core plus province,
 *     nickname, labelled social links, a hosted photo URL and a note.
 *     Not size-constrained, but still curated: a photo is linked, never embedded
 *     (a base64 headshot adds ~10k chars and breaks the QR), and socials are real
 *     URLs (Apple item-labels degrade to a bare URL elsewhere) because Google
 *     Contacts silently strips custom `X-` properties.
 */

const CRLF = '\r\n'

/** RFC 2426 §5: backslash, comma and semicolon are escaped; newlines become a literal \n. */
const esc = (value: string): string =>
	value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

/** Apple Contacts shows `itemN.URL` + `itemN.X-ABLabel` as a labelled link; others keep the URL. */
const SOCIAL_LABEL: Record<string, string> = {
	github: 'GitHub',
	linkedin: 'LinkedIn',
	youtube: 'YouTube',
	instagram: 'Instagram'
}

export interface VCardOptions {
	/**
	 * Include the rich extras (province, nickname, socials, photo, note).
	 * Leave off for the QR payload — every extra property pushes the symbol to a
	 * higher version, and a denser code is harder to scan off a phone screen.
	 */
	rich?: boolean
	/** Organisation line — a core field, passed by the caller from the current role. */
	org?: string
}

/** Digits-and-plus only — `tel:` URIs and display forms both normalise to this. */
const normalisePhone = (raw: string): string => raw.replace(/^tel:/, '').replace(/[^\d+]/g, '')

const findPhone = (p: PersonalData): string | undefined => {
	const raw = p.contactChannels?.find(c => c.id === 'phone' || c.id === 'whatsapp')?.url
	if (!raw) return undefined
	const normalised = normalisePhone(raw)
	return normalised.length > 3 ? normalised : undefined
}

const websiteUrl = (p: PersonalData): string =>
	p.socialLinks.find(s => s.platform === 'website')?.url ?? 'https://nooobtimex.me'

/**
 * Build a vCard 3.0 payload. Returns a CRLF-delimited string ready to write to a `.vcf`
 * blob or encode into a QR.
 */
export function buildVCard(p: PersonalData, options: VCardOptions = {}): string {
	const { rich = false, org } = options

	const given = p.contact.givenName ?? p.name.split(' ')[0] ?? p.name
	const family = p.contact.familyName ?? p.name.split(' ').slice(1).join(' ')
	const fullName = [given, family].filter(Boolean).join(' ')
	const phone = findPhone(p)

	const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']

	// --- CORE (also the QR payload): the fields people actually use ---
	// FN, N and VERSION are the three MUST properties in RFC 2426.
	lines.push(`N:${esc(family)};${esc(given)};;;`)
	lines.push(`FN:${esc(fullName)}`)
	lines.push(`TITLE:${esc(p.title)}`)
	if (org) lines.push(`ORG:${esc(org)}`)
	if (phone) lines.push(`TEL;TYPE=CELL,VOICE:${esc(phone)}`)
	lines.push(`EMAIL;TYPE=INTERNET,PREF:${esc(p.contact.email)}`)
	lines.push(`URL:${esc(websiteUrl(p))}`)

	// --- RICH extras (.vcf download only) ---
	if (rich) {
		const nickname = p.socialLinks.find(s => s.platform === 'github')?.username
		if (nickname) lines.push(`NICKNAME:${esc(nickname)}`)

		// ADR has seven components: PO box; extended; street; locality; region; postcode; country.
		// City and country only — never a street address on a public page.
		if (p.contact.locality || p.contact.country) {
			lines.push(`ADR;TYPE=WORK:;;;${esc(p.contact.locality ?? '')};;;${esc(p.contact.country ?? '')}`)
		}

		// Socials as labelled URLs (Apple item-grouping; a bare URL everywhere else).
		let item = 0
		for (const social of p.socialLinks) {
			const label = SOCIAL_LABEL[social.platform]
			if (!label) continue
			item += 1
			lines.push(`item${item}.URL:${esc(social.url)}`)
			lines.push(`item${item}.X-ABLabel:${esc(label)}`)
		}

		const wechat = p.contactChannels?.find(c => c.id === 'wechat' && c.value)
		if (wechat) lines.push(`X-SOCIALPROFILE;type=wechat:${esc(wechat.value)}`)

		// Hosted photo — a URI, never an embedded base64 blob (that would break the QR
		// and most contact apps won't render webp anyway; this is best-effort).
		lines.push(`PHOTO;VALUE=URI:${esc(websiteUrl(p) + p.avatar)}`)

		const langs = p.languages.map(l => `${l.name} (${l.level})`).join(', ')
		const noteParts = [p.tagline, p.contact.availability, `Languages: ${langs}`]
		if (wechat) noteParts.push(`WeChat: ${wechat.value}`)
		lines.push(`NOTE:${esc(noteParts.join('\n'))}`)
	}

	lines.push('END:VCARD')

	return lines.join(CRLF) + CRLF
}

/** Filename for the downloadable card, e.g. 'wongsaphat-puangsorn.vcf'. */
export function vCardFilename(p: PersonalData): string {
	const given = p.contact.givenName ?? ''
	const family = p.contact.familyName ?? ''
	const base = [given, family].filter(Boolean).join('-').toLowerCase() || 'contact'
	return `${base}.vcf`
}
