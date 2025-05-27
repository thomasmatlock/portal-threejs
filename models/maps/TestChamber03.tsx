/*
 * File goals: 3D model component for Test Chamber 03 from Portal
 * - Properly load and render Test Chamber 03 3D model
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
		world_geometry_MESH: THREE.Mesh;
		world_geometry_MESH_1: THREE.Mesh;
		world_geometry_MESH_2: THREE.Mesh;
		world_geometry_MESH_3: THREE.Mesh;
		world_geometry_MESH_4: THREE.Mesh;
		world_geometry_MESH_5: THREE.Mesh;
		world_geometry_MESH_6: THREE.Mesh;
		world_geometry_MESH_7: THREE.Mesh;
		world_geometry_MESH_8: THREE.Mesh;
		world_geometry_MESH_9: THREE.Mesh;
		world_geometry_MESH_10: THREE.Mesh;
		world_geometry_MESH_11: THREE.Mesh;
		world_geometry_MESH_12: THREE.Mesh;
		world_geometry_MESH_13: THREE.Mesh;
		world_geometry_MESH_14: THREE.Mesh;
		world_geometry_MESH_15: THREE.Mesh;
		world_geometry_MESH_16: THREE.Mesh;
		world_geometry_MESH_17: THREE.Mesh;
		world_geometry_MESH_18: THREE.Mesh;
		world_geometry_MESH_19: THREE.Mesh;
		world_geometry_MESH_20: THREE.Mesh;
		world_geometry_MESH_21: THREE.Mesh;
		world_geometry_MESH_22: THREE.Mesh;
		world_geometry_MESH_23: THREE.Mesh;
		world_geometry_MESH_24: THREE.Mesh;
		world_geometry_MESH_25: THREE.Mesh;
		world_geometry_MESH_26: THREE.Mesh;
		world_geometry_MESH_27: THREE.Mesh;
		world_geometry_MESH_28: THREE.Mesh;
		world_geometry_MESH_29: THREE.Mesh;
		world_geometry_MESH_30: THREE.Mesh;
		world_geometry_MESH_31: THREE.Mesh;
		world_geometry_MESH_32: THREE.Mesh;
		world_geometry_MESH_33: THREE.Mesh;
		world_geometry_MESH_34: THREE.Mesh;
		world_geometry_MESH_35: THREE.Mesh;
		world_geometry_MESH_36: THREE.Mesh;
		world_geometry_MESH_37: THREE.Mesh;
		world_geometry_MESH_38: THREE.Mesh;
		world_geometry_MESH_39: THREE.Mesh;
		world_geometry_MESH_40: THREE.Mesh;
		world_geometry_MESH_41: THREE.Mesh;
		world_geometry_MESH_42: THREE.Mesh;
		func_brush_425285: THREE.Mesh;
		lift_brush_a03: THREE.Mesh;
		func_brush_212569: THREE.Mesh;
		rail_cart_brush_b00: THREE.Mesh;
		brush_lift: THREE.Mesh;
		func_brush_437969: THREE.Mesh;
	};
	materials: {
		['CONCRETE/CONCRETE_MODULAR_CEILING001A']: THREE.MeshStandardMaterial;
		['METAL/METALWALL061F']: THREE.MeshStandardMaterial;
		['METAL/METALWALL_BTS_006B_GRADIENT']: THREE.MeshStandardMaterial;
		['LIGHTS/LIGHT_ORANGE001']: THREE.MeshStandardMaterial;
		['CONCRETE/CONCRETE_MODULAR_WALL001A']: THREE.MeshStandardMaterial;
		['LIGHTS/LIGHT_RECESSEDCOOL002']: THREE.MeshStandardMaterial;
		['CONCRETE/CONCRETE_MODULAR_WALL001E']: THREE.MeshStandardMaterial;
		['CONCRETE/CONCRETE_MODULAR_FLOOR001B']: THREE.MeshStandardMaterial;
		['CONCRETE/CONCRETE_MODULAR_WALL001F']: THREE.MeshStandardMaterial;
		['CONCRETE/OBSERVATIONWALL_001A']: THREE.MeshStandardMaterial;
		['CONCRETE/CONCRETE_MODULAR_FLOOR001A']: THREE.MeshStandardMaterial;
		['METAL/METALWALL060A']: THREE.MeshStandardMaterial;
		['CONCRETE/CONCRETE_MODULAR_WALL001D']: THREE.MeshStandardMaterial;
		['LIGHTS/WHITE008']: THREE.MeshStandardMaterial;
		['SIGNAGE/HAZARD_ORANGE_03B']: THREE.MeshStandardMaterial;
		['METAL/METALDOOR008A']: THREE.MeshStandardMaterial;
		['LIGHTS/WHITE001']: THREE.MeshStandardMaterial;
		['LIGHTS/WHITE009']: THREE.MeshStandardMaterial;
		['METAL/METALGRATE018']: THREE.MeshStandardMaterial;
		['METAL/METALGRATE018B']: THREE.MeshStandardMaterial;
		['METAL/METALWALL_BTS_005A']: THREE.MeshStandardMaterial;
		['DEV/REFLECTIVITY_10B']: THREE.MeshStandardMaterial;
		['SIGNAGE/SIGNAGE_ARROW']: THREE.MeshStandardMaterial;
		['SIGNAGE/SIGNAGE_BORDER']: THREE.MeshStandardMaterial;
		['SIGNAGE/SIGNAGE_EXIT']: THREE.MeshStandardMaterial;
		['OBJECTS/FLAT_PANEL_TV']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/metal/metalwall048b_lrg']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/metal/metalwall048b']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/metal/metalwall048b_med']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/metal/metal_modular_floor001']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/metal/metalwall_bts_006a']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plastic/plasticwall001b']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plaster/plasterwall044c']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/concrete/observationwall_001b']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/tile/observation_tilefloor001a']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plastic/plasticwall002a']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plastic/plastic_light002a']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plastic/plasticwall001a']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plastic/plasticwall004a']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plastic/plasticwall003a']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/metal/metal_lift001']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/metal/metal_lift001_gradient']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/plastic/plastic_light002c']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/glass/glasswindow_refract01']: THREE.MeshPhysicalMaterial;
		['maps/testchmb_a_03/glass/glasswindow_frosted']: THREE.MeshStandardMaterial;
		['maps/testchmb_a_03/glass/glasswindow_frosted_003b']: THREE.MeshStandardMaterial;
		['EFFECTS/LIGHT_RAIL_BEAM1']: THREE.MeshPhysicalMaterial;
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
		'/../../models/meshes/TestChamber03/TestChamber03.gltf'
	) as GLTFResult;

	return (
		<group {...props} dispose={null}>
			<Detailed distances={props.distances || [0, 4, 8, 12]}>
				<group userData={{ name: 'world_geometry' }}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.world_geometry_MESH.geometry}
						material={materials['CONCRETE/CONCRETE_MODULAR_CEILING001A']}
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
						geometry={nodes.world_geometry_MESH_1.geometry}
						material={materials['METAL/METALWALL061F']}
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
						geometry={nodes.world_geometry_MESH_2.geometry}
						material={materials['METAL/METALWALL_BTS_006B_GRADIENT']}
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
						geometry={nodes.world_geometry_MESH_3.geometry}
						material={materials['LIGHTS/LIGHT_ORANGE001']}
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
						geometry={nodes.world_geometry_MESH_4.geometry}
						material={materials['CONCRETE/CONCRETE_MODULAR_WALL001A']}
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
						geometry={nodes.world_geometry_MESH_5.geometry}
						material={materials['LIGHTS/LIGHT_RECESSEDCOOL002']}
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
						geometry={nodes.world_geometry_MESH_6.geometry}
						material={materials['CONCRETE/CONCRETE_MODULAR_WALL001E']}
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
						geometry={nodes.world_geometry_MESH_7.geometry}
						material={materials['CONCRETE/CONCRETE_MODULAR_FLOOR001B']}
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
						geometry={nodes.world_geometry_MESH_8.geometry}
						material={materials['CONCRETE/CONCRETE_MODULAR_WALL001F']}
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
						geometry={nodes.world_geometry_MESH_9.geometry}
						material={materials['CONCRETE/OBSERVATIONWALL_001A']}
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
						geometry={nodes.world_geometry_MESH_10.geometry}
						material={materials['CONCRETE/CONCRETE_MODULAR_FLOOR001A']}
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
						geometry={nodes.world_geometry_MESH_11.geometry}
						material={materials['METAL/METALWALL060A']}
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
						geometry={nodes.world_geometry_MESH_12.geometry}
						material={materials['CONCRETE/CONCRETE_MODULAR_WALL001D']}
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
						geometry={nodes.world_geometry_MESH_13.geometry}
						material={materials['LIGHTS/WHITE008']}
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
						geometry={nodes.world_geometry_MESH_14.geometry}
						material={materials['SIGNAGE/HAZARD_ORANGE_03B']}
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
						geometry={nodes.world_geometry_MESH_15.geometry}
						material={materials['METAL/METALDOOR008A']}
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
						geometry={nodes.world_geometry_MESH_16.geometry}
						material={materials['LIGHTS/WHITE001']}
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
						geometry={nodes.world_geometry_MESH_17.geometry}
						material={materials['LIGHTS/WHITE009']}
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
						geometry={nodes.world_geometry_MESH_18.geometry}
						material={materials['METAL/METALGRATE018']}
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
						geometry={nodes.world_geometry_MESH_19.geometry}
						material={materials['METAL/METALGRATE018B']}
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
						geometry={nodes.world_geometry_MESH_20.geometry}
						material={materials['METAL/METALWALL_BTS_005A']}
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
						geometry={nodes.world_geometry_MESH_21.geometry}
						material={materials['DEV/REFLECTIVITY_10B']}
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
						geometry={nodes.world_geometry_MESH_22.geometry}
						material={materials['SIGNAGE/SIGNAGE_ARROW']}
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
						geometry={nodes.world_geometry_MESH_23.geometry}
						material={materials['SIGNAGE/SIGNAGE_BORDER']}
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
						geometry={nodes.world_geometry_MESH_24.geometry}
						material={materials['SIGNAGE/SIGNAGE_EXIT']}
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
						geometry={nodes.world_geometry_MESH_25.geometry}
						material={materials['OBJECTS/FLAT_PANEL_TV']}
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
						geometry={nodes.world_geometry_MESH_26.geometry}
						material={materials['maps/testchmb_a_03/metal/metalwall048b_lrg']}
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
						geometry={nodes.world_geometry_MESH_27.geometry}
						material={materials['maps/testchmb_a_03/metal/metalwall048b']}
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
						geometry={nodes.world_geometry_MESH_28.geometry}
						material={materials['maps/testchmb_a_03/metal/metalwall048b_med']}
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
						geometry={nodes.world_geometry_MESH_29.geometry}
						material={materials['maps/testchmb_a_03/metal/metal_modular_floor001']}
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
						geometry={nodes.world_geometry_MESH_30.geometry}
						material={materials['maps/testchmb_a_03/metal/metalwall_bts_006a']}
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
						geometry={nodes.world_geometry_MESH_31.geometry}
						material={materials['maps/testchmb_a_03/plastic/plasticwall001b']}
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
						geometry={nodes.world_geometry_MESH_32.geometry}
						material={materials['maps/testchmb_a_03/plaster/plasterwall044c']}
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
						geometry={nodes.world_geometry_MESH_33.geometry}
						material={materials['maps/testchmb_a_03/concrete/observationwall_001b']}
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
						geometry={nodes.world_geometry_MESH_34.geometry}
						material={materials['maps/testchmb_a_03/tile/observation_tilefloor001a']}
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
						geometry={nodes.world_geometry_MESH_35.geometry}
						material={materials['maps/testchmb_a_03/plastic/plasticwall002a']}
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
						geometry={nodes.world_geometry_MESH_36.geometry}
						material={materials['maps/testchmb_a_03/plastic/plastic_light002a']}
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
						geometry={nodes.world_geometry_MESH_37.geometry}
						material={materials['maps/testchmb_a_03/plastic/plasticwall001a']}
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
						geometry={nodes.world_geometry_MESH_38.geometry}
						material={materials['maps/testchmb_a_03/plastic/plasticwall004a']}
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
						geometry={nodes.world_geometry_MESH_39.geometry}
						material={materials['maps/testchmb_a_03/plastic/plasticwall003a']}
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
						geometry={nodes.world_geometry_MESH_40.geometry}
						material={materials['maps/testchmb_a_03/metal/metal_lift001']}
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
						geometry={nodes.world_geometry_MESH_41.geometry}
						material={materials['maps/testchmb_a_03/metal/metal_lift001_gradient']}
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
						geometry={nodes.world_geometry_MESH_42.geometry}
						material={materials['maps/testchmb_a_03/plastic/plastic_light002c']}
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
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.func_brush_425285.geometry}
					material={materials['maps/testchmb_a_03/glass/glasswindow_refract01']}
					position={[-2.438, 26.822, -6.144]}
					userData={{ name: 'func_brush_425285' }}
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
					geometry={nodes.lift_brush_a03.geometry}
					material={materials['maps/testchmb_a_03/glass/glasswindow_frosted']}
					position={[6.096, -0.076, 0.152]}
					userData={{ name: 'lift_brush_a03' }}
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
					geometry={nodes.func_brush_212569.geometry}
					material={materials['maps/testchmb_a_03/glass/glasswindow_refract01']}
					position={[-1.219, 1.14, -4.953]}
					userData={{ name: 'func_brush_212569' }}
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
					geometry={nodes.rail_cart_brush_b00.geometry}
					material={materials['maps/testchmb_a_03/glass/glasswindow_frosted_003b']}
					position={[-7.315, 25.951, 4.534]}
					userData={{ name: 'rail_cart_brush_b00' }}
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
					geometry={nodes.brush_lift.geometry}
					material={materials['maps/testchmb_a_03/metal/metal_lift001']}
					position={[6.095, -1.37, -0.01]}
					userData={{ name: 'brush_lift' }}
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
					geometry={nodes.func_brush_437969.geometry}
					material={materials['EFFECTS/LIGHT_RAIL_BEAM1']}
					position={[-7.277, 25.413, 0.267]}
					userData={{ name: 'func_brush_437969' }}
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
			</Detailed>
		</group>
	);
}

useGLTF.preload('/../../models/meshes/TestChamber03/TestChamber03.gltf');
