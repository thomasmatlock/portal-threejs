import React, { useState, useEffect } from 'react';
import styles from './PauseMenu.module.scss';
import AudioPlayer from './audio/AudioPlayer';
import { portalSoundtracks } from '../../utils/soundtrackHandlers';
import { PauseMenuProps } from './GameMenu.props';
import { useBackgroundRotation } from '../../utils/backgroundUtils';

const PauseMenu: React.FC<PauseMenuProps> = ({
	onResume,
	onSettings,
	onExit,
	onRestart = () => console.log('Restart level...'),
	onSave = () => console.log('Save game...'),
	onLoad = () => console.log('Load game...'),
}) => {
	const [selectedOption, setSelectedOption] = useState<string>('resume');
	const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(true);
	const [musicVolume, setMusicVolume] = useState<number>(80);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const { currentBackground } = useBackgroundRotation();

	useEffect(() => {
		// Animate the menu in when it mounts
		setTimeout(() => {
			setIsVisible(true);
		}, 50);
	}, []);

	const handleOptionClick = (optionId: string) => {
		setSelectedOption(optionId);

		switch (optionId) {
			case 'resume':
				onResume();
				break;
			case 'restart':
				onRestart();
				break;
			case 'save':
				onSave();
				break;
			case 'load':
				onLoad();
				break;
			case 'settings':
				onSettings();
				break;
			case 'exit':
				onExit();
				break;
			case 'toggle_audio_player':
				setShowAudioPlayer(!showAudioPlayer);
				break;
		}
	};

	const handleMusicVolumeChange = (volume: number) => {
		setMusicVolume(volume);
	};

	const menuOptions = [
		{ id: 'resume', label: 'Resume Game' },
		{ id: 'restart', label: 'Restart Level' },
		{ id: 'save', label: 'Save Game' },
		{ id: 'load', label: 'Load Game' },
		{ id: 'settings', label: 'Settings' },
		{ id: 'toggle_audio_player', label: 'Audio Player', value: showAudioPlayer ? 'On' : 'Off' },
		{ id: 'exit', label: 'Exit to Main Menu' },
	];

	return (
		<div
			className={`${styles.pauseMenuOverlay} ${isVisible ? styles.visible : ''}`}
			style={{
				backgroundImage: `url(${currentBackground})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
				backgroundRepeat: 'no-repeat',
			}}
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
