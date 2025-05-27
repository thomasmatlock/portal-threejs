import styles from './Crosshair.module.scss';

interface CrosshairProps {
	className?: string;
}

/**
 * Crosshair component - renders the game's targeting reticle
 * Features a center dot with four surrounding directional dots
 */
export default function Crosshair({ className }: CrosshairProps) {
	return (
		<div className={`${styles.crosshair} ${className || ''}`}>
			<div className={styles.reticle} />
			<div className={styles.reticle} />
			<div className={styles.reticle} />
			<div className={styles.reticle} />
			<div className={styles.reticle} />
		</div>
	);
}
