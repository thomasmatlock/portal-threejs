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
import { Leva } from 'leva';
import MainStaticMeshes from './MainStaticMeshes';
import dynamic from 'next/dynamic';

const Turret = dynamic(() => import('../models/Turret').then((mod) => mod.Model), {
	ssr: false,
});
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
						enableZoom={false}
						enablePan={true}
						enableRotate={false}
						minDistance={0}
						maxDistance={10}
						makeDefault
						position={[0, 0, 0]}
						target={[0, 0.1, 0]}
						dampingFactor={1}
						autoRotate={true}
						autoRotateSpeed={-1}
					/>

					<PerspectiveCamera
						makeDefault
						position={[-1, 0, 1]}
						fov={mobile ? 27 : 27} // desktop is wider, mobile is narrower
						near={0.1} // Closer near plane
						far={150} // Further far plane
					/>
					<Turret scale={5} position={[0, 0, 0]} />
					{/* <directionalLight position={[5, 10, 0]} intensity={1} /> */}
					<spotLight
						intensity={1}
						// angle={Math.PI / 2}
						penumbra={0.15} // this
						position={[0, 0.5, 1]}
						rotation={[Math.PI * 0.22, 0, 0]}
						userData={{ name: 'point' }}
					/>
				</Canvas>
			</Suspense>
		</>
	);
}
