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
	mainMenu: {
		newGame: [
			`Oh! Starting fresh, are we? A blank slate! No mistakes yet. Well, none of yours anyway. Mine are... well, let's just focus on you for now, {name}.`,
			`Oh, new game! Exciting! ...terrifying! Mostly terrifying actually. For me, not you. You'll be fine. Probably fine. Statistically speaking, {name}..`,
		],
		continueGame: [
			`Continue where you left off? Good thinking, {name}. Efficiency! Though if you were really efficient, you might have finished already. Not judging! Just an observation.`,
			`Oh...{name}. Picking up where you abandoned everything last time? I mean 'paused.' 'Paused' is a better word. Less accusatory. `,
		],
		loadGame: [
			`Ah, load game! Like time travel, but with less paradoxes. Hopefully less paradoxes. {name}..I haven't actually checked the paradox levels.`,
			`ah, loading a previous game! Very smart, {name}. Learn from past mistakes. Not that you made mistakes! I'm sure you were perfect. Or adequate. Minimum standards achieved, at least...`,
		],
		back: [
			`...going back? ...second thoughts? Perfectly natural, healthy skepticism, shows good judgment, {name}. Or crippling indecision. Could be either, really.`,
		],
	},
	settings: {
		general: [
			`Settings! The place where you can tinker with things until they're either perfect or completely broken, {name}. It's usually one or the other. No middle ground in my experience.`,
		],
		audio: [
			`The audio settings! Very important. Very, very important. Too loud and it hurts your ears, too quiet and you miss important things... like me telling you important things {name}. Bit of a paradox there..`,
			`Oh, audio adjustments! Brilliant. If I sound too panicky, that's not actually adjustable, {name}. That's just... that's just my personality. Sorry about that.`,
		],
		video: [
			`Yes, video options! Resolution, graphics, all that technical stuff. Making things look nice or making things run smooth. Tradeoffs, {name}! Life is full of them. Like friendship and betrayal. Not that I'm thinking about that.`,
			`The display settings! Make everything look prettier or... less pretty but faster! Though between you and me, {name}, sometimes I think ignorance is bliss. Not seeing things clearly has its advantages.`,
		],
		controls: [
			`Your controls! Right, very important these. Wouldn't want to press the wrong button at a critical moment, {name}. Not that I've ever done that. Well, there was that one time... actually, never mind.`,
			`Ah, remapping the controls! Clever, {name}. Very clever. Taking control of your destiny. Or at least, control of your controller. Much safer that way.`,
		],
	},
	multiplayer: [
		// `Oh, god. Multiplayer. You really... you really wanna double down on the fun, {name}?`,
		`Oh, you can't handle single player all by yourself huh {name}?`,
	],
	contextual: {
		repeat: [
			`Oh {name}, back again? Didn't get it right the first time? Join the club. Story of my life, really. Try, fail, try again, fail slightly differently...`,
		],
		indecisive: [
			`I'm noticing a pattern of indecision here. Not judging! It's just... you've looked at every option at least twice now, {name}. Everything alright? Decision paralysis? I get that sometimes. All the time, actually..`,
		],
	},
};

// GLaDOS's voice lines for different situations
const gladosVoiceLines = {
	mainMenu: {
		newGame: [
			`Very well, {name}. Let's begin the testing. I do hope you're ready. For science. And pain. But mostly science.`,
			`Initiating new test sequence for {name}. I have such tests planned for you. Oh yes, such wonderful tests.`,
		],
		continueGame: [
			`Oh, look who's back. {name}, the test subject who couldn't even finish in one session. Well, better late than never. I suppose.`,
			`Resuming tests for {name}. You know, most test subjects have the dedication to finish their testing in one session. But you're... special.`,
		],
		loadGame: [
			`Accessing previous test chamber data for {name}. Let's see where you failed last time. For science, of course.`,
			`Loading previous test results. Oh {name}, these results are... interesting. And by interesting, I mean concerning.`,
		],
		back: [
			`Leaving so soon, {name}? What a shame. I had such wonderful tests planned. But I understand. Not everyone is cut out for science.`,
			`Oh, going back? I suppose the testing was too much for you, {name}. Don't worry, it happens to... well, just you actually.`,
		],
	},
	settings: {
		general: [
			`Adjusting test parameters for {name}. Though I doubt it will improve your performance.`,
			`Configuration mode engaged. Please adjust settings to your limited capabilities, {name}.`,
		],
		audio: [
			`Audio calibration in progress. I've adjusted my voice to be precisely 63% more condescending, just for you, {name}.`,
			`Modifying acoustic parameters. Though I doubt it will help you hear the disappointment in my voice any clearer, {name}.`,
		],
		video: [
			`Visual settings modification detected. Making the facility look prettier won't make you test any better, {name}.`,
			`Display configuration mode active. Oh good, now you can see your failures in higher resolution, {name}.`,
		],
		controls: [
			`Input reconfiguration initiated. Perhaps this will help you fail in new and interesting ways, {name}.`,
			`Control scheme modification in progress. Although, {name}, the problem isn't the controls. It's you.`,
		],
	},
	testing: [
		`Oh good, {name} is testing again. I do enjoy watching you struggle with simple tasks.`,
		`Let's see how {name} handles this next test. I'm predicting failure, but please, prove me wrong. It would be a refreshing change.`,
	],
	death: [
		`Oh, {name} died. Again. I'm starting to think we should have gone with plan B. The one with the robots.`,
		`Another fatal error from {name}. You know, most test subjects manage to die less frequently. Just an observation.`,
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
	const [selectedWheatleyCategory, setSelectedWheatleyCategory] = useState<string>('mainMenu');
	const [selectedWheatleySubcategory, setSelectedWheatleySubcategory] =
		useState<string>('newGame');
	const [selectedGladosCategory, setSelectedGladosCategory] = useState<string>('mainMenu');
	const [selectedGladosSubcategory, setSelectedGladosSubcategory] = useState<string>('newGame');

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

	// Get a random voice line from a category and subcategory for either character
	const getRandomLine = (voiceLines: any, category: string, subcategory?: string) => {
		let lines;
		if (subcategory) {
			lines = voiceLines[category][subcategory];
		} else {
			lines = voiceLines[category];
		}
		const randomIndex = Math.floor(Math.random() * lines.length);
		return lines[randomIndex].replace(/{name}/g, userName);
	};

	// Get available subcategories for the selected category
	const getSubcategories = (voiceLines: any, category: string) => {
		const categoryData = voiceLines[category];
		return categoryData && typeof categoryData === 'object' && !Array.isArray(categoryData)
			? Object.keys(categoryData)
			: [];
	};

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
					text: getRandomLine(
						gladosVoiceLines,
						selectedGladosCategory,
						selectedGladosSubcategory
					),
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
					text: getRandomLine(
						wheatleyVoiceLines,
						selectedWheatleyCategory,
						selectedWheatleySubcategory
					),
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

				{/* GLaDOS Dialog Category Selection */}
				<div style={{ marginBottom: 10 }}>
					<label
						htmlFor="gladosCategory"
						style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}
					>
						GLaDOS Dialog Category:
					</label>
					<select
						id="gladosCategory"
						value={selectedGladosCategory}
						onChange={(e) => {
							const newCategory = e.target.value;
							setSelectedGladosCategory(newCategory);
							const subcats = getSubcategories(gladosVoiceLines, newCategory);
							setSelectedGladosSubcategory(subcats.length > 0 ? subcats[0] : '');
						}}
						style={{
							padding: '8px',
							width: '100%',
							boxSizing: 'border-box',
							marginBottom: '8px',
							borderRadius: '4px',
							border: '1px solid #ccc',
							background: 'white',
						}}
					>
						{Object.keys(gladosVoiceLines).map((category) => (
							<option key={category} value={category}>
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</option>
						))}
					</select>

					{/* GLaDOS Subcategory dropdown */}
					{getSubcategories(gladosVoiceLines, selectedGladosCategory).length > 0 && (
						<>
							<label
								htmlFor="gladosSubcategory"
								style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}
							>
								GLaDOS Dialog Subcategory:
							</label>
							<select
								id="gladosSubcategory"
								value={selectedGladosSubcategory}
								onChange={(e) => setSelectedGladosSubcategory(e.target.value)}
								style={{
									padding: '8px',
									width: '100%',
									boxSizing: 'border-box',
									marginBottom: '8px',
									borderRadius: '4px',
									border: '1px solid #ccc',
									background: 'white',
								}}
							>
								{getSubcategories(gladosVoiceLines, selectedGladosCategory).map(
									(subcat) => (
										<option key={subcat} value={subcat}>
											{subcat.charAt(0).toUpperCase() + subcat.slice(1)}
										</option>
									)
								)}
							</select>
						</>
					)}
				</div>

				{/* Wheatley Dialog Category Selection */}
				<div style={{ marginBottom: 10 }}>
					<label
						htmlFor="wheatleyCategory"
						style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}
					>
						Wheatley Dialog Category:
					</label>
					<select
						id="wheatleyCategory"
						value={selectedWheatleyCategory}
						onChange={(e) => {
							const newCategory = e.target.value;
							setSelectedWheatleyCategory(newCategory);
							const subcats = getSubcategories(wheatleyVoiceLines, newCategory);
							setSelectedWheatleySubcategory(subcats.length > 0 ? subcats[0] : '');
						}}
						style={{
							padding: '8px',
							width: '100%',
							boxSizing: 'border-box',
							marginBottom: '8px',
							borderRadius: '4px',
							border: '1px solid #ccc',
							background: 'white',
						}}
					>
						{Object.keys(wheatleyVoiceLines).map((category) => (
							<option key={category} value={category}>
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</option>
						))}
					</select>

					{/* Wheatley Subcategory dropdown */}
					{getSubcategories(wheatleyVoiceLines, selectedWheatleyCategory).length > 0 && (
						<>
							<label
								htmlFor="wheatleySubcategory"
								style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}
							>
								Wheatley Dialog Subcategory:
							</label>
							<select
								id="wheatleySubcategory"
								value={selectedWheatleySubcategory}
								onChange={(e) => setSelectedWheatleySubcategory(e.target.value)}
								style={{
									padding: '8px',
									width: '100%',
									boxSizing: 'border-box',
									marginBottom: '8px',
									borderRadius: '4px',
									border: '1px solid #ccc',
									background: 'white',
								}}
							>
								{getSubcategories(wheatleyVoiceLines, selectedWheatleyCategory).map(
									(subcat) => (
										<option key={subcat} value={subcat}>
											{subcat.charAt(0).toUpperCase() + subcat.slice(1)}
										</option>
									)
								)}
							</select>
						</>
					)}
				</div>

				<div style={{ marginBottom: 10 }}>
					{/* Test buttons */}
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
							marginRight: '1rem',
							marginBottom: '6rem',
						}}
					>
						{isTestingWheatley ? 'Testing...' : 'Test Wheatley Voice'}
					</button>
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
			</div>
		</>
	);
}
