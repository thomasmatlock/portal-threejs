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
import voices from '../config/voices';

// Define the OutputFormat type based on the ElevenLabs API
type OutputFormat =
	| 'mp3_22050_32'
	| 'mp3_44100_32'
	| 'mp3_44100_64'
	| 'mp3_44100_96'
	| 'mp3_44100_128'
	| 'mp3_44100_192'
	| 'pcm_16000'
	| 'pcm_22050'
	| 'pcm_24000'
	| 'pcm_44100'
	| 'ulaw_8000';

// Define allowed Portal characters
type PortalCharacter = 'glados' | 'wheatley';

interface ElevenLabsProps {
	text: string;
	character?: PortalCharacter;
	voiceId?: string; // If you want to override the character setting
	modelId?: string;
	outputFormat?: OutputFormat;
	autoPlay?: boolean;
}

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
	const selectedVoiceId = voiceId || voices[character].id;
	const selectedModelId = modelId || voices[character].model;
	const selectedOutputFormat = outputFormat || (voices[character].outputFormat as OutputFormat);

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
				console.log(
					chalk.blue(
						`ElevenLabs: Converting text to speech with ${voices[character].name} voice...`
					)
				);
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
				console.log(chalk.green('ElevenLabs: Text to speech conversion complete.'));
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
				console.log(chalk.blue(`ElevenLabs: Playing ${voices[character].name} voice...`));

				// Create a data URL from the base64 audio data
				audioRef.current.src = `data:audio/mp3;base64,${audioData}`;

				// Play the audio
				await audioRef.current.play();

				hasPlayedRef.current = true;
				console.log(chalk.green('ElevenLabs: Audio playback started.'));

				// Listen for when playback ends
				audioRef.current.onended = () => {
					console.log(chalk.green('ElevenLabs: Audio playback complete.'));
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

// Export a standalone function to use outside of React components
export const generateSpeech = async (
	text: string,
	character: PortalCharacter = 'glados',
	autoPlay: boolean = true
) => {
	try {
		console.log(
			chalk.blue(
				`ElevenLabs: Converting text to speech with ${voices[character].name} voice...`
			)
		);

		// Call our API route
		const response = await fetch('/api/text-to-speech', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text,
				voiceId: voices[character].id,
				modelId: voices[character].model,
				outputFormat: voices[character].outputFormat,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.details || `API returned ${response.status}: ${response.statusText}`
			);
		}

		const data = await response.json();
		const audioBase64 = data.audio;

		if (autoPlay) {
			console.log(chalk.blue(`ElevenLabs: Playing ${voices[character].name} voice...`));
			const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
			await audio.play();
		}

		return audioBase64;
	} catch (error) {
		console.error(chalk.red('ElevenLabs error:'), error);
		throw error;
	}
};
