import Script from 'next/script';
import { useState, useEffect } from 'react';
type Props = {
	tagID: string;
};
export default function HeaderGTag({ tagID }: Props) {
	const [isUserInteracted, setIsUserInteracted] = useState(false);

	useEffect(() => {
		// Attach event listener to detect user interaction
		const handleUserInteraction = () => setIsUserInteracted(true);

		window.addEventListener('scroll', handleUserInteraction, { once: true });
		window.addEventListener('mousemove', handleUserInteraction, { once: true });
		window.addEventListener('click', handleUserInteraction, { once: true });
		window.addEventListener('keydown', handleUserInteraction, { once: true });

		return () => {
			// Cleanup event listeners
			window.removeEventListener('scroll', handleUserInteraction);
			window.removeEventListener('mousemove', handleUserInteraction);
			window.removeEventListener('click', handleUserInteraction);
			window.removeEventListener('keydown', handleUserInteraction);
		};
	}, []);

	if (!isUserInteracted) return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${tagID}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${tagID}');
        `}
			</Script>
		</>
	);
}
