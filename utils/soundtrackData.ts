import { Track } from '../components/ui/GameMenu.props';
import config from '@/cloudflare.config';

// This file contains the soundtrack data for the audio player
// The file paths are relative to the public directory
export const spotifyPlaylistURL = 'https://open.spotify.com/playlist/3jH61Xe9Y4AuonXUykOGNh';
export const portalSoundtracks: Track[] = [
	{
		id: 'science-is-fun',
		title: 'Science is Fun',
		file: encodeURIComponent('Portal 2 OST Volume 1 - Science is Fun.mp3'),
		spotifyURL: 'https://open.spotify.com/track/3xJP5tr5GQKeurrUTPey9B',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
	{
		id: 'reconstructing-more-science',
		title: 'Reconstructing More Science',
		file: encodeURIComponent('Portal 2 OST Volume 3 - Reconstructing More Science.mp3'),
		spotifyURL: 'https://open.spotify.com/track/05pbh2CJtcXebgfp5KltmC',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
	{
		id: 'you-will-be-perfect',
		title: 'You Will Be Perfect',
		file: encodeURIComponent('Portal 2 OST Volume 2 - You Will Be Perfect.mp3'),
		spotifyURL: 'https://open.spotify.com/track/0seJSzwYdx5vk0WqMTiDUZ',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
	{
		id: '9999999',
		title: '9999999',
		file: encodeURIComponent('Portal 2 OST Volume 1 - 9999999.mp3'),
		spotifyURL: 'https://open.spotify.com/track/0seJSzwYdx5vk0WqMTiDUZ',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
	{
		id: 'franken-turrets',
		title: 'Franken Turrets',
		file: encodeURIComponent('Portal 2 OST Volume 3 - Franken Turrets.mp3'),
		spotifyURL: 'https://open.spotify.com/track/0S6ZykDabkWI7M8ahRv4La',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
	{
		id: 'wheatley-science',
		title: 'Wheatley Science',
		file: encodeURIComponent('Portal 2 OST Volume 3 - Wheatley Science.mp3'),
		spotifyURL: 'https://open.spotify.com/track/0C9RYBeaXzWTC18rsdUQp3',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
	{
		id: 'dont-do-it',
		title: "Don't Do It",
		file: encodeURIComponent('Portal 2 OST Volume 2 - Dont Do it.mp3'),
		spotifyURL: 'https://open.spotify.com/track/2kJuFLhgWW7UiTmBjOsn8e',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
	{
		id: 'concentration-enhancing-menu-initialiser',
		title: 'Concentration Enhancing Menu Initialiser',
		file: encodeURIComponent(
			'Portal 2 OST Volume 1 - Concentration Enhancing Menu Initialiser.mp3'
		),
		spotifyURL: 'https://open.spotify.com/track/68XFAysEwafpCyRbP4hkeX',
		assetsURL: `${config.assetsURL}/audio/music`,
	},
];

// Function to get a random soundtrack
export const getRandomSoundtrack = (): Track => {
	const randomIndex = Math.floor(Math.random() * portalSoundtracks.length);
	const track = portalSoundtracks[randomIndex];
	return {
		...track,
		file: `${track.assetsURL}/${track.file}`, // Construct full URL for cloud access
	};
};

// Function to get a random soundtrack index
export const getRandomSoundtrackIndex = (): number => {
	return Math.floor(Math.random() * portalSoundtracks.length);
};

// Function to get the next soundtrack in the playlist
export const getNextSoundtrack = (currentId: string): Track => {
	const currentIndex = portalSoundtracks.findIndex((track) => track.id === currentId);
	if (currentIndex === -1) return portalSoundtracks[0];

	const nextIndex = (currentIndex + 1) % portalSoundtracks.length;
	const track = portalSoundtracks[nextIndex];
	return {
		...track,
		file: `${track.assetsURL}/${track.file}`, // Construct full URL for cloud access
	};
};

// Function to get the previous soundtrack in the playlist
export const getPreviousSoundtrack = (currentId: string): Track => {
	const currentIndex = portalSoundtracks.findIndex((track) => track.id === currentId);
	if (currentIndex === -1) return portalSoundtracks[0];

	const prevIndex = currentIndex === 0 ? portalSoundtracks.length - 1 : currentIndex - 1;
	const track = portalSoundtracks[prevIndex];
	return {
		...track,
		file: `${track.assetsURL}/${track.file}`, // Construct full URL for cloud access
	};
};
