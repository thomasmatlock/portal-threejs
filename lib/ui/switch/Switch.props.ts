export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchTheme = 'light' | 'dark';

export interface SwitchProps {
	/** Label text to display next to the switch */
	label?: string;
	/** Whether the switch is checked/on */
	checked?: boolean;
	/** Default checked state (uncontrolled mode) */
	defaultChecked?: boolean;
	/** Callback fired when switch state changes */
	onCheckedChange?: (checked: boolean) => void;
	/** Visual theme */

	theme?: SwitchTheme;
	/** Whether the switch is disabled */

	disabled?: boolean;
	/** Size of the switch - affects both width and height proportionally */
	size?: SwitchSize;
	/** HTML id for the switch input */
	id?: string;
	/** Aria label for accessibility */
	ariaLabel?: string;
}
