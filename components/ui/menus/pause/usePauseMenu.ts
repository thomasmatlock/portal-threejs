import { useState, useEffect } from 'react';
import { useBackgroundRotation } from '../../../../utils/backgroundUtils';
import { DEFAULT_MUSIC_VOLUME, MENU_ANIMATION_DELAY } from './pauseMenuConstants';

export const usePauseMenu = () => {
	const [selectedOption, setSelectedOption] = useState<string>('resume');
	const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(true);
	const [musicVolume, setMusicVolume] = useState<number>(DEFAULT_MUSIC_VOLUME);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const { currentBackground } = useBackgroundRotation();

	// Handle menu animation on mount
	useEffect(() => {
		setTimeout(() => {
			setIsVisible(true);
		}, MENU_ANIMATION_DELAY);
	}, []);

	const handleMusicVolumeChange = (volume: number) => {
		setMusicVolume(volume);
	};

	const toggleAudioPlayer = () => {
		setShowAudioPlayer(!showAudioPlayer);
	};

	return {
		selectedOption,
		setSelectedOption,
		showAudioPlayer,
		musicVolume,
		isVisible,
		currentBackground,
		handleMusicVolumeChange,
		toggleAudioPlayer,
	};
};
