import React from 'react';
import styles from './PauseMenu.module.scss';
import AudioPlayer from './audio/AudioPlayer';
import { portalSoundtracks } from '../../utils/soundtrackHandlers';
import { PauseMenuProps } from './GameMenu.props';
import { usePauseMenu } from './usePauseMenu';
import { pauseMenuOptionData } from './pauseMenuConstants';
import {
	executeMenuAction,
	createBackgroundStyle,
	buildMenuOptions,
	type MenuActions,
} from './pauseMenuUtils';

const PauseMenu: React.FC<PauseMenuProps> = ({
	onResume,
	onSettings,
	onExit,
	onRestart = () => console.log('Restart level...'),
	onSave = () => console.log('Save game...'),
	onLoad = () => console.log('Load game...'),
}) => {
	const {
		selectedOption,
		setSelectedOption,
		showAudioPlayer,
		musicVolume,
		isVisible,
		currentBackground,
		handleMusicVolumeChange,
		toggleAudioPlayer,
	} = usePauseMenu();

	const handleOptionClick = (optionId: string) => {
		setSelectedOption(optionId);

		const actions: MenuActions = {
			onResume,
			onRestart,
			onSave,
			onLoad,
			onSettings,
			onExit,
			onToggleAudioPlayer: toggleAudioPlayer,
		};

		executeMenuAction(optionId, actions);
	};

	const menuOptions = buildMenuOptions(showAudioPlayer, pauseMenuOptionData);
	const backgroundStyle = createBackgroundStyle(currentBackground);

	return (
		<div
			className={`${styles.pauseMenuOverlay} ${isVisible ? styles.visible : ''}`}
			style={backgroundStyle}
		>
			<div className={styles.pauseMenuContainer}>
				<h2 className={styles.pauseTitle}>Game Paused</h2>

				<div className={styles.menuOptions}>
					{menuOptions.map((option) => (
						<div
							key={option.id}
							className={`${styles.menuOption} ${
								selectedOption === option.id ? styles.selected : ''
							}`}
							onClick={() => handleOptionClick(option.id)}
						>
							<span>{option.label}</span>
							{option.value !== undefined && (
								<div className={styles.optionValue}>{option.value}</div>
							)}
						</div>
					))}
				</div>

				<div className={styles.pauseHint}>
					<span>Press ESC to resume</span>
				</div>
			</div>

			{showAudioPlayer && (
				<AudioPlayer
					tracks={portalSoundtracks}
					initialVolume={musicVolume}
					onVolumeChange={handleMusicVolumeChange}
					autoplay={true}
					randomizeTrack={true}
				/>
			)}
		</div>
	);
};

export default PauseMenu;
