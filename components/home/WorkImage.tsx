'use client'

import { type ReactNode, useRef, useSyncExternalStore } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import styles from './home.module.css'

const query = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
const subscribe = (callback: () => void) => {
	const media = matchMedia(query)
	media.addEventListener('change', callback)
	return () => media.removeEventListener('change', callback)
}
const getSnapshot = () => matchMedia(query).matches
const getServerSnapshot = () => false

export default function WorkImage({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLDivElement>(null)
	const fine = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
	const reduced = useReducedMotion()
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
	const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])
	return (
		<div ref={ref} className={styles.workImage}>
			<motion.div className={styles.imageInner} style={{ y: fine && reduced === false ? y : 0 }}>
				{children}
			</motion.div>
			<span className={styles.imageArrow} aria-hidden='true'>
				↗
			</span>
		</div>
	)
}
