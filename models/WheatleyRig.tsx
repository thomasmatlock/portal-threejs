import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';

const Wheatley = dynamic(() => import('./Wheatley').then((mod) => mod.Model), {
	ssr: false,
});

export function WheatleyRig() {
	const groupRef = useRef<THREE.Group>(null);
	const lookRef = useRef<THREE.Group>(null);
	const bodyRef = useRef<THREE.Group>(null);

	// Animation parameters
	const lookTarget = useRef(new THREE.Vector3());
	const lookSpeed = useRef(0.05);
	const idleTimer = useRef(0);
	const idleState = useRef({
		looking: false,
		waitTime: Math.random() * 2 + 1,
		lookDuration: 0,
		bobPhase: Math.random() * Math.PI * 2,
	});

	// Twitching parameters
	const twitchState = useRef({
		twitching: false,
		duration: 0,
		elapsed: 0,
		intensity: 0,
		recoveryRate: 0,
		originalRotation: new THREE.Euler(),
		targetRotation: new THREE.Euler(),
	});

	// Set initial rotation to face camera
	useEffect(() => {
		if (lookRef.current) {
			// Rotate 90 degrees to face camera
			lookRef.current.rotation.y = Math.PI / 2;
		}
	}, []);

	useFrame((state, delta) => {
		if (!groupRef.current || !lookRef.current || !bodyRef.current) return;

		// Increment timer
		idleTimer.current += delta;

		// Gentle floating/bobbing motion
		const floatY = Math.sin(state.clock.elapsedTime * 0.5 + idleState.current.bobPhase) * 0.05;
		const floatX = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;

		// Apply floating motion to body
		easing.damp3(bodyRef.current.position, [floatX, floatY, 0], 0.3, delta);

		// Handle twitching behavior
		if (twitchState.current.twitching) {
			// Update elapsed time
			twitchState.current.elapsed += delta;

			// If we're still in the twitch duration
			if (twitchState.current.elapsed < twitchState.current.duration) {
				// Apply random micro-movements to simulate nervousness
				if (Math.random() < 0.3) {
					const microTwitch =
						(Math.random() - 0.5) * 0.02 * twitchState.current.intensity;
					lookRef.current.rotation.z += microTwitch;
				}
			} else {
				// Gradually recover from the twitch
				const recovery = twitchState.current.recoveryRate * delta;
				lookRef.current.rotation.z = THREE.MathUtils.lerp(
					lookRef.current.rotation.z,
					twitchState.current.originalRotation.z,
					recovery
				);

				// Check if we've recovered enough to end the twitch
				if (
					Math.abs(lookRef.current.rotation.z - twitchState.current.originalRotation.z) <
					0.01
				) {
					twitchState.current.twitching = false;
				}
			}
		} else {
			// Randomly start a new twitch
			if (Math.random() < 0.002) {
				// Less frequent but longer twitches
				// Save original rotation
				twitchState.current.originalRotation.copy(lookRef.current.rotation);

				// Set twitch parameters
				twitchState.current.twitching = true;
				twitchState.current.elapsed = 0;
				twitchState.current.duration = Math.random() * 0.8 + 0.4; // 0.4 to 1.2 seconds
				twitchState.current.intensity = Math.random() * 0.5 + 0.5; // 0.5 to 1.0 intensity
				twitchState.current.recoveryRate = Math.random() * 2 + 1; // 1 to 3 recovery rate

				// Apply initial twitch
				const initialTwitch = (Math.random() - 0.5) * 0.2 * twitchState.current.intensity;
				lookRef.current.rotation.z += initialTwitch;
			}
		}

		// Random looking around behavior
		if (!idleState.current.looking) {
			// Wait for random duration before looking somewhere new
			if (idleTimer.current > idleState.current.waitTime) {
				// Start looking at a new random target
				lookTarget.current.set(
					(Math.random() - 0.5) * 1.5,
					(Math.random() - 0.5) * 1.5,
					-2 - Math.random() * 3
				);
				idleState.current.looking = true;
				idleState.current.lookDuration = Math.random() * 1.5 + 0.5;
				idleTimer.current = 0;
			}
		} else {
			// Look at target
			const lookDirection = new THREE.Vector3();
			lookRef.current.getWorldPosition(lookDirection);
			lookDirection.sub(lookTarget.current).normalize().negate();

			// Calculate target rotation
			const targetRotation = new THREE.Euler();
			targetRotation.y = Math.atan2(lookDirection.x, lookDirection.z) + Math.PI / 2; // Add 90 degrees to base rotation
			targetRotation.x = Math.atan2(
				lookDirection.y,
				Math.sqrt(lookDirection.x * lookDirection.x + lookDirection.z * lookDirection.z)
			);

			// Smoothly rotate to look at target
			easing.dampE(
				lookRef.current.rotation,
				[targetRotation.x, targetRotation.y, lookRef.current.rotation.z], // Preserve Z for twitches
				lookSpeed.current,
				delta
			);

			// Check if we've been looking long enough
			if (idleTimer.current > idleState.current.lookDuration) {
				idleState.current.looking = false;
				idleState.current.waitTime = Math.random() * 2 + 0.5;
				idleTimer.current = 0;
			}
		}
	});

	return (
		<group ref={groupRef}>
			<group ref={bodyRef}>
				<group ref={lookRef} rotation={[0, Math.PI / 2, 0]}>
					<Wheatley scale={0.025} position={[0, -0.5, 0]} />
				</group>
			</group>
		</group>
	);
}
