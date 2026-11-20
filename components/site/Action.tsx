import React from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const actionVariants = cva(
	'comic-action inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				solid: 'bg-brand text-primary-foreground hover:bg-brand/90',
				outline: 'border border-brand/60 text-brand hover:bg-brand/10 hover:border-brand',
				danger: 'border border-danger/60 text-danger hover:bg-danger/10',
				ghost: 'text-muted-foreground hover:text-brand'
			},
			size: {
				sm: 'min-h-11 px-4',
				md: 'min-h-11 px-5',
				lg: 'h-12 px-7 text-sm'
			}
		},
		defaultVariants: { variant: 'solid', size: 'md' }
	}
)

type ActionProps = VariantProps<typeof actionVariants> & {
	className?: string
	children: React.ReactNode
} & (
		| ({ href: Route | string; external?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
		| ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
	)

/**
 * Shared action element. Renders <button>, internal <Link>, or external <a>.
 */
const Action: React.FC<ActionProps> = ({ variant, size, className, children, ...props }) => {
	const classes = cn(actionVariants({ variant, size }), className)

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
				<a data-variant={variant ?? 'solid'} href={href} className={classes} {...rest}>
					{children}
				</a>
			)
		}

		if (external) {
			return (
				<a
					data-variant={variant ?? 'solid'}
					href={href}
					target='_blank'
					rel='noopener noreferrer'
					className={classes}
					{...rest}>
					{children}
				</a>
			)
		}
		return (
			<Link data-variant={variant ?? 'solid'} href={href as Route} className={classes} {...rest}>
				{children}
			</Link>
		)
	}

	const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>
	return (
		<button data-variant={variant ?? 'solid'} className={classes} {...buttonProps}>
			{children}
		</button>
	)
}

export default Action
