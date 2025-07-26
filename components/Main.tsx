import styles from '../styles/App.module.scss';
import { useState, useContext, useEffect } from 'react';
import Level00_MainMenu from './maps/Level00_MainMenu';
import InputContext from '@/context/inputContext';
import UserContext from '@/context/userContext';
import GameCanvas from '@/components/GameCanvas';
import GameMenu from '@/components/ui/menus/MainMenu';
import Crosshair from '@/components/ui/hud/Crosshair';

export default function Main() {
	const { setInteracted, interacted } = useContext(InputContext);
	const { mobile, dev } = useContext(UserContext);
	// const [showGame, setShowGame] = useState(dev ? true : false);
	const [showGame, setShowGame] = useState(false);

	const handleStartGame = () => {
		console.log('Starting new game...');
		setShowGame(true);
	};

	const handleContinueGame = () => {
		console.log('Continuing game...');
		setShowGame(true);
	};

	const handleLoadGame = () => {
		console.log('Loading game...');
		setTimeout(() => {
			setShowGame(true);
		}, 1000);
	};

	const handleOptions = () => {
		console.log('Opening options...');
	};

	const handleExit = () => {
		console.log('Exiting game...');
		if (typeof window !== 'undefined') {
			window.alert('In a real game, this would exit the application.');
		}
	};

	return (
		<div>
			<div
				className={styles['app']}
				onClick={() => {
					setInteracted(true);
				}}
			>
				{showGame && <Crosshair />}
				{!showGame && (
					<>
						<Level00_MainMenu />
						<GameMenu
							onStartGame={handleStartGame}
							onSettings={handleOptions}
							onExit={handleExit}
							onLoadGame={handleLoadGame}
							onContinueGame={handleContinueGame}
						/>
					</>
				)}

				{showGame && <GameCanvas />}
			</div>
		</div>
	);
}
