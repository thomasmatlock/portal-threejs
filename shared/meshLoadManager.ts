// util/meshLoadManager.ts
class MeshLoadManager {
	private static instance: MeshLoadManager;
	private loadOrder: string[] = [];
	private loadedMeshes = new Set<string>();
	private subscribers = new Set<(meshName: string) => void>();

	private constructor() {
		this.loadMeshOrder();
	}

	static getInstance(): MeshLoadManager {
		if (!MeshLoadManager.instance) {
			MeshLoadManager.instance = new MeshLoadManager();
		}
		return MeshLoadManager.instance;
	}

	private async loadMeshOrder() {
		try {
			const response = await fetch('/models/meshLoadOrder.json');
			const data = await response.json();
			this.loadOrder = data.meshes.map((m: any) => m.name);
			// console.log(`[MeshLoadManager] Found ${this.loadOrder.length} meshes to load`);

			// Start loading
			this.startLoading();
		} catch (error) {
			console.error('[MeshLoadManager] Failed to load order:', error);
		}
	}

	private startLoading() {
		let index = 0;

		const loadNext = () => {
			if (index >= this.loadOrder.length) {
				// console.log(`[MeshLoadManager] ✅ All ${this.loadOrder.length} meshes loaded!`);
				return;
			}

			const meshName = this.loadOrder[index];
			this.loadedMeshes.add(meshName);

			// Log each mesh as it loads with progress
			console.log(
				`[MeshLoadManager] Loading ${index + 1}/${this.loadOrder.length}: ${meshName}`
			);

			// Notify all subscribers
			this.subscribers.forEach((callback) => callback(meshName));

			index++;
			setTimeout(loadNext, process.env.NODE_ENV === 'development' ? 0 : 0); // 10ms delay between loads
		};

		loadNext();
	}

	// Simple API
	isLoaded(meshName: string): boolean {
		return this.loadedMeshes.has(meshName);
	}

	subscribe(callback: (meshName: string) => void): () => void {
		this.subscribers.add(callback);
		// Return unsubscribe function that returns void
		return () => {
			this.subscribers.delete(callback);
		};
	}
}

export const meshLoadManager = MeshLoadManager.getInstance();
