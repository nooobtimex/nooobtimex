import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { ModelFactory, ModelInstance, ViewerController } from './types'

export async function createProjectViewer(
	host: HTMLElement,
	factory: ModelFactory,
	onFailure: () => void
): Promise<ViewerController> {
	let renderer: THREE.WebGLRenderer | null = null
	try {
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
	} catch {
		onFailure()
		throw new Error('WebGL not available')
	}

	renderer.setClearColor(0x000000, 0)
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 0.95
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.domElement.setAttribute('aria-hidden', 'true')
	host.appendChild(renderer.domElement)

	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
	camera.position.set(0, 0.8, 6.5)

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

	const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.ShadowMaterial({ opacity: 0.09 }))
	floor.rotation.x = -Math.PI / 2
	floor.position.y = -1.55
	floor.receiveShadow = true
	scene.add(floor)

	let modelInstance: ModelInstance
	try {
		modelInstance = await factory()
		scene.add(modelInstance.group)
	} catch {
		onFailure()
		renderer.dispose()
		renderer.domElement.remove()
		throw new Error('Failed to load model instance')
	}

	const initialCam = modelInstance.initialCameraPosition ?? [0, 0.8, 6.5]
	const initialTarget = modelInstance.initialTarget ?? [0, 0, 0]
	camera.position.set(...initialCam)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.dampingFactor = 0.05
	controls.autoRotate = true
	controls.autoRotateSpeed = 1.0
	controls.minDistance = 2.0
	controls.maxDistance = 15.0
	controls.maxPolarAngle = Math.PI / 2 + 0.04
	controls.target.set(...initialTarget)
	controls.update()

	let paused = false
	let inView = true
	let disposed = false
	let interacting = false
	let frame = 0
	let previous = 0
	let elapsed = 0
	let firstFrame = true

	const reduced = matchMedia('(prefers-reduced-motion: reduce)')
	if (reduced.matches) controls.autoRotate = false

	const resize = () => {
		if (disposed || !renderer) return
		const { width, height } = host.getBoundingClientRect()
		if (!width || !height) return
		const ratio = Math.min(devicePixelRatio || 1, width < 600 ? 1.5 : 2)
		const scale = Math.min(1, Math.sqrt(1_800_000 / (width * height * ratio * ratio)))
		renderer.setSize(Math.round(width * ratio * scale), Math.round(height * ratio * scale), false)
		camera.aspect = width / height
		camera.updateProjectionMatrix()
		requestFrame()
	}

	const render = (time: number) => {
		frame = 0
		if (disposed || !inView || document.hidden || !renderer) return
		const delta = Math.min((time - previous) / 1000, 0.05)
		previous = time
		const still = paused || reduced.matches

		if (!still) {
			elapsed += delta
			modelInstance.update?.(delta, elapsed)
		}

		controls.update()
		renderer.render(scene, camera)

		if (firstFrame) {
			host.dataset.ready = 'true'
			firstFrame = false
		}

		if (!still || interacting || controls.autoRotate) requestFrame()
	}

	function requestFrame() {
		if (!frame && !disposed && inView && !document.hidden) {
			frame = requestAnimationFrame(render)
		}
	}

	controls.addEventListener('start', () => {
		interacting = true
		requestFrame()
	})
	controls.addEventListener('end', () => {
		interacting = false
		requestFrame()
	})
	controls.addEventListener('change', () => {
		requestFrame()
	})

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

	renderer.domElement.addEventListener('webglcontextlost', lost)
	document.addEventListener('visibilitychange', requestFrame)
	reduced.addEventListener('change', () => {
		controls.autoRotate = !reduced.matches && !paused
		requestFrame()
	})

	resize()
	requestFrame()

	return {
		setPaused(value: boolean) {
			paused = value
			controls.autoRotate = !value && !reduced.matches
			requestFrame()
		},
		resetCamera() {
			camera.position.set(...initialCam)
			controls.target.set(...initialTarget)
			controls.update()
			requestFrame()
		},
		dispose() {
			if (disposed) return
			disposed = true
			cancelAnimationFrame(frame)
			resizeObserver.disconnect()
			visibilityObserver.disconnect()
			renderer?.domElement.removeEventListener('webglcontextlost', lost)
			document.removeEventListener('visibilitychange', requestFrame)
			controls.dispose()
			modelInstance.dispose?.()
			floor.geometry.dispose()
			floor.material.dispose()
			light.shadow.dispose()
			environment.dispose()
			renderer?.dispose()
			renderer?.domElement.remove()
			delete host.dataset.ready
		}
	}
}
