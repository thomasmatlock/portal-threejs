import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DeviceOrientationControlsProps {
	enabled?: boolean;
}

const DeviceOrientationControls = ({ enabled = true }: DeviceOrientationControlsProps) => {
	const { camera } = useThree();

	useEffect(() => {
		// Point camera up at y-axis
		const upVector = new THREE.Vector3(0, 1, 0);
		camera.lookAt(upVector);
		// Store initial quaternion
		const initialQuaternion = camera.quaternion.clone();

		if (!enabled) return;

		let frameId: number;
		let initialAlpha: number | null = null;
		let initialBeta: number | null = null;
		let initialGamma: number | null = null;

		const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
			if (!event.alpha || !event.beta || !event.gamma) return;

			if (initialAlpha === null) {
				initialAlpha = event.alpha;
				initialBeta = event.beta;
				initialGamma = event.gamma;
				console.log('Initial orientation set:', {
					initialAlpha,
					initialBeta,
					initialGamma,
				});
				return;
			}

			// Calculate relative angles
			let alpha = THREE.MathUtils.degToRad(event.alpha - initialAlpha);
			let beta = THREE.MathUtils.degToRad(event.beta - initialBeta);
			let gamma = THREE.MathUtils.degToRad(event.gamma - initialGamma);

			// Create a quaternion for the device rotation
			const quaternion = new THREE.Quaternion().copy(initialQuaternion);

			// Handle Y-axis rotation (looking left/right) separately
			const yRotation = new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(0, 1, 0),
				-alpha
			);

			// Handle X-axis rotation (looking up/down)
			const xRotation = new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(1, 0, 0),
				beta
			);

			// Apply rotations in the correct order
			quaternion.multiply(yRotation).multiply(xRotation);

			frameId = requestAnimationFrame(() => {
				camera.quaternion.copy(quaternion);
			});
		};

		window.addEventListener('deviceorientation', handleDeviceOrientation, true);
		console.log('Device orientation controls initialized');

		return () => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}
			window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
			console.log('Device orientation controls cleaned up');
		};
	}, [camera, enabled]);

	return null;
};

export default DeviceOrientationControls;
