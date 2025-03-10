// File goals: Display current camera position in bottom center of screen for debugging 3D scenes
// Provides real-time position tracking with configurable refresh rate and styling

import React, { useEffect, useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import chalk from 'chalk';
import styles from './CameraPositionDebug.module.scss';

interface CameraPositionDebugProps {
	refreshRate?: number;
	precision?: number;
	showRotation?: boolean;
	compact?: boolean;
}

const CameraPositionDebug: React.FC<CameraPositionDebugProps> = ({
	refreshRate = 100,
	precision = 2,
	showRotation = false,
	compact = false,
}) => {
	const { camera } = useThree();
	const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
	const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
	const prevPosition = useRef({ x: 0, y: 0, z: 0 });
	const prevRotation = useRef({ x: 0, y: 0, z: 0 });
	const [changedValues, setChangedValues] = useState({
		x: false,
		y: false,
		z: false,
		rx: false,
		ry: false,
		rz: false,
	});

	useEffect(() => {
		const updateCameraPosition = () => {
			const newPosition = {
				x: Number(camera.position.x.toFixed(precision)),
				y: Number(camera.position.y.toFixed(precision)),
				z: Number(camera.position.z.toFixed(precision)),
			};

			const newChangedValues = {
				x: newPosition.x !== prevPosition.current.x,
				y: newPosition.y !== prevPosition.current.y,
				z: newPosition.z !== prevPosition.current.z,
				rx: false,
				ry: false,
				rz: false,
			};

			setPosition(newPosition);
			prevPosition.current = newPosition;

			if (showRotation) {
				const newRotation = {
					x: Number(camera.rotation.x.toFixed(precision)),
					y: Number(camera.rotation.y.toFixed(precision)),
					z: Number(camera.rotation.z.toFixed(precision)),
				};

				newChangedValues.rx = newRotation.x !== prevRotation.current.x;
				newChangedValues.ry = newRotation.y !== prevRotation.current.y;
				newChangedValues.rz = newRotation.z !== prevRotation.current.z;

				setRotation(newRotation);
				prevRotation.current = newRotation;
			}

			setChangedValues(newChangedValues);

			// Reset changed values after animation duration
			setTimeout(() => {
				setChangedValues({ x: false, y: false, z: false, rx: false, ry: false, rz: false });
			}, 300);
		};

		// Initial update
		updateCameraPosition();

		// Set up interval for updates
		const intervalId = setInterval(updateCameraPosition, refreshRate);

		console.log(chalk.blue(`Camera debug initialized with ${refreshRate}ms refresh rate`));

		return () => {
			clearInterval(intervalId);
			console.log(chalk.gray('Camera debug component unmounted'));
		};
	}, [camera, precision, refreshRate, showRotation]);

	return (
		<Html fullscreen style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}>
			<div className={styles.debugContainer}>
				{compact ? (
					// Compact layout - all on one row
					<div className={styles.positionRow}>
						<div className={styles.positionValue}>
							<span className={styles.label}>X:</span>
							<span
								className={`${styles.value} ${styles.xValue} ${
									changedValues.x ? styles.valueChanged : ''
								}`}
							>
								{position.x}
							</span>
						</div>
						<div className={styles.positionValue}>
							<span className={styles.label}>Y:</span>
							<span
								className={`${styles.value} ${styles.yValue} ${
									changedValues.y ? styles.valueChanged : ''
								}`}
							>
								{position.y}
							</span>
						</div>
						<div className={styles.positionValue}>
							<span className={styles.label}>Z:</span>
							<span
								className={`${styles.value} ${styles.zValue} ${
									changedValues.z ? styles.valueChanged : ''
								}`}
							>
								{position.z}
							</span>
						</div>
					</div>
				) : (
					// Standard layout - position values
					<>
						<div className={styles.positionRow}>
							<div className={styles.positionValue}>
								<span className={styles.label}>X:</span>
								<span
									className={`${styles.value} ${styles.xValue} ${
										changedValues.x ? styles.valueChanged : ''
									}`}
								>
									{position.x}
								</span>
							</div>
							<div className={styles.positionValue}>
								<span className={styles.label}>Y:</span>
								<span
									className={`${styles.value} ${styles.yValue} ${
										changedValues.y ? styles.valueChanged : ''
									}`}
								>
									{position.y}
								</span>
							</div>
							<div className={styles.positionValue}>
								<span className={styles.label}>Z:</span>
								<span
									className={`${styles.value} ${styles.zValue} ${
										changedValues.z ? styles.valueChanged : ''
									}`}
								>
									{position.z}
								</span>
							</div>
						</div>
					</>
				)}

				{showRotation && (
					<>
						<div className={styles.divider}></div>
						<div className={styles.positionRow}>
							<div className={styles.positionValue}>
								<span className={styles.label}>RX:</span>
								<span
									className={`${styles.value} ${
										changedValues.rx ? styles.valueChanged : ''
									}`}
								>
									{rotation.x}
								</span>
							</div>
							<div className={styles.positionValue}>
								<span className={styles.label}>RY:</span>
								<span
									className={`${styles.value} ${
										changedValues.ry ? styles.valueChanged : ''
									}`}
								>
									{rotation.y}
								</span>
							</div>
							<div className={styles.positionValue}>
								<span className={styles.label}>RZ:</span>
								<span
									className={`${styles.value} ${
										changedValues.rz ? styles.valueChanged : ''
									}`}
								>
									{rotation.z}
								</span>
							</div>
						</div>
					</>
				)}
			</div>
		</Html>
	);
};

export default CameraPositionDebug;
