// Search.props.ts
export interface SearchProps {
	/** ID for the search input */
	id: string;
	/** Placeholder text shown when input is empty */
	placeholder?: string;
	/** Handler for search input changes */
	onSearch?: (value: string) => void;
	/** Handler for search submission */
	onSubmit?: (value: string) => void;
	/** Visual theme */
	theme?: 'light' | 'dark';
	/** Additional CSS class name */
	className?: string;
	/** Whether to autofocus the input on mount */
	autoFocus?: boolean;
	/** Icon to show in search input */
	/** Icon to show in search input */
	icon?: string | { src: string };
}

export const defaultSearchProps = {
	placeholder: 'Search...',
	theme: 'light' as const,
	autoFocus: false,
} as const;
