import React from 'react';
import Icon from './Icon';
import styles from './Icon.example.module.scss';
// import processIcon from '../../../public/icons/processSolid.svg';
import processIcon from '../../../public/icons/device/battery75.svg';
import dragAndDrop from '../../../public/icons/device/battery25.svg';

interface IconExampleProps {
	theme: 'light' | 'dark';
}

const IconExample: React.FC<IconExampleProps> = ({ theme }) => {
	const sizes: [12, 16, 20, 24, 32, 48] = [12, 16, 20, 24, 32, 48];

	return (
		<div className={styles.container}>
			{/* Basic Usage */}
			<section className={styles.section}>
				<h6>Basic Usage</h6>
				<div className={styles.iconGrid}>
					<Icon icon={processIcon} theme={theme} />
					<Icon icon={dragAndDrop} theme={theme} />
				</div>
			</section>

			{/* Size Variants */}
			<section className={styles.section}>
				<h6>Size Variants</h6>
				<div className={styles.iconGrid}>
					{sizes.map((size) => (
						<div key={size} className={styles.iconWrapper}>
							<Icon icon={processIcon} size={size} theme={theme} />
							<span className={styles.sizeLabel}>{size}px</span>
						</div>
					))}
				</div>
			</section>

			{/* Theme Comparison */}
			<section className={styles.section}>
				<h6>Theme Comparison</h6>
				<div className={styles.themeGrid}>
					<div className={styles.themeExample}>
						<Icon icon={processIcon} theme="light" size={24} />
						<span className={styles.themeLabel}>Light Theme</span>
					</div>
					<div className={`${styles.themeExample} ${styles.darkBackground}`}>
						<Icon icon={processIcon} theme="dark" size={24} />
						<span className={`${styles.themeLabel} ${styles.darkLabel}`}>
							Dark Theme
						</span>
					</div>
				</div>
			</section>

			{/* With Labels (Accessibility) */}
			<section className={styles.section}>
				<h6>With Labels (Accessibility)</h6>
				<div className={styles.iconGrid}>
					<Icon icon={processIcon} label="Process Icon" size={24} theme={theme} />
					<Icon icon={dragAndDrop} label="Drag and Drop Icon" size={24} theme={theme} />
				</div>
			</section>
		</div>
	);
};

export default IconExample;
