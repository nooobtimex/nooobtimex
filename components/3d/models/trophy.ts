import * as THREE from 'three'
import type { ModelInstance } from '../types'
import { createModelScope } from './palette'

export function createTrophyModel(): ModelInstance {
	const scope = createModelScope()
	const { materials, mesh, box, cylinder, sphere, ring, part, tube } = scope
	const { gold, silver, dark, white } = materials

	const trophyGroup = new THREE.Group()

	// 1. Pedestal Base (Stepped dark marble look with gold plate)
	mesh(box(1.6, 0.28, 1.3, 0.06), dark, trophyGroup, [0, -1.35, 0])
	mesh(box(1.3, 0.35, 1.05, 0.05), dark, trophyGroup, [0, -1.05, 0])
	// Plaque plate
	mesh(box(0.9, 0.2, 0.03, 0.01), gold, trophyGroup, [0, -1.05, 0.54])

	// 2. Trophy Stem & Risers (Polished Gold & Silver)
	mesh(cylinder(0.42, 0.12), gold, trophyGroup, [0, -0.82, 0])
	mesh(cylinder(0.24, 0.28), silver, trophyGroup, [0, -0.62, 0])
	mesh(ring(0.28, 0.05), gold, trophyGroup, [0, -0.46, 0]).rotation.x = Math.PI / 2

	// 3. Main Cup Body
	const cupStem = mesh(cylinder(0.18, 0.32), gold, trophyGroup, [0, -0.3, 0])
	cupStem.rotation.x = 0

	// Cup lower bowl & upper bell
	const bowlGeo = new THREE.CylinderGeometry(0.72, 0.26, 0.75, 32)
	mesh(bowlGeo, gold, trophyGroup, [0, 0.15, 0])

	const rimGeo = new THREE.TorusGeometry(0.72, 0.05, 16, 48)
	const rim = mesh(rimGeo, silver, trophyGroup, [0, 0.52, 0])
	rim.rotation.x = Math.PI / 2

	// Inner cup dark hollow look
	mesh(cylinder(0.68, 0.02), dark, trophyGroup, [0, 0.49, 0])

	// 4. Curved Handles (Left and Right)
	for (const side of [-1, 1]) {
		const handlePoints: [number, number, number][] = [
			[side * 0.68, 0.44, 0],
			[side * 1.15, 0.48, 0],
			[side * 1.25, 0.1, 0],
			[side * 0.95, -0.15, 0],
			[side * 0.42, -0.05, 0]
		]
		tube(handlePoints, 0.05, gold, trophyGroup)
	}

	// 5. Cup Lid & Star Finial
	const lid = part(trophyGroup, [0, 0.58, 0])
	mesh(cylinder(0.62, 0.16), gold, lid, [0, 0.06, 0])
	mesh(sphere(0.16), silver, lid, [0, 0.24, 0])
	// Star finial on top
	const star = mesh(new THREE.ConeGeometry(0.14, 0.32, 5), gold, lid, [0, 0.46, 0])
	star.rotation.z = Math.PI

	// 6. Award Medal Beside the Trophy
	const medalPart = part(trophyGroup, [1.3, -1.05, 0.4], 0.1)
	medalPart.rotation.y = -0.3
	medalPart.rotation.x = 0.2
	// Ribbon
	const ribbonShape = new THREE.Shape()
	ribbonShape.moveTo(-0.16, 0.6)
	ribbonShape.lineTo(0.16, 0.6)
	ribbonShape.lineTo(0.08, 0.05)
	ribbonShape.lineTo(-0.08, 0.05)
	ribbonShape.closePath()
	mesh(
		new THREE.ExtrudeGeometry(ribbonShape, { depth: 0.02, bevelEnabled: false }),
		materials.blue,
		medalPart,
		[0, 0, 0]
	)
	// Medal Disc
	mesh(cylinder(0.38, 0.06), gold, medalPart, [0, -0.22, 0.02]).rotation.x = Math.PI / 2
	mesh(ring(0.34, 0.02), silver, medalPart, [0, -0.22, 0.06])
	mesh(box(0.18, 0.18, 0.02, 0.01), white, medalPart, [0, -0.22, 0.06]).rotation.z = 0.785

	return {
		group: trophyGroup,
		initialCameraPosition: [0, 0.5, 5.4],
		initialTarget: [0, -0.1, 0],
		update(_delta, elapsed) {
			trophyGroup.position.y = Math.sin(elapsed * 1.0) * 0.03
			lid.position.y = 0.58 + Math.sin(elapsed * 1.5) * 0.01
		},
		dispose() {
			scope.dispose()
		}
	}
}
