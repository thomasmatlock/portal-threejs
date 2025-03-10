import dynamic from 'next/dynamic';
import InputContext from '@/context/inputContext';
import { useContext, useEffect } from 'react';

const { log } = console;
// const AM_WindmillBlades = dynamic(
// 	() => import('../models/AM_WindmillBlades').then((mod) => mod.Model),
// 	{
// 		ssr: false,
// 	}
// );
// const COLL_Cells = dynamic(() => import('../models/512/COLL_Cells').then((mod) => mod.Model), {
// 	ssr: false,
// });

export default function MainAnimatedMeshes() {
	const { timestamp, goToStart, goToEnd, toggleScrollable, scrollable } =
		useContext(InputContext);
	useEffect(() => {
		// Add any side effects you want to run here
		// For example, logging initialization
		// log(scrollable);
		return () => {
			// Cleanup function (optional)
		};
	}, [scrollable]); //
	return (
		<>
			{/* <AM_WindmillBlades scrollable={scrollable} /> */}
			{/* <COLL_Cells scrollable={scrollable} /> */}
		</>
	);
}
