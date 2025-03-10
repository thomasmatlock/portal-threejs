export type ContextMenuItemType = 'item' | 'checkbox' | 'radio' | 'submenu' | 'separator' | 'label';

interface BaseItem {
	id?: string;
	type: ContextMenuItemType;
	label?: string;
	disabled?: boolean;
	shortcut?: string;
}

interface MenuItem extends BaseItem {
	// type: 'item';
	type: 'item';
}

interface CheckboxItem extends BaseItem {
	type: 'checkbox';
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

interface RadioOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface RadioItem extends BaseItem {
	type: 'radio';
	value: string;
	options?: RadioOption[];
	onValueChange?: (value: string) => void;
}

interface SubmenuItem extends BaseItem {
	type: 'submenu';
	items: ContextMenuItem[];
}

interface SeparatorItem {
	type: 'separator';
}

interface LabelItem extends BaseItem {
	type: 'label';
}

export type ContextMenuItem =
	| MenuItem
	| CheckboxItem
	| RadioItem
	| SubmenuItem
	| SeparatorItem
	| LabelItem;

export interface ContextMenuProps {
	/** Visual theme */
	theme?: 'light' | 'dark';
	/** Array of menu items */
	items: ContextMenuItem[];
	/** Custom trigger element */
	trigger?: React.ReactNode;
	/** Callback fired when a menu item is selected */
	onSelect?: (value: string) => void;
	/** Accessibility label */
	ariaLabel?: string;
}

export const defaultContextMenuProps = {
	theme: 'light' as const,
	ariaLabel: 'Context menu',
};
