import React from 'react';
import styles from './AudioPlayer.module.scss';

interface AudioPlayerVolumeProps {
	volume: number;
	onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AudioPlayerVolume: React.FC<AudioPlayerVolumeProps> = ({ volume, onVolumeChange }) => {
	return (
		<div className={styles.volumeControls}>
			<input
				type="range"
				min="0"
				max="100"
				value={volume}
				onChange={onVolumeChange}
				className={styles.volumeSlider}
				aria-label="Volume"
			/>
		</div>
	);
};

export default AudioPlayerVolume;
