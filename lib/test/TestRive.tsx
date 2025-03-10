import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useState, useCallback, useMemo } from 'react';
import styles from './TestRive.module.scss';

interface AnimationProps {
	src?: string;
	className?: string;
	onStateChange?: (state: string) => void;
}
// import gear from '../../public/icons/gear2.svg';

const ResponsiveAnimation: React.FC<AnimationProps> = ({
	// src = '/rive/zelda.riv',
	// src = '/rive/zelda',
	// src = '/rive/responsive_core.riv',
	// src = '/rive/mode_switch.riv',
	// src = '/rive/spinner.riv',
	// src = '/rive/master_controllers.riv',
	// src = '/rive/inventory.riv',
	src = '/rive/folder.riv',
	// src = '/rive/spacesheep.riv',
	// src = '/rive/spacesheep.riv',
	// src = '/rive/trooperbird.riv',
	// src = '/rive/lumberjack_walk_cycle.riv',
	// src = '/rive/eclipse.riv',
	// src = '/rive/rive_logo.riv',
	// src = '/rive/dial.riv',
	// src = '/rive/spiral.riv',
	// src = '/rive/test.riv',
	className = '',
	onStateChange,
}) => {
	const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'error'>('playing');
	const [statusText, setStatusText] = useState<string>('Animation playing');

	const layout = useMemo(
		() =>
			new Layout({
				fit: Fit.Cover,
				alignment: Alignment.Center,
			}),
		[]
	);

	const { rive, RiveComponent } = useRive({
		src,
		stateMachines: 'State Machine 1',
		autoplay: true,
		layout,
		onLoadError: () => {
			setPlaybackState('error');
			setStatusText('Failed to load animation');
			onStateChange?.('error');
		},
		onPause: () => {
			setPlaybackState('paused');
			setStatusText('Animation paused');
			onStateChange?.('paused');
		},
		onPlay: () => {
			setPlaybackState('playing');
			setStatusText('Animation playing');
			onStateChange?.('playing');
		},
	});

	const togglePlayback = useCallback(() => {
		if (!rive) return;
		if (playbackState === 'playing') {
			rive.pause();
		} else {
			rive.play();
		}
	}, [playbackState, rive]);

	return (
		<div className={styles.container}>
			<div className={`${styles.animationWrapper} ${className}`}>
				{playbackState === 'error' ? (
					<div className={styles.error}>Failed to load animation</div>
				) : (
					<RiveComponent className={styles.animation} />
				)}
			</div>

			{/* <div className={styles.controls}> */}
			{/* <p className={styles.status}>{statusText}</p> */}
			{/* <button onClick={togglePlayback} className={styles.button}>
					{playbackState === 'playing' ? 'Pause' : 'Play'}
				</button> */}
			{/* </div> */}
		</div>
	);
};

export default ResponsiveAnimation;
