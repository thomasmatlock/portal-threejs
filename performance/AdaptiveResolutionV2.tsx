import React, { useEffect, useRef, useContext, useCallback } from 'react';
import UserContextProvider from '../context/userContext';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const mobileMaxDpr = 2;
const defaultDprStep = 0.5;
const nearlyStillThreshold = 0.0025; // lower value = waits longer to up-res, higher = up-res sooner, but at risk up res before camera stops moving

interface AdaptiveResolutionProps {
	dprStep?: number;
}

export default function AdaptiveResolution({ dprStep = defaultDprStep }: AdaptiveResolutionProps) {
	const { frameloop, mobile } = useContext(UserContextProvider);
	const state = useRef({
		dpr: 1,
		maxDpr: 1,
		prevCamPos: new THREE.Vector3(),
		camSpeed: 0,
	}).current;

	useEffect(() => {
		const devicePixelRatio = window.devicePixelRatio;
		state.maxDpr = mobile ? Math.min(mobileMaxDpr, devicePixelRatio) : devicePixelRatio;
		state.maxDpr = Math.round(state.maxDpr / dprStep) * dprStep; // Round to nearest dprStep
	}, [mobile, state, dprStep]);

	const updateDpr = useCallback(
		(gl: THREE.WebGLRenderer, camera: THREE.Camera) => {
			state.camSpeed = camera.position.distanceTo(state.prevCamPos);
			state.prevCamPos.copy(camera.position);

			let newDpr;
			if (state.camSpeed < nearlyStillThreshold) {
				// console.log('nearly still');
				newDpr = state.maxDpr;
			} else {
				const speedFactor = Math.min(state.camSpeed * 10, 1);
				const lerpedDpr = THREE.MathUtils.lerp(state.maxDpr, 1, speedFactor);
				newDpr = Math.max(1, Math.round(lerpedDpr / dprStep) * dprStep); // Round to nearest dprStep, minimum 1
			}

			if (newDpr !== state.dpr) {
				state.dpr = newDpr;
				gl.setPixelRatio(state.dpr);
				console.log(state.dpr);
			}
		},
		[state, dprStep]
	);

	useFrame(({ gl, camera }) => {
		if (frameloop !== 'never') {
			updateDpr(gl, camera);
		}
	});

	return null;
}
