/**
 * voices.ts
 *
 * Goals:
 * - Configure voice settings for Portal characters
 * - Store voice IDs for ElevenLabs API
 * - Provide easy access to voice configurations
 */

interface VoiceConfig {
	id: string;
	name: string;
	description: string;
	model: string;
	outputFormat: string;
}

interface VoiceConfigurations {
	glados: VoiceConfig;
	wheatley: VoiceConfig;
	[key: string]: VoiceConfig; // Allow for future character additions
}

const voices: VoiceConfigurations = {
	glados: {
		name: 'GLaDOS',
		description: 'Passive-aggressive AI antagonist from the Portal series',
		model: 'eleven_multilingual_v2',
		id: 'GDHJm7rsiAFXZ0ctpCyx',
		outputFormat: 'mp3_44100_128',
	},
	wheatley: {
		id: 'VDCD06JV2NI4A7bLa3JU',
		name: 'Wheatley',
		description: 'Well-meaning but incompetent personality core from Portal 2',
		model: 'eleven_multilingual_v2',
		outputFormat: 'mp3_44100_128',
	},
};

export default voices;
