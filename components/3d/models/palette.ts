import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export interface ModelScope {
	materials: {
		blue: THREE.MeshPhysicalMaterial
		white: THREE.MeshPhysicalMaterial
		silver: THREE.MeshStandardMaterial
		gold: THREE.MeshStandardMaterial
		dark: THREE.MeshPhysicalMaterial
		eye: THREE.MeshStandardMaterial
	}
	geometries: THREE.BufferGeometry[]
	mesh: (
		geometry: THREE.BufferGeometry,
		material: THREE.Material,
		parent: THREE.Group,
		position?: [number, number, number]
	) => THREE.Mesh
	box: (w: number, h: number, d: number, radius?: number) => RoundedBoxGeometry
	cylinder: (r: number, h: number) => THREE.CylinderGeometry
	sphere: (r: number) => THREE.SphereGeometry
	ring: (r: number, tube: number) => THREE.TorusGeometry
	part: (parent: THREE.Group, position: [number, number, number], rotation?: number) => THREE.Group
	tube: (
		points: [number, number, number][],
		radius: number,
		material: THREE.Material,
		parent: THREE.Group
	) => THREE.CatmullRomCurve3
	screen: (parent: THREE.Group, w: number, h: number, accent?: THREE.Material) => void
	windowLines: (parent: THREE.Group, width: number, y: number, count: number) => void
	dispose: () => void
}

export function createModelScope(): ModelScope {
	const blue = new THREE.MeshPhysicalMaterial({ color: 0x2845ee, metalness: 0.35, roughness: 0.21, clearcoat: 1 })
	const white = new THREE.MeshPhysicalMaterial({ color: 0xf6f7f4, metalness: 0.22, roughness: 0.24, clearcoat: 0.7 })
	const silver = new THREE.MeshStandardMaterial({ color: 0xbfc5cf, metalness: 1, roughness: 0.2 })
	const gold = new THREE.MeshStandardMaterial({ color: 0xf5b335, metalness: 0.9, roughness: 0.18 })
	const dark = new THREE.MeshPhysicalMaterial({ color: 0x111723, metalness: 0.6, roughness: 0.13, clearcoat: 1 })
	const eye = new THREE.MeshStandardMaterial({ color: 0x439dff, emissive: 0x006dff, emissiveIntensity: 0.8 })

	const materialsList = [blue, white, silver, gold, dark, eye]
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

	const screen = (parent: THREE.Group, w: number, h: number, accent: THREE.Material = blue) => {
		mesh(box(w, h, 0.14, 0.09), dark, parent)
		mesh(box(w - 0.12, h - 0.12, 0.025, 0.05), white, parent, [0, 0, 0.08])
		mesh(box(w - 0.2, 0.12, 0.025, 0.02), accent, parent, [0, h / 2 - 0.14, 0.1])
	}

	const windowLines = (parent: THREE.Group, width: number, y: number, count: number) => {
		for (let i = 0; i < count; i++) {
			mesh(box(width * (i % 2 ? 0.75 : 1), 0.035, 0.025, 0.01), silver, parent, [0, y - i * 0.12, 0.11])
		}
	}

	return {
		materials: { blue, white, silver, gold, dark, eye },
		geometries,
		mesh,
		box,
		cylinder,
		sphere,
		ring,
		part,
		tube,
		screen,
		windowLines,
		dispose() {
			geometries.forEach(geo => geo.dispose())
			materialsList.forEach(mat => mat.dispose())
		}
	}
}
