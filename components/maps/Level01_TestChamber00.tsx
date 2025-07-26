// components/portal/environment/levels/TestChamber00.tsx
// import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { MeshStandardMaterial } from 'three';
import { Model as Floor } from '@/models/Floor';
import Ground from '@/components/maps/Ground';
import dynamic from 'next/dynamic';
import MainComponents from '@/components/TestChamber01/MainTestChamber01';

export default function TestChamber00() {
	const distances = [0, 1, 2, 3];
	return (
		<group>
			<Ground />
			<MainComponents distances={distances} />
		</group>
	);
}
