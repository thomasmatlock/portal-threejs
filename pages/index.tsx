import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import { InputContextProvider } from '../context/inputContext';
import Main from '../components/Main';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
	const [apiTestResult, setApiTestResult] = useState<string | null>(null);
	const [isTestingApi, setIsTestingApi] = useState(false);
	const [envCheckResult, setEnvCheckResult] = useState<string | null>(null);
	const [isCheckingEnv, setIsCheckingEnv] = useState(false);

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

	// Check environment variables
	const checkEnvVars = async () => {
		setIsCheckingEnv(true);
		setEnvCheckResult(null);

		try {
			console.log('Checking environment variables...');
			const response = await fetch('/api/env-check');
			const result = await response.json();

			console.log('Environment check result:', result);
			setEnvCheckResult(
				`API Key Set: ${result.elevenlabsApiKeySet ? 'Yes' : 'No'}\nMasked Key: ${
					result.maskedKey
				}\nNode Env: ${result.nodeEnv}`
			);
		} catch (error) {
			console.error('Environment check error:', error);
			setEnvCheckResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			setIsCheckingEnv(false);
		}
	};

	// Test the TTS API directly with more detailed error handling and a backup approach
	const testTtsApi = async () => {
		setIsTestingApi(true);
		setApiTestResult(null);

		try {
			console.log('Testing TTS API...');
			const response = await fetch('/api/text-to-speech', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: 'Well, well, well. Hello there, Tom! How are you doing today? My name is Wheatley. I am a sentient core personality from the Portal series.',
					voiceId: 'Qp2jP4wqfVrgjJ3nj5Pr',
					modelId: 'eleven_multilingual_v2',
					outputFormat: 'mp3_44100_128',
				}),
			});

			console.log('API Response status:', response.status);
			console.log('API Response headers:', response.headers);

			// Try to parse response as text first if JSON fails
			let responseText;
			try {
				responseText = await response.text();
				console.log('Raw response text (first 100 chars):', responseText.substring(0, 100));
			} catch (parseError) {
				console.error('Error getting response text:', parseError);
			}

			// Parse as JSON
			const result = responseText ? JSON.parse(responseText) : {};

			if (response.ok) {
				console.log('TTS API test successful!');
				setApiTestResult('Success! Audio data received.');

				// Play the audio
				if (result.audio) {
					const audio = new Audio(`data:audio/mp3;base64,${result.audio}`);
					await audio.play();
				} else {
					setApiTestResult('Warning: Response OK but no audio data received.');
				}
			} else {
				console.error('TTS API test failed:', result);
				setApiTestResult(
					`Error: ${result.error || response.statusText} - ${
						result.details || 'No details'
					}`
				);
			}
		} catch (error) {
			console.error('TTS API test error:', error);
			setApiTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);

			// Try alternative approach using XMLHttpRequest for debugging
			try {
				console.log('Trying alternative XMLHttpRequest approach...');
				setApiTestResult((prev) => `${prev}\nTrying XMLHttpRequest approach...`);

				const xhr = new XMLHttpRequest();
				xhr.open('POST', '/api/text-to-speech', true);
				xhr.setRequestHeader('Content-Type', 'application/json');

				xhr.onload = function () {
					if (xhr.status >= 200 && xhr.status < 300) {
						console.log('XMLHttpRequest successful!');
						try {
							const result = JSON.parse(xhr.responseText);
							if (result.audio) {
								console.log('Audio data received via XMLHttpRequest');
								setApiTestResult(
									(prev) => `${prev}\nXHR Success: Audio data received.`
								);
								const audio = new Audio(`data:audio/mp3;base64,${result.audio}`);
								audio.play();
							} else {
								console.log('No audio data in XMLHttpRequest response');
								setApiTestResult((prev) => `${prev}\nXHR Warning: No audio data.`);
							}
						} catch (parseError) {
							console.error('Error parsing XMLHttpRequest response:', parseError);
							setApiTestResult((prev) => `${prev}\nXHR Error: ${parseError.message}`);
						}
					} else {
						console.error('XMLHttpRequest failed:', xhr.status, xhr.statusText);
						setApiTestResult(
							(prev) => `${prev}\nXHR Error: ${xhr.status} ${xhr.statusText}`
						);
					}
				};

				xhr.onerror = function () {
					console.error('Network error with XMLHttpRequest');
					setApiTestResult((prev) => `${prev}\nXHR Network error`);
				};

				xhr.send(
					JSON.stringify({
						text: 'This is an alternative test of the text to speech API.',
						voiceId: 'Qp2jP4wqfVrgjJ3nj5Pr',
						modelId: 'eleven_multilingual_v2',
						outputFormat: 'mp3_44100_128',
					})
				);
			} catch (xhrError) {
				console.error('XMLHttpRequest approach error:', xhrError);
				setApiTestResult((prev) => `${prev}\nXHR Setup Error: ${xhrError.message}`);
			}
		} finally {
			setIsTestingApi(false);
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
				<div style={{ marginBottom: 10 }}>
					{/* <button
						onClick={checkEnvVars}
						disabled={isCheckingEnv}
						style={{
							padding: '8px 16px',
							background: '#4169E1',
							color: 'white',
							border: 'none',
							borderRadius: 4,
							cursor: isCheckingEnv ? 'not-allowed' : 'pointer',
							opacity: isCheckingEnv ? 0.7 : 1,
							marginRight: '8px',
						}}
					>
						{isCheckingEnv ? 'Checking...' : 'Check Env'}
					</button> */}

					<button
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

				{apiTestResult && (
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
				)}
			</div>
		</>
	);
}
