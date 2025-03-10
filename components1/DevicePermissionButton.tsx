import React, { useState, useEffect } from 'react';

interface DeviceOrientationEventStaticiOS extends EventTarget {
	requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}

interface DevicePermissionButtonProps {
	onPermissionGranted: () => void;
}

export const DevicePermissionButton = ({ onPermissionGranted }: DevicePermissionButtonProps) => {
	const [isIOS, setIsIOS] = useState(false);

	useEffect(() => {
		// Check if we're in the browser and if it's iOS
		if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
			setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
		}
	}, []);

	const requestPermission = async () => {
		console.log('Requesting device orientation permission...');
		const DeviceOrientationEventIOS =
			DeviceOrientationEvent as unknown as DeviceOrientationEventStaticiOS;

		if (typeof DeviceOrientationEventIOS.requestPermission === 'function') {
			try {
				const permission = await DeviceOrientationEventIOS.requestPermission();
				console.log('Permission response:', permission);
				if (permission === 'granted') {
					onPermissionGranted();
				}
			} catch (error) {
				console.error('Error requesting permission:', error);
			}
		} else {
			console.log('Device does not require explicit permission');
			onPermissionGranted();
		}
	};

	// Don't render anything during SSR or if not iOS
	if (typeof window === 'undefined' || !isIOS) return null;

	return (
		<div
			style={{
				position: 'fixed',
				bottom: '2rem',
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 1000,
			}}
		>
			<button
				onClick={requestPermission}
				style={{
					padding: '0.25rem ',
					backgroundColor: '#1a1a1a',
					color: 'white',
					border: 'none',
					borderRadius: '8px',
					height: '2.5rem',
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minWidth: '200px',
					fontSize: '14px',
					fontWeight: '500',
					transition: 'background-color 0.2s ease',
				}}
			>
				Enable Device Controls
			</button>
		</div>
	);
};

export default DevicePermissionButton;
