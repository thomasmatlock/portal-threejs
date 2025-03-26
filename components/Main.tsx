import styles from '../styles/App.module.scss';
import { useState, useContext, useEffect } from 'react';
import MainScene from './environment/MainMenuScene';
import InputContext from '@/context/inputContext';
import UserContext from '@/context/userContext';
import GameCanvas from '@/components/GameCanvas';
import GameMenu from '@/components/ui/MainMenu';
import ElevenLabs, { generateSpeech } from '@/components/ElevenLabs';

export default function Main() {
	const { setInteracted, interacted } = useContext(InputContext);
	const [showGame, setShowGame] = useState(false);
	const { mobile } = useContext(UserContext);
	const [activeCharacter, setActiveCharacter] = useState<'glados' | 'wheatley'>('glados');

	// Voice lines for characters
	const voiceLines = {
		glados: 'The Enrichment Center is required to remind you that the Portal will open in 3... 2... 1...',
		wheatley:
			"Hello! This is the part where I'm supposed to be incredibly evil. How am I doing?",
	};

	// Toggle between characters
	const toggleCharacter = () => {
		setActiveCharacter((prev) => (prev === 'glados' ? 'wheatley' : 'glados'));
	};

	const handleStartGame = () => {
		console.log('Starting new game...');
		setShowGame(true);

		// If user has interacted, play a voice line when starting the game
		if (interacted) {
			generateSpeech(
				'Let the testing begin. Remember, the Aperture Science Weighted Companion Cube will never threaten to stab you.',
				'glados'
			);
		}
	};

	const handleContinueGame = () => {
		console.log('Continuing game...');
		setShowGame(true);

		// If user has interacted, play a voice line when continuing
		if (interacted) {
			generateSpeech("Oh... it's you. It's been a long time.", 'glados');
		}
	};

	const handleLoadGame = () => {
		console.log('Loading game...');
		// Here you would show a load game dialog
		setTimeout(() => {
			setShowGame(true);

			// If user has interacted, play a voice line when loading
			if (interacted) {
				generateSpeech('Loading saved test parameters. Please wait.', 'glados');
			}
		}, 1000);
	};

	const handleOptions = () => {
		console.log('Opening options...');
		// Options are now handled in the submenu

		// If user has interacted, play a voice line when opening options
		if (interacted) {
			generateSpeech(
				'Adjusting test parameters. This may cause slight neurotoxin leakage.',
				'glados'
			);
		}
	};

	const handleExit = () => {
		console.log('Exiting game...');
		// In a real game, this might redirect to a different page or close the app

		// If user has interacted, play a voice line when exiting
		if (interacted) {
			generateSpeech('Goodbye. Your specimen has been processed and cataloged.', 'glados');
		}

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

				{/* Voice playback component - only shown when user has interacted */}
				{interacted && (
					<ElevenLabs text={voiceLines[activeCharacter]} character={activeCharacter} />
				)}

				{/* Character voice toggle button - positioned in bottom left */}
				{interacted && (
					<button
						onClick={toggleCharacter}
						style={{
							position: 'fixed',
							bottom: '20px',
							left: '20px',
							padding: '8px 16px',
							backgroundColor: activeCharacter === 'glados' ? '#ff9800' : '#2196f3',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							zIndex: 100,
							fontFamily: 'sans-serif',
							boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
						}}
					>
						Switch to {activeCharacter === 'glados' ? 'Wheatley' : 'GLaDOS'}
					</button>
				)}

				{showGame && <GameCanvas />}
			</div>
		</div>
	);
}
