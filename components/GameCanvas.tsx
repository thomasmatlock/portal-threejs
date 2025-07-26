// components/portal/GameCanvas.tsx
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Sky, Stats } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import TestChamber00 from './maps/Level01_TestChamber00';
import Player from '@/components/core/Player';
import { Suspense } from 'react';
import styles from '@/styles/App.module.scss';
import dynamic from 'next/dynamic';

export default function GameCanvas() {
	return (
		<KeyboardControls
			map={[
				{ name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
				{ name: 'backward', keys: ['ArrowDown', 's', 'S'] },
				{ name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
				{ name: 'right', keys: ['ArrowRight', 'd', 'D'] },
				{ name: 'jump', keys: ['Space'] },
				{ name: 'portal1', keys: ['1', 'z', 'Z'] },
				{ name: 'portal2', keys: ['2', 'x', 'X'] },
			]}
		>
			<Canvas shadows camera={{ fov: 45 }}>
				{/* Sky and lighting */}
				<Sky sunPosition={[100, 20, 100]} />
				<ambientLight intensity={0.3} />
				<pointLight
					// castShadow
					intensity={0.8}
					position={[100, 100, 100]}
					shadow-mapSize={2048}
				/>

				<Suspense fallback={null}>
					<Physics gravity={[0, -5, 0]} interpolate={true} timeStep={1 / 120}>
						<TestChamber00 />
						<Player position={[-10, 5, 6]} />
					</Physics>
				</Suspense>

				{/* Performance stats - remove in production */}
				{/* <Stats /> */}
			</Canvas>
		</KeyboardControls>
	);
}
