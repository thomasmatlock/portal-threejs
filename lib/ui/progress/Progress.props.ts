import { CSSProperties } from 'react';

export interface ProgressProps {
	/** Current progress value (0-100) */
	progress: number;
	/** Maximum value for the progress bar */
	max?: number;
	/** Minimum value for the progress bar */
	min?: number;
	/** Visual theme of the progress bar */
	theme?: 'light' | 'dark';
	/** Custom color for the progress indicator */
	indicatorColor?: string;
	/** Custom color for the progress track */
	/** Custom color for the progress track */
	trackColor?: string;
	/** Additional CSS styles */
	style?: CSSProperties;
	/** CSS class name for custom styling */
	className?: string;
	/** Whether to show progress text */
	showText?: boolean;
	/** Whether to animate progress changes */
	animate?: boolean;
	/** Custom height for the progress bar */
	height?: number;
	/** Aria label for accessibility */
	ariaLabel?: string;

	/** Whether the progress bar is indeterminate */
	indeterminate?: boolean;
}

export const defaultProgressProps = {
	max: 100,
	min: 0,
	theme: 'light' as const,
	showText: false,
	animate: true,
	height: 8,
	ariaLabel: 'Progress',
	indeterminate: false,
} as const;
