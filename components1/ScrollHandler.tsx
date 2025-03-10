// @ts-nocheck

import { useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import { useRef, useContext } from 'react';
import * as THREE from 'three';
import * as animate from './Animate';
import { MathUtils } from 'three';
import InputContext from '@/context/inputContext';
import { easing, geometry } from 'maath';
export default function ScrollNav() {
	const {
		scrollSpeed,
		scrollDirection,
		scrolling,
		start,
		end,
		goToEnd,
		goToStart,
		setInteracted,
	} = useContext(InputContext);
	// const scrollSpeed = useRef(0);
	// const scrollDirection = useRef(0);
	// const scrolling = useRef(false);
	function checkScrollingUp() {
		if (scroll.offset > scrollSpeed.current) {
			scrollDirection.current = 1;
			scrolling.current = true;
			// console.log('scrolling up');

			// setInteracted(true);
			// disableGoToPoint();
		}
	}
	function checkScrollingDown() {
		if (scroll.offset < scrollSpeed.current) {
			scrollDirection.current = -1;
			scrolling.current = true;
			// console.log('scrolling down');
			// disableGoToPoint();
			// console.log('scrolling up');
		}
	}
	function checkStoppedScrolling() {
		if (scroll.offset === scrollSpeed.current) {
			scrollDirection.current = 0;
			scrolling.current = false;
			// console.log('stopped scrolling');
		}
	}
	const scroll = useScroll();
	const scrollTo = useScroll();
	const speed = useRef(0);
	useFrame((state, controls) => {
		checkScrollingUp();
		checkScrollingDown();
		checkStoppedScrolling();

		// scrollTo(scrollSpeed.current, { duration: 1000, easing: easing.easeInOutCubic });
		// console.log(start.current, end.current);

		if (start.current) scroll.scroll.current = 0.01;
		if (end.current) scroll.scroll.current = 0.99;

		// scroll.damping = 1;
		// scroll.scroll.current = 0.001;

		// const r1 = scroll.range(0, 0.25);
		// const r2 = scroll.range(0.25, 0.25);
		// const r3 = scroll.range(0.5, 0.25); //  begins, distance
		// const r4 = scroll.range(0.75, 0.25);
		// const r1Vis = scroll.range(0, 0.25);
		// const r2Vis = scroll.range(0.25, 0.25);
		// const r3Vis = scroll.range(0.5, 0.25);
		// const r4Vis = scroll.range(0.75, 0.25);
		scrollSpeed.current = scroll.offset;
		speed.current = scroll.delta * 100;
	});
	useEffect(() => {
		// listen for left and right keys
		const handleKeyDown = (e) => {
			if (e.key === 'ArrowLeft') {
				console.log('left');
				// move scroll left by 1
				// scrollSpeed.current = -1;
				goToStart();
				// gotoStart.current = true;

				// scrollDirection.current = -1;
			} else if (e.key === 'ArrowRight') {
				console.log('right');
				// gotoEnd.current = true;
				goToEnd();
				// scrollDirection.current = 1;
			}
		};
		const handleKeyUp = (e) => {
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				// scrollDirection.current = 0;
			}
		};
		const handleWheel = () => {
			// console.log('wheel');
		};
		const touchStart = (e) => console.log('touch start');
		const touchEnd = (e) => console.log('touch end');
		const touchMove = (e) => console.log('touch move');
		const touchCancel = (e) => console.log('touch cancel');

		const mouseMoveHandler = (e) => console.log('mouse move');
		const mouseDownHandler = (e) => console.log('mouse down');
		const mouseUpHandler = (e) => console.log('mouse up');

		window.addEventListener('touchstart', touchStart);
		window.addEventListener('touchend', touchEnd);
		window.addEventListener('touchmove', touchMove);
		window.addEventListener('touchcancel', touchCancel);
		// window.addEventListener('mousemove', mouseMoveHandler);
		// window.addEventListener('mousedown', mouseDownHandler);
		// window.addEventListener('mouseup', mouseUpHandler);
		window.addEventListener('keydown', handleKeyDown);

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('wheel', handleWheel);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('wheel', handleWheel);
		};
	}, []);

	return null;
}
