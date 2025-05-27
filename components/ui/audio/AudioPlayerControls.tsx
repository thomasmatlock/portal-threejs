import React from 'react';
import styles from './AudioPlayerControls.module.scss';

interface AudioPlayerControlsProps {
	isPlaying: boolean;
	onPlayPause: () => void;
	onPrevTrack: () => void;
	onNextTrack: () => void;
}

const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
	isPlaying,
	onPlayPause,
	onPrevTrack,
	onNextTrack,
}) => {
	return (
		<div className={styles.mainControls}>
			<button className={styles.prevButton} onClick={onPrevTrack} aria-label="Previous track">
				⏮
			</button>

			<button
				className={styles.playPauseButton}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onPlayPause();
				}}
				aria-label={isPlaying ? 'Pause' : 'Play'}
			>
				{isPlaying ? '⏸' : '▶'}
			</button>

			<button className={styles.nextButton} onClick={onNextTrack} aria-label="Next track">
				⏭
			</button>
		</div>
	);
};

export default AudioPlayerControls;
