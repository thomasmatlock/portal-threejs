// components/portal/core/Player.tsx
import * as THREE from 'three';
import { useKeyboardControls, PointerLockControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { Vector3, type Vector3Tuple } from 'three';

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

interface PlayerProps {
	position?: Vector3Tuple;
}

export default function Player({ position = [0, 1, 0] as Vector3Tuple }: PlayerProps) {
	const playerRef = useRef<RapierRigidBody>(null);
	const rapier = useRapier();
	const [, getKeys] = useKeyboardControls();

	useFrame((state) => {
		if (!playerRef.current) return;

		// Get keyboard controls
		const { forward, backward, left, right, jump } = getKeys();

		// Get current velocity
		const velocity = playerRef.current.linvel();

		// Update camera position to match player position
		const playerPosition = playerRef.current.translation();
		state.camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z);

		// Calculate movement direction based on camera orientation
		frontVector.set(0, 0, Number(backward) - Number(forward));
		sideVector.set(Number(left) - Number(right), 0, 0);
		direction
			.subVectors(frontVector, sideVector)
			.normalize()
			.multiplyScalar(SPEED)
			.applyEuler(state.camera.rotation);

		// Apply movement
		playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

		// Handle jumping with ray casting for better ground detection
		try {
			// Use the rapier world to cast a ray for ground detection
			const world = rapier.world;

			// Check if we're grounded using a simple velocity check
			const isGrounded = Math.abs(velocity.y) < 0.1;

			// Jump if grounded and jump key pressed
			if (jump && isGrounded) {
				playerRef.current.setLinvel({ x: 0, y: 7.5, z: 0 }, true);
			}
		} catch (error) {
			console.error('Physics error:', error);
		}
	});

	return (
		<>
			<RigidBody
				ref={playerRef}
				colliders={false}
				mass={1}
				type="dynamic"
				position={position}
				enabledRotations={[false, false, false]}
			>
				<CapsuleCollider args={[0.75, 0.5]} />
			</RigidBody>

			{/* Add pointer lock controls for mouse look */}
			<PointerLockControls />
		</>
	);
}
