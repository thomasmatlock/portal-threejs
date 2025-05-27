import { Vector3, Camera } from 'three';

export const MOVEMENT_CONSTANTS = {
	SPEED: 5,
	JUMP_FORCE: 7,
	PLAYER_HEIGHT: 1.8,
	DRAG_FACTOR: 0.9,
	MOVEMENT_MULTIPLIER: 20,
} as const;

export interface MovementInput {
	forward: boolean;
	backward: boolean;
	left: boolean;
	right: boolean;
	jump: boolean;
}

export interface PlayerState {
	position: { x: number; y: number; z: number };
	velocity: { x: number; y: number; z: number };
	isGrounded: boolean;
}

/**
 * Calculate movement direction based on input
 */
export function calculateMovementDirection(input: MovementInput): Vector3 {
	const direction = new Vector3();

	if (input.forward) direction.z = -1;
	else if (input.backward) direction.z = 1;

	if (input.left) direction.x = -1;
	else if (input.right) direction.x = 1;

	return direction;
}

/**
 * Apply camera-relative rotation to movement direction
 */
export function applyCameraRotation(direction: Vector3, camera: Camera): Vector3 {
	if (direction.length() === 0) return direction;

	direction.normalize().multiplyScalar(MOVEMENT_CONSTANTS.SPEED);

	const cameraDirection = new Vector3();
	camera.getWorldDirection(cameraDirection);
	const angle = Math.atan2(cameraDirection.x, cameraDirection.z);

	return new Vector3(
		direction.x * Math.cos(angle) - direction.z * Math.sin(angle),
		0,
		direction.x * Math.sin(angle) + direction.z * Math.cos(angle)
	);
}

/**
 * Calculate new velocity with movement applied
 */
export function calculateNewVelocity(
	rotatedDirection: Vector3,
	currentVelocity: { x: number; y: number; z: number },
	delta: number,
	isMoving: boolean
): { x: number; y: number; z: number } {
	if (isMoving) {
		return {
			x: rotatedDirection.x * MOVEMENT_CONSTANTS.MOVEMENT_MULTIPLIER * delta,
			y: currentVelocity.y,
			z: rotatedDirection.z * MOVEMENT_CONSTANTS.MOVEMENT_MULTIPLIER * delta,
		};
	}

	// Apply drag when not moving
	return {
		x: currentVelocity.x * MOVEMENT_CONSTANTS.DRAG_FACTOR,
		y: currentVelocity.y,
		z: currentVelocity.z * MOVEMENT_CONSTANTS.DRAG_FACTOR,
	};
}

/**
 * Handle jump mechanics
 */
export function handleJump(
	shouldJump: boolean,
	isGrounded: boolean,
	currentVelocity: { x: number; y: number; z: number }
): { x: number; y: number; z: number } {
	if (shouldJump && isGrounded) {
		return {
			x: currentVelocity.x,
			y: MOVEMENT_CONSTANTS.JUMP_FORCE,
			z: currentVelocity.z,
		};
	}
	return currentVelocity;
}
