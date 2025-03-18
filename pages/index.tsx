import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import { InputContextProvider } from '../context/inputContext';
import Main from '../components/Main';
import { useState, useEffect } from 'react';
import Head from 'next/head';
export default function Home() {
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
	return (
		<InputContextProvider>
			<Main />
		</InputContextProvider>
	);
}
