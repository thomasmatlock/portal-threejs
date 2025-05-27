/**
 * ElevenLabs.tsx
 *
 * Goals:
 * - Provide a reusable component for text-to-speech conversion using ElevenLabs API
 * - Allow customization of voice, text, and model parameters
 * - Support playing audio from ElevenLabs
 * - Only play after user interaction
 * - Use server-side API route to protect API key
 * - Support Portal character voices
 */

import { useEffect, useState, useRef } from 'react';
import chalk from 'chalk';
import voices from '../../config/voices';
import type { OutputFormat, PortalCharacter, ElevenLabsProps } from './types';
import {
	getVoiceConfig,
	createAudioDataUrl,
	logConversionStart,
	logConversionComplete,
	logPlaybackStart,
	logPlaybackComplete,
} from './elevenLabsUtils';

const ElevenLabs = ({
	text,
	character = 'glados', // Default to GLaDOS
	voiceId, // Optional override
	modelId,
	outputFormat,
	autoPlay = true,
}: ElevenLabsProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [audioData, setAudioData] = useState<string | null>(null); // Base64 encoded audio data
	const hasPlayedRef = useRef(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Select the voice configuration based on character or use voiceId directly
	const voiceConfig = getVoiceConfig(character);
	const selectedVoiceId = voiceId || voiceConfig.id;
	const selectedModelId = modelId || voiceConfig.model;
	const selectedOutputFormat = outputFormat || voiceConfig.outputFormat;

	// Create audio element
	useEffect(() => {
		// Only create the audio element on the client
		if (typeof window !== 'undefined' && !audioRef.current) {
			audioRef.current = new Audio();
		}

		// Cleanup
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, []);

	// Convert text to speech once when component mounts
	useEffect(() => {
		const convertToSpeech = async () => {
			// Skip if we've already got audio data
			if (audioData) return;

			try {
				logConversionStart(voiceConfig.name);
				setLoading(true);
				setError(null);

				// Call our API route instead of ElevenLabs API directly
				const response = await fetch('/api/text-to-speech', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text,
						voiceId: selectedVoiceId,
						modelId: selectedModelId,
						outputFormat: selectedOutputFormat,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.details ||
							`API returned ${response.status}: ${response.statusText}`
					);
				}

				const data = await response.json();
				setAudioData(data.audio);
				logConversionComplete();
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
				setError(errorMessage);
				console.error(chalk.red('ElevenLabs error:'), errorMessage);
			} finally {
				setLoading(false);
			}
		};

		if (text && !loading && !audioData) {
			convertToSpeech();
		}
	}, [
		text,
		selectedVoiceId,
		selectedModelId,
		selectedOutputFormat,
		loading,
		audioData,
		character,
	]);

	// Play audio after it's been loaded
	useEffect(() => {
		const playAudio = async () => {
			if (!audioData || !autoPlay || hasPlayedRef.current || !audioRef.current) return;

			try {
				logPlaybackStart(voiceConfig.name);

				// Create a data URL from the base64 audio data
				audioRef.current.src = createAudioDataUrl(audioData);

				// Play the audio
				await audioRef.current.play();

				hasPlayedRef.current = true;
				console.log(chalk.green('ElevenLabs: Audio playback started.'));

				// Listen for when playback ends
				audioRef.current.onended = () => {
					logPlaybackComplete();
				};
			} catch (err) {
				console.error(chalk.red('ElevenLabs playback error:'), err);
			}
		};

		playAudio();
	}, [audioData, autoPlay, character]);

	return null; // This component doesn't render anything
};

export default ElevenLabs;

// Re-export the standalone function from utils
export { generateSpeech } from './elevenLabsUtils';
