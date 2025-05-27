// Menu helper utilities
import { MenuOption, MenuId, buildMainMenuOptions, buildAudioMenuOptions } from './menuOptions';
import { SettingsState } from './settingsHandlers';

// Get menu options without back button
export const getMenuOptionsWithoutBack = (options: MenuOption[]): MenuOption[] => {
	return options.filter((option) => option.id !== 'back');
};

// Get back button from menu options
export const getBackButton = (options: MenuOption[]): MenuOption | null => {
	return options.find((option) => option.id === 'back') || null;
};

// Get current menu options based on menu state
export const getCurrentMenuOptions = (
	currentMenu: MenuId,
	settingsState: SettingsState,
	callbacks: {
		onContinueGame: () => void;
		onStartGame: () => void;
		onLoadGame: () => void;
		showComingSoonNotification: (message: string) => void;
		incrementOption: (optionId: string) => void;
		navigateToMenu: (menuId: MenuId) => void;
	}
): MenuOption[] => {
	const {
		onContinueGame,
		onStartGame,
		onLoadGame,
		showComingSoonNotification,
		incrementOption,
		navigateToMenu,
	} = callbacks;

	const mainMenuOptions = buildMainMenuOptions({
		onContinueGame,
		onStartGame,
		onLoadGame,
		showComingSoonNotification,
		incrementOption,
		...settingsState,
	});

	switch (currentMenu) {
		case 'singleplayer':
			return mainMenuOptions.find((option) => option.id === 'singleplayer')?.submenu || [];

		case 'extras':
			return mainMenuOptions.find((option) => option.id === 'extras')?.submenu || [];

		case 'options':
			return mainMenuOptions.find((option) => option.id === 'options')?.submenu || [];

		case 'video':
			return (
				mainMenuOptions
					.find((option) => option.id === 'options')
					?.submenu?.find((option) => option.id === 'video')?.submenu || []
			);

		case 'audio':
			return buildAudioMenuOptions({
				incrementOption,
				navigateToMenu,
				masterVolume: settingsState.masterVolume,
				musicVolume: settingsState.musicVolume,
				sfxVolume: settingsState.sfxVolume,
				showAudioPlayer: settingsState.showAudioPlayer,
			});

		case 'keyboard':
			return (
				mainMenuOptions
					.find((option) => option.id === 'options')
					?.submenu?.find((option) => option.id === 'keyboard')?.submenu || []
			);

		default:
			return mainMenuOptions;
	}
};
