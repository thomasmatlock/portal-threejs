import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';
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
				[targetRotation.x, targetRotation.y, 0],
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

		// Add a slight nervous twitch occasionally
		if (Math.random() < 0.005) {
			const twitchAmount = (Math.random() - 0.5) * 0.1;
			lookRef.current.rotation.z += twitchAmount;
		}
	});

	return (
		<group ref={groupRef}>
			<group ref={bodyRef}>
				<group ref={lookRef} rotation={[0, Math.PI / 2, 0]}>
					<Wheatley scale={0.05} position={[0, -1, 0]} />
				</group>
			</group>
		</group>
	);
}
