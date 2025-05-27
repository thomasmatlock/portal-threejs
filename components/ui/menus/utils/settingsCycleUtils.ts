// Utility functions for cycling through settings options
// Extracted from settingsHandlers.ts for modularity

export const cycleOptionForward = <T>(current: T, options: T[]): T => {
	const currentIndex = options.indexOf(current);
	const nextIndex = (currentIndex + 1) % options.length;
	return options[nextIndex];
};

export const cycleOptionBackward = <T>(current: T, options: T[]): T => {
	const currentIndex = options.indexOf(current);
	const prevIndex = (currentIndex - 1 + options.length) % options.length;
	return options[prevIndex];
};
