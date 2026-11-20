import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
	as?: 'div' | 'section' | 'main'
}

/**
 * The one page container — consistent max width + horizontal padding across every
 * page. Pass extra spacing (e.g. py) via className. Change the width here once.
 */
const Container: React.FC<ContainerProps> = ({ as: Tag = 'div', className, ...props }) => (
	<Tag className={cn('comic-page mx-auto w-full max-w-[1600px] px-5 md:px-10 xl:px-14', className)} {...props} />
)

export default Container
