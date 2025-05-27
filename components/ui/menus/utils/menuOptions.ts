// Menu option type definition and data configurations
export type MenuOption = {
	id: string;
	label: string;
	action?: () => void;
	submenu?: MenuOption[];
	disabled?: boolean;
	value?: string | number | boolean;
	options?: (string | number | boolean)[];
};

export type MenuId =
	| 'main'
	| 'singleplayer'
	| 'multiplayer'
	| 'extras'
	| 'options'
	| 'video'
	| 'audio'
	| 'keyboard';

// Settings options configurations
export const SETTINGS_OPTIONS = {
	antiAliasing: ['Off', 'On'] as (string | number | boolean)[],
	shadowQuality: ['Off', 'Low', 'Medium', 'High'] as (string | number | boolean)[],
	textureQuality: ['Low', 'Medium', 'High'] as (string | number | boolean)[],
	effectsQuality: ['Low', 'Medium', 'High'] as (string | number | boolean)[],
	audioQuality: ['Low', 'Medium', 'High'] as (string | number | boolean)[],
	volumeLevels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as (string | number | boolean)[],
	mouseSensitivity: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as (string | number | boolean)[],
};

// Build main menu options with callbacks
export const buildMainMenuOptions = (callbacks: {
	onContinueGame: () => void;
	onStartGame: () => void;
	onLoadGame: () => void;
	showComingSoonNotification: (message: string) => void;
	incrementOption: (optionId: string) => void;
	antiAliasing: string;
	shadowQuality: string;
	textureQuality: string;
	effectsQuality: string;
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	mouseSensitivity: number;
	reverseMouse: boolean;
}): MenuOption[] => {
	const {
		onContinueGame,
		onStartGame,
		onLoadGame,
		showComingSoonNotification,
		incrementOption,
		antiAliasing,
		shadowQuality,
		textureQuality,
		effectsQuality,
		masterVolume,
		musicVolume,
		sfxVolume,
		mouseSensitivity,
		reverseMouse,
	} = callbacks;

	return [
		{
			id: 'singleplayer',
			label: 'SINGLE PLAYER',
			submenu: [
				{ id: 'continue', label: 'CONTINUE GAME', action: onContinueGame, disabled: true },
				{ id: 'newgame', label: 'NEW GAME', action: onStartGame, disabled: true },
				{ id: 'loadgame', label: 'LOAD GAME', action: onLoadGame, disabled: true },
				{ id: 'back', label: 'BACK' },
			],
		},
		{
			id: 'multiplayer',
			label: 'MULTIPLAYER',
			disabled: true,
			action: () => showComingSoonNotification('Multiplayer mode coming soon!'),
		},
		{
			id: 'options',
			label: 'OPTIONS',
			submenu: [
				{
					id: 'audio',
					label: 'AUDIO',
					submenu: [
						{
							id: 'master_volume',
							label: 'MASTER VOLUME',
							value: masterVolume,
							options: SETTINGS_OPTIONS.volumeLevels,
							action: () => incrementOption('master_volume'),
						},
						{
							id: 'music_volume',
							label: 'MUSIC VOLUME',
							value: musicVolume,
							options: SETTINGS_OPTIONS.volumeLevels,
							action: () => incrementOption('music_volume'),
						},
						{
							id: 'sfx_volume',
							label: 'SOUND EFFECTS',
							value: sfxVolume,
							options: SETTINGS_OPTIONS.volumeLevels,
							action: () => incrementOption('sfx_volume'),
						},
						{ id: 'back', label: 'BACK' },
					],
				},
				{
					id: 'video',
					label: 'VIDEO',
					submenu: [
						{
							id: 'anti_aliasing',
							label: 'ANTI-ALIASING',
							value: antiAliasing,
							options: SETTINGS_OPTIONS.antiAliasing,
							action: () => incrementOption('anti_aliasing'),
						},
						{
							id: 'shadow_quality',
							label: 'SHADOW QUALITY',
							value: shadowQuality,
							options: SETTINGS_OPTIONS.shadowQuality,
							action: () => incrementOption('shadow_quality'),
						},
						{
							id: 'texture_quality',
							label: 'TEXTURE QUALITY',
							value: textureQuality,
							options: SETTINGS_OPTIONS.textureQuality,
							action: () => incrementOption('texture_quality'),
						},
						{
							id: 'effects_quality',
							label: 'EFFECTS QUALITY',
							value: effectsQuality,
							options: SETTINGS_OPTIONS.effectsQuality,
							action: () => incrementOption('effects_quality'),
						},
						{ id: 'back', label: 'BACK' },
					],
				},
				{
					id: 'keyboard',
					label: 'KEYBOARD & MOUSE',
					submenu: [
						{
							id: 'mouse_sensitivity',
							label: 'MOUSE SENSITIVITY',
							value: mouseSensitivity,
							options: SETTINGS_OPTIONS.mouseSensitivity,
							action: () => incrementOption('mouse_sensitivity'),
						},
						{
							id: 'reverse_mouse',
							label: 'REVERSE MOUSE',
							value: reverseMouse ? 'ON' : 'OFF',
							options: [false, true],
							action: () => incrementOption('reverse_mouse'),
						},
						{ id: 'back', label: 'BACK' },
					],
				},
				{
					id: 'controller',
					label: 'CONTROLLER',
					disabled: true,
					action: () => showComingSoonNotification('Controller options coming soon!'),
				},
				{ id: 'back', label: 'BACK' },
			],
		},
	];
};

// Get audio menu options
export const buildAudioMenuOptions = (callbacks: {
	incrementOption: (optionId: string) => void;
	navigateToMenu: (menuId: MenuId) => void;
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	showAudioPlayer: boolean;
}): MenuOption[] => {
	const {
		incrementOption,
		navigateToMenu,
		masterVolume,
		musicVolume,
		sfxVolume,
		showAudioPlayer,
	} = callbacks;

	return [
		{
			id: 'master_volume',
			label: 'MASTER VOLUME',
			value: masterVolume,
			options: SETTINGS_OPTIONS.volumeLevels,
			action: () => incrementOption('master_volume'),
		},
		{
			id: 'music_volume',
			label: 'MUSIC VOLUME',
			value: musicVolume,
			options: SETTINGS_OPTIONS.volumeLevels,
			action: () => incrementOption('music_volume'),
		},
		{
			id: 'sfx_volume',
			label: 'SFX VOLUME',
			value: sfxVolume,
			options: SETTINGS_OPTIONS.volumeLevels,
			action: () => incrementOption('sfx_volume'),
		},
		{
			id: 'show_audio_player',
			label: 'AUDIO PLAYER',
			value: showAudioPlayer ? 'On' : 'Off',
			action: () => incrementOption('show_audio_player'),
		},
		{
			id: 'back',
			label: 'Back',
			action: () => navigateToMenu('options'),
		},
	];
};

// Default selected options for each menu
export const DEFAULT_SELECTED_OPTIONS: Record<MenuId, string> = {
	main: 'singleplayer',
	singleplayer: 'continue',
	multiplayer: '',
	extras: 'developer',
	options: 'audio',
	video: 'anti_aliasing',
	audio: 'master_volume',
	keyboard: 'mouse_sensitivity',
};
