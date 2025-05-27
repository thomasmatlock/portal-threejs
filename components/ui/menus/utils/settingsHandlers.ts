// Settings state management utilities
import { SETTINGS_OPTIONS } from './menuOptions';

export interface SettingsState {
	antiAliasing: string;
	shadowQuality: string;
	textureQuality: string;
	effectsQuality: string;
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	voiceVolume: number;
	audioQuality: string;
	mouseSensitivity: number;
	reverseMouse: boolean;
	showAudioPlayer: boolean;
}

export interface SettingsActions {
	setAntiAliasing: (value: string) => void;
	setShadowQuality: (value: string) => void;
	setTextureQuality: (value: string) => void;
	setEffectsQuality: (value: string) => void;
	setMasterVolume: (value: number) => void;
	setMusicVolume: (value: number) => void;
	setSfxVolume: (value: number) => void;
	setVoiceVolume: (value: number) => void;
	setAudioQuality: (value: string) => void;
	setMouseSensitivity: (value: number) => void;
	setReverseMouse: (value: boolean) => void;
	setShowAudioPlayer: (value: boolean) => void;
}

// Utility function to cycle through options
const cycleOptionForward = <T>(current: T, options: T[]): T => {
	const currentIndex = options.indexOf(current);
	const nextIndex = (currentIndex + 1) % options.length;
	return options[nextIndex];
};

const cycleOptionBackward = <T>(current: T, options: T[]): T => {
	const currentIndex = options.indexOf(current);
	const prevIndex = (currentIndex - 1 + options.length) % options.length;
	return options[prevIndex];
};

// Increment setting values
export const incrementSetting = (
	optionId: string,
	state: SettingsState,
	actions: SettingsActions
): void => {
	switch (optionId) {
		case 'anti_aliasing':
			actions.setAntiAliasing(
				cycleOptionForward(state.antiAliasing, SETTINGS_OPTIONS.antiAliasing as string[])
			);
			break;
		case 'shadow_quality':
			actions.setShadowQuality(
				cycleOptionForward(state.shadowQuality, SETTINGS_OPTIONS.shadowQuality as string[])
			);
			break;
		case 'texture_quality':
			actions.setTextureQuality(
				cycleOptionForward(
					state.textureQuality,
					SETTINGS_OPTIONS.textureQuality as string[]
				)
			);
			break;
		case 'effects_quality':
			actions.setEffectsQuality(
				cycleOptionForward(
					state.effectsQuality,
					SETTINGS_OPTIONS.effectsQuality as string[]
				)
			);
			break;
		case 'master_volume':
			actions.setMasterVolume(
				cycleOptionForward(state.masterVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'music_volume':
			actions.setMusicVolume(
				cycleOptionForward(state.musicVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'sfx_volume':
			actions.setSfxVolume(
				cycleOptionForward(state.sfxVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'voice_volume':
			actions.setVoiceVolume(
				cycleOptionForward(state.voiceVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'audio_quality':
			actions.setAudioQuality(
				cycleOptionForward(state.audioQuality, SETTINGS_OPTIONS.audioQuality as string[])
			);
			break;
		case 'mouse_sensitivity':
			actions.setMouseSensitivity(
				cycleOptionForward(
					state.mouseSensitivity,
					SETTINGS_OPTIONS.mouseSensitivity as number[]
				)
			);
			break;
		case 'reverse_mouse':
			actions.setReverseMouse(!state.reverseMouse);
			break;
		case 'show_audio_player':
			actions.setShowAudioPlayer(!state.showAudioPlayer);
			break;
	}
};

// Decrement setting values
export const decrementSetting = (
	optionId: string,
	state: SettingsState,
	actions: SettingsActions
): void => {
	switch (optionId) {
		case 'anti_aliasing':
			actions.setAntiAliasing(
				cycleOptionBackward(state.antiAliasing, SETTINGS_OPTIONS.antiAliasing as string[])
			);
			break;
		case 'shadow_quality':
			actions.setShadowQuality(
				cycleOptionBackward(state.shadowQuality, SETTINGS_OPTIONS.shadowQuality as string[])
			);
			break;
		case 'texture_quality':
			actions.setTextureQuality(
				cycleOptionBackward(
					state.textureQuality,
					SETTINGS_OPTIONS.textureQuality as string[]
				)
			);
			break;
		case 'effects_quality':
			actions.setEffectsQuality(
				cycleOptionBackward(
					state.effectsQuality,
					SETTINGS_OPTIONS.effectsQuality as string[]
				)
			);
			break;
		case 'master_volume':
			actions.setMasterVolume(
				cycleOptionBackward(state.masterVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'music_volume':
			actions.setMusicVolume(
				cycleOptionBackward(state.musicVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'sfx_volume':
			actions.setSfxVolume(
				cycleOptionBackward(state.sfxVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'voice_volume':
			actions.setVoiceVolume(
				cycleOptionBackward(state.voiceVolume, SETTINGS_OPTIONS.volumeLevels as number[])
			);
			break;
		case 'audio_quality':
			actions.setAudioQuality(
				cycleOptionBackward(state.audioQuality, SETTINGS_OPTIONS.audioQuality as string[])
			);
			break;
		case 'mouse_sensitivity':
			actions.setMouseSensitivity(
				cycleOptionBackward(
					state.mouseSensitivity,
					SETTINGS_OPTIONS.mouseSensitivity as number[]
				)
			);
			break;
		case 'reverse_mouse':
			actions.setReverseMouse(!state.reverseMouse);
			break;
		case 'show_audio_player':
			actions.setShowAudioPlayer(!state.showAudioPlayer);
			break;
	}
};
