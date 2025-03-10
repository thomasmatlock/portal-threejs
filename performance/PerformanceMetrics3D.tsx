// Goals:
// - Create a self-contained 3D performance metrics component
// - Display debug info and performance metrics
// - Provide a simple API for updating metrics and debug logs from anywhere
// - Include debug logs for troubleshooting

import React, { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Helper function to format time in ms
const formatTime = (ms: number) => {
	if (ms < 1000) return `${Math.round(ms)}ms`;
	return `${Math.round(ms / 10) / 100}s`;
};

// Interface for performance metrics
export interface PerformanceMetrics {
	gltfLoadTime: number;
	meshProcessingTime: number;
	textureLoadTime: number;
	totalLoadTime: number;
}

// Props for the PerformanceMetrics3D component
interface PerformanceMetrics3DProps {
	position?: [number, number, number];
	scale?: [number, number, number];
	metricsColor?: string;
	debugColor?: string;
	fontSize?: number;
	maxWidth?: number;
	renderOrder?: number;
	maxDebugLines?: number;
}

// Create a global store for metrics and debug info that can be accessed from anywhere
export const globalStore = {
	metrics: {
		gltfLoadTime: 0,
		meshProcessingTime: 0,
		textureLoadTime: 0,
		totalLoadTime: 0,
	},
	debugInfo: [] as string[],
	listeners: [] as Function[],

	// Update metrics and notify listeners
	updateMetrics(newMetrics: Partial<PerformanceMetrics>) {
		this.metrics = { ...this.metrics, ...newMetrics };
		console.log('Performance metrics updated:', this.metrics);
		this.notifyListeners();
	},

	// Add debug message
	addDebug(message: string) {
		console.log(message);
		this.debugInfo.push(message);
		this.notifyListeners();
	},

	// Notify all listeners
	notifyListeners() {
		this.listeners.forEach((listener) =>
			listener({
				metrics: this.metrics,
				debugInfo: [...this.debugInfo],
			})
		);
	},

	// Add a listener
	addListener(listener: Function) {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	},
};

// Export functions for use in other components
export const updatePerformanceMetrics = (metrics: Partial<PerformanceMetrics>) => {
	globalStore.updateMetrics(metrics);
};

export const addDebug = (message: string) => {
	globalStore.addDebug(message);
};

// Utility function to debug materials and geometry
export const debugMaterialsAndGeometry = (mesh: THREE.Mesh) => {
	const name = mesh.name || 'unnamed';
	addDebug(`Mesh: ${name}`);

	// Check for geometry
	if (mesh.geometry) {
		const geo = mesh.geometry;
		addDebug(`  Geometry: vertices=${geo.attributes.position?.count || 'N/A'}`);

		// Check for UV coordinates
		if (geo.attributes.uv) {
			addDebug(`  Has UVs: ${geo.attributes.uv !== undefined}`);
		}
	}

	// Check for material
	if (mesh.material) {
		const origMat = mesh.material as THREE.MeshStandardMaterial;
		addDebug(`  Material: ${origMat.name || 'unnamed'}`);
		addDebug(`  Material type: ${origMat.type}`);

		// Check for texture maps
		if (origMat.map) {
			addDebug(`  Has baseColor map: ${origMat.map !== null}`);
			if (origMat.map) {
				addDebug(
					`  Map encoding: ${origMat.map.encoding || (origMat.map as any).colorSpace}`
				);
				addDebug(`  Map flipY: ${origMat.map.flipY}`);
			}
		}

		if (origMat.metalnessMap) {
			addDebug(`  Has metalness map: ${origMat.metalnessMap !== null}`);
		}

		if (origMat.roughnessMap) {
			addDebug(`  Has roughness map: ${origMat.roughnessMap !== null}`);
		}
	}
};

// The 3D performance metrics component
const PerformanceMetrics3D: React.FC<PerformanceMetrics3DProps> = ({
	position = [0, 0, 0],
	scale = [0.5, 0.5, 0.5],
	metricsColor = '#00ff00',
	debugColor = '#ffffff',
	fontSize = 0.02,
	maxWidth = 1.25,
	renderOrder = 1000,
	maxDebugLines = 25,
}) => {
	// Local state to trigger re-renders when metrics or debug info change
	const [metrics, setMetrics] = useState<PerformanceMetrics>(globalStore.metrics);
	const [debugInfo, setDebugInfo] = useState<string[]>(globalStore.debugInfo);

	// Subscribe to updates
	useEffect(() => {
		console.log('PerformanceMetrics3D component mounted');

		// Add listener to update local state when metrics or debug info change
		const removeListener = globalStore.addListener(
			(data: { metrics: PerformanceMetrics; debugInfo: string[] }) => {
				setMetrics(data.metrics);
				setDebugInfo([...data.debugInfo]);
			}
		);

		// Cleanup listener on unmount
		return () => {
			console.log('PerformanceMetrics3D component unmounted');
			removeListener();
		};
	}, []);

	return (
		<group position={position} scale={scale} renderOrder={renderOrder}>
			{/* Debug info in white */}
			{debugInfo.length > 0 && (
				<Text
					position={[0, 0.5, 0]}
					color={debugColor}
					fontSize={fontSize}
					maxWidth={maxWidth}
					textAlign="left"
					anchorX="left"
					anchorY="top"
					renderOrder={renderOrder + 1}
				>
					{debugInfo.slice(-maxDebugLines).join('\n')}
				</Text>
			)}

			{/* Performance metrics in green */}
			{metrics.totalLoadTime > 0 && (
				<Text
					position={[0, -0.05, 0]}
					color={metricsColor}
					fontSize={fontSize}
					maxWidth={maxWidth}
					textAlign="left"
					anchorX="left"
					anchorY="top"
					renderOrder={renderOrder + 2}
				>
					{`
Model Load: ${formatTime(metrics.gltfLoadTime)}
Texture Load: ${formatTime(metrics.textureLoadTime)}
Total Load: ${formatTime(metrics.totalLoadTime)}`}
				</Text>
			)}
		</group>
	);
};

export default PerformanceMetrics3D;
