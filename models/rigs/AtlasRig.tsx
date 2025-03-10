import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUIContext } from '../../context/uiContext';
import { useUserContext } from '../../context/userContext';

const Atlas = dynamic(() => import('../Atlas').then((mod) => mod.Model), {
	ssr: false,
});

export function AtlasRig() {
	const atlasRef = useRef<THREE.Group>(null);
	const [scale, setScale] = useState(0); // Start hidden at scale 0

	// Get UI context for menu interactions
	const { currentMenu } = useUIContext();

	// Get user context for mobile detection
	const { mobile } = useUserContext();

	// React to menu option changes
	useEffect(() => {
		// Show Atlas only when in singleplayer menu
		if (currentMenu === 'singleplayer') {
			setScale(mobile ? 0.15 : 0.25); // Show at normal scale
		} else {
			setScale(0); // Hide when not in singleplayer menu
		}
	}, [currentMenu]);

	// Handle smooth scaling and hovering animation
	useFrame((state, delta) => {
		if (!atlasRef.current) return;

		// Get current scale
		const currentScale = atlasRef.current.scale.x;

		// Smoothly interpolate to target scale
		const newScale = THREE.MathUtils.lerp(currentScale, scale, delta * 5);

		// Apply uniform scaling
		atlasRef.current.scale.set(newScale, newScale, newScale);

		// Skip hover animation if nearly invisible
		if (newScale < 0.01) return;

		// Add hovering animation
		const time = state.clock.getElapsedTime();

		// Vertical hovering (up and down)
		const hoverY = Math.sin(time * 0.5) * 0.1; // Slower, larger vertical movement

		// Slight horizontal movement
		const hoverX = Math.sin(time * 0.3) * 0.05; // Subtle side-to-side

		// Slight forward/back movement
		const hoverZ = Math.sin(time * 0.2) * 0.05; // Very subtle forward/back

		// Apply hovering to position - different for mobile and desktop
		if (mobile) {
			atlasRef.current.position.y = -0.5 + hoverY; // Higher position on mobile + hover
			atlasRef.current.position.x = 0 + hoverX; // Centered on mobile
		} else {
			atlasRef.current.position.y = -1.0 + hoverY; // Lower position on desktop + hover
			atlasRef.current.position.x = 0.75 + hoverX; // Right side on desktop
		}

		atlasRef.current.position.z = hoverZ; // Just the hover for Z

		// Add slight rotation to make it look more natural
		atlasRef.current.rotation.x = Math.sin(time * 0.2) * 0.05; // Slight forward/back tilt
		atlasRef.current.rotation.y = Math.sin(time * 0.1) * 0.05; // Very slight turning
		atlasRef.current.rotation.z = Math.sin(time * 0.3) * 0.03; // Subtle side tilt
	});

	// Set initial scale to 0
	useEffect(() => {
		if (atlasRef.current) {
			atlasRef.current.scale.set(0, 0, 0);
		}
	}, []);

	return (
		<group ref={atlasRef} scale={[0, 0, 0]}>
			<Atlas />
		</group>
	);
}
