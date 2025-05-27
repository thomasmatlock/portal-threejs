import React, { useRef } from 'react';
import styles from './AudioPlayerProgress.module.scss';
import { Track } from '../menus/GameMenu.props';

interface AudioPlayerProgressProps {
	currentTrack: Track;
	progress: number;
	duration: number;
	onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const AudioPlayerProgress: React.FC<AudioPlayerProgressProps> = ({
	currentTrack,
	progress,
	duration,
	onProgressClick,
}) => {
	const progressBarRef = useRef<HTMLDivElement>(null);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	return (
		<div className={styles.trackInfo}>
			<div
				className={`${styles.trackTitle} ${
					currentTrack.title.length > 18 ? styles.longTitle : ''
				}`}
			>
				<span className={styles.marqueeText}>{currentTrack.title}</span>
			</div>

			<div className={styles.progressContainer}>
				<div className={styles.progressBar} ref={progressBarRef} onClick={onProgressClick}>
					<div
						className={styles.progressFill}
						style={{ width: `${(progress / duration) * 100}%` }}
					/>
				</div>

				<div className={styles.timeInfo}>
					<span>{formatTime(progress)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>
		</div>
	);
};

export default AudioPlayerProgress;
