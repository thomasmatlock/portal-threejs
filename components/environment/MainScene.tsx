import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
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

const Turret = dynamic(() => import('../../models/Turret').then((mod) => mod.Model), {
	ssr: false,
});

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

export default function Main() {
	return (
		<div style={{ position: 'fixed', width: '70%', height: '100vh', right: 0 }}>
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
						enableRotate={true}
						minDistance={0}
						maxDistance={10}
						makeDefault
						position={[0, 0, 0]}
						target={[0, 0.1, 0]}
						dampingFactor={0.25}
						autoRotate={true}
						autoRotateSpeed={-0.25}
					/>

					<PerspectiveCamera
						makeDefault
						position={[-1, 0, 1]}
						fov={27} // desktop is wider, mobile is narrower
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
		</div>
	);
}
