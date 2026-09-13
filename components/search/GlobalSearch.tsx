'use client'

import React, { Suspense, use } from 'react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { NAV_LINKS } from '@/components/navigation/links'
import { loadSearchIndex } from '@/components/search/loadSearchIndex'
import type { SearchItem, SearchKind } from '@/components/search/types'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/components/ui/command'

interface GlobalSearchProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

/**
 * The palette's content groups, in display order. Each row's `value` — what cmdk matches
 * the query against — is the group prefix plus the row's text, exactly as it was when the
 * palette read the data arrays directly.
 */
const GROUPS: readonly { kind: SearchKind; heading: string }[] = [
	{ kind: 'post', heading: 'Journal' },
	{ kind: 'project', heading: 'Projects' },
	{ kind: 'skill', heading: 'Skills' },
	{ kind: 'career', heading: 'Career' },
	{ kind: 'company', heading: 'Companies' }
]

const Row: React.FC<{ item: SearchItem }> = ({ item }) => {
	switch (item.kind) {
		case 'post':
			return (
				<>
					<Icon icon='mdi:post-outline' className='text-cyber-cyan size-4' />
					<span className='truncate'>{item.title}</span>
				</>
			)
		case 'project':
			return (
				<>
					<Icon icon='mdi:folder-outline' className='text-cyber-yellow size-4' />
					<span>{item.title}</span>
				</>
			)
		case 'skill':
			return (
				<>
					<Icon icon={item.icon!} className='size-4' />
					<span>{item.title}</span>
				</>
			)
		case 'career':
			return (
				<>
					<Icon icon='mdi:briefcase-outline' className='text-cyber-cyan size-4' />
					<span className='truncate'>
						{item.title}
						<span className='text-muted-foreground'> — {item.detail}</span>
					</span>
				</>
			)
		case 'company':
			return (
				<>
					<Icon icon='mdi:domain' className='text-cyber-yellow size-4' />
					<span className='truncate'>{item.title}</span>
				</>
			)
	}
}

/** Career rows match on position then organisation, as they always have. */
const valueOf = (item: SearchItem) =>
	item.kind === 'career' ? `career ${item.detail} ${item.title}` : `${item.kind} ${item.title}`

/**
 * Suspends until the index arrives. NavBar starts that request on the open intent, so this
 * normally resolves at once; the Navigate group above renders either way.
 */
const IndexGroups: React.FC<{ go: (href: Route) => void }> = ({ go }) => {
	const items = use(loadSearchIndex())

	return GROUPS.map(({ kind, heading }) => (
		<CommandGroup key={kind} heading={heading}>
			{items
				.filter(item => item.kind === kind)
				.map(item => (
					<CommandItem key={`${kind}:${item.id}`} value={valueOf(item)} onSelect={() => go(item.href)}>
						<Row item={item} />
					</CommandItem>
				))}
		</CommandGroup>
	))
}

/**
 * Imports no data layer — only types. Every searchable row comes from the prerendered
 * `/search-index.json` (see `lib/search-index.ts` for why this palette must never import the
 * `@/common` arrays itself).
 */
const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
	const router = useRouter()

	const go = (href: Route) => {
		onOpenChange(false)
		router.push(href)
	}

	return (
		<CommandDialog
			open={open}
			onOpenChange={onOpenChange}
			className='border-cyber-cyan/40 bg-popover rounded-none! border'
			title='Search'
			description='Jump to a section, project, skill, or role.'>
			<CommandInput placeholder='> search projects, skills, experience…' />
			<CommandList>
				<CommandEmpty className='font-mono text-sm'>No matches found.</CommandEmpty>

				<CommandGroup heading='Navigate'>
					{NAV_LINKS.map(item => (
						<CommandItem key={item.href} value={`nav ${item.label}`} onSelect={() => go(item.href)}>
							<Icon icon={item.icon} className='text-cyber-cyan size-4' />
							<span className='font-mono uppercase'>{item.label}</span>
						</CommandItem>
					))}
				</CommandGroup>

				<Suspense fallback={null}>
					<IndexGroups go={go} />
				</Suspense>
			</CommandList>
		</CommandDialog>
	)
}

export default GlobalSearch
