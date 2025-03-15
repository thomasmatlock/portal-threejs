import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './AudioPlayer.module.scss';
import { AudioPlayerProps, Track } from './GameMenu.props';
import { getRandomSoundtrackIndex } from '../../utils/soundtrackData';
import InputContext from '../../context/inputContext';

const AudioPlayer: React.FC<AudioPlayerProps> = ({
	tracks,
	initialVolume = 50,
	autoplay = false,
	randomizeTrack = true,
	onVolumeChange,
}) => {
	// Use the shared InputContext instead of local state
	const { interacted, setInteracted } = useContext(InputContext);

	// Use a ref to track if we're on the client side
	const isClient = useRef(false);
	const audioContextRef = useRef<AudioContext | null>(null);
	const hasAttemptedAutoplayRef = useRef(false);
	const manuallyPausedRef = useRef(false);

	// Initialize with a fixed index (0) for server rendering
	// We'll randomize it on the client side after hydration
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(initialVolume);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [prevVolume, setPrevVolume] = useState(initialVolume);
	const [audioLoaded, setAudioLoaded] = useState(false);

	const lastVolumeRef = useRef(initialVolume);
	const isUserAdjustingRef = useRef(false);

	const audioRef = useRef<HTMLAudioElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);

	const currentTrack = tracks[currentTrackIndex];

	// Initialize audio context on mount
	useEffect(() => {
		// Create AudioContext only on client side
		if (typeof window !== 'undefined' && !audioContextRef.current) {
			try {
				const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
				if (AudioContext) {
					audioContextRef.current = new AudioContext();
				}
			} catch (error) {
				console.error('Failed to create AudioContext:', error);
			}
		}

		// Attempt autoplay on mount
		if (autoplay && !hasAttemptedAutoplayRef.current) {
			console.log('Attempting autoplay on component mount...');
			// We'll set this flag to true to avoid multiple attempts
			hasAttemptedAutoplayRef.current = true;

			// We need to wait a bit for the audio element to be ready
			setTimeout(() => {
				if (audioRef.current) {
					audioRef.current
						.play()
						.then(() => {
							console.log('Autoplay successful on mount');
							setIsPlaying(true);
						})
						.catch((error) => {
							console.log(
								'Autoplay prevented on mount, waiting for user interaction:',
								error
							);
							// We'll rely on user interaction to start playback
						});
				}
			}, 500);
		}

		return () => {
			// Clean up audio context on unmount
			if (audioContextRef.current) {
				try {
					// Only close if not already closed
					if (audioContextRef.current.state !== 'closed') {
						audioContextRef.current.close().catch(console.error);
					}
				} catch (error) {
					console.error('Error closing AudioContext:', error);
				}
			}
		};
	}, [autoplay]);

	// Set up randomization after hydration
	useEffect(() => {
		isClient.current = true;

		// Only randomize track on client-side after hydration
		if (randomizeTrack) {
			setCurrentTrackIndex(getRandomSoundtrackIndex());
		}
	}, [randomizeTrack]);

	// Initialize volume on mount and handle audio loading
	useEffect(() => {
		if (audioRef.current) {
			// Set initial volume
			audioRef.current.volume = initialVolume / 100;
			lastVolumeRef.current = initialVolume;

			// Add event listener for when audio is ready to play
			const handleCanPlay = () => {
				console.log('AUDIO CAN PLAY EVENT');
				setAudioLoaded(true);
				// Try autoplay if enabled and not manually paused
				if (autoplay && !hasAttemptedAutoplayRef.current && !manuallyPausedRef.current) {
					hasAttemptedAutoplayRef.current = true;
					handlePlayPause();
				}
			};

			audioRef.current.addEventListener('canplay', handleCanPlay);

			return () => {
				if (audioRef.current) {
					audioRef.current.removeEventListener('canplay', handleCanPlay);
				}
			};
		}
	}, [currentTrackIndex]);

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

	// Listen for user interaction via the InputContext
	useEffect(() => {
		// When interacted changes to true, try to play audio
		// BUT ONLY if not manually paused
		if (
			interacted &&
			autoplay &&
			audioRef.current &&
			audioLoaded &&
			!isPlaying &&
			!manuallyPausedRef.current
		) {
			console.log('User interacted (from context), attempting autoplay...');

			// Resume audio context if it was suspended
			if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
				audioContextRef.current.resume().catch(console.error);
			}

			audioRef.current
				.play()
				.then(() => {
					console.log('Autoplay successful after user interaction');
					setIsPlaying(true);
				})
				.catch((error) => {
					console.error('Autoplay prevented after user interaction:', error);
				});
		}
	}, [interacted, autoplay, audioLoaded, isPlaying]);

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
		// Mark as interacted
		if (!interacted) {
			setInteracted(true);
		}

		// Simple, direct approach
		if (!audioRef.current) {
			console.error('Audio element reference is null');
			return;
		}

		console.log('PLAY/PAUSE BUTTON CLICKED - Current state:', isPlaying ? 'PLAYING' : 'PAUSED');

		// DIRECT DOM MANIPULATION - no fancy stuff
		try {
			if (isPlaying) {
				// PAUSE
				console.log('ATTEMPTING TO PAUSE');
				audioRef.current.pause();
				console.log('PAUSE COMMAND SENT');
				// Set the manually paused flag to prevent autoplay from fighting with us
				manuallyPausedRef.current = true;
				// Force state update
				setIsPlaying(false);
			} else {
				// PLAY
				console.log('ATTEMPTING TO PLAY');
				// Clear the manually paused flag
				manuallyPausedRef.current = false;
				const playPromise = audioRef.current.play();

				if (playPromise !== undefined) {
					playPromise
						.then(() => {
							console.log('PLAY SUCCESSFUL');
							setIsPlaying(true);
						})
						.catch((error) => {
							console.error('PLAY FAILED:', error);
							setIsPlaying(false);
						});
				} else {
					console.log('PLAY COMMAND SENT (no promise)');
					// Force state update in case the event listener doesn't fire
					setIsPlaying(true);
				}
			}
		} catch (error) {
			console.error('ERROR IN PLAY/PAUSE:', error);
		}
	};

	const handlePrevTrack = (): void => {
		// Ensure we mark as interacted when navigation buttons are clicked
		if (!interacted) {
			setInteracted(true);
		}

		const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
		setCurrentTrackIndex(newIndex);
		setProgress(0);
		setAudioLoaded(false);

		// If currently playing, play the new track
		// If manually paused, keep the new track paused
		if (isPlaying && audioRef.current && !manuallyPausedRef.current) {
			// We need to wait for the new audio source to load
			setTimeout(() => {
				if (audioRef.current) {
					// Resume audio context if it was suspended
					if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
						audioContextRef.current.resume().catch(console.error);
					}

					audioRef.current
						.play()
						.then(() => {
							setIsPlaying(true);
						})
						.catch((error) => {
							console.error('Play prevented:', error);
							setIsPlaying(false);
						});
				}
			}, 100);
		} else {
			// Make sure we're paused if we were manually paused
			setIsPlaying(false);
		}
	};

	const handleNextTrack = (): void => {
		// Ensure we mark as interacted when navigation buttons are clicked
		if (!interacted) {
			setInteracted(true);
		}

		const newIndex = (currentTrackIndex + 1) % tracks.length;
		setCurrentTrackIndex(newIndex);
		setProgress(0);
		setAudioLoaded(false);

		// If currently playing, play the new track
		// If manually paused, keep the new track paused
		if (isPlaying && audioRef.current && !manuallyPausedRef.current) {
			// We need to wait for the new audio source to load
			setTimeout(() => {
				if (audioRef.current) {
					// Resume audio context if it was suspended
					if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
						audioContextRef.current.resume().catch(console.error);
					}

					audioRef.current
						.play()
						.then(() => {
							setIsPlaying(true);
						})
						.catch((error) => {
							console.error('Play prevented:', error);
							setIsPlaying(false);
						});
				}
			}, 100);
		} else {
			// Make sure we're paused if we were manually paused
			setIsPlaying(false);
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
		// Ensure we mark as interacted when progress bar is clicked
		if (!interacted) {
			setInteracted(true);
		}

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
		// Ensure we mark as interacted when volume is changed
		if (!interacted) {
			setInteracted(true);
		}

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
		console.log('Track ended, going to next track');
		// Clear the manually paused flag when a track ends naturally
		manuallyPausedRef.current = false;
		handleNextTrack();
	};

	useEffect(() => {
		const handleAudioUnlock = () => {
			if (audioRef.current && !isPlaying) {
				audioRef.current
					.play()
					.then(() => {
						setIsPlaying(true);
					})
					.catch((error) => {
						console.error('Failed to play audio:', error);
					});
			}
		};

		window.addEventListener('audioUnlocked', handleAudioUnlock);

		return () => {
			window.removeEventListener('audioUnlocked', handleAudioUnlock);
		};
	}, [isPlaying]);

	return (
		<div className={styles.audioPlayer}>
			<audio
				ref={audioRef}
				src={`${currentTrack.assetsURL}/${currentTrack.file}`}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleTrackEnded}
				onLoadedMetadata={handleTimeUpdate}
				onPlay={() => {
					console.log('AUDIO ELEMENT PLAY EVENT');
					setIsPlaying(true);
				}}
				onPause={() => {
					console.log('AUDIO ELEMENT PAUSE EVENT');
					setIsPlaying(false);
				}}
				onError={(e) => console.error('AUDIO ERROR:', e)}
				preload="auto"
				crossOrigin="anonymous"
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
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							console.log('DIRECT PLAY/PAUSE BUTTON CLICK');
							handlePlayPause();
						}}
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
