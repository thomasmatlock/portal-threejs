import { useState, useEffect, useRef, useContext } from 'react';
import UserContextProvider from '../context/userContext';
import { useFrame } from '@react-three/fiber';
import InputContextProvider from '../context/inputContext';
export default function AdaptiveFrameloop() {
	const { frameloop } = useContext(UserContextProvider);
	const { timestamp } = useContext(InputContextProvider);
	const paused = useRef(false);
	const currentTimeStamp = useRef(0);
	useEffect(() => {
		frameloop === 'always' ? (paused.current = false) : (paused.current = true);
		if (paused) currentTimeStamp.current = timestamp.current;
	}, [frameloop]);
	useFrame((state) => {
		if (paused.current) return;
		if (!paused.current)
			timestamp.current = state.clock.getElapsedTime() + currentTimeStamp.current;
	});
	return null;
}
