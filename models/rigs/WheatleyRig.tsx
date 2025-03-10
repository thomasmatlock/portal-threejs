import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Wheatley = dynamic(() => import('../Wheatley').then((mod) => mod.Model), {
	ssr: false,
});

export function WheatleyRig() {
	// Simple refs
	const wheatleyRef = useRef<THREE.Group>(null);
	const { mouse } = useThree();

	// Track mouse position manually to work with UI elements
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	// Distraction state
	const distractionState = useRef({
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
	});

	// Set up global mouse tracking
	useEffect(() => {
		// Function to update mouse position
		const updateMousePosition = (e: MouseEvent) => {
			// Convert screen coordinates to normalized coordinates (-1 to 1)
			const x = (e.clientX / window.innerWidth) * 2 - 1;
			const y = -(e.clientY / window.innerHeight) * 2 + 1;
			setMousePosition({ x, y });
		};

		// Add event listener
		window.addEventListener('mousemove', updateMousePosition);

		// Clean up
		return () => {
			window.removeEventListener('mousemove', updateMousePosition);
		};
	}, []);

	// Enhanced mouse following with distractions and head shaking
	useFrame((state, delta) => {
		if (!wheatleyRef.current) return;

		// Update distraction timer
		distractionState.current.distractionTimer += delta;

		// Handle head shaking if active
		if (distractionState.current.isShakingHead) {
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
			wheatleyRef.current.rotation.y =
				wheatleyRef.current.rotation.y +
				shakeAmount * distractionState.current.shakeDirection;

			// Check if shake is complete
			if (distractionState.current.shakeTimer >= distractionState.current.shakeDuration) {
				distractionState.current.isShakingHead = false;
			}

			// Early return to prevent other rotation logic during head shake
			if (
				distractionState.current.shakeTimer <
				distractionState.current.shakeDuration * 0.7
			) {
				// Add subtle bobbing motion during shake
				const time = state.clock.getElapsedTime();
				const floatY = Math.sin(time * 0.5) * 0.05;
				const floatX = Math.sin(time * 0.3) * 0.03;

				wheatleyRef.current.position.y = floatY;
				wheatleyRef.current.position.x = floatX;
				return; // Skip other rotation logic during most of the shake
			}
		}

		// Determine if we should create a new distraction
		if (
			!distractionState.current.isDistracted &&
			!distractionState.current.isShakingHead &&
			state.clock.getElapsedTime() - distractionState.current.lastDistractionTime >
				distractionState.current.cooldownPeriod &&
			Math.random() < 0.005
		) {
			// Increased from 0.002 to 0.005 (0.5% chance per frame to get distracted)

			// Create a new distraction
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
			distractionState.current.distractionSpeed
				.normalize()
				.multiplyScalar(0.5 + Math.random() * 1.5);

			// Set a delay before returning to mouse tracking
			distractionState.current.returnToMouseDelay = Math.random() * 0.5 + 0.2; // 0.2-0.7 seconds
		}

		let rotationX, rotationY;

		if (distractionState.current.isDistracted) {
			// Update distraction position (it's moving)
			distractionState.current.distractionPosition.add(
				distractionState.current.distractionSpeed.clone().multiplyScalar(delta)
			);

			// Calculate direction to distraction
			const directionToDistraction = distractionState.current.distractionPosition
				.clone()
				.sub(wheatleyRef.current.position);

			// Calculate rotation to look at distraction
			rotationY = Math.atan2(directionToDistraction.x, directionToDistraction.z);
			rotationX = Math.atan2(
				directionToDistraction.y,
				Math.sqrt(
					directionToDistraction.x * directionToDistraction.x +
						directionToDistraction.z * directionToDistraction.z
				)
			);

			// Check if distraction is over
			if (
				distractionState.current.distractionTimer >
				distractionState.current.distractionDuration
			) {
				distractionState.current.isDistracted = false;
				distractionState.current.lastDistractionTime = state.clock.getElapsedTime();

				// 60% chance to shake head after watching a distraction
				if (Math.random() < 0.6) {
					// Start head shake
					distractionState.current.isShakingHead = true;
					distractionState.current.shakeTimer = 0;
					distractionState.current.shakeDuration = Math.random() * 0.8 + 0.5; // 0.5-1.3 seconds
					distractionState.current.shakeIntensity = Math.random() * 0.08 + 0.01; // Reduced from 0.1-0.25 to 0.05-0.13
					distractionState.current.shakeFrequency = Math.random() * 3 + 5; // 5-8 Hz
					distractionState.current.shakeDirection = Math.random() > 0.5 ? 1 : -1; // Random direction
				}
			}

			// Apply rotation with smooth damping
			wheatleyRef.current.rotation.x = THREE.MathUtils.lerp(
				wheatleyRef.current.rotation.x,
				rotationX,
				delta * 5
			);

			wheatleyRef.current.rotation.y = THREE.MathUtils.lerp(
				wheatleyRef.current.rotation.y,
				rotationY + Math.PI / 2, // Add offset to face forward
				delta * 5
			);
		} else if (!distractionState.current.isShakingHead) {
			// Only follow mouse if not distracted and not shaking head
			// Use mouse position for rotation
			const mouseX = mousePosition.x;
			const mouseY = mousePosition.y;

			// Map mouse position to rotation
			rotationX = -mouseY * 0.5; // Look up when mouse is at top

			// Adjust left-right sensitivity with non-linear mapping
			if (mouseX < 0) {
				// Left side - increase rotation by 30%
				rotationY = Math.sign(mouseX) * Math.pow(Math.abs(mouseX), 0.8) * 0.9;
			} else {
				// Right side - normal rotation
				rotationY = Math.sign(mouseX) * Math.pow(Math.abs(mouseX), 0.8) * 0.7;
			}

			// Apply rotation with smooth damping
			wheatleyRef.current.rotation.x = THREE.MathUtils.lerp(
				wheatleyRef.current.rotation.x,
				rotationX,
				delta * 5
			);

			wheatleyRef.current.rotation.y = THREE.MathUtils.lerp(
				wheatleyRef.current.rotation.y,
				rotationY + Math.PI / 2, // Add offset to face forward
				delta * 5
			);
		}

		// Add subtle bobbing motion (only if not in early shake phase)
		if (
			!distractionState.current.isShakingHead ||
			distractionState.current.shakeTimer >= distractionState.current.shakeDuration * 0.7
		) {
			const time = state.clock.getElapsedTime();
			const floatY = Math.sin(time * 0.5) * 0.05;
			const floatX = Math.sin(time * 0.3) * 0.03;

			wheatleyRef.current.position.y = floatY;
			wheatleyRef.current.position.x = floatX;
		}
	});

	return (
		<group ref={wheatleyRef} rotation={[0, Math.PI / 2, 0]}>
			<Wheatley scale={0.025} position={[0, -0.5, 0]} rotation={[0, Math.PI - 0.2, 0]} />
		</group>
	);
}
