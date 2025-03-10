import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
	OrbitControls,
	PerspectiveCamera,
	Environment,
	Sparkles,
	CameraShake,
	Lightformer,
} from '@react-three/drei';
import React, { lazy, Suspense, useState, useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

// Add this type declaration at the top of your file
declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext;
	}
}

// Create a context for audio control
export const AudioPlayerContext = React.createContext({
	playAudio: () => {},
	isPlaying: false,
});

const PBodyRig = dynamic(() => import('../../models/rigs/PBodyRig').then((mod) => mod.PBodyRig), {
	ssr: false,
});
const WheatleyRig = dynamic(
	() => import('../../models/rigs/WheatleyRig').then((mod) => mod.WheatleyRig),
	{
		ssr: false,
	}
);
const AtlasRig = dynamic(() => import('../../models/rigs/AtlasRig').then((mod) => mod.AtlasRig), {
	ssr: false,
});
const GladOSRig = dynamic(
	() => import('../../models/rigs/GladOSRig').then((mod) => mod.GladOSRig),
	{
		ssr: false,
	}
);

// Create a component to handle audio initialization
function AudioInitializer() {
	const { gl } = useThree();
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		const canvas = gl.domElement;

		const handleInteraction = () => {
			if (!initialized) {
				// Initialize audio context with proper typing
				const AudioContextClass = window.AudioContext || window.webkitAudioContext;
				const audioContext = new AudioContextClass();
				const silentBuffer = audioContext.createBuffer(1, 1, 22050);
				const source = audioContext.createBufferSource();
				source.buffer = silentBuffer;
				source.connect(audioContext.destination);
				source.start();

				// Dispatch event for AudioPlayer
				window.dispatchEvent(new CustomEvent('audioUnlocked'));

				setInitialized(true);
			}
		};

		canvas.addEventListener('click', handleInteraction);
		canvas.addEventListener('touchstart', handleInteraction);

		return () => {
			canvas.removeEventListener('click', handleInteraction);
			canvas.removeEventListener('touchstart', handleInteraction);
		};
	}, [gl, initialized]);

	return null;
}
function Rig() {
	const [vec] = useState(() => new THREE.Vector3());
	const { camera, mouse } = useThree();
	useFrame(() => camera.position.lerp(vec.set(mouse.x * -1, 0, 3), 0.01));
	return (
		<CameraShake
			maxYaw={0.01}
			maxPitch={0.01}
			maxRoll={0.01}
			yawFrequency={0.5}
			pitchFrequency={0.5}
			rollFrequency={0.4}
		/>
	);
}
export default function Main() {
	return (
		<div style={{ position: 'fixed', width: '100%', height: '100vh', right: 0 }}>
			<Suspense fallback={null}>
				<Canvas
					style={{ position: 'absolute', top: 0, left: 0 }}
					shadows
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
					<AudioInitializer />
					<color args={['#000']} attach="background" />
					{/* <MacbookM4_ktx2 /> */}
					<OrbitControls
						enableZoom={true}
						enablePan={true}
						enableRotate={false}
						minDistance={0}
						maxDistance={10}
						makeDefault
						position={[0, 0, 0]}
						target={[0, 0, 0]}
						dampingFactor={0.25}
						// autoRotate={true}
						// autoRotateSpeed={-0.1}
					/>
					<Rig />
					<PerspectiveCamera
						makeDefault
						position={[-1, 0, 3]}
						fov={60}
						near={0.1}
						far={150}
					/>
					{/* <Turret scale={5} position={[0, 0, 0]} /> */}
					{/* <TestChamber03 /> */}
					{/* <TestChamber03 scale={1} position={[0, 1, 0]} rotation={[0, Math.PI / 2, 0]} /> */}
					<Sparkles
						count={300}
						size={2}
						scale={10}
						speed={0.2}
						opacity={0.3}
						color="#aaa9ad"
						noise={1.5}
					/>
					<WheatleyRig />
					{/* <PBodyRig /> */}
					<AtlasRig />
					{/* <GladOSRig /> */}
					{/* <GladOS scale={0.15} position={[0.5, 1, 0]} />
					<Atlas scale={0.15} position={[0, -0.5, 0]} />
					<PBody scale={0.015} position={[0.75, -0.5, 0]} /> */}
					{/* Portal-style lighting setup */}
					{/* Cool blue ambient light */}
					<ambientLight intensity={0.1} color="#b4c7e0" />

					{/* Main overhead light - simulates the ceiling panels */}
					{/* <spotLight
						intensity={0.7}
						angle={Math.PI / 4}
						penumbra={0.2}
						position={[0, 5, 0]}
						color="#f0f5ff"
						// castShadow
						shadow-bias={-0.0001}
					/> */}

					{/* Accent light from front - simulates the observation window */}
					<spotLight
						intensity={0.4}
						angle={Math.PI / 6}
						penumbra={0.5}
						position={[0, 1, 5]}
						color="#80ccff"
						// castShadow
					/>
					{/* Side accent light - gives that asymmetric Portal look */}
					<spotLight
						intensity={0.3}
						angle={Math.PI / 5}
						penumbra={0.2}
						position={[4, 2, 1]}
						color="#c2fcff"
						// castShadow
					/>
					{/* Subtle floor bounce light */}
					<pointLight
						intensity={0.1}
						position={[0, -1, 0]}
						color="#c2fcff"
						distance={5}
					/>
					{/* Add a subtle volumetric effect */}
					<fog attach="fog" color="#c2fcff" near={10} far={30} />
				</Canvas>
			</Suspense>
		</div>
	);
}
