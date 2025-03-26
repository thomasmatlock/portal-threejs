import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import { InputContextProvider } from '../context/inputContext';
import Main from '../components/Main';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import voices from '../config/voices';

// Wheatley's voice lines for different situations
const wheatleyVoiceLines = {
	continueGame: [
		`Continue where you left off? Good thinking, {name}. Efficiency! Though if you were really efficient, you might have finished already. Not judging! Just an observation.`,
		`Oh, {name}. Picking up where you abandoned everything last time? I mean 'paused.' Paused is a better word. Less accusatory.`,
	],
	newGame: [
		`New game! Exciting! Terrifying! Mostly terrifying actually. For me, {name}. Not you. You'll be fine. Probably fine. Statistically speaking.`,
	],
	loadGame: [
		`Load game! Like time travel, but with less paradoxes. Hopefully less paradoxes. {name}..I haven't actually checked the paradox levels.`,
		`Going back? ...second thoughts? Perfectly natural, healthy skepticism, shows good judgment, {name}. Or crippling indecision. Could be either, really.`,
	],
	audioSettings: [
		`Audio settings! Very important. Very, very important. Too loud and it hurts your ears, too quiet and you miss important things... like me telling you important things {name}. Bit of a paradox there..`,
		`Oh, audio adjustments! Brilliant. If I sound too panicky, that's not actually adjustable, {name}. That's just... that's just my personality. Sorry about that.`,
	],
	controls: [
		`Ah, remapping the controls! Clever, {name}. Very clever. Taking control of your destiny. Or at least, control of your controller. Much safer that way`,
	],
	multiplayer: [
		`Oh, god. Multiplayer. You real... you really wanna double down on the fun?`,
		`Oh, you can't handle single player all by yourself, huh {name}?`,
	],
	indecision: [
		`Oh {name}, back again? Didn't get it right the first time? Join the club. Story of my life, really. Try, fail, try again, fail slightly differently...`,
		`I'm noticing a pattern of indecision here. Not judging! It's just... you've looked at every option at least twice now, {name}. Everything alright? Decision paralysis? I get that sometimes. All the time, actually..`,
	],
};

export default function Home() {
	const [apiTestResult, setApiTestResult] = useState<string | null>(null);
	const [isTestingApi, setIsTestingApi] = useState(false);
	const [envCheckResult, setEnvCheckResult] = useState<string | null>(null);
	const [isCheckingEnv, setIsCheckingEnv] = useState(false);
	const [isTestingGlados, setIsTestingGlados] = useState(false);
	const [isTestingWheatley, setIsTestingWheatley] = useState(false);
	const [userName, setUserName] = useState<string>('Tom');

	// Add this script to your Portal index.tsx file
	useEffect(() => {
		// Function to send a test message to the parent
		const testParentMessage = () => {
			if (window.parent !== window) {
				console.log('[Iframe] Sending test message to parent');

				window.parent.postMessage(
					{
						type: 'test',
						message: 'Hello from iframe!',
						location: window.location.href,
						timestamp: new Date().toISOString(),
					},
					'*'
				); // Use '*' for testing, but in production specify the target origin
			} else {
				console.log('[Iframe] Not embedded in an iframe, running standalone');
			}
		};

		// Handle messages from the parent
		const handleMessageFromParent = (event) => {
			// In production, validate the origin
			// if (event.origin !== 'https://thomasmatlock.com') return;

			console.log('[Iframe] Received message from parent:', event.data);
			// console.log(event.data);

			// If this is the test message, send a response
			if (event.data.type === 'test') {
				window.parent.postMessage(
					{
						type: 'test-response',
						message: 'Message received by iframe!',
						receivedYour: event.data.message,
						timestamp: new Date().toISOString(),
					},
					'*'
				);
			}
		};

		// Set up the event listener
		window.addEventListener('message', handleMessageFromParent);

		// Send a test message after a short delay to ensure everything is loaded
		const timerId = setTimeout(testParentMessage, 1000);

		// Clean up
		return () => {
			window.removeEventListener('message', handleMessageFromParent);
			clearTimeout(timerId);
		};
	}, []);

	// Test GLaDOS voice
	const testGladosVoice = async () => {
		setIsTestingGlados(true);
		setApiTestResult(null);

		try {
			console.log('Testing GLaDOS voice...');
			const response = await fetch('/api/text-to-speech', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: `Hello, ${userName}. The Enrichment Center reminds you that the Aperture Science Weighted Companion Cube will never threaten to stab you.`,
					voiceId: voices.glados.id,
					modelId: voices.glados.model,
					outputFormat: voices.glados.outputFormat,
				}),
			});

			if (!response.ok) {
				throw new Error(`API returned ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			if (result.audio) {
				setApiTestResult('GLaDOS voice test successful!');
				const audio = new Audio(`data:audio/mp3;base64,${result.audio}`);

				// Wait for audio to finish playing before enabling button
				audio.onended = () => {
					console.log('GLaDOS audio playback complete');
					setIsTestingGlados(false);
				};

				await audio.play();
			} else {
				setApiTestResult('Warning: No audio data received from GLaDOS voice test.');
				setIsTestingGlados(false);
			}
		} catch (error) {
			console.error('GLaDOS voice test error:', error);
			setApiTestResult(
				`GLaDOS Error: ${error instanceof Error ? error.message : String(error)}`
			);
			setIsTestingGlados(false);
		}
	};

	// Get a random voice line from a category
	const getRandomWheatleyLine = (category: keyof typeof wheatleyVoiceLines) => {
		const lines = wheatleyVoiceLines[category];
		const randomIndex = Math.floor(Math.random() * lines.length);
		return lines[randomIndex].replace(/{name}/g, userName);
	};

	// Test Wheatley voice
	const testWheatleyVoice = async () => {
		setIsTestingWheatley(true);
		setApiTestResult(null);

		try {
			console.log('Testing Wheatley voice...');
			const response = await fetch('/api/text-to-speech', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: getRandomWheatleyLine('audioSettings'), // Using audioSettings as default for test
					voiceId: voices.wheatley.id,
					modelId: voices.wheatley.model,
					outputFormat: voices.wheatley.outputFormat,
				}),
			});

			if (!response.ok) {
				throw new Error(`API returned ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			if (result.audio) {
				setApiTestResult('Wheatley voice test successful!');
				const audio = new Audio(`data:audio/mp3;base64,${result.audio}`);

				// Wait for audio to finish playing before enabling button
				audio.onended = () => {
					console.log('Wheatley audio playback complete');
					setIsTestingWheatley(false);
				};

				await audio.play();
			} else {
				setApiTestResult('Warning: No audio data received from Wheatley voice test.');
				setIsTestingWheatley(false);
			}
		} catch (error) {
			console.error('Wheatley voice test error:', error);
			setApiTestResult(
				`Wheatley Error: ${error instanceof Error ? error.message : String(error)}`
			);
			setIsTestingWheatley(false);
		}
	};

	return (
		<>
			<InputContextProvider>
				<Main />
			</InputContextProvider>

			{/* Debug Controls */}
			<div
				style={{
					position: 'fixed',
					bottom: 10,
					right: 10,
					zIndex: 1000,
					background: 'rgba(0,0,0,0.7)',
					padding: 10,
					borderRadius: 5,
					color: 'white',
					maxWidth: 300,
				}}
			>
				{/* User Name Input */}
				<div style={{ marginBottom: 10 }}>
					<label
						htmlFor="userName"
						style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}
					>
						Your Name:
					</label>
					<input
						id="userName"
						type="text"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						placeholder="Enter your name"
						style={{
							padding: '8px',
							width: '100%',
							boxSizing: 'border-box',
							marginBottom: '8px',
							borderRadius: '4px',
							border: '1px solid #ccc',
						}}
					/>
				</div>

				<div style={{ marginBottom: 10 }}>
					{/* GLaDOS voice test button */}
					<button
						onClick={testGladosVoice}
						disabled={isTestingGlados}
						style={{
							padding: '8px 16px',
							background: '#FF9800',
							color: 'white',
							border: 'none',
							borderRadius: 4,
							cursor: isTestingGlados ? 'not-allowed' : 'pointer',
							opacity: isTestingGlados ? 0.7 : 1,
							marginRight: '8px',
							marginBottom: '8px',
						}}
					>
						{isTestingGlados ? 'Testing...' : 'Test GLaDOS Voice'}
					</button>

					{/* Wheatley voice test button */}
					<button
						onClick={testWheatleyVoice}
						disabled={isTestingWheatley}
						style={{
							padding: '8px 16px',
							background: '#2196F3',
							color: 'white',
							border: 'none',
							borderRadius: 4,
							cursor: isTestingWheatley ? 'not-allowed' : 'pointer',
							opacity: isTestingWheatley ? 0.7 : 1,
							marginRight: '8px',
							marginBottom: '8px',
						}}
					>
						{isTestingWheatley ? 'Testing...' : 'Test Wheatley Voice'}
					</button>

					{/* <button
						onClick={testTtsApi}
						disabled={isTestingApi}
						style={{
							padding: '8px 16px',
							background: '#4CAF50',
							color: 'white',
							border: 'none',
							borderRadius: 4,
							cursor: isTestingApi ? 'not-allowed' : 'pointer',
							opacity: isTestingApi ? 0.7 : 1,
						}}
					>
						{isTestingApi ? 'Testing...' : 'Test TTS API'}
					</button> */}
				</div>

				{envCheckResult && (
					<div
						style={{
							marginTop: 8,
							padding: 8,
							background: envCheckResult.includes('Error') ? '#FFCCCC' : '#E6E6FA',
							color: envCheckResult.includes('Error') ? '#AA0000' : '#000066',
							borderRadius: 4,
							fontSize: 14,
							whiteSpace: 'pre-line',
							marginBottom: '8px',
						}}
					>
						{envCheckResult}
					</div>
				)}

				{/* {apiTestResult && (
					<div
						style={{
							marginTop: 8,
							padding: 8,
							background: apiTestResult.includes('Error') ? '#FFCCCC' : '#CCFFCC',
							color: apiTestResult.includes('Error') ? '#AA0000' : '#007700',
							borderRadius: 4,
							fontSize: 14,
						}}
					>
						{apiTestResult}
					</div>
				)} */}
			</div>
		</>
	);
}
