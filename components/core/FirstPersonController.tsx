/*
 * File goals: First person controller component for Portal player movement
 * - Handle keyboard input for movement and jumping
 * - Manage physics simulation with Rapier
 * - Support camera synchronization with player position
 * - Maintain focused, testable architecture
 */

import React from 'react';
import { PointerLockControls } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { usePlayerPhysics } from './usePlayerPhysics';

interface FirstPersonControllerProps {
	position?: [number, number, number];
}

export default function FirstPersonController(props: FirstPersonControllerProps) {
	const { player } = usePlayerPhysics(props.position);

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
