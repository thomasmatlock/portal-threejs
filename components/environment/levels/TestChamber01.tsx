// components/portal/environment/levels/TestChamber00.tsx
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export default function TestChamber00() {
	const floorModel = useGLTF('/models/test_chamber/portal_tile_floor.gltf');
	const whiteWallModel = useGLTF('/models/test_chamber/portal_wall_white.gltf');
	const darkWallModel = useGLTF('/models/test_chamber/portal_wall_dark.gltf');

	return (
		<group name="test-chamber-00">
			{/* Simple square room */}

			{/* Floor */}
			<RigidBody type="fixed" colliders="trimesh">
				<group position={[0, 0, 0]}>
					{[...Array(3)].map((_, x) =>
						[...Array(3)].map((_, z) => (
							<primitive
								key={`floor-${x}-${z}`}
								object={floorModel.scene.clone()}
								position={[x * 4 - 4, 0, z * 4 - 4]}
							/>
						))
					)}
				</group>
			</RigidBody>

			{/* Walls - all portal compatible for the first chamber */}
			<RigidBody type="fixed" colliders="trimesh">
				{/* Array of wall placements */}
				{[
					{ pos: [0, 2, -6], rot: [0, 0, 0], model: whiteWallModel }, // Front
					{ pos: [0, 2, 6], rot: [0, Math.PI, 0], model: whiteWallModel }, // Back
					{ pos: [-6, 2, 0], rot: [0, Math.PI / 2, 0], model: whiteWallModel }, // Left
					{ pos: [6, 2, 0], rot: [0, -Math.PI / 2, 0], model: whiteWallModel }, // Right
				].map((wall, i) => (
					<primitive
						key={`wall-${i}`}
						object={wall.model.scene.clone()}
						position={wall.pos}
						rotation={wall.rot}
						userData={{ portalCompatible: true }}
					/>
				))}
			</RigidBody>

			{/* Ceiling */}
			<RigidBody type="fixed" colliders="trimesh">
				<primitive
					object={darkWallModel.scene.clone()}
					position={[0, 6, 0]}
					rotation={[Math.PI / 2, 0, 0]}
				/>
			</RigidBody>

			{/* Add lights specific to this level */}
			<pointLight position={[0, 4, 0]} intensity={0.8} />
		</group>
	);
}
