import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const unitreeG1: ProjectDef = {
	id: 'unitree-g1',
	accent: '#2EC4B6', // Thaibotic's teal, shared with the website entry
	// Python leads: the SDK shim, CLI, safety gate and both on-robot agents are Python; the Hub
	// screen and its agent link are the web half.
	highlightSkills: ['python', 'cpp', 'mujoco', 'ros-2', 'fastapi', 'websocket', 'next-js'],
	title: 'Unitree G1 — Humanoid Robot Workspace',
	description:
		"The software behind a Unitree G1 EDU humanoid robot that Thaibotic runs at events. A cross-platform dev workspace for macOS, Ubuntu and Windows brings the Python and C++ SDKs, a MuJoCo simulation of the G1 over the same DDS topics as the real robot, and a check that runs a pretrained walking policy in simulation; nothing moves the real robot without two separate confirmations, and walking speeds are clamped for bring-up. On top of it sit the Hub — an offline Thai-language web app that runs the robot at a show from a phone, iPad or laptop through an agent on the robot, with PIN sign-in, one screen in control at a time, walking only while a dead-man button is held, and STOP from any signed-in screen — and a Thai/English voice assistant on the robot's own microphones and speaker that answers through speech-to-text, an LLM and text-to-speech, plus an event mode with arm gestures and announcements. Toolchains for reinforcement learning, ROS 2 mapping and navigation, and LeRobot are set up in the same workspace.",
	resumeSummary:
		'Software for a Unitree G1 EDU humanoid robot — a cross-platform Python/C++ workspace with MuJoCo simulation and a real-robot safety gate, an offline show-control web app over WebSocket, and a Thai/English voice assistant on the robot.',
	// Thaibotic's own 2 Nov 2026 shoot of the unit, already public on its site: only shots with nobody in frame.
	images: { cover: assets.projects.unitreeG1.cover, photos: [...assets.projects.unitreeG1.gallery] },
	skills: ['python', 'cpp', 'mujoco', 'docker'],
	// No link: the repo is private and the robot software has no public page of its own.
	links: {},
	stage: 'in-development',
	startDate: '2026-09-30',
	linkedExperienceIds: ['thaibotic-founder'],
	timeline: [
		{
			date: '2026-09-30',
			title: 'Workspace — Unitree G1 dev setup on macOS',
			description:
				'Set up a dev workspace for the G1 EDU on Apple silicon: the Python SDK, a MuJoCo simulation over DDS and a doctor that checks every tier.',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2026-09-30',
			title: 'Cross-platform — Ubuntu and Windows with NVIDIA',
			description:
				'Extended the workspace to Ubuntu and Windows with NVIDIA GPUs, and set up the reinforcement-learning, ROS 2 and LeRobot toolchains.',
			icon: 'mdi:monitor-multiple',
			addedSkills: ['ros-2']
		},
		{
			date: '2026-10-30',
			title: 'Voice — a Thai/English assistant on the robot',
			description:
				"Built a voice assistant on the robot's own microphones and speaker: speech-to-text, an LLM and text-to-speech, answering one sentence at a time.",
			icon: 'mdi:account-voice'
		},
		{
			date: '2026-10-30',
			title: 'Events — event mode and the real-robot gate',
			description:
				'Added an event mode with arm gestures and announcements, behind a gate that needs two confirmations before anything moves the real robot.',
			icon: 'mdi:shield-lock-outline'
		},
		{
			date: '2026-10-30',
			title: 'Hub — the on-robot agent',
			description:
				'Built the agent the Hub talks to: posture runs checked against the robot, a control lock, PIN sign-in, and live remote, motor-temperature and battery readings.',
			icon: 'mdi:remote',
			addedSkills: ['fastapi', 'websocket']
		},
		{
			date: '2026-10-30',
			title: 'Hub — offline show-control app',
			description:
				'Shipped the Hub screen, an offline Thai-language web app that runs the robot at a show from a phone, iPad or laptop.',
			icon: 'mdi:tablet-cellphone',
			addedSkills: ['next-js', 'react', 'bun-js']
		},
		{
			date: '2026-11-04',
			title: 'Safety — STOP and dead-man hardening',
			description:
				'Made a STOP hold until the dead-man is released, and let a remote press, a STOP or a takeover end a command that is still running.',
			icon: 'mdi:stop-circle-outline'
		},
		{
			date: '2026-11-04',
			title: 'Events — business event kit',
			description: 'Added scripts for each kind of business event to the voice assistant and event mode.',
			icon: 'mdi:microphone-outline'
		}
	]
}
