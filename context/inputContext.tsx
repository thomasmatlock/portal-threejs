import { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as THREE from 'three';
import UserContextProvider from './userContext';
import { useRouter } from 'next/router';

const InputContext = createContext({
	activeObject: {} as any,
	scrollDirection: 0 as any,
	scrolling: false as any,
	interacted: false as any,
	start: false as any,
	end: false as any,
	scrollSpeed: 0 as any,
	clipDuration: 0 as any,
	disableGoToPoint: () => {},
	// goToPoint: () => { },
	goToStart: () => {},
	goToEnd: () => {},
	setInteracted: (interacted: boolean) => {},
	toggleScrollable: () => {},
	scrollable: true as any,
	setClipDuration: (duration: number) => {},
	clickHandler: (e: THREE.Event, objName?: string) => {},
	mouseClickVector: new THREE.Vector3(0, 0, 0) as any,
	objPos: new THREE.Vector3(0, 0, 0) as any,
	timestamp: 0 as any,
});
export function InputContextProvider(props) {
	const { toggleTheme } = useContext(UserContextProvider);
	const timestamp = useRef(0);
	const [interacted, setInteracted] = useState(false); // user

	const [clipDuration, setClipDuration] = useState(1);
	const [scrollable, setScrollable] = useState(true);
	const objPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
	const mouseClickVector = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
	function getObjectName(obj: THREE.Object3D) {
		let name = '';
		if (obj.userData.name !== undefined) name = obj.userData.name;
		if (obj.parent.userData.name !== undefined) name = obj.parent.userData.name;
		return name;
	}
	const clickHandler = (e: THREE.Event, objName?: string) => {
		e.stopPropagation();
		getPositionOfObject(e.object);
		getObjectSize(e.object);
		let name = getObjectName(e.object);
		mouseClickVector.current = e.point;
	};
	function getPositionOfObject(object: THREE.Object3D) {
		const vec = new THREE.Vector3();
		vec.setFromMatrixPosition(object.matrixWorld);
		objPos.current = vec;
	}
	function getObjectSize(object: THREE.Object3D) {
		const box = new THREE.Box3().setFromObject(object);
		const size = new THREE.Vector3();
		box.getSize(size);
	}
	const scrollSpeed = useRef(0);
	const scrollDirection = useRef(0);
	const scrolling = useRef(false);

	const activeObject = useRef({});
	// const gotoStart = useState(false);
	const start = useRef(false);
	const end = useRef(false);
	const disableGoToPoint = () => {
		start.current = false;
		end.current = false;
	};

	const goToStart = () => {
		// console.log('go to start');

		disableGoToPoint();
		end.current = false;
		start.current = true;
		setTimeout(() => {
			start.current = false;
		}, 1000);
	};
	const toggleScrollable = () => {
		setScrollable(!scrollable);
	};
	const goToEnd = () => {
		// disableGoToPoint();
		// console.log('go to end');

		start.current = false;
		end.current = true;
		setTimeout(() => {
			end.current = false;
		}, 1000);
	};
	const scrollPoint1 = useRef(0.001);
	const scrollPoint2 = useRef(0.999);
	const goToPoint = (point: number) => {};
	useEffect(() => {
		// listen for t key
		const handleKeyDown = (e) => {
			if (e.key === 't') {
				goToStart();
				toggleTheme();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	return (
		<InputContext.Provider
			value={{
				activeObject,
				interacted,
				start,
				end,
				scrollDirection,
				scrolling,
				scrollSpeed,
				clipDuration,
				disableGoToPoint,
				scrollable,
				goToStart,
				toggleScrollable,
				goToEnd,
				clickHandler,
				setInteracted,
				mouseClickVector,
				objPos,
				timestamp,
				setClipDuration,
			}}
		>
			{props.children}
		</InputContext.Provider>
	);
}

export default InputContext;
