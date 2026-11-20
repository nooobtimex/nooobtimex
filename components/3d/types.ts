import type * as THREE from 'three'

export interface ModelInstance {
	group: THREE.Group
	update?: (delta: number, elapsed: number) => void
	dispose?: () => void
	initialCameraPosition?: [number, number, number]
	initialTarget?: [number, number, number]
}

export type ModelFactory = () => Promise<ModelInstance> | ModelInstance

export interface ViewerController {
	setPaused: (paused: boolean) => void
	resetCamera: () => void
	dispose: () => void
}
