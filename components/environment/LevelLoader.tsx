// components/portal/environment/LevelLoader.tsx
import { Suspense } from 'react';
import { useLevelStore } from '../LevelManager';
import TestChamber00 from './levels/TestChamber00';
import TestChamber01 from './levels/TestChamber01';

// Define valid level IDs
type LevelId = '00' | '01';

// Map level IDs to their components
const levelComponents: Record<LevelId, React.ComponentType> = {
	'00': TestChamber00,
	'01': TestChamber01,
	// Add more as you create them
};

export default function LevelLoader() {
	const currentLevel = useLevelStore((state) => state.currentLevel) as LevelId;

	// Select the appropriate level component
	const LevelComponent = levelComponents[currentLevel] || TestChamber00;

	return (
		<Suspense fallback={null}>
			<LevelComponent />
		</Suspense>
	);
}
