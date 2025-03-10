import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Visual theme */
	theme?: 'light' | 'dark';
	/** Error state */
	error?: boolean;
	/** Success state */
	success?: boolean;
	/** Show loading state */
	/** Show loading state */
	loading?: boolean;
	/** Label text */

	label?: string;
	/** Helper text */
	helperText?: string;
	/** Additional CSS classes */
	className?: string;
	/** Left icon */
	leftIcon?: React.ReactNode;
	/** Right icon */
	rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			theme = 'light',
			error,
			success,
			loading,
			label,
			helperText,
			className,
			leftIcon,
			rightIcon,
			disabled,
			...props
		},
		ref
	) => {
		const inputWrapperClasses = classNames(
			styles.wrapper,
			styles[theme],
			{
				[styles.error]: error,
				[styles.success]: success,
				[styles.loading]: loading,
				[styles.disabled]: disabled,
				[styles.with_left_icon]: leftIcon,
				[styles.with_right_icon]: rightIcon,
			},
			className
		);

		return (
			<div className={inputWrapperClasses}>
				{label && <label className={styles.label}>{label}</label>}
				<div className={styles.input_container}>
					{leftIcon && <span className={styles.left_icon}>{leftIcon}</span>}
					<input
						ref={ref}
						className={styles.input}
						disabled={disabled || loading}
						{...props}
					/>
					{rightIcon && <span className={styles.right_icon}>{rightIcon}</span>}
					{loading && (
						<span className={styles.spinner} aria-hidden="true">
							⟳
						</span>
					)}
				</div>
				{helperText && <span className={styles.helper_text}>{helperText}</span>}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
