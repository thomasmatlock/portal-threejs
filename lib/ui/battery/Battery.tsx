import React from 'react';
import classNames from 'classnames';
import styles from './Battery.module.scss';

export interface BatteryProps {
	/** Battery percentage (0-100) */
	percentage: number;
	/** Icon size in pixels */
	size?: number;
	/** Visual theme */
	theme?: 'light' | 'dark';
	/** Additional CSS class */
	className?: string;
}

const Battery: React.FC<BatteryProps> = ({
	percentage = 100,
	size = 24,
	theme = 'light',
	className,
}) => {
	// Clamp percentage between 0 and 100
	// Clamp percentage between 0 and 100
	const batteryLevel = Math.min(100, Math.max(0, percentage));

	// Calculate the fill width based on percentage
	const fillWidth = (batteryLevel / 100) * 395.636;

	// Determine battery state class
	const getBatteryStateClass = () => {
		if (batteryLevel <= 20) return styles.critical;
		if (batteryLevel <= 40) return styles.warning;
		return styles.normal;
	};

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 512 512"
			className={classNames(styles.battery, className)}
			aria-label={`Battery ${batteryLevel}%`}
			role="img"
		>
			<g>
				{/* Battery outline */}
				<path
					className={styles.batteryOutline}
					d="M488.727,209.455v-46.545c0-25.706-20.839-46.545-46.545-46.545H46.545C20.839,116.364,0,137.203,0,162.909v186.182 c0,25.706,20.839,46.545,46.545,46.545h395.636c25.706,0,46.545-20.839,46.545-46.545v-46.545 c12.853,0,23.273-10.42,23.273-23.273v-46.545C512,219.874,501.58,209.455,488.727,209.455z M465.455,349.091 c0,12.853-10.42,23.273-23.273,23.273H46.545c-12.853,0-23.273-10.42-23.273-23.273V162.909c0-12.853,10.42-23.273,23.273-23.273 h395.636c12.853,0,23.273,10.42,23.273,23.273V349.091z"
				/>
				{/* Battery fill */}
				<rect
					className={classNames(styles.batteryFill, getBatteryStateClass())}
					x="46.545"
					y="162.909"
					width={fillWidth}
					height="186.182"
				/>
			</g>
		</svg>
	);
};

export default Battery;
