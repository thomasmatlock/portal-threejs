import dynamic from 'next/dynamic';
import { useRef, useState, useEffect, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUIContext } from '../../context/uiContext';
import UserContext from '@/context/userContext';

const Atlas = dynamic(() => import('../Atlas').then((mod) => mod.Model), {
	ssr: false,
});

export function AtlasRig() {
	const { mobile } = useContext(UserContext);
	const atlasRef = useRef<THREE.Group>(null);
	const [scale, setScale] = useState(0); // Start hidden at scale 0

	// Get UI context for menu interactions
	const { currentMenu } = useUIContext();

	// React to menu option changes
	useEffect(() => {
		// Show Atlas only when in singleplayer menu
		if (currentMenu === 'singleplayer') {
			setScale(0.2); // Show at normal scale
		} else {
			setScale(0); // Hide when not in singleplayer menu
		}
	}, [currentMenu]);

	// Handle smooth scaling
	useFrame((state, delta) => {
		if (!atlasRef.current) return;

		// Get current scale
		const currentScale = atlasRef.current.scale.x;

		// Smoothly interpolate to target scale
		const newScale = THREE.MathUtils.lerp(currentScale, scale, delta * 5);

		// Apply uniform scaling
		atlasRef.current.scale.set(newScale, newScale, newScale);
	});

	// Set initial scale to 0
	useEffect(() => {
		if (atlasRef.current) {
			atlasRef.current.scale.set(0, 0, 0);
		}
	}, []);

	return (
		<group ref={atlasRef} position={mobile ? [0, -0.5, 0] : [1, -0.75, 0]} scale={[0, 0, 0]}>
			<Atlas />
		</group>
	);
}
