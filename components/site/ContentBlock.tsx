'use client'

import { type HTMLAttributes, useEffect } from 'react'
import { useAnimate, useInView, useReducedMotion } from 'framer-motion'

interface ContentBlockProps extends HTMLAttributes<HTMLDivElement> {
	delay?: number
	y?: number
}

export default function ContentBlock({ delay = 0, y = 12, children, ...props }: ContentBlockProps) {
	const [scope, animate] = useAnimate<HTMLDivElement>()
	const visible = useInView(scope, { once: true, amount: 0.1 })
	const reduced = useReducedMotion()
	useEffect(() => {
		if (!visible || reduced !== false) return
		const controls = animate(
			scope.current,
			{ transform: [`translateY(${y}px) scale(.985)`, 'translateY(0) scale(1)'] },
			{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }
		)
		return () => controls.stop()
	}, [animate, scope, visible, reduced, delay, y])
	return (
		<div ref={scope} {...props}>
			{children}
		</div>
	)
}
