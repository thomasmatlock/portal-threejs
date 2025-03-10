import { useContext, useEffect, useRef, useState } from 'react';
import { MathUtils } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box, ScreenSpace, useCursor, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function PortalTitle({ ...props }) {
	const ref = useRef(null!);
	const textRef = useRef(null!);
	const viewport = useThree((state) => state.viewport);
	const [hovered, hover] = useState(false);
	useCursor(hovered);
	const text = 'ALCHEMIST';
	const [mobile, setMobile] = useState(false);

	function checkIfInView(ref, camera) {
		const box = new THREE.Box3().setFromObject(ref.current);
		const boxCenter = box.getCenter(new THREE.Vector3());
		const boxSize = box.getSize(new THREE.Vector3());
		const frustum = new THREE.Frustum();
		frustum.setFromProjectionMatrix(
			new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
		);

		return frustum.intersectsBox(box);
	}
	function TopRight(ref, mobile) {
		ref.current.position.x = viewport.width / (mobile ? 1.5 : 1.1);
		// ref.current.position.x = viewport.width / 2;
		ref.current.position.y = viewport.height / (mobile ? 1.09 : 1.105); // desktop top
		// ref.current.position.y = viewport.height / 2; // desktop top
	}
	function TopLeft(ref, mobile) {
		ref.current.position.x = -viewport.width / (mobile ? 1.5 : 1.1);
		ref.current.position.y = viewport.height / (mobile ? 1.09 : 1.105); // desktop top
	}
	function BottomRight(ref, mobile) {
		ref.current.position.x = viewport.width / (mobile ? 1.5 : 1.1);
		ref.current.position.y = -viewport.height / (mobile ? 1.09 : 1.105); // desktop top
	}
	function BottomLeft(ref, mobile) {
		ref.current.position.x = -viewport.width / (mobile ? 1.5 : 1.1);
		ref.current.position.y = -viewport.height / (mobile ? 1.09 : 1.105); // desktop top
	}
	function BottomCenter(ref, mobile) {
		ref.current.position.x = viewport.width / 2;
		// ref.current.position.y = -viewport.height / (mobile ? 1.09 : 1.105); // desktop top
		ref.current.position.y = 0; // desktop top
	}
	useFrame((state) => {
		const camera = state.camera;
		const width = viewport.width;
		const height = viewport.height;
		const aspect = width / height;
		const scale = 0.1;
		const x = -aspect + scale * 2;
		const y = 1 - scale * 2;
		const z = 0.05;
		// setMobile(width < height);
		// TopLeft(ref, mobile);
		// BottomRight(ref, mobile);
		// BottomLeft(ref, mobile);
		TopRight(ref, mobile);
		// BottomCenter(ref, mobile);
		// console.log(ref.current.position.x, ref.current.position.y);
	});
	// listen for resize events
	useEffect(() => {
		window.addEventListener('resize', () => {
			const width = viewport.width;
			const height = viewport.height;
			setMobile(width < height);
		});
		return () => window.removeEventListener('resize', () => {});
	}, []);
	return (
		<>
			{/* // Distance from camera // larger number = further away */}
			<ScreenSpace depth={4}>
				<group ref={ref}>
					<Text
						ref={textRef}
						font="/fonts/Greycliff/Webfont/GreycliffCF-Bold.woff"
						fontSize={0.1}
						textAlign="center"
						lineHeight={0.6}
						anchorX="center"
						position={[0, 0, 0.05]}
						material-toneMapped={false}
						color={'#fff'}
						onPointerEnter={(e) => hover(true)}
						onPointerLeave={(e) => hover(false)}
						{...props}
					>
						{text}
					</Text>
					{/* <MovingSpot /> */}
					{/* <pointLight intensity={0.5} /> */}
					{/* <directionalLight intensity={0.5} /> */}
				</group>
			</ScreenSpace>
		</>
	);
}
