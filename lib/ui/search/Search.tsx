import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import styles from './Search.module.scss';
import { SearchProps, defaultSearchProps } from './Search.props';
import Icon from '../icon/Icon';
import lightningIcon from '../../../public/icons/lightning.svg';
import closeIcon from '../../../public/icons/actions/cancel.svg';
import { FaceIcon, Cross1Icon, Cross2Icon } from '@radix-ui/react-icons';

import {
	SearchIcon,
	MailIcon,
	LockIcon,
	CheckIcon,
	AlertCircleIcon,
	LoaderIcon,
} from 'lucide-react';

// Extracted tip text constants
const TIP_TEXT = {
	EXIT: 'Esc to exit',
	// CLEAR: 'Esc to clear',
	CLEAR: 'Esc to clear',
} as const;

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
	(
		{
			id,
			placeholder = defaultSearchProps.placeholder,
			onSearch,
			onSubmit,
			theme = defaultSearchProps.theme,
			className,
			autoFocus = defaultSearchProps.autoFocus,
		},
		ref
	) => {
		const [value, setValue] = useState('');
		const [isFocused, setIsFocused] = useState(false);
		const [isBackspacing, setIsBackspacing] = useState(false);
		const inputRef = useRef<HTMLInputElement>(null);
		const lastValueRef = useRef(value);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const newValue = e.target.value;
				// Detect if user is backspacing by comparing with previous value
				setIsBackspacing(newValue.length < lastValueRef.current.length);
				lastValueRef.current = newValue;
				setValue(newValue);
				onSearch?.(newValue);
			},
			[onSearch]
		);

		const handleSubmit = useCallback(
			(e: React.FormEvent) => {
				e.preventDefault();
				onSubmit?.(value);
			},
			[value, onSubmit]
		);

		const handleClear = useCallback(() => {
			if (!value) {
				inputRef.current?.blur();
				return;
			}

			setValue('');
			onSearch?.('');
			inputRef.current?.focus();
			setIsBackspacing(false);
		}, [onSearch, value]);

		const handleFocus = () => setIsFocused(true);
		const handleBlur = () => {
			setIsFocused(false);
			setIsBackspacing(false);
		};

		// Memoize tip text calculation
		const tipText = useMemo(() => {
			if (isFocused && !value) return TIP_TEXT.EXIT;
			if (value) return TIP_TEXT.CLEAR;
			return '';
		}, [isFocused, value]);

		// Memoize event handlers
		const handleKeyDown = useCallback(
			(e: KeyboardEvent) => {
				if (e.key === 'Escape' && isFocused) {
					value ? handleClear() : inputRef.current?.blur();
					return;
				}

				if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
					e.preventDefault();
					inputRef.current?.focus();
				}
			},
			[isFocused, value, handleClear]
		);

		// Use layout effect for keyboard events
		useEffect(() => {
			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}, [handleKeyDown]);

		return (
			<form
				className={classNames(styles.search, className, {
					[styles.focused]: isFocused,
				})}
				onSubmit={handleSubmit}
				id={id}
			>
				<Icon icon={lightningIcon} size={16} className={styles.searchIcon} theme={theme} />

				<input
					ref={ref || inputRef}
					className={classNames(styles.input, {
						[styles.inputDark]: theme === 'dark',
					})}
					type="text"
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholder={isFocused ? '' : `${placeholder} (Ctrl+K)`}
					autoFocus={autoFocus}
					aria-label={placeholder}
				/>

				<div
					className={classNames(styles.clearWrapper, {
						[styles.visible]: value,
					})}
				>
					{tipText && <span className={styles.clearTip}>{tipText}</span>}
					<button
						type="button"
						className={styles.clearButton}
						onClick={handleClear}
						aria-label="Clear search"
					>
						<Icon icon={closeIcon} theme={theme} size={16} />
						{/* <Cross2Icon height={16} /> */}
						{/* <Icon icon={lightningIcon} theme={theme} size={16} /> */}
					</button>
				</div>
			</form>
		);
	}
);

Search.displayName = 'Search';

export default React.memo(Search);
