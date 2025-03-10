// MultiToggle.props.ts
export interface MultiToggleOption {
	id: string;
	label: string;
	icon?: React.ReactNode;
}

export interface MultiToggleProps {
	options: MultiToggleOption[];
	value: string;
	onChange: (value: string) => void;
	theme?: 'light' | 'dark';
	className?: string;
	isConnectedBelow?: boolean; // To remove bottom border radius when connected to content below
}
