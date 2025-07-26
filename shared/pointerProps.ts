import pointerEventHandlers from './pointerEventHandlers';

export const getPointerProps = () => {
	return Object.fromEntries(
		Object.entries(pointerEventHandlers).map(([key, handler]) => [
			`on${key.replace('handle', '')}`,
			handler,
		])
	);
};
