import React, { useMemo } from 'react';
import * as ProgressUI from '@radix-ui/react-progress';
import { clamp } from 'lodash';
import styles from './Progress.module.scss';
import type { ProgressProps } from './Progress.props';

const Progress: React.FC<ProgressProps> = ({
	progress,
	max = 100,
	min = 0,
	theme = 'light',
	indicatorColor,
	trackColor,
	style,
	className,
	showText = false,
	animate = true,
	height = 8,
	// ariaLabel = 'Progress',
	ariaLabel = 'Progress',

	indeterminate = false,
}) => {
	// Clamp progress value between min and max
	const normalizedProgress = useMemo(() => {
		const clampedValue = clamp(progress, min, max);
		return ((clampedValue - min) / (max - min)) * 100;
	}, [progress, min, max]);

	// Compute dynamic styles once
	const rootStyles = useMemo(
		() => ({
			...style,
			height: `${height}px`,
			backgroundColor: trackColor,
		}),
		[style, height, trackColor]
	);

	const indicatorStyles = useMemo(
		() => ({
			transform: `translateX(-${100 - normalizedProgress}%)`,
			backgroundColor: indicatorColor,
		}),
		[normalizedProgress, indicatorColor]
	);

	return (
		<div className={styles.progressWrapper}>
			<ProgressUI.Root
				className={`${styles.progressRoot} ${styles[`theme-${theme}`]} ${
					animate ? styles.animate : ''
				} ${indeterminate ? styles.indeterminate : ''} ${className || ''}`}
				style={rootStyles}
				value={normalizedProgress}
				max={max}
				aria-label={ariaLabel}
			>
				<ProgressUI.Indicator
					className={styles.progressIndicator}
					style={indicatorStyles}
				/>
			</ProgressUI.Root>
			{showText && (
				<div className={styles.progressText} aria-hidden="true">
					{Math.round(normalizedProgress)}%
				</div>
			)}
		</div>
	);
};

export default React.memo(Progress);
