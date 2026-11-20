import * as THREE from 'three'
import type { ModelInstance } from '../types'
import { createModelScope } from './palette'

export function createPlayModel(): ModelInstance {
	const scope = createModelScope()
	const { materials, mesh, box, cylinder, sphere, ring, part, tube, screen, windowLines } = scope
	const { blue, white, silver, dark } = materials

	const play = new THREE.Group()

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

	return {
		group: play,
		initialCameraPosition: [0, 1.1, 7.2],
		initialTarget: [0, 0, 0],
		update(_delta, elapsed) {
			play.position.y = Math.sin(elapsed * 0.9) * 0.03
			avatar.rotation.y = Math.sin(elapsed * 0.5) * 0.06
			controller.rotation.z = -0.12 + Math.sin(elapsed * 1.1) * 0.04
		},
		dispose() {
			scope.dispose()
		}
	}
}
