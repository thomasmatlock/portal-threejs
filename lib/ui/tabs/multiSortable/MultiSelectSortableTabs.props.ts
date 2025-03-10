// MultiSelectSortableTabs.props.ts
export type MultiTab = {
	id: string;
	label: string;
	selected?: boolean;
	icon?: string | { src: string } | null;
	disabled?: boolean;
};

export type Theme = 'dark' | 'light';
export type Orientation = 'horizontal' | 'vertical';

export interface DragConstraints {
	lockAxis?: boolean;
	restrictToGroup?: boolean;
	dragDelay?: number;
	minIndex?: number;
	maxIndex?: number;
}

export interface MultiSelectSortableTabsProps {
	tabs: MultiTab[];
	onSelectionChange?: (selectedIds: string[]) => void;
	theme: Theme;
	orientation?: Orientation;
	defaultSelected?: string[];
	ariaLabel?: string;
	maxSelections?: number;
	className?: string;
	onOrderChange?: (newOrder: MultiTab[]) => void;
	dragConstraints?: DragConstraints;
}

// Helper function to create stable IDs
export const createStableId = (prefix: string, id: string) => `${prefix}-${id}`;
