import * as THREE from 'three'
import type { ModelInstance } from '../types'
import { createModelScope } from './palette'

export function createSystemsModel(): ModelInstance {
	const scope = createModelScope()
	const { materials, mesh, box, cylinder, sphere, ring, part, tube, screen } = scope
	const { blue, white, silver, eye } = materials

	const systems = new THREE.Group()

	mesh(box(3.8, 0.17, 2.6, 0.14), white, systems, [0, -1.49, 0])

	const server = part(systems, [0, -0.6, 0.15])
	for (let i = 0; i < 3; i++) {
		mesh(box(1.03, 0.24, 0.9, 0.055), i === 2 ? blue : silver, server, [0, i * 0.29, 0])
		mesh(box(0.35, 0.035, 0.03, 0.01), i === 2 ? white : materials.dark, server, [-0.18, i * 0.29, 0.465])
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
	mesh(box(0.66, 0.07, 0.41, 0.03), materials.dark, dashboard, [0, -0.95, 0.03])
	for (let i = 0; i < 4; i++)
		mesh(box(0.15, 0.17 + i * 0.1, 0.03, 0.02), blue, dashboard, [-0.39 + i * 0.25, -0.26 + i * 0.05, 0.11])

	const database = part(systems, [1.34, -0.16, -0.12])
	for (let i = 0; i < 3; i++) {
		mesh(cylinder(0.44, 0.29), i === 1 ? blue : silver, database, [0, i * 0.34, 0])
		const r = mesh(ring(0.42, 0.025), white, database, [0, i * 0.34 + 0.14, 0])
		r.rotation.x = Math.PI / 2
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

	return {
		group: systems,
		initialCameraPosition: [0, 1.4, 7.2],
		initialTarget: [0, 0, 0],
		update(_delta, elapsed) {
			systems.position.y = Math.sin(elapsed * 0.8) * 0.03
			packets.forEach(({ object, curve, offset }) => {
				object.position.copy(curve.getPointAt((elapsed * 0.2 + offset) % 1))
			})
		},
		dispose() {
			scope.dispose()
		}
	}
}
