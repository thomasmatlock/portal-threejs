import { useState, useEffect } from 'react';

/**
 * Background image utilities for Portal game
 */

// Available background images
export const portalBackgrounds = [
	'/images/portal/wallpaper.webp',
	'/images/portal/wallpaper2.webp',
	'/images/portal/wallpaper3.webp',
];

// Preload all background images to prevent flickering
if (typeof window !== 'undefined') {
	portalBackgrounds.forEach((src) => {
		const img = new Image();
		img.src = src;
	});
}

// Keep track of previously used backgrounds to avoid repetition
let previousBackgrounds: string[] = [];

/**
 * Gets a random background image that's different from the current one
 * and tries to avoid repeating the same sequence
 * @param currentBackground The current background image URL
 * @returns A new random background image URL
 */
export const getRandomBackground = (currentBackground: string): string => {
	// If we only have one background, just return it
	if (portalBackgrounds.length <= 1) {
		return portalBackgrounds[0];
	}

	// Create a list of available backgrounds (excluding the current one)
	const availableBackgrounds = portalBackgrounds.filter((bg) => bg !== currentBackground);

	// If we've used all backgrounds except one, reset the history
	if (previousBackgrounds.length >= portalBackgrounds.length - 1) {
		previousBackgrounds = [currentBackground];
	}

	// Filter out recently used backgrounds if possible
	let candidateBackgrounds = availableBackgrounds.filter(
		(bg) => !previousBackgrounds.includes(bg)
	);

	// If we've filtered out all options, just use any background that's not the current one
	if (candidateBackgrounds.length === 0) {
		candidateBackgrounds = availableBackgrounds;
	}

	// Pick a random background from the candidates
	const randomIndex = Math.floor(Math.random() * candidateBackgrounds.length);
	const newBackground = candidateBackgrounds[randomIndex];

	// Add to history
	previousBackgrounds.push(newBackground);

	return newBackground;
};

/**
 * Hook to use in components for background rotation
 * @param intervalMs The interval in milliseconds between background changes (default: 5000)
 * @returns An object with the current background and a function to force a background change
 */
export const useBackgroundRotation = (intervalMs = 5000) => {
	// Start with a random background image
	const getInitialBackground = () => {
		const randomIndex = Math.floor(Math.random() * portalBackgrounds.length);
		return portalBackgrounds[randomIndex];
	};

	const [currentBackground, setCurrentBackground] = useState(getInitialBackground());

	// Force a background change
	const changeBackground = () => {
		setCurrentBackground(getRandomBackground(currentBackground));
	};

	// Set up background image rotation with fixed interval
	useEffect(() => {
		// Set up the interval for background changes
		const interval = setInterval(changeBackground, intervalMs);

		// Return cleanup function
		return () => clearInterval(interval);
	}, []); // Remove currentBackground dependency to prevent reset on each change

	return { currentBackground, changeBackground };
};
