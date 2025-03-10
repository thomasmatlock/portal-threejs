import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import Main from '../components/Main';
import GameCanvas from '@/components/GameCanvas';
import GameMenu from '@/components/ui/MainMenu';
import { useState } from 'react';
import Head from 'next/head';
export default function Home() {
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
		// Here you would show a load game dialog
		setTimeout(() => {
			setShowGame(true);
		}, 1000);
	};

	const handleOptions = () => {
		console.log('Opening options...');
		// Options are now handled in the submenu
	};

	const handleExit = () => {
		console.log('Exiting game...');
		// In a real game, this might redirect to a different page or close the app
		if (typeof window !== 'undefined') {
			window.alert('In a real game, this would exit the application.');
		}
	};
	return (
		<UserContextProvider>
			<Head>
				<title>Portal Three.js</title>
				<meta name="description" content="Portal Three.js" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/portal.svg" />
			</Head>
			<div className={styles['app']}>
				{!showGame && (
					<>
						<Main />
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
		</UserContextProvider>
	);
}
