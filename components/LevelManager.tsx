// components/portal/LevelManager.tsx
import { create } from 'zustand';

export type LevelData = {
	id: string;
	name: string;
	description: string;
};

interface LevelState {
	currentLevel: string;
	levels: Record<string, LevelData>;
	changeLevel: (levelId: string) => void;
}

export const useLevelStore = create<LevelState>((set) => ({
	currentLevel: '00',
	levels: {
		'00': {
			id: '00',
			name: 'Test Chamber 00',
			description: 'Tutorial: Basic movement',
		},
		'01': {
			id: '01',
			name: 'Test Chamber 01',
			description: 'Portal Introduction',
		},
		// Add more levels as needed
	},
	changeLevel: (levelId) => set({ currentLevel: levelId }),
}));
