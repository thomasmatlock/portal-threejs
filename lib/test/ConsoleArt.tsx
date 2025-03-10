import { useEffect, useRef } from 'react';

interface ConsoleArtProps {
	enabled?: boolean;
}

const ConsoleArt: React.FC<ConsoleArtProps> = ({ enabled = true }) => {
	const hasLoggedRef = useRef(false);

	useEffect(() => {
		if (!enabled || !window?.console || hasLoggedRef.current) return;

		const artAndMessages = `
https://thomasmatlock.com
https://youtube.com/@ThomasMatlock
https://x.com/thomasmatlock_
`;

		hasLoggedRef.current = true;

		requestAnimationFrame(() => {
			console.log(`${artAndMessages}`);
		});
	}, [enabled]);

	return null;
};

export default ConsoleArt;
