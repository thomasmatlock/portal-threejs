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
		Object_2: THREE.Mesh;
		Object_3: THREE.Mesh;
		Object_4: THREE.Mesh;
		Object_5: THREE.Mesh;
		Object_6: THREE.Mesh;
	};
	materials: {
		acmat_0: THREE.MeshStandardMaterial;
		acmat_1: THREE.MeshStandardMaterial;
		acmat_2: THREE.MeshStandardMaterial;
		acmat_3: THREE.MeshStandardMaterial;
		acmat_4: THREE.MeshStandardMaterial;
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
			<Detailed distances={props.distances || [0, 4, 8, 12]}>
				<group
					rotation={[-Math.PI / 2, 0, 0]}
					userData={{ name: 'GLADoS.obj.cleaner.materialmerger.gles' }}
				>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Object_2.geometry}
						material={materials.acmat_0}
						userData={{ name: 'Object_2' }}
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
						geometry={nodes.Object_3.geometry}
						material={materials.acmat_1}
						userData={{ name: 'Object_3' }}
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
						geometry={nodes.Object_4.geometry}
						material={materials.acmat_2}
						userData={{ name: 'Object_4' }}
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
						geometry={nodes.Object_5.geometry}
						material={materials.acmat_3}
						userData={{ name: 'Object_5' }}
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
						geometry={nodes.Object_6.geometry}
						material={materials.acmat_4}
						userData={{ name: 'Object_6' }}
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
			</Detailed>
		</group>
	);
}

useGLTF.preload('/../../models/meshes/GladOS/GladOS.gltf');
