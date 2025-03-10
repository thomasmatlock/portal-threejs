import { useState, useEffect, useRef, useContext } from 'react';
import UserContextProvider from '../context/userContext';
export default function AdaptiveFrameloop() {
	const { tabActive, frameloop, setFrameloop } = useContext(UserContextProvider);
	useEffect(() => {
		tabActive ? setFrameloop('always') : setFrameloop('never');
	}, [tabActive, frameloop, setFrameloop]);
	return null;
}
