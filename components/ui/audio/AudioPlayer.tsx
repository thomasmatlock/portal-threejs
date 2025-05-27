import React from 'react';
import styles from './AudioPlayer.module.scss';
import { AudioPlayerProps } from '../GameMenu.props';
import { useAudioPlayer } from './useAudioPlayer';
import AudioPlayerControls from './AudioPlayerControls';
import AudioPlayerProgress from './AudioPlayerProgress';
import AudioPlayerVolume from './AudioPlayerVolume';

const AudioPlayer: React.FC<AudioPlayerProps> = ({
	tracks,
	initialVolume = 50,
	autoplay = false,
	randomizeTrack = true,
	onVolumeChange,
}) => {
	const {
		currentTrack,
		isPlaying,
		volume,
		progress,
		duration,
		audioRef,
		handlePlayPause,
		handlePrevTrack,
		handleNextTrack,
		handleTimeUpdate,
		handleProgressClick,
		handleVolumeChange,
		handleTrackEnded,
		onPlay,
		onPause,
		onCanPlay,
	} = useAudioPlayer({
		tracks,
		initialVolume,
		autoplay,
		randomizeTrack,
		onVolumeChange,
	});

	return (
		<div className={styles.audioPlayer}>
			<audio
				ref={audioRef}
				src={`${currentTrack.assetsURL}/${currentTrack.file}`}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleTrackEnded}
				onLoadedMetadata={handleTimeUpdate}
				onPlay={onPlay}
				onPause={onPause}
				onCanPlay={onCanPlay}
				onError={(e) => console.error('Audio error:', e)}
				preload="auto"
				crossOrigin="anonymous"
			/>

			<div className={styles.playerControls}>
				<AudioPlayerControls
					isPlaying={isPlaying}
					onPlayPause={handlePlayPause}
					onPrevTrack={handlePrevTrack}
					onNextTrack={handleNextTrack}
				/>

				<AudioPlayerProgress
					currentTrack={currentTrack}
					progress={progress}
					duration={duration}
					onProgressClick={handleProgressClick}
				/>

				<AudioPlayerVolume volume={volume} onVolumeChange={handleVolumeChange} />
			</div>
		</div>
	);
};

export default AudioPlayer;
