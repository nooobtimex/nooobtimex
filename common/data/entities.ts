import type { Organization } from '../interfaces'
import { assets } from './assets'
import { personalData } from './personal'

export const ruamsukPlating: Organization = {
	id: 'ruamsuk-plating',
	name: 'RUAMSUK PLATING LIMITED PARTNERSHIP',
	logo: assets.logos.rsTrophy,
	location: 'pathumthani-thailand',
	type: 'company',
	url: 'https://rs-trophy.com',
	description:
		'Thai awards manufacturer behind the RS TROPHY storefront, which absorbed its former RS Medal and RS Award sites — custom trophies, plaques, and medals, with the entire technology stack built and run in house.',
	about:
		'A Thai limited partnership (est. 2006) in Pathum Thani that designs and manufactures trophies, medals, and award plaques under the RS TROPHY brand, running an in-house facility for design, zinc casting, laser engraving, and metal electroplating. It sells nationwide and consolidated its former RS Medal and RS Award storefronts into rs-trophy.com.',
	industry: 'Awards & trophy manufacturing · metal electroplating',
	founded: '2006',
	headquarters: 'Mueang, Pathum Thani, Thailand',
	size: 'Small limited partnership',
	parentGroup: 'Independent',
	products: [
		'Trophies',
		'Medals',
		'Award plaques & shields',
		'RS TROPHY storefront',
		'Metal electroplating & laser engraving'
	],
	highlights: [
		'In-house Pathum Thani facility: design, zinc casting, laser engraving, electroplating, and QA.',
		'Consolidated the RS Award and RS Medal storefronts into the RS TROPHY brand.',
		'Registered limited partnership (est. 2006) selling awards nationwide across Thailand.'
	]
}

export const jasmineTechnologySolution: Organization = {
	id: 'jasmine-technology-solution',
	name: 'Jasmine Technology Solution',
	logo: assets.logos.jasmineTech,
	location: 'nonthaburi-thailand',
	type: 'company',
	url: 'https://www.jts.co.th',
	description:
		'Software solutions company — home of the LOOKLOOK PET platform work: storefront, B2B partner console, microservices, and multi-vendor marketplace.',
	about:
		'A SET-listed Thai ICT and telecom systems-integration company, founded in 1995 as Jasmine Telecom Systems and renamed Jasmine Technology Solution in 2021. Its largest shareholder is Jasmine International PCL (~44%). Alongside its core integration business it runs IaaS/cloud, Bitcoin mining, and generative-AI ventures.',
	industry: 'ICT & telecom systems integration',
	founded: '1995',
	headquarters: 'Pak Kret, Nonthaburi, Thailand',
	size: 'SET-listed public company',
	parentGroup: 'Jasmine International PCL (SET: JAS) · ~44%',
	stockTicker: 'SET: JTS',
	products: [
		'ICT system design & installation',
		'Telecom systems & services',
		'Infrastructure-as-a-Service (IaaS)',
		'Bitcoin mining',
		'Generative AI / Cloud AI',
		'Smart building systems'
	],
	highlights: [
		'Listed on the SET as JTS; largest shareholder Jasmine International PCL at ~44% (a plurality, not a majority).',
		'Renamed from Jasmine Telecom Systems to Jasmine Technology Solution in October 2021.',
		'Expanded into Bitcoin mining in 2021, alongside IaaS and generative-AI ventures.'
	]
}

export const jasTv: Organization = {
	id: 'jas-tv',
	name: 'JAS TV',
	location: 'nonthaburi-thailand',
	type: 'company',
	url: 'https://www.jasmine.com/en/our-business/jas-tv',
	description:
		"Jasmine International's internet-TV arm. Its parent group, JAS, holds the exclusive English Premier League & Emirates FA Cup rights for Thailand, Laos, and Cambodia (2025/26–2030/31), distributed via Mono.",
	about:
		"The internet-TV and family-entertainment arm of Jasmine International PCL (SET: JAS), a Thai ICT and media group founded in 1982. Its parent JAS holds the exclusive English Premier League and Emirates FA Cup rights for Thailand, Laos, and Cambodia (2025/26–2030/31), distributed through Mono Group's MONOMax and Mono29.",
	industry: 'Internet-TV / streaming & media',
	founded: '1982',
	headquarters: 'Pak Kret, Nonthaburi, Thailand',
	size: 'Business unit of the JAS group',
	parentGroup: 'Jasmine International PCL (SET: JAS)',
	stockTicker: 'SET: JAS (parent)',
	products: [
		'JAS TV internet & TV entertainment',
		'Live programs, movies & series library',
		'Premier League & FA Cup rights (via parent JAS)',
		'MONOMax & Mono29 (distribution partners)'
	],
	highlights: [
		'Parent JAS won exclusive 6-season Premier League & FA Cup rights for Thailand/Laos/Cambodia (2025/26–2030/31), confirmed Nov 2024.',
		'The rights deal is valued at roughly US$560M (≈THB 19.17bn).',
		"Football is distributed via Mono Group's MONOMax streaming and the Mono29 channel; 2025/26 kicked off 16 Aug 2025."
	]
}

export const monomax: Organization = {
	id: 'monomax',
	name: 'MONOMax',
	location: 'nonthaburi-thailand',
	type: 'company',
	url: 'https://www.monomax.me',
	description:
		"Mono Group's SVOD streaming platform (Mono Next PCL). MONOMax Sports Premium streams the English Premier League — the platform the EPL licensing portal provisions venue accounts for.",
	about:
		'A Thai SVOD streaming service run by Mono Streaming Co., Ltd. under SET-listed Mono Next PCL (Mono Group), a leading Thai media company founded in 2002. Its MONOMax Sports Premium tier streams the English Premier League — with the rights held by Jasmine (JAS) and Mono as distribution partner — and passed 1 million subscribers in 2025.',
	industry: 'OTT / SVOD streaming & media',
	founded: '2002',
	headquarters: 'Pak Kret, Nonthaburi, Thailand',
	size: '1M+ subscribers (2025)',
	parentGroup: 'Mono Group — Mono Next PCL',
	stockTicker: 'SET: MONO',
	products: [
		'MONOMax (SVOD)',
		'MONOMax Sports Premium (EPL)',
		'MONOMax Sports TV (ex-MONO29)',
		'Mono Original',
		'MThai'
	],
	highlights: [
		'Run by Mono Streaming Co., Ltd. under SET-listed Mono Next PCL (SET: MONO).',
		'MONOMax Sports Premium streams the EPL — rights held by JAS, distributed by Mono.',
		'Passed 1M Standard-package subscribers in October 2025, driven by EPL demand.'
	]
}

export const freelance: Organization = {
	id: 'freelance',
	name: 'Freelance',
	location: 'remote',
	type: 'company',
	// The hire link, so "Visit Organization" on /career/freelance and "Website" on
	// /companies/freelance both land where a client can actually hire.
	url: personalData.hire.url,
	description: 'Remote freelance web-app engineering, delivered end-to-end from scoping to deployment.',
	about:
		'Independent, remote freelance software engineering — building web apps end-to-end for clients, from scoping and design through full-stack build and deployment.',
	industry: 'Freelance web-app engineering',
	founded: '2024',
	headquarters: 'Remote',
	size: 'Independent',
	parentGroup: 'Independent',
	products: ['End-to-end web development', 'Full-stack delivery', 'Scoping → deployment'],
	highlights: [
		'Collaborative, end-to-end delivery — scoping, build, and ship.',
		"Scalable web solutions tailored to each client's needs."
	]
}

export const thammasatUniversity: Organization = {
	id: 'thammasat-university',
	name: 'Thammasat University',
	logo: assets.logos.tuLogo,
	location: 'pathumthani-thailand',
	type: 'university',
	url: 'https://www.tu.ac.th',
	description: "One of Thailand's leading universities — where the engineering foundation was laid.",
	about:
		"One of Thailand's leading public research universities, founded in 1934 by Pridi Banomyong as the University of Moral and Political Sciences. Its flagship Rangsit campus in Pathum Thani hosts engineering — including the international SIIT — alongside medicine and the sciences, while the original Tha Prachan campus sits in Bangkok.",
	industry: 'Higher education (public research university)',
	founded: '1934',
	headquarters: 'Rangsit, Pathum Thani, Thailand',
	size: '~40,000 students',
	parentGroup: 'Independent (autonomous public university)',
	products: [
		'Faculty of Law',
		'Political Science',
		'Economics',
		'Thammasat Business School',
		'Faculty of Medicine',
		'SIIT — engineering & technology'
	],
	highlights: [
		"Thailand's second-oldest university, founded 1934 by Pridi Banomyong.",
		'National autonomous public university across four campuses (Tha Prachan, Rangsit, Pattaya, Lampang).',
		'SIIT — the Sirindhorn International Institute of Technology — offers English-medium international engineering programmes.'
	]
}

export const entitiesData: Organization[] = [ruamsukPlating, jasmineTechnologySolution, jasTv, monomax, freelance]
