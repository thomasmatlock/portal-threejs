// Settings controls component for option values
import { MenuOption } from '../utils/menuOptions';
import {
	SettingsState,
	SettingsActions,
	incrementSetting,
	decrementSetting,
} from '../utils/settingsHandlers';
import styles from '../GameMenu.module.scss';

interface SettingsControlsProps {
	option: MenuOption;
	settingsState: SettingsState;
	settingsActions: SettingsActions;
	onVolumeChange?: (volume: number) => void;
}

const SettingsControls: React.FC<SettingsControlsProps> = ({
	option,
	settingsState,
	settingsActions,
	onVolumeChange,
}) => {
	if (option.value === undefined) return null;

	const handleLeftArrowClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		decrementSetting(option.id, settingsState, settingsActions);
	};

	const handleRightArrowClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		incrementSetting(option.id, settingsState, settingsActions);
	};

	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const newValue = parseInt(e.target.value, 10);

		// Update the appropriate state based on the option ID
		switch (option.id) {
			case 'master_volume':
				settingsActions.setMasterVolume(newValue);
				break;
			case 'music_volume':
				settingsActions.setMusicVolume(newValue);
				// Notify AudioPlayer of music volume change
				if (onVolumeChange) {
					onVolumeChange(newValue);
				}
				break;
			case 'sfx_volume':
				settingsActions.setSfxVolume(newValue);
				break;
			case 'voice_volume':
				settingsActions.setVoiceVolume(newValue);
				break;
			case 'mouse_sensitivity':
				settingsActions.setMouseSensitivity(newValue);
				break;
		}
	};

	// Check if this is a slider option (numeric with specific IDs)
	const isSliderOption =
		typeof option.value === 'number' &&
		[
			'master_volume',
			'music_volume',
			'sfx_volume',
			'voice_volume',
			'mouse_sensitivity',
		].includes(option.id);

	if (isSliderOption) {
		// For mouse sensitivity, use different range and step
		const min = option.id === 'mouse_sensitivity' ? 1 : 0;
		const max = option.id === 'mouse_sensitivity' ? 10 : 100;
		const step = option.id === 'mouse_sensitivity' ? 1 : 10;

		return (
			<div className={styles.sliderOptionValue} onClick={(e) => e.stopPropagation()}>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={option.value as number}
					onChange={handleSliderChange}
					className={styles.volumeSlider}
					aria-label={`${option.label} slider`}
				/>
			</div>
		);
	}

	// For non-slider options, use arrow controls
	return (
		<div className={styles.optionValue}>
			<span className={styles.leftArrow} onClick={handleLeftArrowClick}>
				◀
			</span>
			<span>{option.value}</span>
			<span className={styles.rightArrow} onClick={handleRightArrowClick}>
				▶
			</span>
		</div>
	);
};

export default SettingsControls;
