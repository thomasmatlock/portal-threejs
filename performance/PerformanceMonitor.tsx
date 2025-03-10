import { Suspense, useState, useEffect, useRef, ReactNode } from 'react';
import styles from './PerformanceMonitor.module.scss';

interface Props {
	children: ReactNode;
}

interface MemoryMeasurement {
	jsHeap: number;
	jsHeapTotal: number;
	jsHeapLimit: number;
}

const PerformanceMetrics = () => {
	const [metrics, setMetrics] = useState({
		componentLoad: 0,
		firstPaint: 0,
		firstContentfulPaint: 0,
		memory: {
			jsHeap: 0,
			jsHeapTotal: 0,
			jsHeapLimit: 0,
		},
		fps: 0,
	});

	const startTime = useRef(Date.now());
	const hasRecordedLoad = useRef(false);
	const frameCallbackRef = useRef<number | null>(null);
	const frameTimestamps = useRef<number[]>([]);

	useEffect(() => {
		// Calculate initial load time once
		if (!hasRecordedLoad.current) {
			const loadTime = Date.now() - startTime.current;
			setMetrics((prev) => ({
				...prev,
				componentLoad: loadTime,
			}));
			hasRecordedLoad.current = true;
		}

		const frameCallback = (timestamp: number) => {
			frameTimestamps.current.push(timestamp);
			const relevantTimeframe = timestamp - 1000;
			frameTimestamps.current = frameTimestamps.current.filter((t) => t > relevantTimeframe);

			setMetrics((prev) => ({
				...prev,
				fps: frameTimestamps.current.length,
			}));

			frameCallbackRef.current = requestAnimationFrame(frameCallback);
		};

		frameCallbackRef.current = requestAnimationFrame(frameCallback);

		// Update only non-load metrics
		const updateMetrics = () => {
			const paint = performance.getEntriesByType('paint');
			const memory = (performance as any).memory;

			setMetrics((prev) => ({
				...prev,
				firstPaint: paint.find((entry) => entry.name === 'first-paint')?.startTime || 0,
				firstContentfulPaint:
					paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
				memory: memory
					? {
							jsHeap: Math.round(memory.usedJSHeapSize / 1048576),
							jsHeapTotal: Math.round(memory.totalJSHeapSize / 1048576),
							jsHeapLimit: Math.round(memory.jsHeapSizeLimit / 1048576),
					  }
					: { jsHeap: 0, jsHeapTotal: 0, jsHeapLimit: 0 },
			}));
		};

		updateMetrics();
		const interval = setInterval(updateMetrics, 1000);

		return () => {
			clearInterval(interval);
			if (frameCallbackRef.current) {
				cancelAnimationFrame(frameCallbackRef.current);
			}
		};
	}, []);

	return (
		<div className={styles.metrics}>
			<div className={styles.grid}>
				<div>Load Time:</div>
				<div>{metrics.componentLoad}ms</div>

				<div>First Paint:</div>
				<div>{Math.round(metrics.firstPaint)}ms</div>

				<div>First Content:</div>
				<div>{Math.round(metrics.firstContentfulPaint)}ms</div>

				<div>JS Memory:</div>
				<div>{metrics.memory.jsHeap}MB</div>

				<div>Total Memory:</div>
				<div>{metrics.memory.jsHeapTotal}MB</div>

				<div>Memory Limit:</div>
				<div>{metrics.memory.jsHeapLimit}MB</div>

				<div>FPS:</div>
				<div>{metrics.fps}</div>
			</div>
		</div>
	);
};

export default PerformanceMetrics;
