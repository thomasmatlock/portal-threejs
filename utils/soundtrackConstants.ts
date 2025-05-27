import { Track } from '../components/ui/GameMenu.props';
import config from '@/cloudflare.config';

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
		file: 'Portal 2 OST Volume 2 - You Will Be Perfect.mp3',
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
