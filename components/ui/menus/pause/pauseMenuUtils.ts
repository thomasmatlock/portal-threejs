import { PauseMenuProps } from '../GameMenu.props';

export interface MenuActions {
	onResume: () => void;
	onRestart: () => void;
	onSave: () => void;
	onLoad: () => void;
	onSettings: () => void;
	onExit: () => void;
	onToggleAudioPlayer: () => void;
}

// Handle menu option click actions
export const executeMenuAction = (optionId: string, actions: MenuActions): void => {
	const actionMap: Record<string, () => void> = {
		resume: actions.onResume,
		restart: actions.onRestart,
		save: actions.onSave,
		load: actions.onLoad,
		settings: actions.onSettings,
		exit: actions.onExit,
		toggle_audio_player: actions.onToggleAudioPlayer,
	};

	const action = actionMap[optionId];
	if (action) {
		action();
	}
};

// Create background style object
export const createBackgroundStyle = (backgroundUrl: string) => ({
	backgroundImage: `url(${backgroundUrl})`,
	backgroundSize: 'cover' as const,
	backgroundPosition: 'center center' as const,
	backgroundRepeat: 'no-repeat' as const,
});

// Create menu options with dynamic values
export const buildMenuOptions = (
	showAudioPlayer: boolean,
	baseOptions: Array<{ id: string; label: string }>
) => {
	return baseOptions.map((option) => ({
		...option,
		value: option.id === 'toggle_audio_player' ? (showAudioPlayer ? 'On' : 'Off') : undefined,
	}));
};
