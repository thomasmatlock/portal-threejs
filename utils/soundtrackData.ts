import { Track } from '../components/ui/GameMenu.props';

// This file contains the soundtrack data for the audio player
// The file paths are relative to the public/audio/music directory

export const portalSoundtracks: Track[] = [
	{
		id: 'science-is-fun',
		title: 'Science is Fun',
		file: 'Portal 2 OST Volume 1 - Science is Fun.mp3',
	},
	{
		id: 'reconstructing-more-science',
		title: 'Reconstructing More Science',
		file: 'Portal 2 OST Volume 3 - Reconstructing More Science.mp3',
	},
	{
		id: 'you-will-be-perfect',
		title: 'You Will Be Perfect',
		file: 'Portal 2 OST Volume 2 - You Will Be Perfect.mp3',
	},
	{
		id: '9999999',
		title: '9999999',
		file: 'Portal 2 OST Volume 1 - 9999999.mp3',
	},
	{
		id: 'franken-turrets',
		title: 'Franken Turrets',
		file: 'Portal 2 OST Volume 3 - Franken Turrets.mp3',
	},
	{
		id: 'wheatley-science',
		title: 'Wheatley Science',
		file: 'Portal 2 OST Volume 3 - Wheatley Science.mp3',
	},
	{
		id: 'dont-do-it',
		title: "Don't Do It",
		file: "Portal 2 OST Volume 2 - Don't Do It.mp3",
	},
];

// Function to get a random soundtrack
export const getRandomSoundtrack = (): Track => {
	const randomIndex = Math.floor(Math.random() * portalSoundtracks.length);
	return portalSoundtracks[randomIndex];
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
	return portalSoundtracks[nextIndex];
};

// Function to get the previous soundtrack in the playlist
export const getPreviousSoundtrack = (currentId: string): Track => {
	const currentIndex = portalSoundtracks.findIndex((track) => track.id === currentId);
	if (currentIndex === -1) return portalSoundtracks[0];

	const prevIndex = currentIndex === 0 ? portalSoundtracks.length - 1 : currentIndex - 1;
	return portalSoundtracks[prevIndex];
};
