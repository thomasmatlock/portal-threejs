import * as THREE from 'three';
import { DistractionState, AnimationParams } from './wheatleyTypes';
import { startHeadShake } from './wheatleyHeadShaking';

// Helper function to create a new distraction
export function createDistraction(
	distractionState: React.MutableRefObject<DistractionState>
): void {
	distractionState.current.isDistracted = true;
	distractionState.current.distractionTimer = 0;
	distractionState.current.distractionDuration = Math.random() * 3 + 2; // 2-5 seconds

	// Random position for distraction to start
	const angle = Math.random() * Math.PI * 2;
	const distance = 5 + Math.random() * 5; // 5-10 units away
	distractionState.current.distractionPosition.set(
		Math.cos(angle) * distance,
		Math.sin(angle) * distance * 0.5 + 1, // Keep it somewhat level with Wheatley
		Math.sin(angle) * distance
	);

	// Random speed and direction for the distraction to move
	distractionState.current.distractionSpeed.set(
		(Math.random() - 0.5) * 2,
		(Math.random() - 0.5) * 0.5,
		(Math.random() - 0.5) * 2
	);

	// Normalize and scale the speed
	distractionState.current.distractionSpeed.normalize().multiplyScalar(0.5 + Math.random() * 1.5);

	// Set a delay before returning to mouse tracking
	distractionState.current.returnToMouseDelay = Math.random() * 0.5 + 0.2; // 0.2-0.7 seconds
}

// Helper function to check if distraction should start
export function shouldStartDistraction(
	distractionState: React.MutableRefObject<DistractionState>,
	elapsedTime: number
): boolean {
	return (
		!distractionState.current.isDistracted &&
		!distractionState.current.isShakingHead &&
		elapsedTime - distractionState.current.lastDistractionTime >
			distractionState.current.cooldownPeriod &&
		Math.random() < 0.005
	);
}

// Helper function to handle distraction behavior
export function handleDistractionBehavior({
	wheatleyRef,
	distractionState,
	delta,
	elapsedTime = 0,
}: AnimationParams & { elapsedTime: number }): void {
	// Update distraction position (it's moving)
	distractionState.current.distractionPosition.add(
		distractionState.current.distractionSpeed.clone().multiplyScalar(delta)
	);

	// Calculate direction to distraction
	const directionToDistraction = distractionState.current.distractionPosition
		.clone()
		.sub(wheatleyRef.current!.position);

	// Calculate rotation to look at distraction
	const rotationY = Math.atan2(directionToDistraction.x, directionToDistraction.z);
	const rotationX = Math.atan2(
		directionToDistraction.y,
		Math.sqrt(
			directionToDistraction.x * directionToDistraction.x +
				directionToDistraction.z * directionToDistraction.z
		)
	);

	// Check if distraction is over
	if (distractionState.current.distractionTimer > distractionState.current.distractionDuration) {
		distractionState.current.isDistracted = false;
		distractionState.current.lastDistractionTime = elapsedTime;

		// 60% chance to shake head after watching a distraction
		if (Math.random() < 0.6) {
			startHeadShake(distractionState);
		}
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
