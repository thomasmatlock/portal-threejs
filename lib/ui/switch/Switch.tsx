import React, { useCallback } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import classNames from 'classnames';
import styles from './Switch.module.scss';
import type { SwitchProps } from './Switch.props';

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{
			label,
			checked,
			defaultChecked = false,
			onCheckedChange,
			theme = 'light',
			disabled = false,
			size = 'md',
			id,

			ariaLabel = 'Toggle switch',
		},
		ref
	) => {
		const handleCheckedChange = useCallback(
			(isChecked: boolean) => {
				onCheckedChange?.(isChecked);
			},
			[onCheckedChange]
		);

		return (
			<div className={styles.switchContainer}>
				{label && (
					<label
						htmlFor={id}
						className={classNames(styles.label, {
							[styles.labelDark]: theme === 'dark',
							[styles.disabled]: disabled,
						})}
					>
						{label}
					</label>
				)}
				<SwitchPrimitive.Root
					ref={ref}
					id={id}
					checked={checked}
					defaultChecked={defaultChecked}
					onCheckedChange={handleCheckedChange}
					disabled={disabled}
					className={classNames(styles.root, styles[`size${size}`], {
						[styles.dark]: theme === 'dark',
						[styles.disabled]: disabled,
					})}
					aria-label={ariaLabel}
				>
					<SwitchPrimitive.Thumb className={styles.thumb} />
				</SwitchPrimitive.Root>
			</div>
		);
	}
);

Switch.displayName = 'Switch';

export default React.memo(Switch);
