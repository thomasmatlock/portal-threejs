import { useState, useEffect, useRef, useContext } from 'react';
import { Perf } from 'r3f-perf';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import UserContextProvider from '../context/userContext';
import AdaptiveFrameloop from './AdaptiveFrameloop';
import AdaptiveResolution from './AdaptiveResolution';

export default function Performance() {
	const { dev, mobile } = useContext(UserContextProvider);

	return (
		<>
			<Perf position={'top-right'} showGraph={false} style={{ top: '0rem' }} />
			{/* <Perf position={'bottom-right'} showGraph={false} /> */}
			{/* <AdaptiveFrameloop /> */}
			{/* <AdaptiveResolution /> */}
			{/* <AdaptiveDpr /> */}
			{/* <AdaptiveEvents /> */}
			{/* {mobile && (	
				<PerformanceMonitor
					onIncline={() => (dpr.current = deviceDpr.current)}
					onDecline={() => (dpr.current = 1)}
				/>
			)}
			{!mobile && (
				<PerformanceMonitor
					onIncline={() => (dpr.current = dpr.current)}
					onDecline={() => (dpr.current = 1)}
				/>
			)} */}
		</>
	);
}
