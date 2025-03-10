import pointerEventHandlers from './pointerEventHandlers';

export const getPointerProps = (userData?: { name?: string }) => {
	if (!userData?.name) {
		console.warn('No userData.name provided for pointer props');
	}
	return Object.fromEntries(
		Object.entries(pointerEventHandlers).map(([key, handler]) => [
			`on${key.replace('handle', '')}`,
			handler,
		])
	);
};
