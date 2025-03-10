import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import React, { lazy, Suspense, useState, useContext, useEffect, useRef } from 'react';
import UserContextProvider from '@/context/userContext';
import InputContextProvider from '@/context/inputContext';
import Performance from '@/performance/Performance';
import { HeaderConfig } from '../lib/ui/header/Header.props';
import Header from '../lib/ui/header/Header';
import PreloaderSpinners from '@/lib/ui/loaders/PreloaderSpinners';
import * as THREE from 'three';
import config from '@/config';
import LightingShadowManager from '../models/ShadowManager';
import MacbookM4_ktx2 from '@/models/MacbookM4_ktx2';
import PerformanceMetrics2D from '@/performance/PerformanceMetrics2D';
import PerformanceMetrics3D from '@/performance/PerformanceMetrics3D';
import { Leva } from 'leva';
import MainStaticMeshes from './MainStaticMeshes';

export default function Main() {
	const { theme, frameloop, dev, mobile } = useContext(UserContextProvider);
	const headerConfig: HeaderConfig = {
		title: 'Juxtaposition',
		description:
			'Juxtaposition is an Atlanta-based creative production studio founded by an award-winning developer specializing in premium 3D visual storytelling and interactive web experiences.',

		author: 'Thomas Matlock',
		url: config.site.url,
		icon: '/impossibleCubeFigma.svg',
		thumbnail: config.site.thumbnail,
		tagID: config.tagID,
	};
	return (
		<>
			<Header config={headerConfig} />
			<Suspense fallback={<PreloaderSpinners theme={theme} />}>
				{/* <Suspense fallback={null}> */}
				<Canvas
					shadows
					frameloop={frameloop}
					dpr={[1, 2]}
					gl={{
						powerPreference: 'high-performance',
						antialias: true,
						logarithmicDepthBuffer: true,
						stencil: false,
						toneMapping: THREE.ACESFilmicToneMapping,
						toneMappingExposure: 1.0,
					}}
					onCreated={({ gl }) => {
						gl.toneMapping = THREE.ACESFilmicToneMapping;
					}}
				>
					<color args={[theme === 'light' ? '#fff' : '#000']} attach="background" />

					{/* <MacbookM4_ktx2 /> */}
					<OrbitControls
						enableZoom={true}
						enablePan={true}
						enableRotate={true}
						minDistance={0}
						maxDistance={10}
						makeDefault
						position={[0, 0, 0]}
						target={[0, 0.075, 0]}
						// enableDamping={true}
						dampingFactor={1}
						autoRotate={true}
						autoRotateSpeed={-1}
					/>

					<PerspectiveCamera
						makeDefault
						position={mobile ? [1, 1, 2] : [-1, 1, 1]}
						fov={mobile ? 27 : 27} // desktop is wider, mobile is narrower
						near={0.1} // Closer near plane
						far={150} // Further far plane
					/>
					{/* <Performance /> */}
					<MainStaticMeshes />
					{/* <ambientLight intensity={0.5} /> */}
					<directionalLight position={[5, 10, 0]} intensity={1} />
					<spotLight
						intensity={1}
						angle={Math.PI / 2}
						penumbra={0.15} // this
						position={[0, 0.112, -0.106]}
						rotation={[Math.PI * 0.22, 0, 0]}
						userData={{ name: 'point' }}
					/>
					{/* <LightingShadowManager /> */}
					{/* {mobile && <PerformanceMetrics3D position={[-0.25, 0.15, 0]} />} */}
				</Canvas>
			</Suspense>

			<PerformanceMetrics2D
				position={{ top: '4rem', right: '1rem' }}
				fontSize="12px"
				maxWidth="500px"
				showDebug={mobile ? false : true}
				showMetrics={true}
			/>
			{/* <Leva collapsed /> */}
		</>
	);
}
