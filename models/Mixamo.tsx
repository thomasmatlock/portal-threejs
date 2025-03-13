/*
 * File goals: 3D model component for Mixamo character in Portal Three.js
 * - Properly load and render Mixamo 3D model
 * - Support animations with scrollable and non-scrollable modes
 * - Support level-of-detail rendering
 * - Maintain consistent structure with other model components
 */

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF, useAnimations, useScroll, Detailed } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame, useThree } from '@react-three/fiber';
import UserContextProvider from '@/context/userContext';
import InputContextProvider from '@/context/inputContext';
import { useContext } from 'react';
import pointerEventHandlers from './shared/pointerEventHandlers';

type GLTFResult = GLTF & {
	nodes: {
		Ch45: THREE.SkinnedMesh;
		mixamorig1Hips: THREE.Bone;
	};
	materials: {
		Ch45_Body: THREE.MeshStandardMaterial;
	};
};

type ActionName = 'Armature|mixamo.com|Layer0';
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Model(
	props: { scrollable?: boolean; distances?: number[] } & JSX.IntrinsicElements['group']
) {
	const group = useRef<THREE.Group>(null);

	const { frameloop, dev, mobile } = useContext(UserContextProvider);
	const {
		// timestamp,
		// scrollSpeed,
		// scrollDirection,
		// scrolling,
		// activeObject,
		clipDuration,
		setClipDuration,
	} = useContext(InputContextProvider);
	const { scrollable } = props.scrollable ? props : { scrollable: false };
	const scroll = useScroll();
	const { clock, controls, camera, scene } = useThree();
	const { nodes, materials, animations } = useGLTF(
		'/../../models/meshes/Mixamo/Mixamo.gltf'
	) as GLTFResult;
	const { actions } = useAnimations(animations, group);
	useFrame((state) => {
		const elapsedTime = state.clock.getElapsedTime();

		if (actions && actions['Armature|mixamo.com|Layer0']) {
			if (actions['Armature|mixamo.com|Layer0'].getClip().duration > clipDuration) {
				setClipDuration(actions['Armature|mixamo.com|Layer0'].getClip().duration);
			}

			actions['Armature|mixamo.com|Layer0'].reset();
			actions['Armature|mixamo.com|Layer0'].play();
			actions['Armature|mixamo.com|Layer0'].paused = false;
			actions['Armature|mixamo.com|Layer0'].time =
				elapsedTime % actions['Armature|mixamo.com|Layer0'].getClip().duration;
			actions['Armature|mixamo.com|Layer0'].setLoop(THREE.LoopRepeat, Infinity);
		}
	});
	return (
		<group ref={group} {...props} dispose={null}>
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
						castShadow
						receiveShadow
					/>
				</group>
			</group>
		</group>
	);
}

useGLTF.preload('/../../models/meshes/Mixamo/Mixamo.gltf');
