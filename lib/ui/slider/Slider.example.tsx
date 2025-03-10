import React, { useState, useCallback } from 'react';
import Slider from './Slider';
import styles from './Slider.module.scss';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const SliderExample: React.FC<ExampleProps> = ({ theme }) => {
	// State for different slider scenarios
	// State for different slider scenarios
	const [volumeLevel, setVolumeLevel] = useState(50);
	const [brightness, setBrightness] = useState(75);
	const [zoomLevel, setZoomLevel] = useState(100);
	const [customRange, setCustomRange] = useState(25);

	const handleValueChange = useCallback((sliderId: string, value: number) => {
		switch (sliderId) {
			case 'volume':
				setVolumeLevel(value);
				break;
			case 'brightness':
				setBrightness(value);
				break;
			case 'zoom':
				setZoomLevel(value);
				break;
			case 'custom-range':
				setCustomRange(value);
				break;
		}
	}, []);

	return (
		<div className={styles.sliderExampleContainer}>
			{/* Basic Usage */}
			<section className={styles.exampleSection}>
				<h6>Basic Usage</h6>
				<div className={styles.sliderWrapper}>
					<label>Volume: {volumeLevel}%</label>
					<Slider
						id="volume"
						value={volumeLevel}
						onValueChange={handleValueChange}
						theme={theme}
					/>
				</div>
			</section>

			{/* Custom Range */}
			<section className={styles.exampleSection}>
				<h6>Custom Range and Step</h6>
				<div className={styles.sliderWrapper}>
					<label>Brightness: {brightness}%</label>
					<Slider
						id="brightness"
						value={brightness}
						min={20}
						max={200}
						step={5}
						onValueChange={handleValueChange}
						theme={theme}
					/>
				</div>
			</section>

			{/* Controlled Component */}
			<section className={styles.exampleSection}>
				<h6>Controlled Component</h6>
				<div className={styles.sliderWrapper}>
					<label>Zoom Level: {zoomLevel}%</label>
					<Slider
						id="zoom"
						value={zoomLevel}
						min={50}
						max={150}
						step={10}
						onValueChange={handleValueChange}
						theme={theme}
					/>
					<div className={styles.controls}>
						<button
							onClick={() => handleValueChange('zoom', Math.max(50, zoomLevel - 10))}
							className={styles.controlButton}
						>
							-
						</button>
						<button
							onClick={() => handleValueChange('zoom', Math.min(150, zoomLevel + 10))}
							className={styles.controlButton}
						>
							+
						</button>
					</div>
				</div>
			</section>

			{/* With Value Display */}
			<section className={styles.exampleSection}>
				<h6>Custom Range with Fine Control</h6>
				<div className={styles.sliderWrapper}>
					<div className={styles.valueDisplay}>
						<label>Custom Range:</label>
						<input
							type="number"
							value={customRange}
							onChange={(e) =>
								handleValueChange('custom-range', Number(e.target.value))
							}
							min={0}
							max={100}
							className={styles.numberInput}
						/>
					</div>
					<Slider
						id="custom-range"
						value={customRange}
						onValueChange={handleValueChange}
						theme={theme}
					/>
				</div>
			</section>
		</div>
	);
};

export default SliderExample;
