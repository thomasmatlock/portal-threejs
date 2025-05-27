import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import type { RapierRigidBody } from '@react-three/rapier';
import {
	calculateMovementDirection,
	applyCameraRotation,
	calculateNewVelocity,
	handleJump,
	MOVEMENT_CONSTANTS,
	type MovementInput,
} from './firstPersonMovement';
import { useGroundDetection } from './useGroundDetection';

/**
 * Custom hook for managing player physics and movement
 */
export function usePlayerPhysics(initialPosition?: [number, number, number]) {
	const { camera } = useThree();
	const player = useRef<RapierRigidBody>(null);
	const [, getKeys] = useKeyboardControls();
	const { isGrounded, updateGroundState } = useGroundDetection();

	// Initialize player position and camera
	useEffect(() => {
		if (player.current) {
			const pos = initialPosition || [0, 1, 0];
			player.current.setTranslation({ x: pos[0], y: pos[1], z: pos[2] }, true);
			camera.position.set(pos[0], pos[1] + MOVEMENT_CONSTANTS.PLAYER_HEIGHT, pos[2]);
		}
	}, [camera, initialPosition]);

	// Handle physics update
	useFrame((_, delta) => {
		if (!player.current) return;

		const { forward, backward, left, right, jump } = getKeys();
		const input: MovementInput = { forward, backward, left, right, jump };
		const position = player.current.translation();
		const velocity = player.current.linvel();

		// Update ground detection
		updateGroundState(position.y, velocity.y);

		// Calculate movement
		const direction = calculateMovementDirection(input);
		const rotatedDirection = applyCameraRotation(direction, camera);
		const isMoving = direction.length() > 0;

		// Apply movement
		const newVelocity = calculateNewVelocity(rotatedDirection, velocity, delta, isMoving);
		player.current.setLinvel(newVelocity, true);

		// Handle jumping
		const jumpVelocity = handleJump(input.jump, isGrounded, newVelocity);
		if (jumpVelocity !== newVelocity) {
			player.current.setLinvel(jumpVelocity, true);
		}

		// Update camera position
		camera.position.set(position.x, position.y + MOVEMENT_CONSTANTS.PLAYER_HEIGHT, position.z);
	});

	return {
		player,
		isGrounded,
	};
}
