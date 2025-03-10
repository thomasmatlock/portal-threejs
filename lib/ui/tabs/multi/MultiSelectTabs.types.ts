// MultiTabs.types.ts
import chalk from 'chalk';
const { log } = console;

// Core type definitions for MultiTab items
export type MultiSelectTab = {
	id: string;
	label: string;
	selected?: boolean;
	icon?: string | { src: string } | null;
	disabled?: boolean;
};

export type Theme = 'dark' | 'light';
export type Orientation = 'horizontal' | 'vertical';

// Component props interface
export type MultiSelectTabsProps = {
	tabs: MultiSelectTab[];
	onSelectionChange?: (selectedIds: string[]) => void;
	theme: Theme;
	orientation?: Orientation;
	defaultSelected?: string[];
	ariaLabel?: string;
	maxSelections?: number;
	className?: string;
};

// Helper Functions
export const createMultiSelectTabs = (tabs: Partial<MultiSelectTab>[]): MultiSelectTab[] => {
	return tabs.map((tab) => ({
		id: tab.id || '',
		label: tab.label || '',
		selected: tab.selected || false,
		disabled: tab.disabled || false,
		icon: tab.icon || null,
	}));
};
