// Settings type definitions for menu state and actions
// Separated for clarity and reusability

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
