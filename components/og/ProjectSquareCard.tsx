/**
 * 1080×1080 shareable card for one project. See `card-primitives.tsx` for the
 * Satori constraints that apply to this whole folder.
 *
 * The meta values mirror what `components/projects/ProjectDetail.tsx` derives, so
 * the card and the page never disagree about a project's client, status or tier.
 */
import React from 'react'
import {
	CARD_SIZE,
	CardFooter,
	CornerBrackets,
	Kicker,
	MetaCell,
	PAD,
	StackGrid,
	type StackIcon,
	alpha,
	gridBackground,
	stripEmoji,
	truncate
} from '@/components/og/card-primitives'
import { iconDataUri } from '@/lib/og-assets'
import { OG } from '@/lib/og-palette'
import { type ProjectStatus, projectStatus } from '@/lib/utils'
import { type Project, entitiesData, experiencesData } from '@/common'

/** Same wording as the dossier (`ProjectDetail.tsx`), so the card and the page agree. */
const STATUS_LABEL = {
	'live': 'Active',
	'in-development': 'In Development',
	'archived': 'Archived'
} satisfies Record<ProjectStatus, string>

/**
 * The covers are 16:9, so 1080×608 shows one whole and uncropped. That matters:
 * a cover is already a finished composition — kicker, title, subtitle, stack line
 * and its own corner brackets — and cropping it lops off the top and bottom rows.
 *
 * Because the cover supplies the title, this card deliberately does NOT print one;
 * doing so stacked two titles on top of each other. The card's job is the part the
 * cover cannot do: real stack icons, and meta that stays in sync with the site.
 */
const COVER_HEIGHT = 608
/** Two rows of ten chips, with the last slot reserved for the `+N` overflow. */
const STACK_SLOTS = 19

/** Only used when the cover could not be embedded and the card has to name itself. */
const titleSize = (title: string) =>
	title.length <= 16 ? 78
	: title.length <= 30 ? 62
	: 52

/** Filled bars instead of `▲` — the default Satori font has no geometric-shapes glyphs. */
const TierBars: React.FC<{ tier: number; accent: string }> = ({ tier, accent }) => (
	<div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
		{[1, 2, 3].map(n => (
			<div
				key={n}
				style={{
					display: 'flex',
					width: 26,
					height: 12,
					backgroundColor: n <= tier ? accent : alpha(accent, 0.22)
				}}
			/>
		))}
	</div>
)

interface ProjectSquareCardProps {
	project: Project
	/** PNG data URI of the project cover, or null when it could not be embedded. */
	cover: string | null
}

const ProjectSquareCard: React.FC<ProjectSquareCardProps> = ({ project, cover }) => {
	const accent = project.accent
	const title = stripEmoji(project.title)
	const year = new Date(project.startDate).getFullYear()
	const status = projectStatus(project)
	const tier = Math.min(3, Math.max(1, Math.ceil(project.activeSkills.length / 4)))

	// Explicit client wins; otherwise fall back to the delivering role's org — same
	// precedence as ProjectDetail.
	const linkedRoles = (project.linkedExperienceIds ?? []).flatMap(id => {
		const role = experiencesData.find(e => e.id === id)
		return role ? [role] : []
	})
	const client =
		(project.clientOrganizationId ? entitiesData.find(e => e.id === project.clientOrganizationId) : undefined)
		?? linkedRoles[0]?.organization

	const icons = project.activeSkills.slice(0, STACK_SLOTS).flatMap<StackIcon>(skill => {
		const embedded = iconDataUri(skill.icon, { size: 48, color: OG.fg })
		return embedded ? [{ ...embedded, whiteBg: skill.whiteBg }] : []
	})
	const overflow = project.activeSkills.length - icons.length

	return (
		<div
			style={{
				...gridBackground(accent),
				position: 'relative',
				width: CARD_SIZE,
				height: CARD_SIZE,
				display: 'flex',
				flexDirection: 'column',
				color: OG.fg,
				fontFamily: 'sans-serif'
			}}>
			{/* Cover — shown whole; no overlay text, so nothing competes with its own typography. */}
			<div style={{ position: 'relative', display: 'flex', width: CARD_SIZE, height: COVER_HEIGHT }}>
				{
					cover ?
						<img src={cover} width={CARD_SIZE} height={COVER_HEIGHT} alt='' style={{ objectFit: 'cover' }} />
						// Fallback only: with no cover there is nothing to name the project, so the
						// card prints its own title block instead.
					:	<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								width: CARD_SIZE,
								height: COVER_HEIGHT,
								padding: `0 ${PAD}px`
							}}>
							<Kicker color={accent}>{'// PROJECT'}</Kicker>
							<div
								style={{
									display: 'flex',
									marginTop: 20,
									fontSize: titleSize(title),
									fontWeight: 800,
									lineHeight: 1.05,
									letterSpacing: -1,
									textTransform: 'uppercase'
								}}>
								{title}
							</div>
						</div>

				}
			</div>

			{/* Content. Explicit margins, not `space-between` — CardFooter pins itself with
			    `margin-top: auto`, which would swallow all the free space and collapse the
			    gap between the meta row and the stack grid. */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					padding: `34px ${PAD}px 44px`
				}}>
				<div style={{ display: 'flex', gap: 20 }}>
					<MetaCell label='Client' value={truncate(client?.name ?? 'Independent', 16)} accent={accent} />
					<MetaCell label='Year' value={String(year)} accent={accent} />
					<MetaCell
						label='Status'
						value={STATUS_LABEL[status]}
						color={status === 'archived' ? OG.muted : accent}
						accent={accent}
					/>
					<MetaCell label='Tier' value={<TierBars tier={tier} accent={accent} />} accent={accent} />
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', marginTop: 34 }}>
					<div style={{ display: 'flex', marginBottom: 14 }}>
						<Kicker size={22} color={accent}>
							{'STACK //'}
						</Kicker>
					</div>
					<StackGrid icons={icons} overflow={overflow} accent={accent} />
				</div>

				<CardFooter
					accent={accent}
					right={
						<div style={{ display: 'flex', color: accent, fontSize: 24, letterSpacing: 3 }}>
							{`${project.activeSkills.length} TECH`}
						</div>
					}
				/>
			</div>

			{/* Bottom pair only — the cover brings its own brackets along the top edge. */}
			<CornerBrackets only='bottom' color={accent} />
		</div>
	)
}

export default ProjectSquareCard
