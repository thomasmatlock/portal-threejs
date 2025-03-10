export type IconSize = 12 | 16 | 20 | 24 | 32 | 48;
export type Theme = 'light' | 'dark';

export interface IconProps {
	/** The icon source - can be a string path or object with src property */
	icon: string | { src: string };
	/** Size of the icon in pixels */
	size?: IconSize;
	/** Color override for the icon */
	color?: string;
	/** Additional CSS classes */
	className?: string;
	/** Accessibility label */
	label?: string;
	/** Visual theme */
	theme?: Theme;
	/** Additional inline styles */
	style?: React.CSSProperties;
}

export const defaultIconProps = {
	size: 16,
	color: 'currentColor',
	className: '',
} as const;
