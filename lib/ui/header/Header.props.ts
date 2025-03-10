// Goals:
// - Define reusable prop types for Header component
// - Ensure type safety across different repos
// - Allow for flexible configuration while maintaining defaults
// - Support theme customization and analytics integration

import { ReactNode } from 'react';

export interface HeaderConfig {
	// Site metadata
	title: string;
	description: string;
	author: string;
	url: string;

	// Assets & Resources
	icon: string;
	thumbnail: string;
	manifestPath?: string; // Optional, defaults to '/manifest.json'

	// Analytics
	tagID?: string; // Google Analytics tag ID

	// Theme
	defaultTheme?: 'light' | 'dark';
	themeColor?: {
		light: string;
		dark: string;
	};

	// CDN/Asset Configuration
	cdn?: {
		bucketURL: string;
		bucketDir: string;
	};

	// Social Media
	social?: {
		twitter?: {
			handle?: string;
			cardType?: 'summary' | 'summary_large_image';
		};
		facebook?: {
			appId?: string;
		};
	};

	// SEO
	seo?: {
		keywords?: string[];
		robots?: string;
		additionalMetaTags?: Array<{
			name: string;
			content: string;
		}>;
	};
}

export interface HeaderProps {
	config: HeaderConfig;
	children?: ReactNode;
	className?: string;
	onThemeChange?: (theme: 'light' | 'dark') => void;
}

// Default configuration
export const defaultHeaderConfig: Partial<HeaderConfig> = {
	manifestPath: '/manifest.json',
	defaultTheme: 'light',
	themeColor: {
		light: '#ffffff',
		dark: '#000000',
	},
	social: {
		twitter: {
			cardType: 'summary_large_image',
		},
	},
	seo: {
		robots: 'index,follow',
	},
};

// Type guard to validate HeaderConfig
export function isValidHeaderConfig(config: HeaderConfig): boolean {
	const requiredFields: Array<keyof HeaderConfig> = [
		'title',
		'description',
		'author',
		'url',
		'icon',
		'thumbnail',
	];

	return requiredFields.every((field) => !!config[field]);
}
