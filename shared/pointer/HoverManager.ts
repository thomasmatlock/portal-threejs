// shared/HoverManager.ts
/*
Simple global hover state manager
- Only one piece can be hovered at a time
- No React re-renders needed
- Direct updates for performance
*/

class HoverManager {
	current: string | null = null;
	listeners: Set<(piece: string | null) => void> = new Set();

	setHovered(piece: string | null) {
		if (this.current !== piece) {
			this.current = piece;
			// Notify all listeners
			this.listeners.forEach((listener) => listener(piece));
		}
	}

	subscribe(listener: (piece: string | null) => void) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
}

export const hoverManager = new HoverManager();
