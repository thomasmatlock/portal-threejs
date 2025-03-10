import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Wheatley = dynamic(() => import('./Wheatley').then((mod) => mod.Model), {
	ssr: false,
});

export function WheatleyRig() {
	// Simple refs
	const wheatleyRef = useRef<THREE.Group>(null);
	const { mouse } = useThree();

	// Simple mouse following
	useFrame(() => {
		if (!wheatleyRef.current) return;

		// Map mouse position to rotation
		// Mouse x: -1 (left) to 1 (right) → rotation y
		// Mouse y: -1 (bottom) to 1 (top) → rotation x
		const rotationX = -mouse.y * 0.5; // Look up when mouse is at top
		const rotationY = mouse.x * 0.5; // Look right when mouse is at right

		// Apply rotation directly
		wheatleyRef.current.rotation.x = rotationX;
		wheatleyRef.current.rotation.y = rotationY + Math.PI / 2; // Add offset to face forward
	});

	return (
		<group ref={wheatleyRef} rotation={[0, Math.PI / 2, 0]}>
			<Wheatley scale={0.025} position={[0, -0.5, 0]} rotation={[0, Math.PI, 0]} />
		</group>
	);
}
