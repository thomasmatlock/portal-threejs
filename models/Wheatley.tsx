/*
 * File goals: 3D model component for Wheatley character from Portal
 * - Properly load and render Wheatley 3D model
 * - Support pointer interactions
 * - Support level-of-detail rendering
 * - Maintain consistent structure with other model components
 */

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF, useScroll, Detailed } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame, useThree } from '@react-three/fiber';
import { easing, geometry } from 'maath';
import UserContextProvider from '@/context/userContext';
import InputContextProvider from '@/context/inputContext';
import { useContext, useState } from 'react';
import pointerEventHandlers from './shared/pointerEventHandlers';

type GLTFResult = GLTF & {
	nodes: {
		personality_sphere_model: THREE.Mesh;
		personality_sphere_model_1: THREE.Mesh;
	};
	materials: {
		personality_sphere: THREE.MeshStandardMaterial;
		personality_sphere_light: THREE.MeshStandardMaterial;
	};
};

export function Model(
	props: { scrollable?: boolean; distances?: number[] } & JSX.IntrinsicElements['group']
) {
	const { frameloop, dev, mobile } = useContext(UserContextProvider);
	const { interacted, setInteracted } = useContext(InputContextProvider);
	const { scrollable } = props.scrollable ? props : { scrollable: false };
	const scroll = useScroll();
	const { clock, controls, camera, scene } = useThree();
	const { nodes, materials } = useGLTF(
		'/../../models/meshes/Wheatley/Wheatley.gltf'
	) as GLTFResult;
	return (
		<group {...props} dispose={null}>
			<group position={[0, 27.002, 0]} userData={{ name: 'personality_sphere' }}>
				<group userData={{ name: 'Personality_Sphere_model' }}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.personality_sphere_model.geometry}
						material={materials.personality_sphere}
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
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.personality_sphere_model_1.geometry}
						material={materials.personality_sphere_light}
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
	);
}

useGLTF.preload('/../../models/meshes/Wheatley/Wheatley.gltf');
