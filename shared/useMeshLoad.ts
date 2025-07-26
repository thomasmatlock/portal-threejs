// hooks/useMeshLoad.ts
import { useState, useEffect } from 'react';
import { meshLoadManager } from './meshLoadManager';

export function useMeshLoad(meshName: string) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Check if already loaded
		if (meshLoadManager.isLoaded(meshName)) {
			setIsLoaded(true);
			return;
		}

		// Subscribe to updates
		const unsubscribe = meshLoadManager.subscribe((loadedMesh) => {
			if (loadedMesh === meshName) {
				setIsLoaded(true);
			}
		});

		return unsubscribe; // This needs to return void, not boolean
	}, [meshName]);

	return isLoaded;
}
