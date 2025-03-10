import { useGLTF, Cloud } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useState, useContext, useRef } from 'react';
import UserContextProvider from '@/context/userContext';
import * as THREE from 'three';
import { log } from 'console';
import config from '@/scripts/config';

type Props = {
	// mainCtaHovered: React.MutableRefObject<boolean>;
};

export default function Fog(props: Props) {
	const { theme, dev, mobile } = useContext(UserContextProvider);

	const fogRef = useRef(null!);
	const color = new THREE.Color(theme === 'light' ? '#fff' : '#000');
	const { near, far } = config.fog;
	useFrame((state, delta) => {
		const rounded = Math.round(fogRef.current.far * 100) / 100;
		if (rounded === config.fog.far) return; // no need to update if fog is already at target

		fogRef.current.near = THREE.MathUtils.lerp(
			fogRef.current.near,
			near,
			config.fog.changeSpeed
		);
		fogRef.current.far = THREE.MathUtils.lerp(
			fogRef.current.far,
			far,
			config.fog.changeSpeed * 2
		);
	});
	return <fog ref={fogRef} attach="fog" args={[color, 0, 0]} />;
}
