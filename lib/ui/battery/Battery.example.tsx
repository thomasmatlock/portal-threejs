// Battery.example.tsx
import React, { useState, useEffect } from 'react';
import Battery from './Battery';
import styles from './Battery.example.module.scss';

interface BatteryExampleProps {
	theme: 'light' | 'dark';
}

const BatteryExample: React.FC<BatteryExampleProps> = ({ theme }) => {
	const [percentage, setPercentage] = useState(100);

	useEffect(() => {
		// Generate a new random percentage every 2 seconds
		const interval = setInterval(() => {
			// Random value between 0 and 100
			// Random value between 0 and 100
			const randomPercentage = Math.floor(Math.random() * 101);
			setPercentage(randomPercentage);
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h6>Battery States</h6>
				<div className={styles.group}>
					<div className={styles.batteryWrapper}>
						<Battery percentage={100} theme={theme} />
						<span className={styles.label}>100%</span>
					</div>
					<div className={styles.batteryWrapper}>
						<Battery percentage={75} theme={theme} />
						<span className={styles.label}>75%</span>
					</div>
					<div className={styles.batteryWrapper}>
						<Battery percentage={50} theme={theme} />
						<span className={styles.label}>50%</span>
					</div>
					<div className={styles.batteryWrapper}>
						<Battery percentage={25} theme={theme} />
						<span className={styles.label}>25%</span>
					</div>
					<div className={styles.batteryWrapper}>
						<Battery percentage={10} theme={theme} />
						<span className={styles.label}>10%</span>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h6>Sizes</h6>
				<div className={styles.group}>
					<div className={styles.batteryWrapper}>
						<Battery percentage={percentage} size={16} theme={theme} />
						<span className={styles.label}>Small</span>
					</div>
					<div className={styles.batteryWrapper}>
						<Battery percentage={percentage} size={24} theme={theme} />
						<span className={styles.label}>Medium</span>
					</div>
					<div className={styles.batteryWrapper}>
						<Battery percentage={percentage} size={32} theme={theme} />
						<span className={styles.label}>Large</span>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h6>Animated Demo</h6>
				<div className={styles.group}>
					<div className={styles.batteryWrapper}>
						<Battery percentage={percentage} size={32} theme={theme} />
						<span className={styles.label}>{percentage}%</span>
					</div>
				</div>
			</section>
		</div>
	);
};

export default BatteryExample;
