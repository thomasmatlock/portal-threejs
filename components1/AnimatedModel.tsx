import { useRef, useContext } from 'react';
import { MathUtils } from 'three';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import InputContextProvider from '../context/inputContext';

const { DEG2RAD } = THREE.MathUtils;

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function scaleFunction(objectRef, targetSize, delta, speed) {
	objectRef.current.scale.x = MathUtils.lerp(
		objectRef.current.scale.x,
		targetSize,
		speed * delta
	);
	objectRef.current.scale.y = MathUtils.lerp(
		objectRef.current.scale.y,
		targetSize,
		speed * delta
	);
	objectRef.current.scale.z = MathUtils.lerp(
		objectRef.current.scale.z,
		targetSize,
		speed * delta
	);
}
function moveToZero(objectRef, delta, speed) {
	objectRef.current.position.x = MathUtils.lerp(objectRef.current.position.x, 0, speed * delta);
	objectRef.current.position.y = MathUtils.lerp(objectRef.current.position.y, 0, speed * delta);
	objectRef.current.position.z = MathUtils.lerp(objectRef.current.position.z, 0, speed * delta);
}

type Props = {
	// clickHandler: (e: THREE.Event) => void;
	ref: React.MutableRefObject<THREE.Scene>;
	position?: [number, number, number];
	rotation?: [number, number, number];
	scale?: [number, number, number];
	targetScale?: number;
	speed?: number;
	children: React.ReactNode;
};
export default function AnimateModel(props: Props) {
	const { position, rotation, scale, speed } = props;
	const inputCtx = useContext(InputContextProvider);

	// const randomSpeed = randomInt(10, 20); // 9 is about 60 frames
	const randomSpeed = randomInt(9, 10); // 9 is about 60 frames

	const objectRef = useRef(null!);
	const sizeThreshold = 0.9999;
	// const sizeThreshold = 1.0;
	const moveThreshold = 0.0001;
	useFrame((state, delta) => {
		if (state.camera.position.y > 20) return;

		if (state.camera.position.y < 20) {
			// console.log(targetScale);

			if (scale !== undefined) {
				if (
					objectRef.current.scale.x > sizeThreshold &&
					objectRef.current.scale.y > sizeThreshold &&
					objectRef.current.scale.z > sizeThreshold
				) {
					// console.log('done scaling up');

					return;
				} else {
					// console.log(objectRef.current.scale.x);

					// console.log('scaling up');
					scaleFunction(objectRef, 1, delta, speed ? speed : randomSpeed);
				}
			}
			if (position !== undefined) {
				if (
					(objectRef.current.position.x.toFixed(4) === 0 &&
						objectRef.current.position.y.toFixed(4) === 0 &&
						objectRef.current.position.z.Tofixed(4) === 0) ||
					-objectRef.current.position.z.toFixed(4) === 0
				) {
					return;
				} else {
					// console.log(objectRef.current.position.y.toFixed(4));

					// console.log('moving to position');

					moveToZero(objectRef, delta, speed ? speed : randomSpeed);
				}
				// }
			}
		}
		if (rotation !== undefined) {
			// console.log(rotation);
			// rotate object
			// objectRef.current.rotation.x += DEG2RAD * 360 * delta;
		}
	});
	return (
		<group
			ref={objectRef}
			position={position ? position : [0, 0, 0]}
			// rotation={rotation ? rotation : [0, 0, 0]}
			scale={scale ? scale : [1, 1, 1]}
			onClick={(e) => inputCtx.clickHandler(e)}
		>
			{props.children}
		</group>
	);
}
