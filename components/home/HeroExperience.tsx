'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import styles from './home.module.css'
import type { SceneController, SceneMode } from './scene'

export interface HeroMode {
	id: SceneMode
	label: string
	description: string
}

function SceneFallback({ mode }: { mode: SceneMode }) {
	return (
		<svg className={styles.fallback} viewBox='0 0 600 600' aria-hidden='true'>
			<defs>
				<linearGradient id='sculpture-white' x2='1' y2='1'>
					<stop stopColor='#fff' />
					<stop offset='1' stopColor='#bfc5cf' />
				</linearGradient>
			</defs>
			<ellipse cx='300' cy='502' rx='170' ry='17' fill='#17191c' opacity='.07' />
			{mode === 'robotics' ?
				<g stroke='#17191c' strokeWidth='2' strokeLinejoin='round'>
					<rect x='271' y='91' width='58' height='76' rx='24' fill='#111723' />
					<path
						d='M282 111Q300 96 318 111L316 139Q300 164 284 139Z M284 120h32'
						fill='none'
						stroke='#89bcff'
						strokeWidth='3'
					/>
					<path d='M290 167h20v15h-20z' fill='#17191c' />
					<path d='M244 183Q300 172 356 183L337 291Q300 304 263 291Z' fill='url(#sculpture-white)' />
					<path d='M294 200h12l-6 7z' fill='#17191c' />
					<path d='M278 298h44v29h-44z' fill='#17191c' />
					{[-1, 1].map(side => (
						<g key={side}>
							<circle cx={300 + side * 65} cy='196' r='16' fill='#bfc5cf' />
							<path d={`M${300 + side * 70} 212l${side * 8} 47`} stroke='#bfc5cf' strokeWidth='25' />
							<circle cx={300 + side * 78} cy='269' r='12' fill='#17191c' />
							<path d={`M${300 + side * 78} 282v43`} stroke='#bfc5cf' strokeWidth='22' />
							<rect x={289 + side * 78} y='334' width='22' height='25' rx='4' fill='#17191c' />
							<rect x={285 + side * 24} y='325' width='30' height='64' rx='8' fill='url(#sculpture-white)' />
							<circle cx={300 + side * 24} cy='397' r='13' fill='#17191c' />
							<rect x={287 + side * 26} y='413' width='26' height='66' rx='7' fill='url(#sculpture-white)' />
							<rect x={279 + side * 27} y='480' width='42' height='16' rx='5' fill='#17191c' />
						</g>
					))}
				</g>
			: mode === 'systems' ?
				<g stroke='#17191c' strokeWidth='3' strokeLinejoin='round'>
					<path d='M116 424l244-54 128 83-250 56z' fill='url(#sculpture-white)' />
					<path d='M182 310v110h113V310m0 110h123V291m-123 129v32h68' fill='none' stroke='#2845ee' strokeWidth='6' />
					<rect x='102' y='205' width='156' height='108' rx='9' fill='#17191c' />
					<path d='M113 218h134v81H113z' fill='#fff' />
					<path d='M128 281v-22m32 22v-38m32 38v-15m32 15v-48' stroke='#2845ee' strokeWidth='14' />
					<path d='M175 314v34m-32 0h64' fill='none' />
					{[0, 1, 2].map(i => (
						<rect
							key={i}
							x='260'
							y={312 + i * 27}
							width='74'
							height='22'
							rx='4'
							fill={i === 0 ? '#2845ee' : '#bfc5cf'}
						/>
					))}
					<rect x='262' y='212' width='72' height='72' rx='10' fill='#2845ee' />
					<path d='M283 236l-9 12 9 12m30-24 9 12-9 12m-12-17-6 30' fill='none' stroke='#fff' />
					{[0, 1, 2].map(i => (
						<g key={i}>
							<path d={`M373 ${270 + i * 26}v23c0 14 91 14 91 0v-23`} fill={i === 1 ? '#2845ee' : '#bfc5cf'} />
							<ellipse cx='418' cy={270 + i * 26} rx='45' ry='11' fill='url(#sculpture-white)' />
						</g>
					))}
					<rect x='340' y='413' width='104' height='59' rx='6' fill='#fff' />
					<path d='M353 435h78m-78 16h18m12 0h18m12 0h18' stroke='#2845ee' />
				</g>
			:	<g stroke='#17191c' strokeWidth='3' strokeLinejoin='round'>
					<rect x='303' y='174' width='176' height='112' rx='9' fill='#17191c' />
					<path d='M314 186h154v87H314z' fill='#fff' />
					<path d='M335 260v-31h28v31m18 0v-49h28v49m18 0v-20h28v20' fill='#2845ee' />
					<path d='M386 287v41m-38 0h76' fill='none' />
					<rect x='492' y='231' width='37' height='108' rx='6' fill='url(#sculpture-white)' />
					<circle cx='510' cy='258' r='9' fill='#2845ee' />
					<circle cx='510' cy='286' r='9' fill='#2845ee' />
					<rect x='100' y='262' width='53' height='105' rx='9' fill='#17191c' />
					<path d='M108 274h37v80h-37z' fill='#fff' />
					<path d='M117 294h18m-18 15h18m-18 15h18' stroke='#2845ee' />
					<g transform='rotate(-5 245 320)'>
						<rect x='215' y='204' width='55' height='55' rx='7' fill='url(#sculpture-white)' />
						<circle cx='232' cy='224' r='2' />
						<circle cx='251' cy='224' r='2' />
						<path d='M234 239q8 7 16 0' fill='none' />
						<path d='M200 266h83v83h-83z' fill='#2845ee' />
						<path d='M228 285h28v28h-28z' fill='#fff' transform='rotate(16 242 299)' />
						<path d='M238 295h9v9h-9z' fill='#2845ee' />
						<path d='M168 268h27v78h-27zm120 0h27v78h-27z' fill='url(#sculpture-white)' />
						<path d='M204 355h32v73h-32zm42 0h32v73h-32z' fill='#17191c' />
					</g>
					<rect x='360' y='355' width='126' height='84' rx='8' fill='#17191c' />
					<path d='M369 364h108v65H369z' fill='#fff' />
					<path d='M381 376h35v40h-35z' fill='#2845ee' />
					<path d='M429 381h34m-34 14h34m-34 14h34' stroke='#bfc5cf' />
					<g transform='rotate(-9 247 451)'>
						<path
							d='M169 422Q153 426 151 462l-5 27q14 16 29-3l17-18h94l17 18q15 19 29 3l-5-27q-2-36-18-40z'
							fill='url(#sculpture-white)'
						/>
						<path d='M174 438h24m-12-12v24' strokeWidth='7' />
						<circle cx='216' cy='454' r='9' fill='#17191c' />
						<circle cx='260' cy='454' r='9' fill='#17191c' />
						<circle cx='289' cy='435' r='5' fill='#2845ee' />
						<circle cx='305' cy='447' r='5' fill='#2845ee' />
					</g>
				</g>
			}
		</svg>
	)
}

export default function HeroExperience({ modes }: { modes: readonly HeroMode[] }) {
	const host = useRef<HTMLDivElement>(null)
	const controller = useRef<SceneController | null>(null)
	const [mode, setMode] = useState<SceneMode>('robotics')
	const [paused, setPaused] = useState(false)
	const [failed, setFailed] = useState(false)
	const desired = useRef({ mode, paused })
	useEffect(() => {
		let cancelled = false
		let active: SceneController | null = null
		const element = host.current
		if (!element) return
		void import('./scene')
			.then(({ createScene }) => {
				if (cancelled) return
				try {
					active = createScene(element, () => {
						setFailed(true)
						active?.dispose()
						controller.current = null
					})
					controller.current = active
					active.setMode(desired.current.mode)
					active.setPaused(desired.current.paused)
				} catch {
					setFailed(true)
				}
			})
			.catch(() => {
				if (!cancelled) setFailed(true)
			})
		return () => {
			cancelled = true
			active?.dispose()
			controller.current = null
		}
	}, [])
	useEffect(() => {
		desired.current.mode = mode
		controller.current?.setMode(mode)
	}, [mode])
	useEffect(() => {
		desired.current.paused = paused
		controller.current?.setPaused(paused)
	}, [paused])
	return (
		<div className={styles.experience}>
			<div className={styles.sceneWrap}>
				<div className={styles.scene} ref={host} data-failed={failed || undefined}>
					<SceneFallback mode={mode} />
				</div>
				<button
					className={styles.motionToggle}
					type='button'
					aria-label={paused ? 'Resume animation' : 'Pause animation'}
					aria-pressed={paused}
					onClick={() => setPaused(value => !value)}>
					{paused ?
						<Play size={15} />
					:	<Pause size={15} />}
				</button>
			</div>
			<div className={styles.sceneControls}>
				<div className={styles.modeList} role='group' aria-label='Explore what I build'>
					{modes.map(item => (
						<button
							type='button'
							key={item.id}
							aria-pressed={mode === item.id}
							className={styles.mode}
							onClick={() => setMode(item.id)}>
							<span className={styles.modeDot} />
							{item.label}
						</button>
					))}
				</div>
				<p className={styles.modeDescription} aria-live='polite'>
					{modes.find(item => item.id === mode)?.description}
				</p>
			</div>
		</div>
	)
}
