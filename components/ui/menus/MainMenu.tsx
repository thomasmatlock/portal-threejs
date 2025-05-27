// Main menu component - refactored for clarity and maintainability
import { useContext } from 'react';
import styles from './GameMenu.module.scss';
import AudioPlayer from '../audio/AudioPlayer';
import { portalSoundtracks } from '../../../utils/soundtrackHandlers';
import { GameMenuProps } from './GameMenu.props';
import UserContext from '@/context/userContext';

// Hooks and utilities
import { useMenuState } from './hooks/useMenuState';
import { useMenuNavigation } from './hooks/useMenuNavigation';
import { incrementSetting } from './utils/settingsHandlers';
import {
	getCurrentMenuOptions,
	getMenuOptionsWithoutBack,
	getBackButton,
} from './utils/menuHelpers';

// Components
import MenuHeader from './components/MenuHeader';
import MenuOptionsList from './components/MenuOptionsList';

const GameMenu: React.FC<GameMenuProps> = ({
	onStartGame,
	onSettings,
	onExit,
	onLoadGame = () => console.log('Load game...'),
	onContinueGame = () => console.log('Continue game...'),
}) => {
	const { mobile } = useContext(UserContext);

	// State management
	const {
		menuState,
		menuActions,
		settingsState,
		settingsActions,
		showComingSoonNotification,
		handleMusicVolumeChange,
	} = useMenuState();

	// Navigation and interactions
	const { containerRef, navigateToMenu, handleOptionClick, setHoveredMenuOption } =
		useMenuNavigation({
			menuActions,
			setSelectedOption: menuActions.setSelectedOption,
			setMenuVisible: menuActions.setMenuVisible,
		});

	// Settings increment handler
	const handleIncrementOption = (optionId: string) => {
		incrementSetting(optionId, settingsState, settingsActions);
	};

	// Handle volume changes from sliders to update AudioPlayer
	const handleSliderVolumeChange = (volume: number) => {
		// Find the audio element and update its volume directly
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			audioElement.volume = volume / 100; // Convert percentage to 0-1 range
		}
	};

	// Get current menu options
	const currentMenuOptions = getCurrentMenuOptions(menuState.currentMenu, settingsState, {
		onContinueGame,
		onStartGame,
		onLoadGame,
		showComingSoonNotification,
		incrementOption: handleIncrementOption,
		navigateToMenu,
	});

	// Split options and back button
	const menuOptionsWithoutBack = getMenuOptionsWithoutBack(currentMenuOptions);
	const backButton = getBackButton(currentMenuOptions);
	const isSubmenu = menuState.currentMenu !== 'main';

	return (
		<div
			ref={containerRef}
			className={`${styles.menuContainer} ${
				menuState.menuVisible ? styles.visible : styles.hidden
			}`}
		>
			<MenuHeader logoAnimated={menuState.logoAnimated} />

			{!mobile && (
				<div className={styles.menuWrapper}>
					<MenuOptionsList
						options={menuOptionsWithoutBack}
						selectedOption={menuState.selectedOption}
						menuTransitioning={menuState.menuTransitioning}
						isSubmenu={isSubmenu}
						settingsState={settingsState}
						settingsActions={settingsActions}
						onOptionClick={handleOptionClick}
						onOptionHover={setHoveredMenuOption}
						onVolumeChange={handleSliderVolumeChange}
					/>

					{backButton && (
						<div
							className={`${styles.backButton} ${
								isSubmenu ? styles.submenuBackground : ''
							}`}
							onClick={() => handleOptionClick(backButton)}
							onMouseEnter={() => setHoveredMenuOption(backButton.id)}
							onMouseLeave={() => setHoveredMenuOption(null)}
						>
							<span>{backButton.label}</span>
						</div>
					)}
				</div>
			)}

			{menuState.showComingSoon && (
				<div className={styles.notification}>{menuState.comingSoonMessage}</div>
			)}

			{settingsState.showAudioPlayer && (
				<AudioPlayer
					tracks={portalSoundtracks}
					initialVolume={settingsState.musicVolume}
					onVolumeChange={handleMusicVolumeChange}
					autoplay={true}
					randomizeTrack={true}
				/>
			)}
		</div>
	);
};

export default GameMenu;
