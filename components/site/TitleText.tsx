import type { ElementType } from 'react'

export default function TitleText({
	text,
	className,
	as: Tag = 'span'
}: {
	text: string
	className?: string
	as?: ElementType
}) {
	return <Tag className={className}>{text}</Tag>
}
