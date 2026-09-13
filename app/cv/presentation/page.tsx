import React from 'react'
import PresentationView, { type PresentationData } from '@/components/cv/PresentationView'
import {
	type SkillCategory,
	categoryMetadata,
	entitiesData,
	experiencesData,
	featuredProjects,
	featuredSkills,
	latestRole,
	personalData,
	workExperienceData
} from '@/common'

const STACK_ORDER: SkillCategory[] = ['frontend', 'backend', 'infrastructure', 'growth-management']

const entityName = (id?: string) => (id ? (entitiesData.find(e => e.id === id)?.name ?? null) : null)

/**
 * A server component on purpose: the deck is interactive, but its data must not be imported
 * by the client — see `PresentationData`. This page assembles exactly what the slides show and
 * hands it over as one serializable prop.
 */
const data: PresentationData = {
	personal: {
		name: personalData.name,
		tagline: personalData.tagline,
		about: personalData.about,
		languages: personalData.languages,
		email: personalData.contact.email,
		website: personalData.socialLinks.find(s => s.platform === 'website')?.username ?? 'nooobtimex.me'
	},
	latestPosition: latestRole.position,
	roles: workExperienceData.slice(0, 4).map(r => ({
		id: r.id,
		credential: r.credential,
		position: r.position,
		startDate: r.startDate,
		endDate: r.endDate,
		description: r.description,
		organization: r.organization.name
	})),
	stack: STACK_ORDER.map(category => ({
		category,
		label: categoryMetadata[category].label,
		skills: featuredSkills.filter(s => s.category === category).map(s => ({ name: s.name, icon: s.icon }))
	})).filter(group => group.skills.length > 0),
	projects: featuredProjects.map(p => {
		const roleId = p.linkedExperienceIds?.[0]
		return {
			id: p.id,
			title: p.title,
			description: p.description,
			startDate: p.startDate,
			endDate: p.endDate,
			cover: p.images.cover,
			live: p.links.live,
			// Client = explicit client org if set (e.g. MONOMax), else the delivering role's organization.
			client:
				p.clientOrganizationId ? entityName(p.clientOrganizationId)
				: roleId ? (experiencesData.find(e => e.id === roleId)?.organization.name ?? null)
				: null,
			via: entityName(p.viaOrganizationId),
			activeSkills: p.activeSkills.map(s => ({ name: s.name, icon: s.icon })),
			retiredSkills: p.retiredSkills.map(s => ({ name: s.name, icon: s.icon }))
		}
	})
}

export default function PresentationPage() {
	return <PresentationView data={data} />
}
