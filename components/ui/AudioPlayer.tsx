import React, { useState, useEffect, useRef } from 'react';
import styles from './AudioPlayer.module.scss';
import { AudioPlayerProps, Track } from './GameMenu.props';
import { getRandomSoundtrackIndex } from '../../utils/soundtrackData';

const AudioPlayer: React.FC<AudioPlayerProps> = ({
	tracks,
	initialVolume = 50,
	autoplay = false,
	randomizeTrack = true,
	onVolumeChange,
}) => {
	// Use a ref to track if we're on the client side
	const isClient = useRef(false);

	// Initialize with a fixed index (0) for server rendering
	// We'll randomize it on the client side after hydration
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(initialVolume);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [prevVolume, setPrevVolume] = useState(initialVolume);
	const [userInteracted, setUserInteracted] = useState(false);

	const lastVolumeRef = useRef(initialVolume);
	const isUserAdjustingRef = useRef(false);

	const audioRef = useRef<HTMLAudioElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);

	const currentTrack = tracks[currentTrackIndex];

	// Set up randomization after hydration
	useEffect(() => {
		isClient.current = true;

		// Only randomize track on client-side after hydration
		if (randomizeTrack) {
			setCurrentTrackIndex(getRandomSoundtrackIndex());
		}
	}, [randomizeTrack]);

	// Initialize volume on mount
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = initialVolume / 100;
			lastVolumeRef.current = initialVolume;
		}
	}, []);

	// Handle initialVolume prop changes
	useEffect(() => {
		// Only update if the change didn't come from the slider
		if (!isUserAdjustingRef.current && initialVolume !== lastVolumeRef.current) {
			setVolume(initialVolume);
			if (audioRef.current) {
				audioRef.current.volume = initialVolume / 100;
			}
			lastVolumeRef.current = initialVolume;
		}
	}, [initialVolume]);

	// Listen for user interaction with the page
	useEffect(() => {
		const handleUserInteraction = () => {
			if (!userInteracted) {
				setUserInteracted(true);
				if (autoplay && audioRef.current) {
					audioRef.current.play().catch((error) => {
						console.error('Autoplay prevented:', error);
					});
					setIsPlaying(true);
				}
			}
		};

		// Add event listeners for common user interactions
		window.addEventListener('click', handleUserInteraction);
		window.addEventListener('keydown', handleUserInteraction);
		window.addEventListener('touchstart', handleUserInteraction);
		window.addEventListener('scroll', handleUserInteraction);

		return () => {
			// Clean up event listeners
			window.removeEventListener('click', handleUserInteraction);
			window.removeEventListener('keydown', handleUserInteraction);
			window.removeEventListener('touchstart', handleUserInteraction);
			window.removeEventListener('scroll', handleUserInteraction);
		};
	}, [userInteracted, autoplay]);

	useEffect(() => {
		// Handle autoplay after user interaction
		if (userInteracted && autoplay && audioRef.current && !isPlaying) {
			audioRef.current.play().catch((error) => {
				console.error('Autoplay prevented:', error);
			});
			setIsPlaying(true);
		}
	}, [userInteracted, autoplay, isPlaying]);

	// Update audio element when volume state changes
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [volume]);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	const handlePlayPause = (): void => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play().catch((error) => {
					console.error('Play prevented:', error);
				});
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handlePrevTrack = (): void => {
		const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
		setCurrentTrackIndex(newIndex);
		setProgress(0);

		// If currently playing, play the new track
		if (isPlaying && audioRef.current) {
			// We need to wait for the new audio source to load
			setTimeout(() => {
				audioRef.current?.play().catch((error) => {
					console.error('Play prevented:', error);
					setIsPlaying(false);
				});
			}, 100);
		}
	};

	const handleNextTrack = (): void => {
		const newIndex = (currentTrackIndex + 1) % tracks.length;
		setCurrentTrackIndex(newIndex);
		setProgress(0);

		// If currently playing, play the new track
		if (isPlaying && audioRef.current) {
			// We need to wait for the new audio source to load
			setTimeout(() => {
				audioRef.current?.play().catch((error) => {
					console.error('Play prevented:', error);
					setIsPlaying(false);
				});
			}, 100);
		}
	};

	const handleTimeUpdate = (): void => {
		if (audioRef.current) {
			const currentTime = audioRef.current.currentTime;
			const duration = audioRef.current.duration;
			setProgress(currentTime);
			setDuration(duration);
		}
	};

	const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (progressBarRef.current && audioRef.current) {
			const rect = progressBarRef.current.getBoundingClientRect();
			const clickPosition = e.clientX - rect.left;
			const percentClicked = clickPosition / rect.width;
			const newTime = percentClicked * audioRef.current.duration;

			audioRef.current.currentTime = newTime;
			setProgress(newTime);
		}
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		isUserAdjustingRef.current = true;
		const newVolume = parseInt(e.target.value, 10);

		// Update internal state
		setVolume(newVolume);
		setIsMuted(newVolume === 0);
		lastVolumeRef.current = newVolume;

		// Store previous volume when muting with slider
		if (newVolume === 0 && volume > 0) {
			setPrevVolume(volume);
		}

		// Restore from muted state when moving slider from zero
		if (newVolume > 0 && volume === 0) {
			setIsMuted(false);
		}

		// Notify parent component
		if (onVolumeChange) {
			onVolumeChange(newVolume);
		}

		// Reset the flag after a short delay
		setTimeout(() => {
			isUserAdjustingRef.current = false;
		}, 100);
	};

	const handleTrackEnded = (): void => {
		handleNextTrack();
	};

	return (
		<div className={styles.audioPlayer}>
			<audio
				ref={audioRef}
				src={`/audio/music/${currentTrack.file}`}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleTrackEnded}
				onLoadedMetadata={handleTimeUpdate}
			/>

			<div className={styles.playerControls}>
				<div className={styles.mainControls}>
					<button
						className={styles.prevButton}
						onClick={handlePrevTrack}
						aria-label="Previous track"
					>
						⏮
					</button>

					<button
						className={styles.playPauseButton}
						onClick={handlePlayPause}
						aria-label={isPlaying ? 'Pause' : 'Play'}
					>
						{isPlaying ? '⏸' : '▶'}
					</button>

					<button
						className={styles.nextButton}
						onClick={handleNextTrack}
						aria-label="Next track"
					>
						⏭
					</button>
				</div>

				<div className={styles.trackInfo}>
					<div
						className={`${styles.trackTitle} ${
							currentTrack.title.length > 18 ? styles.longTitle : ''
						}`}
					>
						<span className={styles.marqueeText}>{currentTrack.title}</span>
					</div>

					<div className={styles.progressContainer}>
						<div
							className={styles.progressBar}
							ref={progressBarRef}
							onClick={handleProgressBarClick}
						>
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

				<div className={styles.volumeControls}>
					<input
						type="range"
						min="0"
						max="100"
						value={volume}
						onChange={handleVolumeChange}
						className={styles.volumeSlider}
						aria-label="Volume"
					/>
				</div>
			</div>
		</div>
	);
};

export default AudioPlayer;
