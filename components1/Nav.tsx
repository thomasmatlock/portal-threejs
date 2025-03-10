import styles from '@/components1/Nav.module.scss';
import { useContext, useRef, useEffect, useState } from 'react';
import InputContext from '@/context/inputContext';
import UserContext from '@/context/userContext';
export default function Nav() {
	const { timestamp, goToStart, goToEnd, toggleScrollable, scrollable } =
		useContext(InputContext);
	const { theme, toggleTheme, mobile } = useContext(UserContext);
	const startHandler = () => {
		goToStart();
	};
	const endHandler = () => {
		goToEnd();
	};
	const animationHandler = () => {
		toggleScrollable();
	};
	const [msg, setMsg] = useState('');
	function resetMsg() {
		setTimeout(() => {
			// setMsg('');
		}, 1000);
	}
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

		const touchStart = (e) => {
			resetMsg();
			setMsg('touch start');
		};
		const touchEnd = (e) => {
			resetMsg();
			setMsg('touch end');
		};
		const touchMove = (e) => {
			resetMsg();
			setMsg('touch move');
		};
		const touchCancel = (e) => {
			setMsg('touch cancel');
			resetMsg();
		};

		const mouseMoveHandler = (e) => {
			setMsg('mouse move');
			resetMsg();
		};
		const mouseDownHandler = (e) => {
			setMsg('mouse down');
			resetMsg();
		};
		const mouseUpHandler = (e) => {
			setMsg('mouse up');
			resetMsg();
		};

		if (mobile) window.addEventListener('touchstart', touchStart);
		// if (mobile) window.addEventListener('touchend', touchEnd);
		if (mobile) window.addEventListener('touchmove', touchMove);
		if (mobile) window.addEventListener('touchcancel', touchCancel);
		if (!mobile) window.addEventListener('mousemove', mouseMoveHandler);
		if (!mobile) window.addEventListener('mousedown', mouseDownHandler);
		if (!mobile) window.addEventListener('mouseup', mouseUpHandler);
		if (!mobile) window.addEventListener('keydown', handleKeyDown);
		if (!mobile) window.addEventListener('keydown', handleKeyDown);
		if (!mobile) window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('wheel', (e) => {
			if (e.deltaY > 0) {
				setMsg('wheel down');
				resetMsg();
			} else {
				setMsg('wheel up');
				resetMsg();
			}
		});
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('touchstart', touchStart);
			window.removeEventListener('touchend', touchEnd);
			window.removeEventListener('touchmove', touchMove);
			window.removeEventListener('touchcancel', touchCancel);
			window.removeEventListener('mousemove', mouseMoveHandler);
			window.removeEventListener('mousedown', mouseDownHandler);
			window.removeEventListener('mouseup', mouseUpHandler);
		};
	}, [mobile]);
	return (
		<>
			{/* <p
				style={{
					position: 'absolute',
					left: '1rem',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					top: '1rem',
					color: theme === 'dark' ? 'white' : 'black',
					zIndex: 100,
					fontSize: '10px',
				}}
			>
				{msg}
			</p> */}
			<nav
				className={styles.nav}
				style={{
					filter: theme === 'dark' ? 'invert(1)' : 'invert(0)',
				}}
			>
				<p className={styles.nav_item} onClick={startHandler}>
					Start
				</p>
				{/* <p className={styles.nav_item} onClick={toggleScrollable}>
				{scrollable ? 'Scroll to play' : 'Auto playing'}
			</p> */}
				<p className={styles.nav_item} onClick={toggleTheme}>
					{theme === 'light' ? 'Light Mode' : 'Villain Mode'}
				</p>
				<p className={styles.nav_item} onClick={animationHandler}>
					{!scrollable ? 'Auto-playing' : 'Scroll to play'}
				</p>
				<p className={styles.nav_item} onClick={endHandler}>
					End
				</p>
			</nav>
		</>
	);
}
