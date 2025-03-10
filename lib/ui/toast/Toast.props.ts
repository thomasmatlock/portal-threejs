export type ToastTheme = 'light' | 'dark';

export interface ToastProps {
	/** Visual theme for the toast */
	theme: ToastTheme;
	/** Custom title for the toast notification */
	title?: string;
	/** Custom description/message for the toast */
	description?: string;
	/** Duration in milliseconds before auto-dismissal. Set to null for no auto-dismiss */
	duration?: number | null;
	/** Whether the toast is currently visible */
	open?: boolean;
	/** Callback fired when toast visibility changes */
	onOpenChange?: (open: boolean) => void;
	/** Text for the action button */
	actionLabel?: string;
	/** Callback fired when action button is clicked */
	onAction?: () => void;
	/** Alternative text for accessibility */
	altText?: string;

	/** Custom CSS class name */
	className?: string;
	/** Position of the toast on the screen */
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const defaultToastProps = {
	theme: 'light' as const,
	title: '',
	description: '',
	duration: 1000,
	open: false,
	actionLabel: 'Close',
	altText: 'Dismiss notification',
	position: 'bottom-right' as const,
} as const;
