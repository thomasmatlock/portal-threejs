/**
 * ElevenLabs Utilities
 *
 * Standalone functions and helpers for text-to-speech functionality
 * Supports Portal character voices and direct API usage
 */

import chalk from 'chalk';
import voices from '../../config/voices';
import type { PortalCharacter, OutputFormat } from './types';

/**
 * Generate speech audio using ElevenLabs API
 * Standalone function for use outside React components
 */
export const generateSpeech = async (
	text: string,
	character: PortalCharacter = 'glados',
	autoPlay: boolean = true
): Promise<string> => {
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

/**
 * Get voice configuration for a Portal character
 */
export const getVoiceConfig = (character: PortalCharacter) => {
	return {
		id: voices[character].id,
		name: voices[character].name,
		model: voices[character].model,
		outputFormat: voices[character].outputFormat as OutputFormat,
	};
};

/**
 * Create audio data URL from base64 string
 */
export const createAudioDataUrl = (audioBase64: string): string => {
	return `data:audio/mp3;base64,${audioBase64}`;
};

/**
 * Log TTS conversion start message
 */
export const logConversionStart = (characterName: string): void => {
	console.log(chalk.blue(`ElevenLabs: Converting text to speech with ${characterName} voice...`));
};

/**
 * Log TTS conversion completion
 */
export const logConversionComplete = (): void => {
	console.log(chalk.green('ElevenLabs: Text to speech conversion complete.'));
};

/**
 * Log audio playback start
 */
export const logPlaybackStart = (characterName: string): void => {
	console.log(chalk.blue(`ElevenLabs: Playing ${characterName} voice...`));
};

/**
 * Log audio playback completion
 */
export const logPlaybackComplete = (): void => {
	console.log(chalk.green('ElevenLabs: Audio playback complete.'));
};
