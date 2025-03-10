// components/portal/environment/levels/TestChamber00.tsx
// import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { MeshStandardMaterial } from 'three';

// Material definitions
const floorMaterial = new MeshStandardMaterial({ color: '#888888', roughness: 0.7 });
const portalWallMaterial = new MeshStandardMaterial({ color: '#eeeeee', roughness: 0.2 });
const darkWallMaterial = new MeshStandardMaterial({ color: '#555555', roughness: 0.5 });

export default function TestChamber00() {
	return (
		<group name="test-chamber-00">
			{/* Floor */}
			<RigidBody type="fixed" colliders="cuboid">
				<mesh
					position={[0, -0.5, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
					receiveShadow
					material={floorMaterial}
				>
					<boxGeometry args={[12, 12, 1]} />
				</mesh>
			</RigidBody>

			{/* Walls - all portal compatible for the first chamber */}
			<RigidBody type="fixed" colliders="cuboid">
				{/* Front Wall */}
				<mesh
					position={[0, 2.5, -6]}
					material={portalWallMaterial}
					castShadow
					receiveShadow
					userData={{ portalCompatible: true }}
				>
					<boxGeometry args={[12, 6, 0.3]} />
				</mesh>

				{/* Back Wall */}
				<mesh
					position={[0, 2.5, 6]}
					material={portalWallMaterial}
					castShadow
					receiveShadow
					userData={{ portalCompatible: true }}
				>
					<boxGeometry args={[12, 6, 0.3]} />
				</mesh>

				{/* Left Wall */}
				<mesh
					position={[-6, 2.5, 0]}
					rotation={[0, Math.PI / 2, 0]}
					material={portalWallMaterial}
					castShadow
					receiveShadow
					userData={{ portalCompatible: true }}
				>
					<boxGeometry args={[12, 6, 0.3]} />
				</mesh>

				{/* Right Wall */}
				<mesh
					position={[6, 2.5, 0]}
					rotation={[0, Math.PI / 2, 0]}
					material={portalWallMaterial}
					castShadow
					receiveShadow
					userData={{ portalCompatible: true }}
				>
					<boxGeometry args={[12, 6, 0.3]} />
				</mesh>
			</RigidBody>

			{/* Ceiling */}
			<RigidBody type="fixed" colliders="cuboid">
				<mesh
					position={[0, 6, 0]}
					rotation={[Math.PI / 2, 0, 0]}
					material={darkWallMaterial}
					receiveShadow
				>
					<boxGeometry args={[12, 12, 0.3]} />
				</mesh>
			</RigidBody>

			{/* Add lights specific to this level */}
			<pointLight position={[0, 4, 0]} intensity={0.8} castShadow />

			{/* Ambient light to ensure visibility */}
			<ambientLight intensity={0.3} />
		</group>
	);
}
