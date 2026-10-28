import React from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const cyberButtonVariants = cva(
	'inline-flex items-center justify-center gap-2 font-mono text-xs font-semibold tracking-widest uppercase transition-all duration-150 clip-notch-sm select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				solid:
					'bg-cyber-yellow text-black hover:bg-cyber-yellow/80 hover:shadow-[0_0_18px_color-mix(in_oklch,var(--cyber-yellow),transparent_55%)]',
				outline: 'border border-cyber-cyan/60 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan',
				danger: 'border border-cyber-magenta/60 text-cyber-magenta hover:bg-cyber-magenta/10',
				ghost: 'text-muted-foreground hover:text-cyber-cyan'
			},
			size: {
				sm: 'h-8 px-3',
				md: 'h-10 px-5',
				lg: 'h-12 px-7 text-sm'
			}
		},
		defaultVariants: { variant: 'solid', size: 'md' }
	}
)

type CyberButtonProps = VariantProps<typeof cyberButtonVariants> & {
	className?: string
	children: React.ReactNode
} & (
		| ({ href: Route | string; external?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
		| ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
	)

/**
 * Cyberpunk action element. Renders <button>, internal <Link>, or external <a>.
 */
const CyberButton: React.FC<CyberButtonProps> = ({ variant, size, className, children, ...props }) => {
	const classes = cn(cyberButtonVariants({ variant, size }), className)

	if ('href' in props && props.href !== undefined) {
		const { href, external, ...rest } = props as {
			href: string
			external?: boolean
		} & React.AnchorHTMLAttributes<HTMLAnchorElement>

		// A download or a mailto:/tel: link must reach the browser's own handler. next/link
		// would intercept the click and route instead, and target='_blank' would flash a
		// tab, so these get a plain anchor.
		if (rest.download !== undefined || /^(mailto|tel):/.test(href)) {
			return (
				<a href={href} className={classes} {...rest}>
					{children}
				</a>
			)
		}

		if (external) {
			return (
				<a href={href} target='_blank' rel='noopener noreferrer' className={classes} {...rest}>
					{children}
				</a>
			)
		}
		return (
			<Link href={href as Route} className={classes} {...rest}>
				{children}
			</Link>
		)
	}

	const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>
	return (
		<button className={classes} {...buttonProps}>
			{children}
		</button>
	)
}

export default CyberButton
