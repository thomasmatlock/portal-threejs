import Head from 'next/head';
import UserContext from '@/context/userContext';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { HeaderProps, isValidHeaderConfig } from './Header.props';

const HeaderGTag = dynamic(() => import('./HeaderGTag'), {
	ssr: false,
});
import HeaderPreloadFonts from './HeaderPreloadFonts';

export default function Header({ config, className, onThemeChange }: HeaderProps) {
	const { theme } = useContext(UserContext);
	const { pathname } = useRouter();
	// console.log(config.thumbnail);

	// Validate config
	if (!isValidHeaderConfig(config)) {
		throw new Error('Invalid header configuration provided');
	}

	const {
		title,
		description,
		author,
		url,
		icon,
		thumbnail,
		tagID,
		manifestPath = '/manifest.json',
		themeColor = {
			light: '#ffffff',
			dark: '#000000',
		},
	} = config;

	return (
		<div className={className}>
			{tagID && <HeaderGTag tagID={tagID} />}
			<Head>
				<HeaderPreloadFonts />
				<meta charSet="utf-8" />
				<meta name="language" content="english" />
				<meta name="author" content={author} />
				<meta name="designer" content={author} />
				<meta name="publisher" content={author} />
				<meta name="image" content={thumbnail} />
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta name="keywords" content={description} />
				<meta name="robots" content={config.seo?.robots || 'index,follow'} />
				<meta property="og:title" content={title} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={url} />
				<meta property="og:image" content={thumbnail} />
				<meta property="og:site_name" content={title} />
				<meta property="og:description" content={description} />
				<link rel="manifest" href={manifestPath} />
				<meta
					name="theme-color"
					content={theme === 'light' ? themeColor.light : themeColor.dark}
				/>
				<link rel="apple-touch-icon" href={icon} sizes="16x16 32x32 180x180" />
				<link rel="mask-icon" color="#0e0e0e" href={icon} />
				<link rel="shortcut icon" href={icon} />
				<meta
					name="twitter:card"
					content={config.social?.twitter?.cardType || 'summary_large_image'}
				/>
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={thumbnail} />
				{config.seo?.additionalMetaTags?.map((tag, i) => (
					<meta key={`${tag.name}-${i}`} name={tag.name} content={tag.content} />
				))}
			</Head>
		</div>
	);
}
