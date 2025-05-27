import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { handleHeadShaking } from '../utils/wheatleyHeadShaking';
import {
	createDistraction,
	shouldStartDistraction,
	handleDistractionBehavior,
} from '../utils/wheatleyDistractions';
import {
	handleMouseFollowing,
	createInitialDistractionState,
} from '../utils/wheatleyMouseFollowing';
import { DistractionState, MousePosition } from '../utils/wheatleyTypes';

export function useWheatleyBehavior() {
	// Three.js refs and state
	const wheatleyRef = useRef<THREE.Group>(null);
	const { mouse } = useThree();

	// Track mouse position manually to work with UI elements
	const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

	// Distraction state
	const distractionState = useRef<DistractionState>(createInitialDistractionState());

	// Set up global mouse tracking
	useEffect(() => {
		// Function to update mouse position
		const updateMousePosition = (e: MouseEvent) => {
			// Convert screen coordinates to normalized coordinates (-1 to 1)
			const x = (e.clientX / window.innerWidth) * 2 - 1;
			const y = -(e.clientY / window.innerHeight) * 2 + 1;
			setMousePosition({ x, y });
		};

		// Add event listener
		window.addEventListener('mousemove', updateMousePosition);

		// Clean up
		return () => {
			window.removeEventListener('mousemove', updateMousePosition);
		};
	}, []);

	// Enhanced mouse following with distractions and head shaking
	useFrame((state, delta) => {
		if (!wheatleyRef.current) return;

		// Update distraction timer
		distractionState.current.distractionTimer += delta;

		// Handle head shaking if active
		const shouldSkipOtherLogic = handleHeadShaking(wheatleyRef, distractionState, delta);
		if (shouldSkipOtherLogic) return;

		// Check if we should create a new distraction
		if (shouldStartDistraction(distractionState, state.clock.getElapsedTime())) {
			createDistraction(distractionState);
		}

		// Handle behavior based on current state
		if (distractionState.current.isDistracted) {
			handleDistractionBehavior({
				wheatleyRef,
				distractionState,
				delta,
				elapsedTime: state.clock.getElapsedTime(),
			});
		} else if (!distractionState.current.isShakingHead) {
			handleMouseFollowing({ wheatleyRef, mousePosition, delta });
		}
	});

	return { wheatleyRef };
}
