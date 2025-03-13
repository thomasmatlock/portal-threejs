/*
 * File goals: 3D model component for Mixamo character in Portal Three.js
 * - Properly load and render Mixamo character model with animations
 * - Support animations with scrollable and non-scrollable modes
 * - Support level-of-detail rendering
 * - Maintain consistent structure with other model components
 */

import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useScroll, Detailed } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame, useThree } from '@react-three/fiber';
import UserContextProvider from '@/context/userContext';
import InputContextProvider from '@/context/inputContext';
import { useContext } from 'react';
import pointerEventHandlers from './shared/pointerEventHandlers';
import CharacterAnimationController from './animations/animationController';
import animationLibrary from './animations/animationLibrary';

type GLTFResult = GLTF & {
	nodes: {
		Ch45: THREE.SkinnedMesh;
		mixamorig1Hips: THREE.Bone;
	};
	materials: {
		Ch45_Body: THREE.MeshStandardMaterial;
	};
};

export function Model(
	props: {
		scrollable?: boolean;
		distances?: number[];
		defaultAnimation?: string;
		position?: [number, number, number];
		rotation?: [number, number, number];
		scale?: number | [number, number, number];
	} & JSX.IntrinsicElements['group']
) {
	const group = useRef<THREE.Group>(null);
	const [animController, setAnimController] = useState<CharacterAnimationController | null>(null);

	// Get context values
	const { frameloop, dev, mobile } = useContext(UserContextProvider);
	const { interacted } = useContext(InputContextProvider);

	// Default values
	const scrollable = props.scrollable || false;
	const defaultAnimation = props.defaultAnimation || 'test_animation';

	const scroll = useScroll();
	const { nodes, materials } = useGLTF(
		'/../../models/meshes/MixamoModel/MixamoModel.gltf'
	) as GLTFResult;

	// Initialize animation controller
	useEffect(() => {
		if (group.current && !animController) {
			console.log('Initializing Mixamo character animation controller');
			const controller = new CharacterAnimationController(group.current);
			setAnimController(controller);

			// Set scrollable mode
			controller.setScrollable(scrollable);

			// Preload and play default animation
			console.log(`Attempting to load animation: ${defaultAnimation}`);
			animationLibrary
				.preloadCommonAnimations()
				.then(() => {
					console.log(`Preloaded animations, now playing: ${defaultAnimation}`);
					controller
						.playAnimation(defaultAnimation)
						.then(() => {
							console.log(`Successfully started animation: ${defaultAnimation}`);
						})
						.catch((error) => {
							console.error(`Failed to play animation ${defaultAnimation}:`, error);
						});
				})
				.catch((error) => {
					console.error('Failed to preload animations:', error);
				});
		}

		return () => {
			// Clean up animations when component unmounts
			if (animController) {
				console.log('Cleaning up Mixamo character animations');
				animController.stopAll();
			}
		};
	}, [group, defaultAnimation, scrollable]);

	// Update animation on each frame
	useFrame((state, delta) => {
		if (animController) {
			// Update scroll state if in scrollable mode
			if (scrollable) {
				animController.updateScrollState(scroll.offset, false); // No scrolling state in current InputContext
			}

			// Update the animation mixer
			animController.update(delta);
		}
	});

	// Add error handling for model loading
	useEffect(() => {
		const handleError = (error: ErrorEvent) => {
			console.error('Error in MixamoModel component:', error);
		};

		window.addEventListener('error', handleError);
		return () => {
			window.removeEventListener('error', handleError);
		};
	}, []);

	return (
		<group ref={group} {...props} dispose={null}>
			<Detailed distances={props.distances || [0, 4, 8, 12]}>
				{/* High detail model */}
				<group name="Scene">
					<group
						name="Armature"
						rotation={[Math.PI / 2, 0, 0]}
						scale={0.01}
						userData={{ name: 'Armature' }}
					>
						<primitive object={nodes.mixamorig1Hips} />
						<skinnedMesh
							name="Ch45"
							geometry={nodes.Ch45.geometry}
							material={materials.Ch45_Body}
							skeleton={nodes.Ch45.skeleton}
							userData={{ name: 'Ch45' }}
							castShadow
							receiveShadow
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

				{/* Medium detail model (same as high for now) */}
				<group name="Scene_medium">
					<group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
						<primitive object={nodes.mixamorig1Hips} />
						<skinnedMesh
							geometry={nodes.Ch45.geometry}
							material={materials.Ch45_Body}
							skeleton={nodes.Ch45.skeleton}
							castShadow
							receiveShadow
						/>
					</group>
				</group>

				{/* Low detail model (simplified) */}
				<group name="Scene_low">
					<group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
						<primitive object={nodes.mixamorig1Hips} />
						<skinnedMesh
							geometry={nodes.Ch45.geometry}
							material={materials.Ch45_Body}
							skeleton={nodes.Ch45.skeleton}
							castShadow
							receiveShadow
						/>
					</group>
				</group>

				{/* Very low detail model (box placeholder) */}
				<mesh name="placeholder" scale={[0.5, 1, 0.5]}>
					<boxGeometry />
					<meshStandardMaterial color="#888888" />
				</mesh>
			</Detailed>
		</group>
	);
}

useGLTF.preload('/../../models/meshes/MixamoModel/MixamoModel.gltf');
