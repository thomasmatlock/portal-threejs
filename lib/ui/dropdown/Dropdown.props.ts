export type DropdownItem = {
	value: string;
	label: string;
	icon?: string | { src: string };
	shortcut?: string;
	disabled?: boolean;
	selected?: boolean;
	submenu?: DropdownItem[];
};

export type DropdownGroup = {
	label?: string;
	items: DropdownItem[];
};

export type DropdownPosition = 'top' | 'right' | 'bottom' | 'left';
export type DropdownAlign = 'start' | 'center' | 'end';
export type DropdownTheme = 'light' | 'dark';

export interface DropdownProps {
	/** Groups of items to display in the dropdown */
	/** Groups of items to display in the dropdown */
	items: DropdownGroup[];
	/** Visual theme */
	theme: DropdownTheme;
	/** Initial value (controlled) */
	value?: string;
	/** Callback fired when an item is selected */
	onSelect: (value: string) => void;
	/** Direction the dropdown opens */
	position?: DropdownPosition;
	/** Alignment of the dropdown relative to trigger */
	align?: DropdownAlign;
	/** Custom trigger element */
	trigger?: React.ReactNode;
	/** Whether the dropdown is disabled */
	disabled?: boolean;
	/** Accessibility label */
	ariaLabel?: string;
	/** Additional CSS class name */
	className?: string;
}

export const defaultDropdownProps = {
	position: 'bottom' as const,
	align: 'start' as const,
	theme: 'light' as const,
	disabled: false,
	ariaLabel: 'Dropdown menu',
} as const;

// Helper function to create properly typed options
export const createDropdownOptions = (groups: Partial<DropdownGroup>[]): DropdownGroup[] => {
	return groups.map((group) => ({
		label: group.label,
		items:
			group.items?.map((item) => ({
				value: item.value || '',
				label: item.label || '',
				icon: item.icon,
				shortcut: item.shortcut,
				disabled: item.disabled || false,
				selected: item.selected || false,
				submenu: item.submenu
					? createDropdownOptions([{ items: item.submenu }])[0].items
					: undefined,
			})) || [],
	}));
};
