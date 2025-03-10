import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUIContext } from '../../context/uiContext';

const PBody = dynamic(() => import('../PBody').then((mod) => mod.Model), {
	ssr: false,
});

export function PBodyRig() {
	const pBodyRef = useRef<THREE.Group>(null);
	const [scale, setScale] = useState(0); // Start hidden at scale 0

	// Get UI context for menu interactions
	const { hoveredMenuOption } = useUIContext();

	// React to menu option changes
	useEffect(() => {
		// Show PBody when hovering over multiplayer option
		if (hoveredMenuOption === 'multiplayer') {
			// setScale(0.015); // Show at normal scale
			setScale(0); // Show at normal scale
		} else {
			setScale(0); // Hide when not hovering multiplayer
		}
	}, [hoveredMenuOption]);

	// Handle smooth scaling
	useFrame((state, delta) => {
		if (!pBodyRef.current) return;

		// Get current scale
		const currentScale = pBodyRef.current.scale.x;

		// Smoothly interpolate to target scale
		const newScale = THREE.MathUtils.lerp(currentScale, scale, delta * 5);

		// Apply uniform scaling
		pBodyRef.current.scale.set(newScale, newScale, newScale);
	});

	// Set initial scale to 0
	useEffect(() => {
		if (pBodyRef.current) {
			pBodyRef.current.scale.set(0, 0, 0);
		}
	}, []);

	return (
		<group ref={pBodyRef} position={[0.75, -0.5, 0]} scale={[0, 0, 0]}>
			<PBody />
		</group>
	);
}
