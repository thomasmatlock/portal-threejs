// optimizedShadowManager.tsx
/*
Goals:
- Provide global shadow management for all lights in scene
- Handle shadow map resets ONLY on mobile state changes
- Automatically detect and update all scene lights
- Maximize performance by minimizing unnecessary renders
- Optimize memory usage
*/

import { useThree } from '@react-three/fiber';
import { useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import chalk from 'chalk';
import UserContextProvider from '@/context/userContext';
import { useContext } from 'react';

const { log } = console;

interface LightingShadowManagerProps {
	onReset?: () => void;
}

export const LightingShadowManager: React.FC<LightingShadowManagerProps> = ({ onReset }) => {
	const { scene } = useThree();
	const { mobile } = useContext(UserContextProvider);
	const previousMobile = useRef<boolean | null>(null);

	const resetShadows = useCallback(() => {
		// Skip if mobile state hasn't changed
		if (previousMobile.current === mobile) {
			return;
		}

		let lightsFound = 0;
		const lights: THREE.Light[] = [];

		// Collect all lights first to minimize traversal
		scene.traverse((object) => {
			if (object instanceof THREE.Light && object.shadow) {
				lights.push(object);
			}
		});

		// Process collected lights
		lights.forEach((light) => {
			lightsFound++;
			const currentPosition = light.position.clone();
			const currentMapSize = light.shadow.mapSize.clone();

			if (light.shadow.map) {
				light.shadow.map.dispose();
				light.shadow.map = null;
			}

			light.shadow.mapSize.copy(currentMapSize);
			light.shadow.needsUpdate = true;
			light.position.add(new THREE.Vector3(0.0001, 0.0001, 0.0001));
			light.position.copy(currentPosition);
			light.castShadow = true;
		});

		if (lightsFound > 0) {
			log(chalk.yellow(`Shadow reset triggered by mobile state change: ${mobile}`));
			log(chalk.green(`Reset complete for ${lightsFound} lights`));
			onReset?.();
		}

		// Update previous mobile state
		previousMobile.current = mobile;
	}, [scene, mobile, onReset]);

	// Only run effect when mobile state changes
	useEffect(() => {
		resetShadows();
	}, [mobile, resetShadows]);

	return null;
};

// Utility function remains unchanged but optimized
export const resetSceneShadows = (scene: THREE.Scene) => {
	const lights: THREE.Light[] = [];

	scene.traverse((object) => {
		if (object instanceof THREE.Light && object.shadow) {
			lights.push(object);
		}
	});

	lights.forEach((light) => {
		const currentMapSize = light.shadow.mapSize.clone();

		if (light.shadow.map) {
			light.shadow.map.dispose();
			light.shadow.map = null;
		}

		light.shadow.mapSize.copy(currentMapSize);
		light.shadow.needsUpdate = true;
	});
};

export default LightingShadowManager;
