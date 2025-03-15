/*
 * File goals: 3D animated model component for Wheatley character from Portal
 * - Properly load and render animated Wheatley 3D model
 * - Support random blinking animation (single or double blinks)
 * - Support scrolling-controlled animation
 * - Support level-of-detail rendering
 * - Maintain consistent structure with other model components
 */

import * as THREE from 'three';
import React, { useRef, useEffect, useCallback } from 'react';
import { useGLTF, useAnimations, useScroll, Detailed } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame, useThree } from '@react-three/fiber';
import { easing, geometry } from 'maath';
import UserContextProvider from '@/context/userContext';
import InputContextProvider from '@/context/inputContext';
import { useContext, useState } from 'react';
import pointerEventHandlers from './shared/pointerEventHandlers';
import config from '@/cloudflare.config';

type ActionName = 'personality_sphereAction.001';
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

type GLTFResult = GLTF & {
	nodes: {
		personality_sphere_model: THREE.SkinnedMesh;
		personality_sphere_model_1: THREE.SkinnedMesh;
		Root: THREE.Bone;
	};
	materials: {
		personality_sphere: THREE.MeshStandardMaterial;
		personality_sphere_light: THREE.MeshStandardMaterial;
	};
	animations: THREE.AnimationClip[];
};

// Extend InputContext with the properties we need
interface ExtendedInputContext {
	interacted: boolean;
	setInteracted: (interacted: boolean) => void;
	timestamp?: number;
	scrollSpeed?: number;
	scrollDirection?: string;
	scrolling?: { current: boolean };
	activeObject?: string;
	clipDuration?: number;
	setClipDuration?: (duration: number) => void;
}

export function Model(
	props: { scrollable?: boolean; distances?: number[] } & JSX.IntrinsicElements['group']
) {
	const group = useRef<THREE.Group>(null);
	const { frameloop, dev, mobile } = useContext(UserContextProvider);

	// Create local state for animation control if not provided by context
	const [localClipDuration, setLocalClipDuration] = useState(1);
	const [isBlinking, setIsBlinking] = useState(false);
	const [lastBlinkTime, setLastBlinkTime] = useState(0);
	const [doubleBlink, setDoubleBlink] = useState(false);
	const [secondBlinkScheduled, setSecondBlinkScheduled] = useState(false);
	const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Get context values, with fallbacks for missing properties
	const inputContext = useContext(InputContextProvider) as ExtendedInputContext;
	const { interacted, setInteracted } = inputContext;
	const scrolling = inputContext.scrolling || { current: false };
	const clipDuration = inputContext.clipDuration || localClipDuration;
	const setClipDuration = inputContext.setClipDuration || setLocalClipDuration;

	const { scrollable } = props.scrollable ? props : { scrollable: false };
	const scroll = useScroll();
	const { clock, controls, camera, scene } = useThree();
	const { nodes, materials, animations } = useGLTF(
		`${config.assetsURL}/models/meshes/WheatleyAnimated/WheatleyAnimated.gltf`
	) as GLTFResult;

	const { actions } = useAnimations(animations, group);

	// Cleanup function for timeouts
	useEffect(() => {
		return () => {
			if (blinkTimeoutRef.current) {
				clearTimeout(blinkTimeoutRef.current);
			}
		};
	}, []);

	useFrame((state) => {
		const elapsedTime = state.clock.getElapsedTime();

		// Only proceed if actions are loaded
		if (actions && actions['personality_sphereAction.001']) {
			// Update clip duration if needed
			if (actions['personality_sphereAction.001'].getClip().duration > clipDuration) {
				setClipDuration(actions['personality_sphereAction.001'].getClip().duration);
			}

			// Handle scrollable animation
			if (scrollable) {
				actions['personality_sphereAction.001'].time = scroll.offset * clipDuration;
				if (scrolling.current) {
					actions['personality_sphereAction.001'].play();
				} else {
					const action = actions['personality_sphereAction.001'].play();
					if (action) action.paused = true;
				}
			}

			// Handle random blinking for non-scrollable mode
			if (!scrollable) {
				// Check if we should start a new blink
				if (!isBlinking && elapsedTime - lastBlinkTime > 2) {
					// Check at least every 2 seconds
					// 1/10 chance to blink
					if (Math.random() < 0.5) {
						// Decide if we'll do a double blink (40% chance)
						const shouldDoubleBlink = Math.random() < 0.4;
						setDoubleBlink(shouldDoubleBlink);
						setSecondBlinkScheduled(false);
						setIsBlinking(true);
						setLastBlinkTime(elapsedTime);

						// Play the blink animation once
						actions['personality_sphereAction.001'].reset();
						actions['personality_sphereAction.001'].setLoop(THREE.LoopOnce, 1);
						actions['personality_sphereAction.001'].clampWhenFinished = true;
						actions['personality_sphereAction.001'].play();

						// Set a timeout to either end blinking or trigger second blink
						if (blinkTimeoutRef.current) {
							clearTimeout(blinkTimeoutRef.current);
						}

						blinkTimeoutRef.current = setTimeout(() => {
							if (shouldDoubleBlink && !secondBlinkScheduled) {
								// Schedule second blink
								setSecondBlinkScheduled(true);

								// Play the blink animation again
								actions['personality_sphereAction.001'].reset();
								actions['personality_sphereAction.001'].play();

								// Set timeout to end blinking after second blink
								if (blinkTimeoutRef.current) {
									clearTimeout(blinkTimeoutRef.current);
								}

								blinkTimeoutRef.current = setTimeout(() => {
									setIsBlinking(false);
									setDoubleBlink(false);
									// Reset animation to beginning frame
									actions['personality_sphereAction.001'].reset();
									actions['personality_sphereAction.001'].paused = true;
								}, clipDuration * 1000);
							} else {
								// End blinking after single blink
								setIsBlinking(false);
								setDoubleBlink(false);
								// Reset animation to beginning frame
								actions['personality_sphereAction.001'].reset();
								actions['personality_sphereAction.001'].paused = true;
							}
						}, clipDuration * 1000);
					}
				} else if (!isBlinking) {
					// Make sure animation is paused and at frame 0 when not blinking
					actions['personality_sphereAction.001'].paused = true;
					actions['personality_sphereAction.001'].time = 0;
				}
			}
		}
	});

	return (
		<group ref={group} {...props} dispose={null}>
			<Detailed distances={props.distances || [0, 4, 8, 12]}>
				{/* High detail model */}
				<group name="personality_sphereqc">
					<group
						name="personality_sphere"
						position={[0, 27.002, 0]}
						userData={{ name: 'personality_sphere' }}
					>
						<primitive object={nodes.Root} />
						<group
							name="Personality_Sphere_model"
							userData={{ name: 'Personality_Sphere_model' }}
						>
							<skinnedMesh
								name="personality_sphere_model"
								castShadow
								receiveShadow
								geometry={nodes.personality_sphere_model.geometry}
								material={materials.personality_sphere}
								skeleton={nodes.personality_sphere_model.skeleton}
								onClick={pointerEventHandlers.handleClick}
								onContextMenu={pointerEventHandlers.handleContextMenu}
								onDoubleClick={pointerEventHandlers.handleDoubleClick}
								onWheel={pointerEventHandlers.handleWheel}
								onPointerUp={pointerEventHandlers.handlePointerUp}
								onPointerDown={pointerEventHandlers.handlePointerDown}
								onPointerOver={pointerEventHandlers.handlePointerOver}
								onPointerOut={pointerEventHandlers.handlePointerOut}
								onPointerEnter={pointerEventHandlers.handlePointerEnter}
								onPointerLeave={pointerEventHandlers.handlePointerLeave}
								onPointerMove={pointerEventHandlers.handlePointerMove}
								onPointerMissed={pointerEventHandlers.handlePointerMissed}
								onUpdate={pointerEventHandlers.handleUpdate}
							/>
							<skinnedMesh
								name="personality_sphere_model_1"
								castShadow
								receiveShadow
								geometry={nodes.personality_sphere_model_1.geometry}
								material={materials.personality_sphere_light}
								skeleton={nodes.personality_sphere_model_1.skeleton}
								onClick={pointerEventHandlers.handleClick}
								onContextMenu={pointerEventHandlers.handleContextMenu}
								onDoubleClick={pointerEventHandlers.handleDoubleClick}
								onWheel={pointerEventHandlers.handleWheel}
								onPointerUp={pointerEventHandlers.handlePointerUp}
								onPointerDown={pointerEventHandlers.handlePointerDown}
								onPointerOver={pointerEventHandlers.handlePointerOver}
								onPointerOut={pointerEventHandlers.handlePointerOut}
								onPointerEnter={pointerEventHandlers.handlePointerEnter}
								onPointerLeave={pointerEventHandlers.handlePointerLeave}
								onPointerMove={pointerEventHandlers.handlePointerMove}
								onPointerMissed={pointerEventHandlers.handlePointerMissed}
								onUpdate={pointerEventHandlers.handleUpdate}
							/>
						</group>
					</group>
				</group>

				{/* Medium detail model */}
				<group name="personality_sphereqc_medium">
					<group
						name="personality_sphere"
						position={[0, 27.002, 0]}
						userData={{ name: 'personality_sphere' }}
					>
						<primitive object={nodes.Root} />
						<group
							name="Personality_Sphere_model"
							userData={{ name: 'Personality_Sphere_model' }}
						>
							<skinnedMesh
								name="personality_sphere_model"
								castShadow
								receiveShadow
								geometry={nodes.personality_sphere_model.geometry}
								material={materials.personality_sphere}
								skeleton={nodes.personality_sphere_model.skeleton}
							/>
							<skinnedMesh
								name="personality_sphere_model_1"
								castShadow
								receiveShadow
								geometry={nodes.personality_sphere_model_1.geometry}
								material={materials.personality_sphere_light}
								skeleton={nodes.personality_sphere_model_1.skeleton}
							/>
						</group>
					</group>
				</group>

				{/* Low detail model */}
				<group name="personality_sphereqc_low">
					<group
						name="personality_sphere"
						position={[0, 27.002, 0]}
						userData={{ name: 'personality_sphere' }}
					>
						<primitive object={nodes.Root} />
						<group
							name="Personality_Sphere_model"
							userData={{ name: 'Personality_Sphere_model' }}
						>
							<skinnedMesh
								name="personality_sphere_model"
								geometry={nodes.personality_sphere_model.geometry}
								material={materials.personality_sphere}
								skeleton={nodes.personality_sphere_model.skeleton}
							/>
							<skinnedMesh
								name="personality_sphere_model_1"
								geometry={nodes.personality_sphere_model_1.geometry}
								material={materials.personality_sphere_light}
								skeleton={nodes.personality_sphere_model_1.skeleton}
							/>
						</group>
					</group>
				</group>

				{/* Lowest detail model */}
				<group name="personality_sphereqc_lowest">
					<group
						name="personality_sphere"
						position={[0, 27.002, 0]}
						userData={{ name: 'personality_sphere' }}
					>
						<primitive object={nodes.Root} />
						<group
							name="Personality_Sphere_model"
							userData={{ name: 'Personality_Sphere_model' }}
						>
							<skinnedMesh
								name="personality_sphere_model"
								geometry={nodes.personality_sphere_model.geometry}
								material={materials.personality_sphere}
								skeleton={nodes.personality_sphere_model.skeleton}
							/>
						</group>
					</group>
				</group>
			</Detailed>
		</group>
	);
}

useGLTF.preload(`${config.assetsURL}/models/meshes/WheatleyAnimated/WheatleyAnimated.gltf`);
