import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Wheatley = dynamic(() => import('./Wheatley').then((mod) => mod.Model), {
	ssr: false,
});

export function WheatleyRig() {
	// Simple refs
	const wheatleyRef = useRef<THREE.Group>(null);
	const containerRef = useRef<THREE.Group>(null);
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
		cooldownPeriod: 5, // Seconds between possible distractions
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

	// Enhanced mouse following with distractions
	useFrame((state, delta) => {
		if (!wheatleyRef.current || !containerRef.current) return;

		// Update distraction timer
		distractionState.current.distractionTimer += delta;

		// Determine if we should create a new distraction
		if (
			!distractionState.current.isDistracted &&
			state.clock.getElapsedTime() - distractionState.current.lastDistractionTime >
				distractionState.current.cooldownPeriod &&
			Math.random() < 0.002
		) {
			// 0.2% chance per frame to get distracted

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
			}
		} else {
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

		// Add subtle bobbing motion
		const time = state.clock.getElapsedTime();
		const floatY = Math.sin(time * 0.5) * 0.05;
		const floatX = Math.sin(time * 0.3) * 0.03;

		wheatleyRef.current.position.y = floatY;
		wheatleyRef.current.position.x = floatX;

		// Gentle hovering animation
		const hoverY = Math.sin(time * 0.5) * 0.1;

		// Secondary micro-movements - adds a bit of character
		const microX = Math.sin(time * 0.7) * 0.02;
		const microZ = Math.cos(time * 0.6) * 0.02;

		// Apply hovering to container
		containerRef.current.position.y = hoverY;
		containerRef.current.position.x = microX;
		containerRef.current.position.z = microZ;

		// Subtle tilt as he hovers
		containerRef.current.rotation.x = Math.sin(time * 0.4) * 0.03;
		containerRef.current.rotation.z = Math.sin(time * 0.3) * 0.03;
	});

	return (
		<group ref={containerRef}>
			<group ref={wheatleyRef} rotation={[0, Math.PI / 2, 0]}>
				<Wheatley scale={0.025} position={[0, -0.5, 0]} rotation={[0, Math.PI - 0.2, 0]} />
			</group>
		</group>
	);
}
