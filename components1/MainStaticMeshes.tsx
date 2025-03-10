import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Pi } from 'lucide-react';
// import MacbookM4 from '../models/MacbookM4';
// import MacbookM4_ktx2 from '../models/MacbookM4_ktx2';

const { log } = console;

const MacbookM4 = dynamic(() => import('../models/MacbookM4').then((mod) => mod.Model), {
	ssr: false,
});
const MacbookM4_ktx2 = dynamic(() => import('../models/MacbookM4_ktx2').then((mod) => mod.Model), {
	ssr: false,
});
const Turret = dynamic(() => import('../models/Turret').then((mod) => mod.Model), {
	ssr: false,
});

export default function MainAnimatedMeshes() {
	const [minDistance] = useState(0);
	const [maxDistance] = useState(5);
	const [steps] = useState(4);
	const [distances, setDistances] = useState(() => {
		// Calculate 4 equally spaced distances between min and max
		const step = (maxDistance - minDistance) / (steps - 1); // 3 steps for 4 values
		// console.log(step);
		const newDistances = [
			Number(minDistance.toFixed(1)),
			Number((minDistance + step).toFixed(1)),
			Number((minDistance + 2 * step).toFixed(1)),
			Number(maxDistance.toFixed(1)),
		];
		newDistances.forEach((distance) => {
			// console.log(distance);
		});
		return newDistances;
	});

	// Remove the interval effect since we're using fixed distances now
	// If you still want dynamic behavior, we can modify this approach

	return (
		<>
			<MacbookM4 distances={[0, 3, 6, 9]} position={[0, 0, 0]} />
			{/* <MacbookM4_ktx2 position={[0.2, 0, 0]} /> */}
			{/* <MacbookM4 distances={[1, 2, 3, 4]} /> */}
		</>
	);
}
