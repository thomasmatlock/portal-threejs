/*
Goals:
- Provide a React hook for dynamic pointer event handling
- Support conditional handlers and custom behavior
- Allow overriding specific handlers while using defaults for others
- Disable pointer events during drag/orbit to prevent lag
*/

import { useMemo, useEffect, useState, useRef } from 'react';
import pointerEventHandlers from './pointerEventHandlers';
import { ThreeEvent } from '@react-three/fiber';

type EventHandler<T = any> = (e: ThreeEvent<T>) => void;

interface UsePointerEventsOptions {
	enabled?: boolean;
	overrides?: Partial<typeof pointerEventHandlers>;
	onlyEvents?: (keyof typeof pointerEventHandlers)[];
	disableDuringOrbit?: boolean;
}

export const usePointerEvents = (options: UsePointerEventsOptions = {}) => {
	const { enabled = true, overrides = {}, onlyEvents, disableDuringOrbit = true } = options;
	const [isDragging, setIsDragging] = useState(false);
	const mouseDownRef = useRef(false);
	const dragStartPosRef = useRef({ x: 0, y: 0 });

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
		if (!enabled || (disableDuringOrbit && isDragging)) return {};

		const handlers = { ...pointerEventHandlers, ...overrides };
		const handlersToUse = onlyEvents
			? Object.fromEntries(
					Object.entries(handlers).filter(([key]) =>
						onlyEvents.includes(key as keyof typeof pointerEventHandlers)
					)
			  )
			: handlers;

		return Object.fromEntries(
			Object.entries(handlersToUse).map(([key, handler]) => [
				`on${key.replace('handle', '')}`,
				handler,
			])
		);
	}, [enabled, overrides, onlyEvents, isDragging, disableDuringOrbit]);
};

// Usage examples:
// Basic usage: const pointerProps = usePointerEvents();
// Conditional: const pointerProps = usePointerEvents({ enabled: !isLoading });
// Override click: const pointerProps = usePointerEvents({ overrides: { handleClick: customClickHandler } });
// Only specific events: const pointerProps = usePointerEvents({ onlyEvents: ['handleClick', 'handlePointerOver'] });
// Keep events during orbit: const pointerProps = usePointerEvents({ disableDuringOrbit: false });
