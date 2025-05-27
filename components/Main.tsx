import styles from '../styles/App.module.scss';
import { useState, useContext, useEffect } from 'react';
import MainScene from './maps/MainMenuScene';
import InputContext from '@/context/inputContext';
import UserContext from '@/context/userContext';
import GameCanvas from '@/components/GameCanvas';
import GameMenu from '@/components/ui/MainMenu';

export default function Main() {
	const { setInteracted, interacted } = useContext(InputContext);
	const [showGame, setShowGame] = useState(false);
	const { mobile } = useContext(UserContext);

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
				{showGame && (
					<div className={styles.reticles}>
						<div className={styles.reticle} />
						<div className={styles.reticle} />
						<div className={styles.reticle} />
						<div className={styles.reticle} />
						<div className={styles.reticle} />
					</div>
				)}
				{!showGame && (
					<>
						<MainScene />
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
