// Global audio volume context for managing volume and audio settings
import { createContext, useState, useContext, ReactNode } from 'react';

interface AudioVolumeContextType {
	// Volume settings
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	voiceVolume: number;

	// Audio player state
	showAudioPlayer: boolean;

	// Volume setters
	setMasterVolume: (volume: number) => void;
	setMusicVolume: (volume: number) => void;
	setSfxVolume: (volume: number) => void;
	setVoiceVolume: (volume: number) => void;
	setShowAudioPlayer: (show: boolean) => void;

	// Utility functions
	updateAudioPlayerVolume: (volume: number) => void;
}

const AudioVolumeContext = createContext<AudioVolumeContextType>({
	masterVolume: 100,
	musicVolume: 10,
	sfxVolume: 100,
	voiceVolume: 100,
	showAudioPlayer: true,
	setMasterVolume: () => {},
	setMusicVolume: () => {},
	setSfxVolume: () => {},
	setVoiceVolume: () => {},
	setShowAudioPlayer: () => {},
	updateAudioPlayerVolume: () => {},
});

interface AudioVolumeContextProviderProps {
	children: ReactNode;
}

export function AudioVolumeContextProvider({ children }: AudioVolumeContextProviderProps) {
	const [masterVolume, setMasterVolume] = useState(100);
	const [musicVolume, setMusicVolume] = useState(10);
	const [sfxVolume, setSfxVolume] = useState(100);
	const [voiceVolume, setVoiceVolume] = useState(100);
	const [showAudioPlayer, setShowAudioPlayer] = useState(true);

	// Function to update audio player volume directly
	const updateAudioPlayerVolume = (volume: number) => {
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			audioElement.volume = volume / 100;
		}
	};

	// Enhanced music volume setter that also updates the audio player
	const handleSetMusicVolume = (volume: number) => {
		setMusicVolume(volume);
		updateAudioPlayerVolume(volume);
	};

	const value: AudioVolumeContextType = {
		masterVolume,
		musicVolume,
		sfxVolume,
		voiceVolume,
		showAudioPlayer,
		setMasterVolume,
		setMusicVolume: handleSetMusicVolume,
		setSfxVolume,
		setVoiceVolume,
		setShowAudioPlayer,
		updateAudioPlayerVolume,
	};

	return <AudioVolumeContext.Provider value={value}>{children}</AudioVolumeContext.Provider>;
}

// Custom hook for using audio volume context
export const useAudioVolumeContext = () => {
	const context = useContext(AudioVolumeContext);
	if (!context) {
		throw new Error('useAudioVolumeContext must be used within an AudioVolumeContextProvider');
	}
	return context;
};

export default AudioVolumeContext;
