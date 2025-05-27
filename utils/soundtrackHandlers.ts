import { Track } from '../components/ui/menus/GameMenu.props';
import { portalSoundtracks, spotifyPlaylistURL } from './soundtrackConstants';
import {
	buildTrackFileURL,
	findTrackIndex,
	getRandomIndex,
	getNextIndex,
	getPreviousIndex,
} from './soundtrackUtils';

// Re-export constants for backward compatibility
export { portalSoundtracks, spotifyPlaylistURL };

// Function to get a random soundtrack
export const getRandomSoundtrack = (): Track => {
	const randomIndex = getRandomIndex(portalSoundtracks.length);
	const track = portalSoundtracks[randomIndex];
	return buildTrackFileURL(track);
};

// Function to get a random soundtrack index
export const getRandomSoundtrackIndex = (): number => {
	return getRandomIndex(portalSoundtracks.length);
};

// Function to get the next soundtrack in the playlist
export const getNextSoundtrack = (currentId: string): Track => {
	const currentIndex = findTrackIndex(portalSoundtracks, currentId);
	if (currentIndex === -1) return buildTrackFileURL(portalSoundtracks[0]);

	const nextIndex = getNextIndex(currentIndex, portalSoundtracks.length);
	const track = portalSoundtracks[nextIndex];
	return buildTrackFileURL(track);
};

// Function to get the previous soundtrack in the playlist
export const getPreviousSoundtrack = (currentId: string): Track => {
	const currentIndex = findTrackIndex(portalSoundtracks, currentId);
	if (currentIndex === -1) return buildTrackFileURL(portalSoundtracks[0]);

	const prevIndex = getPreviousIndex(currentIndex, portalSoundtracks.length);
	const track = portalSoundtracks[prevIndex];
	return buildTrackFileURL(track);
};
