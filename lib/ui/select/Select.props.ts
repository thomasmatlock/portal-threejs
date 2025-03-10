export type SelectItem = {
	value: string;
	label: string;
	disabled?: boolean;
	// default?: boolean;
	default?: boolean;
};

export type SelectGroup = {
	label?: string;
	items: SelectItem[];
};

export type Theme = 'dark' | 'light';

export interface SelectProps {
	/** Array of item groups to display in the select */
	items: SelectGroup[];
	/** Placeholder text when no option is selected */
	placeholder?: string;
	/** Callback fired when selection changes */
	onValueChange: (value: string) => void;
	/** Visual theme - light or dark mode */
	theme?: Theme;
	/** Pre-selected value */
	defaultValue?: string;
	/** Accessibility label */
	ariaLabel?: string;
}

// Helper function to create properly typed options
export const createSelectOptions = (options: Partial<SelectGroup>[]): SelectGroup[] => {
	return options.map((group) => ({
		label: group.label,
		items:
			group.items?.map((item) => ({
				value: item.value || '',
				label: item.label || '',
				disabled: item.disabled || false,
				default: item.default || false,
			})) || [],
	}));
};
