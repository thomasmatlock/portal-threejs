// @ts-nocheck

import { useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { CycleRaycast, Detailed } from '@react-three/drei';
import { useRef, useContext } from 'react';
import * as THREE from 'three';
import InputContext from '../context/inputContext';
import { useThree } from '@react-three/fiber';
export default function Raycaster() {
	const { activeObject } = useContext(InputContext);

	const { scene, camera, mouse, raycaster, controls } = useThree();
	// Modified: We'll collect all meshes instead of just scene children
	const objects = useRef([]);
	const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
	const startPosition = useRef(new THREE.Vector3(0, 0, 0));
	const isTargeting = useRef(false);
	const startTime = useRef(0);
	const animationDuration = 0.8; // Shortened from 1s to 0.8s for quicker transitions
	const isDragging = useRef(false);
	const mouseDownPos = useRef({ x: 0, y: 0 });
	// Default positions from Main.tsx
	const defaultTarget = useRef(new THREE.Vector3(0, 1.5, 0));
	const defaultCameraPosition = useRef(new THREE.Vector3(-15, 12, 15));
	const startCameraPosition = useRef(new THREE.Vector3(0, 0, 0));
	const isCameraResetting = useRef(false);
	const lastClickTime = useRef(0);
	const doubleClickThreshold = 300; // Time in ms to detect a double click
	const enableDebugLogs = false; // TOGGLE DEBUG LOGGING
	const eventsBound = useRef(false);

	// Helper function for formatted vector logging
	const formatVector = (vector) => {
		return `[${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)}]`;
	};

	// Debug logging function
	const debugLog = (message) => {
		if (enableDebugLogs) {
			console.log(`[Raycaster] ${message}`);
		}
	};

	// Pure ease-in-out function - smooth start AND end
	const easeInOut = (t) => {
		// Enhanced cubic ease-in-out for smoother camera movement
		// This provides a more natural feel with a gentler start and end
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	};

	// New function to collect all meshes from the scene
	const collectMeshes = (object, meshes = []) => {
		if (object.isMesh) {
			meshes.push(object);
		}

		if (object.children && object.children.length > 0) {
			object.children.forEach((child) => collectMeshes(child, meshes));
		}

		return meshes;
	};

	// Update objects ref with all meshes in the scene
	useEffect(() => {
		if (scene) {
			const allMeshes = collectMeshes(scene);
			objects.current = allMeshes;
			debugLog(`Collected ${allMeshes.length} meshes for raycasting`);
		}
	}, [scene]);

	// Periodically update the mesh collection (every 2 seconds)
	// This ensures we catch any dynamically added objects
	useEffect(() => {
		const updateInterval = setInterval(() => {
			if (scene) {
				const allMeshes = collectMeshes(scene);
				if (allMeshes.length !== objects.current.length) {
					objects.current = allMeshes;
					debugLog(`Updated mesh collection: now ${allMeshes.length} meshes`);
				}
			}
		}, 2000);

		return () => clearInterval(updateInterval);
	}, [scene]);

	const getIntersects = (event) => {
		// Make sure we have valid event coordinates
		if (!event || typeof event.clientX !== 'number' || typeof event.clientY !== 'number') {
			debugLog('Invalid event coordinates');
			return [];
		}

		// Calculate normalized device coordinates
		// Use document.body as fallback for getBoundingClientRect
		const canvas = document.querySelector('canvas');
		const rect = event.currentTarget?.getBoundingClientRect?.() ||
			canvas?.getBoundingClientRect?.() || {
				left: 0,
				top: 0,
				width: window.innerWidth,
				height: window.innerHeight,
			};

		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		debugLog(`Normalized coordinates: [${x.toFixed(2)}, ${y.toFixed(2)}]`);

		// Update mouse position
		mouse.x = x;
		mouse.y = y;

		// Set raycaster and return intersections
		raycaster.setFromCamera(mouse, camera);

		// Use the collected meshes instead of scene.children
		const intersects = raycaster.intersectObjects(objects.current, true); // Set recursive to true

		// Debug the number of intersections found
		if (intersects.length === 0) {
			debugLog(
				`No intersections found. Raycasting against ${objects.current.length} objects.`
			);
		} else {
			debugLog(`Found ${intersects.length} intersections`);
		}

		return intersects;
	};

	const mouseMove = (e) => {
		const intersects = getIntersects(e);
		if (intersects.length > 0) {
			activeObject.current = intersects[0];
			// Debug hover point (uncomment if needed - can be noisy)
			// debugLog(`Hover point: ${formatVector(intersects[0].point)}`);
		}

		// If mouse is down and moving, we're dragging
		if (e.buttons > 0) {
			// Check if we've moved enough to consider it a drag
			const dx = Math.abs(e.clientX - mouseDownPos.current.x);
			const dy = Math.abs(e.clientY - mouseDownPos.current.y);
			if (dx > 3 || dy > 3) {
				// Small threshold to detect intentional drag vs. slight movement
				if (!isDragging.current) {
					debugLog(`Drag detected (moved ${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`);
					isDragging.current = true;

					// If we're in the middle of a camera reset, cancel it when dragging starts
					if (isCameraResetting.current) {
						debugLog('Interrupting camera reset animation with drag');
						isCameraResetting.current = false;

						// We'll keep isTargeting.current true so the animation continues
						// but without the camera position reset, just the target movement
					}
				}
			}
		}
	};

	const mouseDown = (e) => {
		// Store the initial mouse position
		mouseDownPos.current = { x: e.clientX, y: e.clientY };
		isDragging.current = false;
		debugLog(`Mouse down at screen position [${e.clientX}, ${e.clientY}]`);
	};

	const mouseClick = (e) => {
		// If we were dragging, don't treat this as a click
		if (isDragging.current) {
			debugLog('Ignoring click after drag');
			isDragging.current = false;
			return;
		}

		// Check for double click
		const currentTime = performance.now();
		const timeSinceLastClick = currentTime - lastClickTime.current;
		debugLog(`Time since last click: ${timeSinceLastClick.toFixed(0)}ms`);
		lastClickTime.current = currentTime;

		if (timeSinceLastClick < doubleClickThreshold) {
			// Double click detected - reset to default target
			debugLog('Double-click detected');
			handleDoubleClick();
			return;
		}

		// Handle single click
		debugLog('Single click detected');
		const intersects = getIntersects(e);

		// Debug all intersections to see what we're hitting
		if (intersects.length > 0) {
			debugLog(`Found ${intersects.length} intersections on click:`);
			intersects.forEach((hit, index) => {
				const objName = hit.object.name || 'unnamed';
				debugLog(`  ${index + 1}. ${objName} (distance: ${hit.distance.toFixed(2)})`);
			});

			// Get the controls to use - either from useThree or from window._debug
			const controlsToUse = controls || window._debug?.orbitControls;

			// Always use the first intersection if we have any
			if (controlsToUse) {
				const hitPoint = intersects[0].point;
				const hitObject = intersects[0].object;
				debugLog(`Click hit point: ${formatVector(hitPoint)}`);
				debugLog(
					`Click hit object: ${
						hitObject.name || 'unnamed'
					} (uuid: ${hitObject.uuid.substring(0, 8)}...)`
				);

				// Store the starting position
				startPosition.current.copy(controlsToUse.target);
				debugLog(`Starting target position: ${formatVector(startPosition.current)}`);

				// Set the target position to the clicked point
				targetPosition.current.copy(hitPoint);
				debugLog(`New target position: ${formatVector(targetPosition.current)}`);

				// If we were resetting the camera, stop that reset
				if (isCameraResetting.current) {
					debugLog('Interrupting camera reset animation with new target');
					isCameraResetting.current = false;

					// IMPORTANT: Also store the current camera position as the new starting position
					// This prevents the camera from continuing to move toward the default position
					startCameraPosition.current.copy(camera.position);

					// Clear any reset requested flag to ensure we don't restart the reset
					// @ts-ignore
					if (window._debug) window._debug.resetRequested = false;
				}

				// Start the animation
				startTime.current = currentTime / 1000;
				isTargeting.current = true;
				debugLog('Starting camera target animation');

				// Force an update to ensure the animation starts immediately
				controlsToUse.update();

				// Debug the controls state
				debugLog(`Controls enabled: ${controlsToUse.enabled}`);
				debugLog(`Controls target after update: ${formatVector(controlsToUse.target)}`);

				// Try to directly set the target for immediate feedback
				try {
					// This is a more direct approach that might work better in some cases
					const directTarget = new THREE.Vector3().copy(hitPoint);
					debugLog(`Setting direct target: ${formatVector(directTarget)}`);
					controlsToUse.target.copy(directTarget);
					controlsToUse.update();
				} catch (err) {
					debugLog(`Error setting direct target: ${err.message}`);
				}
			} else {
				debugLog('Controls not available for camera targeting');
			}
		} else {
			debugLog('Click did not hit any objects');
		}
	};

	const handleDoubleClick = () => {
		debugLog('Handling double-click reset');

		// Try to use the debug reset method first
		// @ts-ignore
		if (window._debug?.resetCamera) {
			debugLog('Using debug reset method');
			// @ts-ignore
			window._debug.resetCamera();
			// @ts-ignore
			window._debug.resetRequested = true; // Make sure this is set even if the method fails
		}

		// Try both the regular controls and the debug controls
		const controlsToUse = controls || window._debug?.orbitControls;

		if (controlsToUse) {
			// Store the starting positions
			startPosition.current.copy(controlsToUse.target);
			startCameraPosition.current.copy(camera.position);

			debugLog(
				`Reset from target: ${formatVector(controlsToUse.target)} to ${formatVector(
					defaultTarget.current
				)}`
			);
			debugLog(
				`Reset from camera: ${formatVector(camera.position)} to ${formatVector(
					defaultCameraPosition.current
				)}`
			);

			// Force the target to be exactly [0, 1.5, 0] as specified in Main.tsx
			targetPosition.current.set(0, 1.5, 0);

			// Start the animation
			startTime.current = performance.now() / 1000;
			isTargeting.current = true;
			isCameraResetting.current = true;

			// Don't try to immediately set the target - this causes the jumpiness
			// Instead, let the animation handle it smoothly
			debugLog('Starting camera and target reset animation');
		} else {
			debugLog('No controls available for double-click reset');
		}
	};

	// Use useFrame to update the camera target with smooth easing
	useFrame(() => {
		// Get the controls to use - either from useThree or from window._debug
		const controlsToUse = controls || window._debug?.orbitControls;

		// If no controls are available, we can't do anything
		if (!controlsToUse) {
			if (!window.noControlsWarningShown) {
				debugLog('No controls found in useFrame');
				window.noControlsWarningShown = true;
			}
			return;
		}

		// Check if a reset was requested via the debug method
		// @ts-ignore
		if (window._debug?.resetRequested && !isTargeting.current) {
			// @ts-ignore
			window._debug.resetRequested = false; // Clear the flag

			// Store the starting positions
			startPosition.current.copy(controlsToUse.target);
			startCameraPosition.current.copy(camera.position);

			// Set the target position
			targetPosition.current.copy(defaultTarget.current);

			// Start the animation
			startTime.current = performance.now() / 1000;
			isTargeting.current = true;
			isCameraResetting.current = true;

			debugLog('Starting camera reset animation from useFrame');
		}

		// Debug controls type once
		if (!window.controlsDebugDone) {
			debugLog(`Controls type: ${controlsToUse.constructor.name}`);
			debugLog(`Controls target: ${formatVector(controlsToUse.target)}`);
			debugLog(`Controls enabled: ${controlsToUse.enabled}`);

			// Check if target is a Vector3 or an array
			if (Array.isArray(controlsToUse.target)) {
				debugLog('Controls target is an array, converting to Vector3');
				controlsToUse.target = new THREE.Vector3().fromArray(controlsToUse.target);
			}

			// Check if the controls have the necessary methods
			if (typeof controlsToUse.update !== 'function') {
				debugLog('WARNING: controls.update is not a function!');
			}

			window.controlsDebugDone = true;
		}

		if (isTargeting.current) {
			const currentTime = performance.now() / 1000;
			const elapsedTime = currentTime - startTime.current;

			// Calculate progress with smooth easing
			const rawProgress = Math.min(elapsedTime / animationDuration, 1.0);
			const progress = easeInOut(rawProgress);

			// Create a temporary vector for smooth interpolation
			const newTarget = new THREE.Vector3();
			newTarget.lerpVectors(startPosition.current, targetPosition.current, progress);

			// Apply the new target position directly
			controlsToUse.target.copy(newTarget);

			// Log animation progress occasionally
			if (Math.round(rawProgress * 100) % 25 === 0) {
				debugLog(`Animation progress: ${(rawProgress * 100).toFixed(0)}%`);
				debugLog(`Current target: ${formatVector(controlsToUse.target)}`);
			}

			// If we're resetting the camera position too (double-click)
			if (isCameraResetting.current) {
				// Create a temporary vector for camera position interpolation
				const newCameraPos = new THREE.Vector3();
				newCameraPos.lerpVectors(
					startCameraPosition.current,
					defaultCameraPosition.current,
					progress
				);

				// Apply the new camera position
				camera.position.copy(newCameraPos);

				// Log progress occasionally (not every frame to avoid console spam)
				if (Math.round(rawProgress * 100) % 25 === 0) {
					debugLog(`Reset progress: ${(rawProgress * 100).toFixed(0)}%`);
					debugLog(`Camera position: ${formatVector(camera.position)}`);
				}
			} else if (isTargeting.current) {
				// If we're targeting but not resetting camera position,
				// make sure we log that we're only animating the target
				if (Math.round(rawProgress * 100) % 25 === 0) {
					debugLog(`Target-only animation: ${(rawProgress * 100).toFixed(0)}%`);
				}
			}

			// Force controls update
			controlsToUse.update();

			// Check if animation is complete
			if (rawProgress >= 1.0) {
				isTargeting.current = false;

				if (isCameraResetting.current) {
					debugLog('Camera reset complete');
					isCameraResetting.current = false;

					// Ensure final positions are exact
					camera.position.copy(defaultCameraPosition.current);
					controlsToUse.target.copy(defaultTarget.current);

					debugLog(`Final camera position: ${formatVector(camera.position)}`);
					debugLog(`Final target position: ${formatVector(controlsToUse.target)}`);
				} else {
					debugLog('Target animation complete');
					// Only set the target position, not the camera position
					controlsToUse.target.copy(targetPosition.current);
					debugLog(`Final target position: ${formatVector(controlsToUse.target)}`);
				}

				// Force a final update
				controlsToUse.update();
			}
		}
	});

	// Function to safely bind events
	const bindEvents = () => {
		if (typeof window !== 'undefined' && !eventsBound.current) {
			debugLog('Binding mouse events');

			// Find the canvas element
			const canvas = document.querySelector('canvas');

			// Define event handlers
			const handleMouseMove = (e) => {
				// Prevent default to avoid any browser handling
				e.preventDefault?.();
				mouseMove(e);
			};

			const handleMouseDown = (e) => {
				// Prevent default to avoid any browser handling
				e.preventDefault?.();
				mouseDown(e);
			};

			const handleMouseUp = (e) => {
				// Prevent default to avoid any browser handling
				e.preventDefault?.();

				// Use the same event object for both mouseUp and click handling
				mouseClick(e);
			};

			const handleTouchMove = (e) => {
				e.preventDefault?.();
				if (e.touches && e.touches[0]) {
					const touchEvent = {
						clientX: e.touches[0].clientX,
						clientY: e.touches[0].clientY,
						buttons: e.touches.length,
						currentTarget: canvas || e.currentTarget || document.body,
						preventDefault: () => {},
					};
					mouseMove(touchEvent);
				}
			};

			const handleTouchStart = (e) => {
				e.preventDefault?.();
				if (e.touches && e.touches[0]) {
					const touchEvent = {
						clientX: e.touches[0].clientX,
						clientY: e.touches[0].clientY,
						currentTarget: canvas || e.currentTarget || document.body,
						preventDefault: () => {},
					};
					mouseDown(touchEvent);
				}
			};

			const handleTouchEnd = (e) => {
				e.preventDefault?.();
				// Use the last known position for the click
				const touchEvent = {
					clientX: mouseDownPos.current.x,
					clientY: mouseDownPos.current.y,
					currentTarget: canvas || e.currentTarget || document.body,
					preventDefault: () => {},
				};
				mouseClick(touchEvent);
			};

			// Store handlers for cleanup
			window.raycasterHandlers = {
				handleMouseMove,
				handleMouseDown,
				handleMouseUp,
				handleTouchMove,
				handleTouchStart,
				handleTouchEnd,
			};

			if (canvas) {
				debugLog('Found canvas element for event binding');

				// Bind events to the canvas instead of window for more accurate coordinates
				canvas.addEventListener('mousemove', handleMouseMove);
				canvas.addEventListener('mousedown', handleMouseDown);
				canvas.addEventListener('mouseup', handleMouseUp);

				// Also bind touch events for mobile
				canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
				canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
				canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
			} else {
				// Fallback to window if canvas not found
				debugLog('Canvas not found, binding to window instead');

				window.addEventListener('mousemove', handleMouseMove, { passive: true });
				window.addEventListener('mousedown', handleMouseDown, { passive: true });
				window.addEventListener('mouseup', handleMouseUp, { passive: true });

				// Also bind touch events for mobile
				window.addEventListener('touchmove', handleTouchMove, { passive: true });
				window.addEventListener('touchstart', handleTouchStart, { passive: true });
				window.addEventListener('touchend', handleTouchEnd, { passive: true });
			}

			eventsBound.current = true;
		}
	};

	// Function to safely unbind events
	const unbindEvents = () => {
		if (typeof window !== 'undefined' && eventsBound.current) {
			debugLog('Unbinding mouse events');

			// Get the stored handlers
			const {
				handleMouseMove,
				handleMouseDown,
				handleMouseUp,
				handleTouchMove,
				handleTouchStart,
				handleTouchEnd,
			} = window.raycasterHandlers || {};

			if (!handleMouseMove) {
				debugLog('No handlers found for cleanup');
				return;
			}

			const canvas = document.querySelector('canvas');
			if (canvas) {
				// Need to use the same handler references to properly remove
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mousedown', handleMouseDown);
				canvas.removeEventListener('mouseup', handleMouseUp);

				// Also remove touch events
				canvas.removeEventListener('touchmove', handleTouchMove);
				canvas.removeEventListener('touchstart', handleTouchStart);
				canvas.removeEventListener('touchend', handleTouchEnd);
			} else {
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mousedown', handleMouseDown);
				window.removeEventListener('mouseup', handleMouseUp);

				// Also remove touch events
				window.removeEventListener('touchmove', handleTouchMove);
				window.removeEventListener('touchstart', handleTouchStart);
				window.removeEventListener('touchend', handleTouchEnd);
			}

			// Clean up the stored handlers
			delete window.raycasterHandlers;

			eventsBound.current = false;
		}
	};

	useEffect(() => {
		// Make sure we're in the browser environment
		if (typeof window === 'undefined') return;

		debugLog('Raycaster initialized');
		debugLog(`Default target: ${formatVector(defaultTarget.current)}`);
		debugLog(`Default camera position: ${formatVector(defaultCameraPosition.current)}`);

		// Bind events immediately instead of with a timeout
		bindEvents();

		// Cleanup function
		return () => {
			unbindEvents();
			debugLog('Raycaster cleanup');
		};
	}, []);

	return null;
}
