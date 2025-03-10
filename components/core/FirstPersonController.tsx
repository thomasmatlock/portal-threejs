// components/portal/core/FirstPersonController.tsx
import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useKeyboardControls, PointerLockControls } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';

const SPEED = 5;
const JUMP_FORCE = 7;
const PLAYER_HEIGHT = 1.8;

interface FirstPersonControllerProps {
	position?: [number, number, number];
	// Add other specific props as needed
}

export default function FirstPersonController(props: FirstPersonControllerProps) {
	const { camera } = useThree();
	const player = useRef<RapierRigidBody>(null);
	const [, getKeys] = useKeyboardControls();
	const [isGrounded, setIsGrounded] = useState(false);
	const lastY = useRef(0);

	// Initialize player physics body
	useEffect(() => {
		if (player.current) {
			// Position the player
			player.current.setTranslation({ x: 0, y: 1, z: 0 }, true);

			// Position camera at player eye level
			camera.position.set(0, PLAYER_HEIGHT, 0);
		}
	}, [camera]);

	// Handle movement and physics
	useFrame((state, delta) => {
		if (!player.current) return;

		const { forward, backward, left, right, jump } = getKeys();

		// Get current player position and velocity
		const position = player.current.translation();
		const velocity = player.current.linvel();

		// Simple ground detection by checking if y position is stable
		const currentY = position.y;
		if (Math.abs(currentY - lastY.current) < 0.01 && velocity.y < 0.1) {
			setIsGrounded(true);
		} else {
			setIsGrounded(false);
		}
		lastY.current = currentY;

		// Movement direction based on camera orientation
		const direction = new Vector3();

		// Forward/backward movement
		if (forward) {
			direction.z = -1;
		} else if (backward) {
			direction.z = 1;
		}

		// Left/right movement
		if (left) {
			direction.x = -1;
		} else if (right) {
			direction.x = 1;
		}

		// Normalize and apply movement relative to camera
		if (direction.length() > 0) {
			direction.normalize().multiplyScalar(SPEED * delta);

			// Convert direction to be relative to camera rotation
			const cameraDirection = new Vector3();
			camera.getWorldDirection(cameraDirection);
			const angle = Math.atan2(cameraDirection.x, cameraDirection.z);

			// Rotate direction vector
			const rotatedDirection = new Vector3(
				direction.x * Math.cos(angle) - direction.z * Math.sin(angle),
				0,
				direction.x * Math.sin(angle) + direction.z * Math.cos(angle)
			);

			// Apply movement
			player.current.setLinvel(
				{
					x: rotatedDirection.x * 20,
					y: velocity.y,
					z: rotatedDirection.z * 20,
				},
				true
			);
		} else {
			// Apply drag when not pressing movement keys
			player.current.setLinvel(
				{
					x: velocity.x * 0.9,
					y: velocity.y,
					z: velocity.z * 0.9,
				},
				true
			);
		}

		// Handle jumping
		if (jump && isGrounded) {
			player.current.setLinvel(
				{
					x: velocity.x,
					y: JUMP_FORCE,
					z: velocity.z,
				},
				true
			);
		}

		// Update camera position
		camera.position.set(position.x, position.y + PLAYER_HEIGHT, position.z);
	});

	return (
		<>
			<RigidBody
				ref={player}
				position={props.position || [0, 1, 0]}
				enabledRotations={[false, false, false]}
				type="dynamic"
				colliders="ball"
				{...props}
			>
				{/* Player hitbox - invisible in first person */}
				<mesh visible={false}>
					<capsuleGeometry args={[0.5, 1, 4, 8]} />
				</mesh>
			</RigidBody>

			<PointerLockControls />
		</>
	);
}
