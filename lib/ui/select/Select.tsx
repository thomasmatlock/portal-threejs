import React, { useMemo } from 'react';
import * as SelectUI from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import styles from './Select.module.scss';
import type { SelectProps } from './Select.props';

// Memoized SelectItem sub-component
// Memoized SelectItem sub-component
const SelectItem = React.memo(
	React.forwardRef<HTMLDivElement, SelectUI.SelectItemProps>(
		({ children, className, ...props }, forwardedRef) => (
			<SelectUI.Item
				className={classNames(styles.SelectItem, className)}
				{...props}
				ref={forwardedRef}
			>
				<SelectUI.ItemText>{children}</SelectUI.ItemText>
				<SelectUI.ItemIndicator className={styles.SelectItemIndicator}>
					<CheckIcon />
				</SelectUI.ItemIndicator>
			</SelectUI.Item>
		)
	)
);

SelectItem.displayName = 'SelectItem';

const Select = ({
	items,
	placeholder = 'Select an option',
	onValueChange,
	theme = 'light',
	defaultValue,
	ariaLabel = 'Select option',
}: SelectProps) => {
	// Memoized Computations
	const computedDefaultValue = useMemo(
		() =>
			defaultValue ||
			items.flatMap((group) => group.items).find((item) => item.default)?.value ||
			undefined,
		[defaultValue, items]
	);

	const themeStyles = useMemo(
		() => ({
			color: theme === 'dark' ? 'white' : 'black',
		}),
		[theme]
	);

	return (
		<SelectUI.Root onValueChange={onValueChange} defaultValue={computedDefaultValue}>
			<SelectUI.Trigger
				className={classNames(styles.SelectTrigger, theme === 'dark' && styles.dark)}
				style={themeStyles}
				aria-label={ariaLabel}
			>
				<SelectUI.Value placeholder={placeholder} />
				<SelectUI.Icon className={styles.SelectIcon}>
					<ChevronDownIcon style={themeStyles} />
				</SelectUI.Icon>
			</SelectUI.Trigger>

			<SelectUI.Portal>
				<SelectUI.Content
					className={classNames(styles.SelectContent, theme === 'dark' && styles.dark)}
					position="popper"
					sideOffset={5}
				>
					<SelectUI.ScrollUpButton className={styles.SelectScrollButton}>
						<ChevronUpIcon />
					</SelectUI.ScrollUpButton>

					<SelectUI.Viewport className={styles.SelectViewport}>
						{items.map((group, groupIndex) => (
							<React.Fragment key={`group-${group.label || groupIndex}`}>
								<SelectUI.Group>
									{group.label && groupIndex > 0 && (
										<>
											<SelectUI.Separator
												className={styles.SelectSeparator}
											/>
											<SelectUI.Label className={styles.SelectLabel}>
												{group.label}
											</SelectUI.Label>
										</>
									)}
									{group.label && groupIndex === 0 && (
										<SelectUI.Label className={styles.SelectLabel}>
											{group.label}
										</SelectUI.Label>
									)}
									{group.items.map((item) => (
										<SelectItem
											key={item.value}
											value={item.value}
											disabled={item.disabled}
										>
											{item.label}
										</SelectItem>
									))}
								</SelectUI.Group>
							</React.Fragment>
						))}
					</SelectUI.Viewport>

					<SelectUI.ScrollDownButton className={styles.SelectScrollButton}>
						<ChevronDownIcon />
					</SelectUI.ScrollDownButton>
				</SelectUI.Content>
			</SelectUI.Portal>
		</SelectUI.Root>
	);
};

export default React.memo(Select);
