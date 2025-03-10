/*
Goals:
- Clean 3D model of PBody from Portal 2
- Provide proper typing and structure
- Enable interaction with the model
- Support level-of-detail rendering
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF, Detailed } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';
import { useUserContext } from '@/context/userContext';
import { useUIContext } from '@/context/uiContext';
import pointerEventHandlers from './shared/pointerEventHandlers';

type GLTFResult = GLTF & {
	nodes: {
		eggbot_lod0001: THREE.Mesh;
		eggbot_lod0001_1: THREE.Mesh;
		eggbot_lod0001_2: THREE.Mesh;
		eggbot_lod0001_3: THREE.Mesh;
		eggbot_lod0001_4: THREE.Mesh;
	};
	materials: {
		eggbot_frame: THREE.MeshStandardMaterial;
		eggbot_shell: THREE.MeshStandardMaterial;
		eye_emissive: THREE.MeshStandardMaterial;
		iris: THREE.MeshStandardMaterial;
		bot_eye_ring_lights: THREE.MeshStandardMaterial;
	};
};

export function Model(
	props: { scrollable?: boolean; distances?: number[] } & JSX.IntrinsicElements['group']
) {
	// Get context values using hooks instead of useContext with providers
	const { dev, mobile } = useUserContext();
	const { hoveredMenuOption } = useUIContext();

	// Set default values for props
	const { scrollable = false, distances = [0, 4, 8, 12] } = props;

	// Get Three.js utilities
	const { camera, scene } = useThree();

	// Load the 3D model
	const { nodes, materials } = useGLTF('/models/meshes/PBody/PBody.gltf') as GLTFResult;

	return (
		<group {...props} dispose={null}>
			<group userData={{ name: 'PBody' }}>
				<group userData={{ name: 'PBody_Model' }}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.eggbot_lod0001.geometry}
						material={materials.eggbot_frame}
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
						geometry={nodes.eggbot_lod0001_1.geometry}
						material={materials.eggbot_shell}
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
						geometry={nodes.eggbot_lod0001_2.geometry}
						material={materials.eye_emissive}
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
						geometry={nodes.eggbot_lod0001_3.geometry}
						material={materials.iris}
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
						geometry={nodes.eggbot_lod0001_4.geometry}
						material={materials.bot_eye_ring_lights}
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

// Preload the model for better performance
useGLTF.preload('/models/meshes/PBody/PBody.gltf');
