import { useState, useEffect, useRef, useContext } from 'react';
import { Perf } from 'r3f-perf';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { useControls, folder, button } from 'leva';
import UserContextProvider from '../context/userContext';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const { log } = console;
export default function AdaptiveResolution() {
	const { frameloop, dev, mobile } = useContext(UserContextProvider);
	const dpr = useRef(1);
	const deviceDpr = useRef(1);
	useEffect(() => {
		if (window.devicePixelRatio > 1) {
			if (window.devicePixelRatio > 2) deviceDpr.current = 1.5;
			// else deviceDpr.current = window.devicePixelRatio;
			else deviceDpr.current = 1.5;
		}
	}, [mobile]);
	const camPositions = useRef<Array<THREE.Vector3>>([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, 0),
	]);
	const camSpeed = useRef(0);
	const stoppedMoving = useRef(true);

	function getCameraSpeed(camPositions) {
		const yDistance = Math.abs(Number(camPositions[0].y) - Number(camPositions[1].y));
		const xDistance = Math.abs(Number(camPositions[0].x) - Number(camPositions[1].x));
		const zDistance = Math.abs(Number(camPositions[0].z) - Number(camPositions[1].z));
		const speed = yDistance + xDistance + zDistance;

		return speed;
	}
	function checkIfStoppedMoving(camSpeed) {
		const threshold = 0.0005; // lower value = waits longer to up-res, higher = up-res sooner, but at risk up res before camera stops moving, default 0.001
		if (camSpeed < threshold) return true;
		else return false;
	}
	function getDifference(number) {
		if (1 - Math.round(Math.abs(number) * 10) / 10 < 0.5) return 1;
		else return 1 - Math.round(Math.abs(number) * 10) / 10;
	}
	useEffect(() => {
		// listen for scroll events
		const handleScroll = () => {
			console.log('scrolling');
			dpr.current = 1;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
		// listen for touch events
		const handleTouch = () => {
			console.log('touching');
			dpr.current = 1;
		};
		window.addEventListener('touchstart', handleTouch);
		return () => window.removeEventListener('touchstart', handleTouch);
	}, []);
	useEffect(() => {}, []);
	useFrame(({ gl, scene, camera, clock }) => {
		if (frameloop === 'never') return;
		camPositions.current.push(camera.position.clone());
		camPositions.current.shift();
		camSpeed.current = getCameraSpeed(camPositions.current);
		stoppedMoving.current = checkIfStoppedMoving(camSpeed.current);
		if (!stoppedMoving.current) {
			// log('started moving');
			dpr.current = getDifference(camSpeed.current);
		}
		if (stoppedMoving.current) {
			// log('stopped moving');

			dpr.current = mobile ? deviceDpr.current : deviceDpr.current;
		}
		gl.setPixelRatio(dpr.current);
		// console.log(dpr.current);
	});
	return null;
}
