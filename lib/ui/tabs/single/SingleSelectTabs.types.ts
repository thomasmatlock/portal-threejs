// SingleSelectTabsExample.types.ts
import chalk from 'chalk';
const { log } = console;

export type RadioTab = {
	id: string;
	label: string;
	active?: boolean;
	icon?: string | { src: string } | null;
	disabled?: boolean;
};

export type Theme = 'dark' | 'light';
export type Orientation = 'horizontal' | 'vertical';

export type SingleSelectTabsProps = {
	tabs: RadioTab[];
	onTabChange?: (id: string) => void;
	theme: Theme;
	orientation?: Orientation;

	defaultActiveTab?: string;
	ariaLabel?: string;
	className?: string;
};

export const createSingleSelectTabs = (tabs: Partial<RadioTab>[]): RadioTab[] => {
	return tabs.map((tab) => ({
		id: tab.id || '',
		label: tab.label || '',
		active: tab.active || false,
		disabled: tab.disabled || false,
		icon: tab.icon || null,
	}));
};
