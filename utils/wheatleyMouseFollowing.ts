import * as THREE from 'three';
import { MouseFollowParams, DistractionState } from './wheatleyTypes';

// Helper function to handle mouse following behavior
export function handleMouseFollowing({
	wheatleyRef,
	mousePosition,
	delta,
}: MouseFollowParams): void {
	const mouseX = mousePosition.x;
	const mouseY = mousePosition.y;

	// Map mouse position to rotation
	const rotationX = -mouseY * 0.5; // Look up when mouse is at top

	// Adjust left-right sensitivity with non-linear mapping
	let rotationY: number;
	if (mouseX < 0) {
		// Left side - increase rotation by 30%
		rotationY = Math.sign(mouseX) * Math.pow(Math.abs(mouseX), 0.8) * 0.9;
	} else {
		// Right side - normal rotation
		rotationY = Math.sign(mouseX) * Math.pow(Math.abs(mouseX), 0.8) * 0.7;
	}

	// Apply rotation with smooth damping
	wheatleyRef.current!.rotation.x = THREE.MathUtils.lerp(
		wheatleyRef.current!.rotation.x,
		rotationX,
		delta * 5
	);

	wheatleyRef.current!.rotation.y = THREE.MathUtils.lerp(
		wheatleyRef.current!.rotation.y,
		rotationY + Math.PI / 2, // Add offset to face forward
		delta * 5
	);
}

// Helper function to create initial distraction state
export function createInitialDistractionState(): DistractionState {
	return {
		isDistracted: false,
		distractionTimer: 0,
		distractionDuration: 0,
		distractionPosition: new THREE.Vector3(),
		distractionSpeed: new THREE.Vector3(),
		returnToMouseDelay: 0,
		lastDistractionTime: 0,
		cooldownPeriod: 3, // Reduced from 5 to 3 seconds between possible distractions

		// Head shaking state
		isShakingHead: false,
		shakeTimer: 0,
		shakeDuration: 0,
		shakeIntensity: 0,
		shakeFrequency: 0,
		shakeDirection: 1, // 1 or -1
	};
}
