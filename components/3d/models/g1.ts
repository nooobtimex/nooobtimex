import * as THREE from 'three'
import type { ModelInstance } from '../types'
import { createModelScope } from './palette'

export function createG1Model(): ModelInstance {
	const scope = createModelScope()
	const { materials, mesh, box, cylinder, sphere, part, tube } = scope
	const { white, silver, dark, eye } = materials

	const robot = new THREE.Group()

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

	mesh(
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

	const badge = mesh(new THREE.ConeGeometry(0.075, 0.095, 3), dark, robot, [0, 0.73, 0.265])
	badge.rotation.z = Math.PI

	const arms: THREE.Group[] = []
	for (const side of [-1, 1]) {
		const joint = mesh(cylinder(0.23, 0.28), silver, robot, [side * 0.69, 0.78, 0])
		joint.rotation.z = Math.PI / 2
		const arm = part(robot, [side * 0.73, 0.68, 0], side * 0.12)
		arms.push(arm)
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

	return {
		group: robot,
		initialCameraPosition: [0, 0.8, 6.2],
		initialTarget: [0, 0.1, 0],
		update(_delta, elapsed) {
			robot.position.y = Math.sin(elapsed * 1.2) * 0.04
			head.rotation.y = Math.sin(elapsed * 0.6) * 0.08
			arms[0].rotation.x = Math.sin(elapsed * 1.2) * 0.05
			arms[1].rotation.x = -Math.sin(elapsed * 1.2) * 0.05
		},
		dispose() {
			scope.dispose()
		}
	}
}
