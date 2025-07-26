// shared/usePointerEvents.ts
/*
Goals:
- Provide a React hook for dynamic pointer event handling
- Support conditional handlers and custom behavior
- Allow overriding specific handlers while using defaults for others
- Disable pointer events during drag/orbit to prevent lag
- FIXED: Ensure events actually fire and log
*/

import { useMemo, useEffect, useState, useRef } from 'react';
import pointerEventHandlers from './pointerEventHandlers';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

type EventHandler<T = any> = (e: ThreeEvent<T>) => void;

interface UsePointerEventsOptions {
	enabled?: boolean;
	overrides?: Partial<typeof pointerEventHandlers>;
	onlyEvents?: (keyof typeof pointerEventHandlers)[];
	disableDuringOrbit?: boolean;
	name?: string; // Add name for debugging
}

export const usePointerEvents = (options: UsePointerEventsOptions = {}) => {
	const {
		enabled = true,
		overrides = {},
		onlyEvents,
		disableDuringOrbit = true,
		name = 'unnamed-mesh',
	} = options;

	const [isDragging, setIsDragging] = useState(false);
	const mouseDownRef = useRef(false);
	const dragStartPosRef = useRef({ x: 0, y: 0 });

	// Debug logging
	useEffect(() => {
		// console.log(`[usePointerEvents] Initialized for ${name}, enabled: ${enabled}`);
	}, [name, enabled]);

	useEffect(() => {
		if (!disableDuringOrbit) return;

		const handleMouseDown = (e: MouseEvent) => {
			mouseDownRef.current = true;
			dragStartPosRef.current = { x: e.clientX, y: e.clientY };
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!mouseDownRef.current) return;

			// Check if mouse moved more than 5 pixels (drag threshold)
			const dx = Math.abs(e.clientX - dragStartPosRef.current.x);
			const dy = Math.abs(e.clientY - dragStartPosRef.current.y);

			if ((dx > 5 || dy > 5) && !isDragging) {
				setIsDragging(true);
			}
		};

		const handleMouseUp = () => {
			mouseDownRef.current = false;
			if (isDragging) {
				// Small delay to prevent click events right after drag
				setTimeout(() => setIsDragging(false), 50);
			}
		};

		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, disableDuringOrbit]);

	return useMemo(() => {
		// Disable all events if not enabled or if dragging
		if (!enabled || (disableDuringOrbit && isDragging)) {
			console.log(`[usePointerEvents] Events disabled for ${name} (dragging: ${isDragging})`);
			return {};
		}

		const handlers = { ...pointerEventHandlers, ...overrides };

		// Filter to only requested events if specified
		const handlersToUse = onlyEvents
			? Object.fromEntries(
					Object.entries(handlers).filter(([key]) =>
						onlyEvents.includes(key as keyof typeof pointerEventHandlers)
					)
			  )
			: handlers;

		// Create the final event props object
		const eventProps = Object.fromEntries(
			Object.entries(handlersToUse).map(([key, handler]) => {
				const eventName = key.replace('handle', '');
				const propName = `on${eventName}`;

				// Wrap the handler to ensure it gets called with proper context
				const wrappedHandler = (e: any) => {
					// Store the custom name in userData if provided
					if (e.object && name) {
						e.object.userData.customName = name;
					}

					// Call the original handler
					handler(e);
				};

				return [propName, wrappedHandler];
			})
		);

		// console.log(
		// 	`[usePointerEvents] Returning ${Object.keys(eventProps).length} events for ${name}`
		// );

		// Also return a userData prop to ensure the name is set
		return {
			...eventProps,
		};
	}, [enabled, overrides, onlyEvents, isDragging, disableDuringOrbit, name]);
};

// One-liner helper that includes common optimizations
export const useOptimizedPointerEvents = (name: string, enabled = true) => {
	return usePointerEvents({
		name,
		enabled,
		onlyEvents: [
			'handleClick',
			'handleContextMenu',
			'handlePointerEnter', // Use enter/leave instead of over/out
			'handlePointerLeave', // These fire less frequently
			'handlePointerDown',
			'handlePointerUp',
		], // Skip high-frequency events like move, over, out, and update
		disableDuringOrbit: true,
	});
};
