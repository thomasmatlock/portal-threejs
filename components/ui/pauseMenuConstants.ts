export interface PauseMenuOption {
	id: string;
	label: string;
	value?: string;
}

export const pauseMenuOptionData = [
	{ id: 'resume', label: 'Resume Game' },
	{ id: 'restart', label: 'Restart Level' },
	{ id: 'save', label: 'Save Game' },
	{ id: 'load', label: 'Load Game' },
	{ id: 'settings', label: 'Settings' },
	{ id: 'toggle_audio_player', label: 'Audio Player' },
	{ id: 'exit', label: 'Exit to Main Menu' },
];

export const DEFAULT_MUSIC_VOLUME = 80;
export const MENU_ANIMATION_DELAY = 50;
