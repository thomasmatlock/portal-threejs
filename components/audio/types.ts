/**
 * ElevenLabs Audio Types
 *
 * Type definitions for text-to-speech functionality using ElevenLabs API
 * Supports Portal character voices and audio configuration
 */

// ElevenLabs API output format options
export type OutputFormat =
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

// Portal character voice identifiers
export type PortalCharacter = 'glados' | 'wheatley';

// Main component props interface
export interface ElevenLabsProps {
	text: string;
	character?: PortalCharacter;
	voiceId?: string; // Override character setting
	modelId?: string;
	outputFormat?: OutputFormat;
	autoPlay?: boolean;
}

// API request payload structure
export interface TTSRequest {
	text: string;
	voiceId: string;
	modelId: string;
	outputFormat: OutputFormat;
}

// API response structure
export interface TTSResponse {
	audio: string; // Base64 encoded audio data
}

// Hook state for TTS conversion
export interface TTSState {
	loading: boolean;
	error: string | null;
	audioData: string | null;
}

// Audio playback hook state
export interface AudioPlaybackState {
	isPlaying: boolean;
	hasPlayed: boolean;
	error: string | null;
}
