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

export const personalData: PersonalData = {
	name: 'WONGSAPHAT PUANGSORN',
	title: 'Chief Technology Officer',
	heroRole: 'Software Engineer',
	pitch:
		'I build production web apps end to end — scope, UI, API, database and deploy — as the one engineer who owns all of it. Remote from Thailand, hired through Fastwork.',
	tagline:
		'Chief Technology Officer at RS Trophy, owning full-stack engineering and infrastructure end to end — freelancing remotely as a software engineer on web app projects on the side.',
	avatar: assets.personal.avatar,
	birthDate: '2003-04-19',
	about: {
		bio: 'Enthusiastic and dedicated technologist focused on transforming business requirements into clean, sustainable code. As CTO, I own every technology decision end-to-end — from technical strategy to single-handedly shipping software, infrastructure, and automation across the business. I am passionate about high-performance systems and modern infrastructure, and I freelance remotely as a software engineer building web apps alongside my full-time role.',
		highlights: [
			'Own end-to-end technology decisions, from strategy to shipped code',
			'Focused on building robust, high-performance systems',
			'Committed to clean and sustainable architecture principles',
			'Remote freelance software engineer for web app projects, alongside my full-time role'
		]
	},
	contact: {
		email: 'nooobtimex@gmail.com',
		phone: '+66855877024',
		location: 'Pak Kret District, Nonthaburi',
		availability:
			'Open for remote freelance web app projects alongside my full-time role as CTO at RS Trophy — hire me through Fastwork',
		locality: 'Pak Kret, Nonthaburi',
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
	hire: {
		url: 'https://fastwork.co/byob/DJpB7L1xWm?openExternalBrowser=1',
		platform: 'Fastwork',
		profileUrl: 'https://fastwork.co/user/nooobtimex',
		label: 'Hire me on Fastwork'
	},
	contactChannels
}
