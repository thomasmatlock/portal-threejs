// MultiToggle.tsx
import React from 'react';
import classNames from 'classnames';
import styles from './MultiToggle.module.scss';
import type { MultiToggleProps } from './MultiToggle.props';

const MultiToggle: React.FC<MultiToggleProps> = ({
	options,
	value,
	onChange,
	theme = 'light',
	className,
	isConnectedBelow = false,
}) => {
	return (
		<div
			className={classNames(
				styles.container,
				styles[theme],
				{ [styles.connectedBelow]: isConnectedBelow },
				className
			)}
			role="tablist"
			aria-label="Toggle between options"
		>
			{options.map((option, index) => (
				<button
					key={option.id}
					role="tab"
					aria-selected={value === option.id}
					aria-controls={`panel-${option.id}`}
					className={classNames(styles.option, {
						[styles.active]: value === option.id,
						[styles.leftOption]: index === 0,
						[styles.rightOption]: index === options.length - 1,
					})}
					onClick={() => onChange(option.id)}
				>
					{option.icon && <span className={styles.icon}>{option.icon}</span>}
					<span className={styles.label}>{option.label}</span>
				</button>
			))}
		</div>
	);
};

export default MultiToggle;
