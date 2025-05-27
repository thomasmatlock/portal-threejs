import * as THREE from 'three';

export interface DistractionState {
	isDistracted: boolean;
	distractionTimer: number;
	distractionDuration: number;
	distractionPosition: THREE.Vector3;
	distractionSpeed: THREE.Vector3;
	returnToMouseDelay: number;
	lastDistractionTime: number;
	cooldownPeriod: number;

	// Head shaking state
	isShakingHead: boolean;
	shakeTimer: number;
	shakeDuration: number;
	shakeIntensity: number;
	shakeFrequency: number;
	shakeDirection: number; // 1 or -1
}

export interface MousePosition {
	x: number;
	y: number;
}

export interface AnimationParams {
	wheatleyRef: React.RefObject<THREE.Group>;
	distractionState: React.MutableRefObject<DistractionState>;
	delta: number;
	elapsedTime?: number;
}

export interface MouseFollowParams {
	wheatleyRef: React.RefObject<THREE.Group>;
	mousePosition: MousePosition;
	delta: number;
}
