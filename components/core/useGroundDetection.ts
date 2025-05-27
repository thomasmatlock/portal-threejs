import { useState, useRef } from 'react';

/**
 * Custom hook for ground detection based on position stability
 * Uses position change threshold and velocity to determine if player is grounded
 */
export function useGroundDetection() {
	const [isGrounded, setIsGrounded] = useState(false);
	const lastY = useRef(0);

	const updateGroundState = (
		currentY: number,
		velocityY: number,
		threshold = 0.01,
		velocityThreshold = 0.1
	) => {
		const isStable = Math.abs(currentY - lastY.current) < threshold;
		const isNotFalling = velocityY < velocityThreshold;

		setIsGrounded(isStable && isNotFalling);
		lastY.current = currentY;
	};

	return {
		isGrounded,
		updateGroundState,
	};
}
