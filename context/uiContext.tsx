// Goals: Provide UI context for menu interactions, hover states, and UI events
// Optimize performance and readability

import { createContext, useState, useContext, ReactNode } from 'react';
import chalk from 'chalk';

const { log } = console;

// Define the UIContextType
type UIContextType = {
	// Menu state
	currentMenu: string;
	hoveredMenuOption: string | null;
	selectedMenuOption: string | null;

	// Setters
	setCurrentMenu: (menu: string) => void;
	setHoveredMenuOption: (option: string | null) => void;
	setSelectedMenuOption: (option: string | null) => void;
};

// Create the UIContext with default values
const UIContext = createContext<UIContextType>({
	currentMenu: 'main',
	hoveredMenuOption: null,
	selectedMenuOption: null,

	setCurrentMenu: () => {},
	setHoveredMenuOption: () => {},
	setSelectedMenuOption: () => {},
});

// Custom hook for using UIContext
export const useUIContext = () => useContext(UIContext);

export function UIContextProvider({ children }: { children: ReactNode }) {
	// Menu state
	const [currentMenu, setCurrentMenu] = useState<string>('main');
	const [hoveredMenuOption, setHoveredMenuOption] = useState<string | null>(null);
	const [selectedMenuOption, setSelectedMenuOption] = useState<string | null>(null);

	// Log UI interactions in development
	const logUIInteraction = (action: string, value: any) => {
		if (process.env.NODE_ENV === 'development') {
			log(chalk.magenta(`UI Interaction: ${action} - ${JSON.stringify(value)}`));
		}
	};

	// Enhanced setters with logging
	const setCurrentMenuWithLogging = (menu: string) => {
		logUIInteraction('Menu Changed', menu);
		setCurrentMenu(menu);
	};

	const setHoveredMenuOptionWithLogging = (option: string | null) => {
		logUIInteraction('Menu Hover', option);
		setHoveredMenuOption(option);
	};

	const setSelectedMenuOptionWithLogging = (option: string | null) => {
		logUIInteraction('Menu Select', option);
		setSelectedMenuOption(option);
	};

	return (
		<UIContext.Provider
			value={{
				currentMenu,
				hoveredMenuOption,
				selectedMenuOption,

				setCurrentMenu: setCurrentMenuWithLogging,
				setHoveredMenuOption: setHoveredMenuOptionWithLogging,
				setSelectedMenuOption: setSelectedMenuOptionWithLogging,
			}}
		>
			{children}
		</UIContext.Provider>
	);
}

export default UIContext;
