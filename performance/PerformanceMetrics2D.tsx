// Goals:
// - Create a 2D version of the performance metrics component for use in the DOM
// - Display debug info and performance metrics
// - Use the same global store as the 3D version
// - Match the styling of the 3D version but in a DOM-friendly way

import React, { useEffect, useState } from 'react';
import { globalStore, addDebug, updatePerformanceMetrics } from './PerformanceMetrics3D';

// Helper function to format time in ms
const formatTime = (ms: number) => {
	if (ms < 1000) return `${Math.round(ms)}ms`;
	return `${Math.round(ms / 10) / 100}s`;
};

// Props for the PerformanceMetrics2D component
interface PerformanceMetrics2DProps {
	position?: { top?: string; right?: string; bottom?: string; left?: string };
	metricsColor?: string;
	debugColor?: string;
	fontSize?: string;
	maxWidth?: string;
	maxDebugLines?: number;
	showDebug?: boolean;
	showMetrics?: boolean;
	className?: string;
}

// The 2D performance metrics component
const PerformanceMetrics2D: React.FC<PerformanceMetrics2DProps> = ({
	position = { bottom: '10px', left: '10px' },
	metricsColor = '#43E12E',
	debugColor = '#ffffff',
	fontSize = '10px',
	maxWidth = '400px',
	maxDebugLines = 25,
	showDebug = true,
	showMetrics = true,
	className = '',
}) => {
	// Local state to trigger re-renders when metrics or debug info change
	const [metrics, setMetrics] = useState(globalStore.metrics);
	const [debugInfo, setDebugInfo] = useState<string[]>([]);

	// Subscribe to updates
	useEffect(() => {
		console.log('PerformanceMetrics2D component mounted');

		// Add listener to update local state when metrics or debug info change
		const removeListener = globalStore.addListener((data: any) => {
			setMetrics(data.metrics);
			setDebugInfo([...data.debugInfo]);
		});

		// Cleanup listener on unmount
		return () => {
			console.log('PerformanceMetrics2D component unmounted');
			removeListener();
		};
	}, []);

	// Base container style
	const containerStyle: React.CSSProperties = {
		position: 'absolute',
		...position,
		fontFamily: 'monospace',
		fontSize,
		maxWidth,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		color: debugColor,
		padding: '10px',
		borderRadius: '4px',
		zIndex: 1000,
		overflow: 'auto',
		maxHeight: '80vh',
	};

	// Debug section style
	const debugStyle: React.CSSProperties = {
		whiteSpace: 'pre-wrap',
		marginBottom: showMetrics ? '10px' : '0',
	};

	// Metrics section style
	const metricsStyle: React.CSSProperties = {
		color: metricsColor,
		whiteSpace: 'pre-wrap',
	};

	return (
		<div className={`performance-metrics-2d ${className}`} style={containerStyle}>
			{/* Debug info in white */}
			{showDebug && debugInfo.length > 0 && (
				<div className="debug-info" style={debugStyle}>
					{debugInfo.slice(-maxDebugLines).join('\n')}
				</div>
			)}

			{/* Performance metrics in green */}
			{showMetrics && metrics.totalLoadTime > 0 && (
				<div className="performance-metrics" style={metricsStyle}>
					{/* <div>PERFORMANCE METRICS:</div> */}
					<div>Model Load: {formatTime(metrics.gltfLoadTime)}</div>
					{/* <div>Mesh Processing: {formatTime(metrics.meshProcessingTime)}</div> */}
					<div>Texture Load: {formatTime(metrics.textureLoadTime)}</div>
					<div>Total Load: {formatTime(metrics.totalLoadTime)}</div>
				</div>
			)}
		</div>
	);
};

// Export the component and the utility functions
export { addDebug, updatePerformanceMetrics };
export default PerformanceMetrics2D;
