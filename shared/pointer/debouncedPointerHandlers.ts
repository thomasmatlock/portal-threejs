// shared/debouncedPointerHandlers.ts
/*
Goals:
- Provide throttled/debounced versions of high-frequency pointer events
- Maintain the same API as regular pointer handlers
- Reduce performance impact while keeping functionality
*/

import chalk from 'chalk';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import pointerEventHandlers from './pointerEventHandlers';

const { log } = console;

// Simple throttle implementation
function throttle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let lastCall = 0;
	let timeout: NodeJS.Timeout | null = null;

	return (...args: Parameters<T>) => {
		const now = Date.now();

		if (now - lastCall >= delay) {
			lastCall = now;
			func(...args);
		}
	};
}

// Create throttled versions of high-frequency handlers
const debouncedPointerHandlers = {
	...pointerEventHandlers,

	// Throttle pointer over to 100ms (10 times per second max)
	handlePointerOver: throttle((e: ThreeEvent<PointerEvent>) => {
		log(chalk.blue(`Distance: ${e.distance.toFixed(1)}`));
	}, 100),

	// Throttle pointer move to 50ms (20 times per second max)
	handlePointerMove: throttle((e: ThreeEvent<PointerEvent>) => {
		log(chalk.blue(`Pointer move: ${e.point.toArray().join(', ')}`));
	}, 50),

	// Keep update but throttle to 250ms (4 times per second max)
	handleUpdate: throttle((self: THREE.Object3D) => {
		log(chalk.magenta(`${self.userData.name} updated`));
	}, 250),
};

export default debouncedPointerHandlers;

// Enhanced one-liner with performance optimizations
export const useHighPerformancePointerEvents = (name: string) => {
	return {
		onClick: pointerEventHandlers.handleClick,
		onContextMenu: pointerEventHandlers.handleContextMenu,
		onPointerEnter: pointerEventHandlers.handlePointerEnter,
		onPointerLeave: pointerEventHandlers.handlePointerLeave,
		onPointerDown: pointerEventHandlers.handlePointerDown,
		onPointerUp: pointerEventHandlers.handlePointerUp,
		// Use throttled version for over events if needed
		onPointerOver: debouncedPointerHandlers.handlePointerOver,
		userData: { name },
	};
};
