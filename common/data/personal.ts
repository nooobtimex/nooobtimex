import type { ContactChannel, PersonalData } from '../interfaces'
import { assets } from './assets'

/**
 * Direct messaging channels for /contact. Ordered most-useful-first for a trade-fair
 * exchange: WeChat leads because it is the only one that works inside mainland China.
 *
 * TO ADD THE REMAINING CHANNELS: uncomment the block below and fill in the real values.
 * Nothing renders while an entry is absent, so the page stays correct until then.
 *
 *   {
 *   	id: 'phone',
 *   	label: 'Phone',
 *   	icon: 'mdi:phone',
 *   	value: '+66 XX XXX XXXX',      // display form
 *   	url: 'tel:+66XXXXXXXXX',       // E.164, no spaces
 *   	inChina: true
 *   },
 *   {
 *   	id: 'whatsapp',
 *   	label: 'WhatsApp',
 *   	icon: 'simple-icons:whatsapp',
 *   	value: '+66 XX XXX XXXX',
 *   	url: 'https://wa.me/66XXXXXXXXX',  // digits only — no '+', no leading zero
 *   	inChina: false
 *   },
 *   {
 *   	id: 'line',
 *   	label: 'LINE',
 *   	icon: 'simple-icons:line',
 *   	value: '<your-line-id>',
 *   	// LINE documents links for Official Accounts only. This personal form is widely
 *   	// used but undocumented — treat it as best-effort; the copyable ID is the real path.
 *   	url: 'https://line.me/ti/p/~<your-line-id>',
 *   	inChina: false
 *   },
 */
const contactChannels: ContactChannel[] = [
	{
		id: 'wechat',
		label: 'WeChat',
		icon: 'simple-icons:wechat',
		// The fallback path when the QR token below stops working — someone can still
		// search this ID in WeChat manually.
		value: 'nooobtimex',
		// Decoded from the owner's personal "add me as friend" QR.
		// OPAQUE BYTE SEQUENCE — do not normalise, trim, or drop the '?s=2'. Any edit
		// silently produces a QR that encodes a different string and stops working.
		// No expiry timer, but tapping "Reset QR Code" in WeChat kills it with no error
		// surface: a dead token just redirects to wechat.com. Update `verifiedOn` on re-check.
		qr: 'https://u.wechat.com/kBBUbWG51gDXWUlnBQ_BdfY?s=2',
		verifiedOn: '2026-07-20',
		inChina: true,
		note: 'Scan in WeChat — the only channel that works inside mainland China'
	}
]

const AVAILABILITY_LEAD = 'Building and running technology at'
const EMPLOYER_NAME = 'RS TROPHY'

export const personalData: PersonalData = {
	name: 'Wongsaphat Puangsorn',
	alternateNames: ['วงศพัทธ์ พวงซ้อน', 'NooobtimeX', 'Kwan', 'ขวัญ'],
	employer: {
		name: EMPLOYER_NAME,
		url: 'https://rs-trophy.com',
		entityId: 'https://rs-trophy.com/#organization',
		// The About-page card on that site, which links back here.
		profileUrl: 'https://rs-trophy.com/en/aboutus#cto'
	},
	title: 'Chief Technology Officer',
	heroRole: 'Software, robots, and things that work.',
	pitch:
		'I’m Kwan, a software engineer and CTO at RS TROPHY. I build the systems behind our family business, work on humanoid robots at Thaibotic, and make games in Roblox.',
	tagline:
		'CTO at RS TROPHY and co-founder of Thaibotic. Building software, working with robots, and making a Roblox game in Thailand.',
	avatar: assets.personal.avatar,
	about: {
		bio: "I'm Wongsaphat Puangsorn (วงศพัทธ์ พวงซ้อน), known as Kwan (ขวัญ) and online as NooobtimeX. I grew up around our family trophy business and now lead its technology as CTO of RS TROPHY. I take systems from the first idea through design, code, deployment, and the work of keeping them running. Alongside that, I co-founded Thaibotic, where I build software for a Unitree G1 humanoid robot. I’m also making a Roblox game — something I enjoy building for myself.",
		highlights: [
			'CTO at RS TROPHY, responsible for technology across the business',
			'Co-founder of Thaibotic, building software for a humanoid robot',
			'Previously a full-stack developer at JTS, July 2025–July 2026',
			'Building a Roblox game and writing about what I learn'
		]
	},
	contact: {
		email: 'nooobtimex@gmail.com',
		location: 'Nonthaburi',
		availabilityLead: AVAILABILITY_LEAD,
		availability: `${AVAILABILITY_LEAD} ${EMPLOYER_NAME}`,
		locality: 'Nonthaburi',
		country: 'Thailand',
		givenName: 'Wongsaphat',
		familyName: 'Puangsorn'
	},
	languages: [
		{ name: 'Thai', level: 'Native', code: 'th' },
		{ name: 'English', level: 'Professional working', code: 'en' }
	],
	socialLinks: [
		{
			platform: 'github',
			url: 'https://github.com/NooobtimeX',
			icon: 'simple-icons:github',
			username: 'NooobtimeX'
		},
		{
			platform: 'linkedin',
			url: 'https://www.linkedin.com/in/nooobtimex',
			icon: 'simple-icons:linkedin',
			username: 'nooobtimex'
		},
		{
			platform: 'youtube',
			url: 'https://www.youtube.com/@nooobtimex',
			icon: 'simple-icons:youtube',
			username: '@nooobtimex'
		},
		{
			platform: 'instagram',
			url: 'https://www.instagram.com/nooobtimex',
			icon: 'simple-icons:instagram',
			username: 'nooobtimex'
		},
		{
			platform: 'email',
			url: 'mailto:nooobtimex@gmail.com',
			icon: 'simple-icons:gmail',
			username: 'nooobtimex@gmail.com'
		},
		{
			platform: 'website',
			url: 'https://nooobtimex.me',
			icon: 'mdi:web',
			username: 'nooobtimex.me'
		}
	],
	contactAction: {
		url: 'mailto:nooobtimex@gmail.com',
		label: 'Say hello'
	},
	contactChannels
}
