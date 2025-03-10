import React, { useState, useEffect } from 'react';
import Progress from './Progress';
import styles from './Progress.example.module.scss';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const ProgressExample: React.FC<ExampleProps> = ({ theme }) => {
	// State for different progress scenarios
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [downloadProgress, setDownloadProgress] = useState(60);
	const [customProgress, setCustomProgress] = useState(75);

	// Simulate a loading process
	// Simulate a loading process
	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingProgress((prev) => (prev >= 100 ? 0 : prev + 5));
		}, 100);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.container}>
			{/* Basic Usage */}
			<section className={styles.section}>
				<h6>Basic Usage</h6>
				<Progress progress={60} theme={theme} />
			</section>

			{/* Animated Loading */}
			<section className={styles.section}>
				<h6>Animated Loading</h6>
				<Progress
					progress={loadingProgress}
					showText
					theme={theme}
					ariaLabel="Loading progress"
				/>
			</section>

			{/* Custom Styling */}
			{/* <section className={styles.section}>
				<h6>Custom Styling</h6>
				<div className={styles.customExamples}>
					<Progress progress={75} theme={theme} height={4} showText />
					<Progress progress={75} theme={theme} height={12} showText />
					<Progress
						progress={75}
						theme={theme}
						indicatorColor="#4CAF50"
						trackColor="#E8F5E9"
						showText
					/>
				</div>
			</section> */}

			{/* Indeterminate Progress */}
			<section className={styles.section}>
				<h6>Indeterminate Progress</h6>
				<Progress progress={0} indeterminate theme={theme} height={4} />
			</section>

			{/* Interactive Example */}
			<section className={styles.section}>
				<h6>Interactive Example</h6>
				<div className={styles.interactive}>
					<Progress
						progress={downloadProgress}
						showText
						theme={theme}
						ariaLabel="Download progress"
					/>
					<div className={styles.controls}>
						<button
							onClick={() => setDownloadProgress((prev) => Math.max(0, prev - 10))}
							className={theme === 'light' ? styles.button : styles.buttonDark}
						>
							-10%
						</button>
						<button
							onClick={() => setDownloadProgress((prev) => Math.min(100, prev + 10))}
							className={theme === 'light' ? styles.button : styles.buttonDark}
						>
							+10%
						</button>
					</div>
				</div>
			</section>

			{/* Custom Range */}
			{/* <section className={styles.section}>
				<h6>Custom Range</h6>
				<Progress
					progress={customProgress}
					min={50}
					max={150}
					showText
					theme={theme}
					className={styles.customRange}
				/>
			</section> */}
		</div>
	);
};

export default ProgressExample;
