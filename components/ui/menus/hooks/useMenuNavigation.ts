// Menu navigation logic hook
import { useEffect, useRef } from 'react';
import { MenuId, MenuOption, DEFAULT_SELECTED_OPTIONS } from '../utils/menuOptions';
import { MenuActions } from './useMenuState';
import { useUIContext } from '../../../../context/uiContext';

interface NavigationCallbacks {
	menuActions: MenuActions;
	setSelectedOption: (option: string) => void;
	setMenuVisible: (visible: boolean) => void;
}

export const useMenuNavigation = (callbacks: NavigationCallbacks) => {
	const { menuActions, setSelectedOption, setMenuVisible } = callbacks;
	const containerRef = useRef<HTMLDivElement>(null);

	// Get UI context
	const {
		setCurrentMenu: updateUIMenu,
		setHoveredMenuOption,
		setSelectedMenuOption,
	} = useUIContext();

	// Setup parallax effect
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const offsetX = (e.clientX - centerX) / (rect.width / 2);
			const offsetY = (e.clientY - centerY) / (rect.height / 2);

			menuActions.setParallaxOffset({
				x: offsetX * -10,
				y: offsetY * -10,
			});
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, [menuActions]);

	// Setup audio unlock effect
	useEffect(() => {
		const handleAudioUnlock = () => {
			const audioElement = document.querySelector('audio');
			if (audioElement && audioElement.paused) {
				audioElement.play().catch((error) => {
					console.error('Failed to play audio:', error);
				});
			}
		};

		window.addEventListener('audioUnlocked', handleAudioUnlock);
		return () => {
			window.removeEventListener('audioUnlocked', handleAudioUnlock);
		};
	}, []);

	// Navigate to menu with transition
	const navigateToMenu = (menuId: MenuId) => {
		menuActions.setMenuTransitioning(true);

		setTimeout(() => {
			menuActions.setCurrentMenu(menuId);
			menuActions.setMenuTransitioning(false);

			// Set default selected option for the menu
			const defaultOption = DEFAULT_SELECTED_OPTIONS[menuId];
			if (defaultOption) {
				setSelectedOption(defaultOption);
			}

			// Update UI context
			updateUIMenu(menuId);
		}, 200);
	};

	// Handle option click with navigation logic
	const handleOptionClick = (option: MenuOption) => {
		if (option.disabled) {
			if (option.action) {
				option.action();
			}
			return;
		}

		setSelectedOption(option.id);

		// Handle back button
		if (option.id === 'back') {
			const currentMenu = menuActions.setCurrentMenu;
			// If we're in a sub-submenu, go back to the parent submenu
			if (['video', 'audio', 'keyboard'].includes(option.id)) {
				navigateToMenu('options');
			} else {
				// Otherwise go back to main menu
				navigateToMenu('main');
			}
			return;
		}

		if (option.submenu) {
			// Navigate to submenu
			const menuMap: Record<string, MenuId> = {
				singleplayer: 'singleplayer',
				extras: 'extras',
				options: 'options',
				video: 'video',
				audio: 'audio',
				keyboard: 'keyboard',
			};

			const targetMenu = menuMap[option.id];
			if (targetMenu) {
				navigateToMenu(targetMenu);
			}
		} else if (option.action) {
			// If the option has a value (it's a setting), just call the action
			if (option.value !== undefined) {
				option.action();
				return;
			}

			// Otherwise, it's a menu action (like starting the game)
			setTimeout(() => {
				setMenuVisible(false);
				setTimeout(() => {
					option.action?.();
				}, 300);
			}, 100);
		}

		// Update UI context
		setSelectedMenuOption(option.id);
	};

	return {
		containerRef,
		navigateToMenu,
		handleOptionClick,
		setHoveredMenuOption,
	};
};
