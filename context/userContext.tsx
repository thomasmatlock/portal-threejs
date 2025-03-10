// Goals: Provide user context for device information, theme, and tab activity
// Optimize performance and readability

import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { UAParser } from 'ua-parser-js';
import chalk from 'chalk';

const { log } = console;

// Define the UserContextType
type UserContextType = {
	dev: boolean;
	frameloop: 'always' | 'demand' | 'never';
	mobile: boolean;
	tabActive: boolean;
	theme: 'dark' | 'light';
	setFrameloop: (value: 'always' | 'demand' | 'never') => void;
	setTabActive: (value: boolean) => void;
	setTheme: (value: 'dark' | 'light') => void;
	toggleTheme: () => void;
};

// Create the UserContext with default values
const UserContext = createContext<UserContextType>({
	dev: false,
	frameloop: 'always',
	mobile: false,
	tabActive: true,
	theme: 'light',
	setFrameloop: () => {},
	setTabActive: () => {},
	setTheme: () => {},
	toggleTheme: () => {},
});

// Custom hook for using UserContext
export const useUserContext = () => useContext(UserContext);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
	const [mobile, setMobile] = useState(false);
	// const [dev] = useState(process.env.NODE_ENV === 'development');
	const dev = useMemo(() => process.env.NODE_ENV === 'development', []);

	const [theme, setTheme] = useState<'dark' | 'light'>('dark');
	const [tabActive, setTabActive] = useState(true);
	const [frameloop, setFrameloop] = useState<'always' | 'demand' | 'never'>('always');

	const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

	// Handle visibility change
	useEffect(() => {
		const handleVisibilityChange = () => setTabActive(!document.hidden);
		document.addEventListener('visibilitychange', handleVisibilityChange, false);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, []);

	// Handle device orientation and resize
	useEffect(() => {
		const checkMobile = () => setMobile(window.innerWidth < window.innerHeight);

		// Initial check
		checkMobile();

		// Event listeners for resize and orientation change
		window.addEventListener('resize', checkMobile);
		window.addEventListener('orientationchange', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('orientationchange', checkMobile);
		};
	}, []);

	// Log device information
	useEffect(() => {
		const parser = new UAParser();
		const deviceInfo = parser.getResult();
		// log(chalk.cyan(`Device Info: ${JSON.stringify(deviceInfo, null, 2)}`));
	}, []);

	return (
		<UserContext.Provider
			value={{
				dev,
				mobile,
				frameloop,
				tabActive,
				theme,
				setTheme,
				setFrameloop,
				setTabActive,
				toggleTheme,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export default UserContext;
