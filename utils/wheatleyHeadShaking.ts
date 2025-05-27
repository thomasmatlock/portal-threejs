import * as THREE from 'three';
import { DistractionState } from './wheatleyTypes';

// Helper function to handle head shaking animation
export function handleHeadShaking(
	wheatleyRef: React.RefObject<THREE.Group>,
	distractionState: React.MutableRefObject<DistractionState>,
	delta: number
): boolean {
	if (!distractionState.current.isShakingHead) return false;

	// Update shake timer
	distractionState.current.shakeTimer += delta;

	// Calculate shake amount based on sine wave
	const shakeAmount =
		Math.sin(
			distractionState.current.shakeTimer *
				distractionState.current.shakeFrequency *
				Math.PI *
				2
		) *
		distractionState.current.shakeIntensity *
		(1 - distractionState.current.shakeTimer / distractionState.current.shakeDuration); // Fade out over time

	// Apply shake to Y rotation (left-right head shake)
	if (wheatleyRef.current) {
		wheatleyRef.current.rotation.y =
			wheatleyRef.current.rotation.y + shakeAmount * distractionState.current.shakeDirection;
	}

	// Check if shake is complete
	if (distractionState.current.shakeTimer >= distractionState.current.shakeDuration) {
		distractionState.current.isShakingHead = false;
	}

	// Return true if we should skip other rotation logic during most of the shake
	return distractionState.current.shakeTimer < distractionState.current.shakeDuration * 0.7;
}

// Helper function to start head shake after distraction
export function startHeadShake(distractionState: React.MutableRefObject<DistractionState>): void {
	distractionState.current.isShakingHead = true;
	distractionState.current.shakeTimer = 0;
	distractionState.current.shakeDuration = Math.random() * 0.8 + 0.5; // 0.5-1.3 seconds
	distractionState.current.shakeIntensity = Math.random() * 0.08 + 0.01; // Reduced from 0.1-0.25 to 0.05-0.13
	distractionState.current.shakeFrequency = Math.random() * 3 + 5; // 5-8 Hz
	distractionState.current.shakeDirection = Math.random() > 0.5 ? 1 : -1; // Random direction
}
