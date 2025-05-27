import { useState, useEffect, useRef, useContext } from 'react';
import { Track } from '../menus/GameMenu.props';
import { getRandomSoundtrackIndex } from '../../../utils/soundtrackHandlers';
import InputContext from '../../../context/inputContext';
import { useAudioVolumeContext } from '../../../context/audioVolumeContext';

interface UseAudioPlayerProps {
	tracks: Track[];
	initialVolume: number;
	autoplay: boolean;
	randomizeTrack: boolean;
	onVolumeChange?: (volume: number) => void;
}

export const useAudioPlayer = ({
	tracks,
	initialVolume,
	autoplay,
	randomizeTrack,
	onVolumeChange,
}: UseAudioPlayerProps) => {
	const { interacted, setInteracted } = useContext(InputContext);
	const audioVolumeContext = useAudioVolumeContext();

	// Audio refs
	const audioRef = useRef<HTMLAudioElement>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const hasAttemptedAutoplayRef = useRef(false);
	const manuallyPausedRef = useRef(false);
	const lastVolumeRef = useRef(initialVolume);
	const isUserAdjustingRef = useRef(false);

	// State
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [prevVolume, setPrevVolume] = useState(initialVolume);
	const [audioLoaded, setAudioLoaded] = useState(false);

	// Use global volume from context
	const volume = audioVolumeContext.musicVolume;

	const currentTrack = tracks[currentTrackIndex];

	// Initialize audio context
	useEffect(() => {
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

		return () => {
			if (audioContextRef.current?.state !== 'closed') {
				audioContextRef.current?.close().catch(console.error);
			}
		};
	}, []);

	// Handle track randomization
	useEffect(() => {
		if (randomizeTrack) {
			setCurrentTrackIndex(getRandomSoundtrackIndex());
		}
	}, [randomizeTrack]);

	// Handle volume changes
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [volume]);

	// Handle autoplay after user interaction
	useEffect(() => {
		if (
			interacted &&
			autoplay &&
			audioRef.current &&
			audioLoaded &&
			!isPlaying &&
			!manuallyPausedRef.current
		) {
			audioContextRef.current?.resume().catch(console.error);
			audioRef.current
				.play()
				.then(() => setIsPlaying(true))
				.catch(console.error);
		}
	}, [interacted, autoplay, audioLoaded, isPlaying]);

	const handlePlayPause = (): void => {
		if (!interacted) setInteracted(true);

		if (!audioRef.current) return;

		try {
			if (isPlaying) {
				audioRef.current.pause();
				manuallyPausedRef.current = true;
				setIsPlaying(false);
			} else {
				manuallyPausedRef.current = false;
				audioRef.current
					.play()
					.then(() => setIsPlaying(true))
					.catch(() => setIsPlaying(false));
			}
		} catch (error) {
			console.error('Error in play/pause:', error);
		}
	};

	const changeTrack = (newIndex: number): void => {
		if (!interacted) setInteracted(true);

		setCurrentTrackIndex(newIndex);
		setProgress(0);
		setAudioLoaded(false);

		if (isPlaying && audioRef.current && !manuallyPausedRef.current) {
			setTimeout(() => {
				audioContextRef.current?.resume().catch(console.error);
				audioRef.current
					?.play()
					.then(() => setIsPlaying(true))
					.catch(() => setIsPlaying(false));
			}, 100);
		} else {
			setIsPlaying(false);
		}
	};

	const handlePrevTrack = (): void => {
		const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
		changeTrack(newIndex);
	};

	const handleNextTrack = (): void => {
		const newIndex = (currentTrackIndex + 1) % tracks.length;
		changeTrack(newIndex);
	};

	const handleTimeUpdate = (): void => {
		if (audioRef.current) {
			setProgress(audioRef.current.currentTime);
			setDuration(audioRef.current.duration);
		}
	};

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (!interacted) setInteracted(true);

		const progressBar = e.currentTarget;
		const rect = progressBar.getBoundingClientRect();
		const clickPosition = e.clientX - rect.left;
		const percentClicked = clickPosition / rect.width;
		const newTime = percentClicked * duration;

		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			setProgress(newTime);
		}
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (!interacted) setInteracted(true);

		isUserAdjustingRef.current = true;
		const newVolume = parseInt(e.target.value, 10);

		// Update global volume context
		audioVolumeContext.setMusicVolume(newVolume);
		setIsMuted(newVolume === 0);
		lastVolumeRef.current = newVolume;

		if (newVolume === 0 && volume > 0) {
			setPrevVolume(volume);
		}
		if (newVolume > 0 && volume === 0) {
			setIsMuted(false);
		}

		onVolumeChange?.(newVolume);

		setTimeout(() => {
			isUserAdjustingRef.current = false;
		}, 100);
	};

	const handleTrackEnded = (): void => {
		manuallyPausedRef.current = false;
		handleNextTrack();
	};

	return {
		// State
		currentTrack,
		isPlaying,
		volume,
		progress,
		duration,
		audioLoaded,

		// Refs
		audioRef,

		// Handlers
		handlePlayPause,
		handlePrevTrack,
		handleNextTrack,
		handleTimeUpdate,
		handleProgressClick,
		handleVolumeChange,
		handleTrackEnded,

		// Event handlers for audio element
		onPlay: () => setIsPlaying(true),
		onPause: () => setIsPlaying(false),
		onCanPlay: () => setAudioLoaded(true),
	};
};
