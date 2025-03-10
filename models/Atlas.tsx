/*
 * File goals: 3D model component for Atlas character from Portal
 * - Properly load and render Atlas 3D model
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
		Object_10: THREE.Mesh;
		Object_11: THREE.Mesh;
		Object_13: THREE.Mesh;
		Object_14: THREE.Mesh;
		Object_15: THREE.Mesh;
		Object_16: THREE.Mesh;
		Object_17: THREE.Mesh;
		Object_7: THREE.Mesh;
		Object_8: THREE.Mesh;
		Object_9: THREE.Mesh;
	};
	materials: {
		iris_aperture: THREE.MeshStandardMaterial;
		modelsplayercoop_botsbot_eye_ring_lights: THREE.MeshStandardMaterial;
		modelsplayercoop_botsballbot_shell: THREE.MeshStandardMaterial;
		modelsplayercoop_botsballbot_frame: THREE.MeshStandardMaterial;
		eye_emissive: THREE.MeshStandardMaterial;
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
	const { nodes, materials } = useGLTF('/../../models/meshes/Atlas/Atlas.gltf') as GLTFResult;

	return (
		<group {...props} dispose={null}>
			<group rotation={[-Math.PI / 2, 0, 0]} scale={0.1} userData={{ name: 'root' }}>
				<group rotation={[Math.PI / 2, 0, 0]} userData={{ name: 'GLTF_created_0' }}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Object_10.geometry}
						material={materials.iris_aperture}
						userData={{ name: 'Object_10' }}
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
						geometry={nodes.Object_11.geometry}
						material={materials.modelsplayercoop_botsbot_eye_ring_lights}
						userData={{ name: 'Object_11' }}
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
						geometry={nodes.Object_13.geometry}
						material={materials.modelsplayercoop_botsballbot_shell}
						userData={{ name: 'Object_13' }}
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
						geometry={nodes.Object_14.geometry}
						material={materials.modelsplayercoop_botsballbot_frame}
						userData={{ name: 'Object_14' }}
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
						geometry={nodes.Object_15.geometry}
						material={materials.eye_emissive}
						userData={{ name: 'Object_15' }}
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
						geometry={nodes.Object_16.geometry}
						material={materials.iris_aperture}
						userData={{ name: 'Object_16' }}
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
						geometry={nodes.Object_17.geometry}
						material={materials.modelsplayercoop_botsbot_eye_ring_lights}
						userData={{ name: 'Object_17' }}
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
						geometry={nodes.Object_7.geometry}
						material={materials.modelsplayercoop_botsballbot_shell}
						userData={{ name: 'Object_7' }}
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
						geometry={nodes.Object_8.geometry}
						material={materials.modelsplayercoop_botsballbot_frame}
						userData={{ name: 'Object_8' }}
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
						geometry={nodes.Object_9.geometry}
						material={materials.eye_emissive}
						userData={{ name: 'Object_9' }}
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

useGLTF.preload('/../../models/meshes/Atlas/Atlas.gltf');
