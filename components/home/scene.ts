import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export type SceneMode = 'systems' | 'robotics' | 'play'
export interface SceneController {
	setMode: (mode: SceneMode) => void
	setPaused: (paused: boolean) => void
	dispose: () => void
}

export function createScene(host: HTMLElement, onFailure: () => void): SceneController {
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
	renderer.setClearColor(0x000000, 0)
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 0.95
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.domElement.setAttribute('aria-hidden', 'true')
	host.appendChild(renderer.domElement)

	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
	camera.position.set(0, 0.4, 9.5)
	camera.lookAt(0, 0.1, 0)
	const pmrem = new THREE.PMREMGenerator(renderer)
	const room = new RoomEnvironment()
	const environment = pmrem.fromScene(room, 0.04)
	scene.environment = environment.texture
	scene.environmentIntensity = 0.65
	room.dispose()
	pmrem.dispose()
	scene.add(new THREE.HemisphereLight(0xffffff, 0x9294b0, 1.5))
	const light = new THREE.DirectionalLight(0xffffff, 3)
	light.position.set(-4, 7, 6)
	light.castShadow = true
	light.shadow.mapSize.set(1024, 1024)
	light.shadow.camera.left = -5
	light.shadow.camera.right = 5
	light.shadow.camera.top = 5
	light.shadow.camera.bottom = -5
	light.shadow.normalBias = 0.04
	scene.add(light)
	const rim = new THREE.DirectionalLight(0xbac7ff, 2)
	rim.position.set(4, 2, -3)
	scene.add(rim)

	const blue = new THREE.MeshPhysicalMaterial({ color: 0x2845ee, metalness: 0.35, roughness: 0.21, clearcoat: 1 })
	const white = new THREE.MeshPhysicalMaterial({ color: 0xf6f7f4, metalness: 0.22, roughness: 0.24, clearcoat: 0.7 })
	const silver = new THREE.MeshStandardMaterial({ color: 0xbfc5cf, metalness: 1, roughness: 0.2 })
	const dark = new THREE.MeshPhysicalMaterial({ color: 0x111723, metalness: 0.6, roughness: 0.13, clearcoat: 1 })
	const eye = new THREE.MeshStandardMaterial({ color: 0x439dff, emissive: 0x006dff, emissiveIntensity: 0.8 })
	const materials = [blue, white, silver, dark, eye]
	const geometries: THREE.BufferGeometry[] = []
	const mesh = (
		geometry: THREE.BufferGeometry,
		material: THREE.Material,
		parent: THREE.Group,
		position: [number, number, number] = [0, 0, 0]
	) => {
		geometries.push(geometry)
		const object = new THREE.Mesh(geometry, material)
		object.position.set(...position)
		object.castShadow = true
		object.receiveShadow = true
		parent.add(object)
		return object
	}
	const box = (w: number, h: number, d: number, radius = 0.15) => new RoundedBoxGeometry(w, h, d, 4, radius)
	const sphere = (r: number) => new THREE.SphereGeometry(r, 32, 24)
	const ring = (r: number, tube: number) => new THREE.TorusGeometry(r, tube, 16, 64)
	const root = new THREE.Group()
	scene.add(root)
	const groups: Record<SceneMode, THREE.Group> = {
		systems: new THREE.Group(),
		robotics: new THREE.Group(),
		play: new THREE.Group()
	}
	Object.values(groups).forEach(group => root.add(group))

	const cylinder = (r: number, h: number) => new THREE.CylinderGeometry(r, r, h, 32)
	const part = (parent: THREE.Group, position: [number, number, number], rotation = 0) => {
		const group = new THREE.Group()
		group.position.set(...position)
		group.rotation.z = rotation
		parent.add(group)
		return group
	}
	const tube = (points: [number, number, number][], radius: number, material: THREE.Material, parent: THREE.Group) => {
		const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)))
		mesh(new THREE.TubeGeometry(curve, 40, radius, 8, false), material, parent)
		return curve
	}
	const screen = (parent: THREE.Group, w: number, h: number, accent = blue) => {
		mesh(box(w, h, 0.14, 0.09), dark, parent)
		mesh(box(w - 0.12, h - 0.12, 0.025, 0.05), white, parent, [0, 0, 0.08])
		mesh(box(w - 0.2, 0.12, 0.025, 0.02), accent, parent, [0, h / 2 - 0.14, 0.1])
	}
	const windowLines = (parent: THREE.Group, width: number, y: number, count: number) => {
		for (let i = 0; i < count; i++) {
			mesh(box(width * (i % 2 ? 0.75 : 1), 0.035, 0.025, 0.01), silver, parent, [0, y - i * 0.12, 0.11])
		}
	}

	// G1 silhouette: small sensor head, tapered chest, exposed rotary joints and long articulated legs.
	// Reference: https://www.unitree.com/g1/ and the owner's existing G1 photographs; this is a procedural study.
	const robot = groups.robotics
	const head = part(robot, [0, 1.55, 0.03])
	mesh(box(0.64, 0.83, 0.48, 0.23), dark, head)
	const face = new THREE.Shape()
	face.moveTo(-0.245, 0.22)
	face.bezierCurveTo(-0.32, 0.4, 0.32, 0.4, 0.245, 0.22)
	face.bezierCurveTo(0.25, -0.31, 0.12, -0.36, 0, -0.37)
	face.bezierCurveTo(-0.12, -0.36, -0.25, -0.31, -0.245, 0.22)
	const faceOutline = face.getPoints(48).map(p => [p.x, p.y, 0.258] as [number, number, number])
	tube(faceOutline, 0.014, eye, head)
	mesh(box(0.43, 0.026, 0.035, 0.012), eye, head, [0, 0.12, 0.269])
	mesh(sphere(0.042), dark, head, [0.07, -0.02, 0.28])
	mesh(cylinder(0.18, 0.17), dark, robot, [0, 1.05, 0])
	const chestShape = new THREE.Shape()
	chestShape.moveTo(-0.53, 0.52)
	chestShape.quadraticCurveTo(-0.65, 0.48, -0.56, 0.05)
	chestShape.lineTo(-0.36, -0.6)
	chestShape.quadraticCurveTo(0, -0.7, 0.36, -0.6)
	chestShape.lineTo(0.56, 0.05)
	chestShape.quadraticCurveTo(0.65, 0.48, 0.53, 0.52)
	chestShape.closePath()
	const chest = mesh(
		new THREE.ExtrudeGeometry(chestShape, {
			depth: 0.42,
			bevelEnabled: true,
			bevelSize: 0.075,
			bevelThickness: 0.07,
			bevelSegments: 4,
			steps: 1
		}),
		white,
		robot,
		[0, 0.43, -0.24]
	)
	chest.name = 'G1 chest shell'
	const badge = mesh(new THREE.ConeGeometry(0.075, 0.095, 3), dark, robot, [0, 0.73, 0.265])
	badge.rotation.z = Math.PI
	for (const side of [-1, 1]) {
		const joint = mesh(cylinder(0.23, 0.28), silver, robot, [side * 0.69, 0.78, 0])
		joint.rotation.z = Math.PI / 2
		const arm = part(robot, [side * 0.73, 0.68, 0], side * 0.12)
		mesh(box(0.31, 0.49, 0.32, 0.12), white, arm, [0, -0.27, 0])
		mesh(cylinder(0.14, 0.25), dark, arm, [0, -0.57, 0])
		const forearm = part(arm, [0, -0.65, 0.015])
		forearm.rotation.x = -0.13
		mesh(box(0.29, 0.48, 0.31, 0.1), white, forearm, [0, -0.22, 0])
		mesh(cylinder(0.12, 0.14), dark, forearm, [0, -0.53, 0])
		mesh(box(0.23, 0.24, 0.17, 0.06), silver, forearm, [0, -0.69, 0.02])
		for (let finger = 0; finger < 3; finger++) {
			mesh(box(0.05, 0.17, 0.07, 0.025), dark, forearm, [(finger - 1) * 0.075, -0.87, 0.035])
		}
		const thumb = mesh(box(0.065, 0.16, 0.07, 0.025), dark, forearm, [-side * 0.15, -0.74, 0.06])
		thumb.rotation.z = -side * 0.5
	}
	mesh(cylinder(0.29, 0.22), dark, robot, [0, -0.35, 0])
	mesh(box(0.78, 0.32, 0.42, 0.1), silver, robot, [0, -0.52, 0])
	for (const side of [-1, 1]) {
		const leg = part(robot, [side * 0.27, -0.57, 0], -side * 0.045)
		const hip = mesh(cylinder(0.2, 0.22), dark, leg)
		hip.rotation.z = Math.PI / 2
		mesh(box(0.34, 0.57, 0.34, 0.1), white, leg, [0, -0.33, 0])
		const knee = mesh(cylinder(0.16, 0.37), dark, leg, [0, -0.67, 0.015])
		knee.rotation.z = Math.PI / 2
		mesh(box(0.28, 0.6, 0.29, 0.09), white, leg, [0, -1.03, -0.015])
		mesh(box(0.1, 0.38, 0.04, 0.02), silver, leg, [0, -1.02, 0.14])
		mesh(cylinder(0.12, 0.13), dark, leg, [0, -1.38, 0])
		mesh(box(0.36, 0.16, 0.65, 0.06), dark, leg, [0, -1.47, 0.16])
		mesh(box(0.31, 0.07, 0.37, 0.03), silver, leg, [0, -1.38, 0.17])
	}

	// A small, readable software architecture rather than disconnected decorative servers.
	const systems = groups.systems
	const platform = mesh(box(3.8, 0.17, 2.6, 0.14), white, systems, [0, -1.49, 0])
	platform.rotation.y = -0.08
	const server = part(systems, [0, -0.6, 0.15])
	for (let i = 0; i < 3; i++) {
		mesh(box(1.03, 0.24, 0.9, 0.055), i === 2 ? blue : silver, server, [0, i * 0.29, 0])
		mesh(box(0.35, 0.035, 0.03, 0.01), i === 2 ? white : dark, server, [-0.18, i * 0.29, 0.465])
		for (let j = 0; j < 3; j++) mesh(sphere(0.025), eye, server, [0.18 + j * 0.1, i * 0.29, 0.47])
	}
	const api = part(systems, [0, 0.66, 0.1], 0.08)
	mesh(box(0.91, 0.79, 0.72, 0.12), blue, api)
	for (const side of [-1, 1]) {
		for (const slope of [-1, 1]) {
			const stroke = mesh(box(0.04, 0.19, 0.035, 0.015), white, api, [side * 0.17, slope * 0.06, 0.38])
			stroke.rotation.z = side * slope * 0.65
		}
	}
	const slash = mesh(box(0.035, 0.29, 0.035, 0.01), white, api, [0, 0, 0.38])
	slash.rotation.z = -0.25
	const dashboard = part(systems, [-1.31, 0.48, -0.28], 0.06)
	dashboard.rotation.y = 0.18
	screen(dashboard, 1.43, 1.08)
	mesh(box(0.12, 0.43, 0.14, 0.03), silver, dashboard, [0, -0.72, 0])
	mesh(box(0.66, 0.07, 0.41, 0.03), dark, dashboard, [0, -0.95, 0.03])
	for (let i = 0; i < 4; i++)
		mesh(box(0.15, 0.17 + i * 0.1, 0.03, 0.02), blue, dashboard, [-0.39 + i * 0.25, -0.26 + i * 0.05, 0.11])
	const database = part(systems, [1.34, -0.16, -0.12])
	for (let i = 0; i < 3; i++) {
		mesh(cylinder(0.44, 0.29), i === 1 ? blue : silver, database, [0, i * 0.34, 0])
		const rim = mesh(ring(0.42, 0.025), white, database, [0, i * 0.34 + 0.14, 0])
		rim.rotation.x = Math.PI / 2
	}
	const workflow = part(systems, [0.91, -0.81, 0.96], -0.08)
	screen(workflow, 1.02, 0.62)
	for (let i = 0; i < 3; i++)
		mesh(box(0.19, 0.14, 0.03, 0.025), i === 1 ? blue : silver, workflow, [-0.29 + i * 0.29, -0.06, 0.11])
	const packets: { object: THREE.Mesh; curve: THREE.CatmullRomCurve3; offset: number }[] = []
	const connections: [number, number, number][][] = [
		[
			[-1.32, -0.49, -0.23],
			[-1.32, -1.28, 0.1],
			[-0.45, -1.28, 0.1],
			[0, -0.63, 0.15]
		],
		[
			[0.45, -0.6, 0.15],
			[0.85, -1.28, 0.1],
			[1.34, -1.28, 0.1],
			[1.34, -0.3, -0.12]
		],
		[
			[0, 0.08, 0.1],
			[0, 0.2, 0.1],
			[0, 0.27, 0.1],
			[0, 0.32, 0.1]
		],
		[
			[0, -0.6, 0.3],
			[0, -1.28, 0.9],
			[0.62, -1.28, 0.96],
			[0.91, -0.9, 0.96]
		]
	]
	connections.forEach((points, i) => {
		const curve = tube(points, 0.027, blue, systems)
		const object = mesh(sphere(0.065), eye, systems)
		packets.push({ object, curve, offset: i / connections.length })
	})

	// Roblox-inspired block avatar and its five ways to play, composed as one tabletop scene.
	const play = groups.play
	const avatar = part(play, [-0.45, 0.3, 0.5], -0.06)
	mesh(box(0.79, 0.86, 0.45, 0.035), blue, avatar)
	mesh(box(0.55, 0.55, 0.48, 0.07), white, avatar, [0, 0.74, 0])
	for (const side of [-1, 1]) {
		mesh(sphere(0.025), dark, avatar, [side * 0.11, 0.8, 0.25])
		const arm = part(avatar, [side * 0.57, 0.14, 0], side * 0.15)
		mesh(box(0.3, 0.8, 0.37, 0.025), white, arm)
		mesh(box(0.34, 0.76, 0.42, 0.025), dark, avatar, [side * 0.22, -0.85, 0])
	}
	tube(
		[
			[-0.12, 0.66, 0.25],
			[0, 0.61, 0.27],
			[0.12, 0.66, 0.25]
		],
		0.018,
		dark,
		avatar
	)
	const robloxShape = new THREE.Shape()
	robloxShape.moveTo(-0.18, -0.18)
	robloxShape.lineTo(0.18, -0.18)
	robloxShape.lineTo(0.18, 0.18)
	robloxShape.lineTo(-0.18, 0.18)
	robloxShape.closePath()
	const hole = new THREE.Path()
	hole.moveTo(-0.067, -0.067)
	hole.lineTo(-0.067, 0.067)
	hole.lineTo(0.067, 0.067)
	hole.lineTo(0.067, -0.067)
	hole.closePath()
	robloxShape.holes.push(hole)
	const emblem = mesh(
		new THREE.ExtrudeGeometry(robloxShape, { depth: 0.045, bevelEnabled: false }),
		white,
		avatar,
		[0, 0, 0.24]
	)
	emblem.rotation.z = -0.28
	const pc = part(play, [0.88, 0.73, -0.5], -0.03)
	pc.rotation.y = -0.15
	screen(pc, 1.76, 1.15)
	mesh(box(0.13, 0.46, 0.16, 0.03), silver, pc, [0, -0.78, 0])
	mesh(box(0.84, 0.07, 0.5, 0.03), silver, pc, [0, -1.02, 0.02])
	for (let i = 0; i < 3; i++)
		mesh(box(0.32, 0.32 + (i % 2) * 0.22, 0.045, 0.015), blue, pc, [-0.53 + i * 0.53, -0.25, 0.13])
	const tower = part(play, [1.98, 0.2, -0.55])
	mesh(box(0.44, 1.2, 0.74, 0.07), white, tower)
	mesh(box(0.3, 1.06, 0.025, 0.04), dark, tower, [0, 0, 0.39])
	for (const y of [-0.25, 0.22]) mesh(ring(0.095, 0.018), blue, tower, [0, y, 0.41])
	const phone = part(play, [-1.58, 0.14, 0.35], 0.13)
	phone.rotation.y = 0.15
	screen(phone, 0.59, 1.18)
	mesh(box(0.16, 0.04, 0.02, 0.015), dark, phone, [0, 0.48, 0.13])
	windowLines(phone, 0.3, 0.12, 3)
	mesh(box(0.27, 0.17, 0.025, 0.025), blue, phone, [0, -0.33, 0.12])
	const tablet = part(play, [1.25, -0.79, 0.74], -0.13)
	tablet.rotation.y = -0.17
	screen(tablet, 1.34, 0.92)
	mesh(box(0.42, 0.49, 0.03, 0.035), blue, tablet, [-0.31, -0.035, 0.12])
	for (let i = 0; i < 3; i++) mesh(box(0.38, 0.035, 0.025, 0.01), silver, tablet, [0.25, 0.12 - i * 0.14, 0.12])
	const controller = part(play, [-0.58, -1.32, 1], -0.12)
	controller.rotation.x = -0.15
	mesh(box(1.55, 0.68, 0.36, 0.23), white, controller)
	for (const side of [-1, 1]) {
		const grip = mesh(box(0.38, 0.63, 0.34, 0.12), blue, controller, [side * 0.53, -0.23, 0])
		grip.rotation.z = side * 0.25
		const stick = mesh(cylinder(0.1, 0.075), dark, controller, [side * 0.21, -0.1, 0.21])
		stick.rotation.x = Math.PI / 2
	}
	mesh(box(0.3, 0.075, 0.04, 0.015), dark, controller, [-0.47, 0.12, 0.21])
	mesh(box(0.075, 0.3, 0.04, 0.015), dark, controller, [-0.47, 0.12, 0.21])
	for (let i = 0; i < 4; i++) {
		const angle = (i * Math.PI) / 2
		mesh(sphere(0.045), i % 2 ? silver : blue, controller, [
			0.45 + Math.cos(angle) * 0.115,
			0.1 + Math.sin(angle) * 0.115,
			0.21
		])
	}

	const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.ShadowMaterial({ opacity: 0.09 }))
	floor.rotation.x = -Math.PI / 2
	floor.position.y = -2.18
	floor.receiveShadow = true
	scene.add(floor)

	let mode: SceneMode = 'robotics'
	let paused = false
	let inView = true
	let disposed = false
	let frame = 0
	let previous = 0
	let elapsed = 0
	let firstFrame = true
	const scales: Record<SceneMode, number> = { systems: 0, robotics: 1, play: 0 }
	const pointer = { x: 0, y: 0 }
	const reduced = matchMedia('(prefers-reduced-motion: reduce)')
	const fine = matchMedia('(hover: hover) and (pointer: fine)')
	const resize = () => {
		const { width, height } = host.getBoundingClientRect()
		if (!width || !height) return
		const ratio = Math.min(devicePixelRatio || 1, width < 600 ? 1.5 : 2)
		const scale = Math.min(1, Math.sqrt(1_800_000 / (width * height * ratio * ratio)))
		renderer.setSize(Math.round(width * ratio * scale), Math.round(height * ratio * scale), false)
		camera.aspect = width / height
		camera.position.z = camera.aspect < 0.85 ? 11.5 : 9.5
		camera.updateProjectionMatrix()
		requestFrame()
	}
	const render = (time: number) => {
		frame = 0
		if (disposed || !inView || document.hidden) return
		const delta = Math.min((time - previous) / 1000, 0.05)
		previous = time
		const still = paused || reduced.matches
		if (!still) elapsed += delta
		let transitioning = false
		for (const key of Object.keys(groups) as SceneMode[]) {
			const target = key === mode ? 1 : 0
			scales[key] = still ? target : THREE.MathUtils.damp(scales[key], target, 10, delta)
			if (Math.abs(scales[key] - target) > 0.001) transitioning = true
			groups[key].visible = scales[key] > 0.002
			groups[key].scale.setScalar(Math.max(0.001, scales[key]))
			groups[key].position.y = still ? 0 : Math.sin(elapsed * 0.9) * 0.065 + (1 - scales[key]) * -0.3
		}
		const targetY = still ? -0.22 : -0.22 + pointer.x * 0.26 + Math.sin(elapsed * 0.25) * 0.04
		root.rotation.y = still ? targetY : THREE.MathUtils.damp(root.rotation.y, targetY, 5, delta)
		root.rotation.x = still ? 0 : THREE.MathUtils.damp(root.rotation.x, pointer.y * 0.1, 5, delta)
		head.rotation.y = still ? 0 : pointer.x * 0.12
		packets.forEach(({ object, curve, offset }) =>
			object.position.copy(curve.getPointAt((elapsed * 0.18 + offset) % 1))
		)
		renderer.render(scene, camera)
		if (firstFrame) {
			host.dataset.ready = 'true'
			firstFrame = false
		}
		if (!still || transitioning) requestFrame()
	}
	function requestFrame() {
		if (!frame && !disposed && inView && !document.hidden) frame = requestAnimationFrame(render)
	}
	const move = (event: PointerEvent) => {
		if (!fine.matches) return
		const rect = host.getBoundingClientRect()
		pointer.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
		pointer.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1))
		requestFrame()
	}
	const leave = () => {
		pointer.x = 0
		pointer.y = 0
	}
	const lost = (event: Event) => {
		event.preventDefault()
		onFailure()
	}
	const resizeObserver = new ResizeObserver(resize)
	resizeObserver.observe(host)
	const visibilityObserver = new IntersectionObserver(([entry]) => {
		inView = entry.isIntersecting
		requestFrame()
	})
	visibilityObserver.observe(host)
	host.addEventListener('pointermove', move)
	host.addEventListener('pointerleave', leave)
	renderer.domElement.addEventListener('webglcontextlost', lost)
	document.addEventListener('visibilitychange', requestFrame)
	reduced.addEventListener('change', requestFrame)
	resize()
	return {
		setMode(value) {
			mode = value
			requestFrame()
		},
		setPaused(value) {
			paused = value
			requestFrame()
		},
		dispose() {
			if (disposed) return
			disposed = true
			cancelAnimationFrame(frame)
			resizeObserver.disconnect()
			visibilityObserver.disconnect()
			host.removeEventListener('pointermove', move)
			host.removeEventListener('pointerleave', leave)
			renderer.domElement.removeEventListener('webglcontextlost', lost)
			document.removeEventListener('visibilitychange', requestFrame)
			reduced.removeEventListener('change', requestFrame)
			geometries.forEach(geometry => geometry.dispose())
			materials.forEach(material => material.dispose())
			floor.geometry.dispose()
			floor.material.dispose()
			light.shadow.dispose()
			environment.dispose()
			renderer.dispose()
			renderer.domElement.remove()
			delete host.dataset.ready
		}
	}
}
