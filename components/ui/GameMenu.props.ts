// This file contains shared prop types for menu components

// Main Menu Props
export interface GameMenuProps {
	onStartGame: () => void;
	onSettings: () => void;
	onExit: () => void;
	onLoadGame?: () => void;
	onContinueGame?: () => void;
}

// Pause Menu Props
export interface PauseMenuProps {
	onResume: () => void;
	onSettings: () => void;
	onExit: () => void;
	onRestart?: () => void;
	onSave?: () => void;
	onLoad?: () => void;
}

// Audio Player Props
export interface AudioPlayerProps {
	tracks: Track[];
	initialVolume?: number;
	/**
	 * When true, the player will attempt to autoplay when the user interacts with the page.
	 * This is necessary because browsers block autoplay until user interaction.
	 */
	autoplay?: boolean;
	/**
	 * When true, the player will start with a random track from the playlist.
	 * Default is true.
	 */
	randomizeTrack?: boolean;
	onVolumeChange?: (volume: number) => void;
}

// Track interface for audio player
export interface Track {
	id: string;
	title: string;
	file: string;
	duration?: number;
	spotifyURL?: string;
	assetsURL?: string;
}
