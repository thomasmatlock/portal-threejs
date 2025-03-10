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
	const audioContextRef = useRef<AudioContext | null>(null);
	const hasAttemptedAutoplayRef = useRef(false);

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
				audioContextRef.current.close().catch(console.error);
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
				setAudioLoaded(true);
				// Try autoplay if enabled
				if (autoplay && !hasAttemptedAutoplayRef.current) {
					hasAttemptedAutoplayRef.current = true;
					handlePlayPause();
				}
			};

			// Add event listeners for play and pause events to ensure state is synchronized
			const handlePlay = () => {
				console.log('Audio play event fired');
				setIsPlaying(true);
			};

			const handlePause = () => {
				console.log('Audio pause event fired');
				setIsPlaying(false);
			};

			audioRef.current.addEventListener('canplay', handleCanPlay);
			audioRef.current.addEventListener('play', handlePlay);
			audioRef.current.addEventListener('pause', handlePause);

			return () => {
				if (audioRef.current) {
					audioRef.current.removeEventListener('canplay', handleCanPlay);
					audioRef.current.removeEventListener('play', handlePlay);
					audioRef.current.removeEventListener('pause', handlePause);
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

	// Listen for user interaction with the page
	useEffect(() => {
		const handleUserInteraction = () => {
			if (!userInteracted) {
				setUserInteracted(true);

				// Resume audio context if it was suspended
				if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
					audioContextRef.current.resume().catch(console.error);
				}

				// Try to play if autoplay is enabled and audio is loaded
				if (autoplay && audioRef.current && audioLoaded && !isPlaying) {
					console.log('User interacted, attempting autoplay...');
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
	}, [userInteracted, autoplay, audioLoaded, isPlaying]);

	// Add back the autoplay after user interaction effect
	useEffect(() => {
		// Handle autoplay after user interaction
		if (userInteracted && autoplay && audioRef.current && audioLoaded && !isPlaying) {
			console.log('Attempting autoplay after user interaction state change...');
			audioRef.current
				.play()
				.then(() => {
					console.log('Autoplay successful after state change');
					setIsPlaying(true);
				})
				.catch((error) => {
					console.error('Autoplay prevented after state change:', error);
				});
		}
	}, [userInteracted, autoplay, audioLoaded, isPlaying]);

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
		console.log('Play/Pause button clicked, current state:', {
			isPlaying,
			audioLoaded,
			audioElement: audioRef.current ? 'exists' : 'null',
			audioContextState: audioContextRef.current
				? audioContextRef.current.state
				: 'no context',
		});

		if (audioRef.current) {
			// Resume audio context if it was suspended
			if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
				audioContextRef.current.resume().catch(console.error);
			}

			// Simply toggle play/pause without manually setting state
			// The event listeners will handle state updates
			if (isPlaying) {
				console.log('Pausing audio...');
				audioRef.current.pause();
				// State will be updated by the pause event listener
			} else {
				console.log('Attempting to play audio...');
				audioRef.current.play().catch((error) => {
					console.error('Play prevented:', error);
					// If play was prevented due to autoplay policy, we need user interaction
					setUserInteracted(false);
				});
				// State will be updated by the play event listener if successful
			}
		} else {
			console.error('Audio element reference is null');
		}
	};

	const handlePrevTrack = (): void => {
		const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
		setCurrentTrackIndex(newIndex);
		setProgress(0);
		setAudioLoaded(false);

		// If currently playing, play the new track
		if (isPlaying && audioRef.current) {
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
		}
	};

	const handleNextTrack = (): void => {
		const newIndex = (currentTrackIndex + 1) % tracks.length;
		setCurrentTrackIndex(newIndex);
		setProgress(0);
		setAudioLoaded(false);

		// If currently playing, play the new track
		if (isPlaying && audioRef.current) {
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
				src={`/audio/music/${currentTrack.file}`}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleTrackEnded}
				onLoadedMetadata={handleTimeUpdate}
				onPlay={() => console.log('onPlay event fired')}
				onPause={() => console.log('onPause event fired')}
				onError={(e) => console.error('Audio error:', e)}
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
							e.stopPropagation();
							console.log('Play/Pause button direct click handler');
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
