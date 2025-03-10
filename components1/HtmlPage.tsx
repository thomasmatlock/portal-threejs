import * as THREE from 'three';

const { DEG2RAD } = THREE.MathUtils;
import { Html } from '@react-three/drei';
type Props = {
	menuOpen?: boolean;
	castShadow?: boolean;
	height?: number;
	occlude?: boolean | 'blending' | 'raycast';
	position?: [number, number, number];
	rotation?: [number, number, number];
	scale?: number;
	url: string;
	width?: number;
};
type PlaneProps = {
	position: [number, number, number];
	rotation: [number, number, number];
	height: number;
	width: number;
	scale: number;
};
function Plane(props: PlaneProps) {
	const { position, rotation, height, width, scale } = props;

	return (
		<mesh
			// castShadow
			// receiveShadow
			position={position}
			rotation={[rotation[0], rotation[1] + DEG2RAD * 180, rotation[2]]}
			scale={scale / 40}
		>
			<planeBufferGeometry attach="geometry" args={[width, height]} />
			<meshStandardMaterial attach="material" color="black" />
		</mesh>
	);
}
export default function HtmlPage(props: Props) {
	const { url, height, width, occlude, scale, castShadow, position, rotation, menuOpen } = props;
	// console.log(menuOpen);

	return (
		<>
			(
			{!menuOpen && (
				<Html
					castShadow={castShadow}
					// occlude={occlude}
					// occlude={!menuOpen ? false : occlude}
					transform
					scale={scale ? scale : 0.1}
					position={position ? position : [0, 0, 0]}
					rotation={rotation ? rotation : [0, DEG2RAD * 180, 0]}
				>
					<iframe title="embed" width={width} height={height} src={url} />
				</Html>
			)}
			)
		</>
	);
}
