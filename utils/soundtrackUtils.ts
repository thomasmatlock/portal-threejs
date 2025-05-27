import { Track } from '../components/ui/menus/GameMenu.props';

// Utility function to build full track file URL
export const buildTrackFileURL = (track: Track): Track => {
	return {
		...track,
		file: `${track.assetsURL}/${encodeURIComponent(track.file)}`,
	};
};

// Utility function to find track index by ID
export const findTrackIndex = (tracks: Track[], trackId: string): number => {
	return tracks.findIndex((track) => track.id === trackId);
};

// Utility function to get random index
export const getRandomIndex = (arrayLength: number): number => {
	return Math.floor(Math.random() * arrayLength);
};

// Utility function to get next index in circular array
export const getNextIndex = (currentIndex: number, arrayLength: number): number => {
	return (currentIndex + 1) % arrayLength;
};

// Utility function to get previous index in circular array
export const getPreviousIndex = (currentIndex: number, arrayLength: number): number => {
	return currentIndex === 0 ? arrayLength - 1 : currentIndex - 1;
};
