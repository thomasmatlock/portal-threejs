/*
 * File goals: 3D model component for GladOS character from Portal
 * - Properly load and render GladOS 3D model
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
		GLADoS_1: THREE.Mesh;
		GLADoS_2: THREE.Mesh;
		GLADoS_3: THREE.Mesh;
		GLADoS_4: THREE.Mesh;
		GLADoS_5: THREE.Mesh;
	};
	materials: {
		['acmat_0.001']: THREE.MeshStandardMaterial;
		['acmat_1.001']: THREE.MeshStandardMaterial;
		['acmat_2.001']: THREE.MeshStandardMaterial;
		['acmat_3.001']: THREE.MeshStandardMaterial;
		['acmat_4.001']: THREE.MeshStandardMaterial;
	};
};

export function Model(
	props: { scrollable?: boolean; distances?: number[] } & JSX.IntrinsicElements['group']
) {
	const { frameloop, dev, mobile } = useContext(UserContextProvider);
	const {} = useContext(InputContextProvider);
	const { scrollable } = props.scrollable ? props : { scrollable: false };
	const scroll = useScroll();
	const { clock, controls, camera, scene } = useThree();
	const { nodes, materials } = useGLTF('/../../models/meshes/GladOS/GladOS.gltf') as GLTFResult;
	return (
		<group {...props} dispose={null}>
			<group rotation={[Math.PI / 2, 0, 0]} userData={{ name: 'GLADoS' }}>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.GLADoS_1.geometry}
					material={materials['acmat_0.001']}
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
					geometry={nodes.GLADoS_2.geometry}
					material={materials['acmat_1.001']}
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
					geometry={nodes.GLADoS_3.geometry}
					material={materials['acmat_2.001']}
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
					geometry={nodes.GLADoS_4.geometry}
					material={materials['acmat_3.001']}
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
					geometry={nodes.GLADoS_5.geometry}
					material={materials['acmat_4.001']}
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
	);
}

useGLTF.preload('/../../models/meshes/GladOS/GladOS.gltf');
