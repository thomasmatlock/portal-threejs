export type ButtonTheme = 'light' | 'dark' | 'orange' | 'blue' | 'magenta';
export type ButtonTarget = '_blank' | '_self';

export interface ButtonProps {
	href?: string;
	label: string;
	icon?: string | { src: string };
	target?: ButtonTarget;
	theme?: ButtonTheme;
	onClick?: () => void;
	// onClick?: () => void;
}

export const defaultButtonProps: Partial<ButtonProps> = {
	href: '#',
	target: '_self',
	theme: 'light',
} as const;
