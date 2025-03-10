// @ts-nocheck

import { useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { CycleRaycast } from '@react-three/drei';
import { useRef, useContext } from 'react';
import * as THREE from 'three';
import InputContext from '../context/inputContext';
import { useThree } from '@react-three/fiber';
export default function Raycaster() {
	const { activeObject } = useContext(InputContext);

	const { scene, camera, mouse, raycaster } = useThree();
	const objects = scene.children;
	const getIntersects = (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		return raycaster.intersectObjects(objects, true);
	};
	const mouseMove = (e) => {
		const intersects = getIntersects(e);
		if (intersects.length > 0) {
			activeObject.current = intersects[0];
			// console.log(activeObject.current);
			// make object not visible
			// activeObject.current.object.parent.visible = true;
		} else {
			// activeObject.current.point = new THREE.Vector3(0, 0, 0);
		}
	};
	// useFrame((state) => {});
	useEffect(() => {
		window.addEventListener('mousemove', mouseMove);
		// make scene not visible
		scene.children.forEach((child) => {
			// child.matrixWorldAutoUpdate = false;
			// child.matrixAutoUpdate = false;
		});
		return () => {
			window.removeEventListener('mousemove', mouseMove);
		};
	}, []);
	return null;
}
