import React, { useCallback, useMemo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronRightIcon, CheckIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import Icon from '../icon/Icon';
import styles from './Dropdown.module.scss';
import moreIcon from '../../../public/icons/hamburger.svg';
import type { DropdownProps, DropdownItem } from './Dropdown.props';

const DropdownMenuItem = ({
	item,
	onSelect,
	theme,
}: {
	item: DropdownItem;
	onSelect: (value: string) => void;
	// theme: 'light' | 'dark';
	theme: 'light' | 'dark';
}) => {
	const handleSelect = useCallback(() => {
		if (!item.disabled) {
			onSelect(item.value);
		}
	}, [item.value, item.disabled, onSelect]);

	if (item.submenu) {
		return (
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger
					className={styles.DropdownMenuSubTrigger}
					disabled={item.disabled}
				>
					{item.icon && (
						<span className={styles.IconSlot}>
							<Icon icon={item.icon} size={16} theme={theme} />
						</span>
					)}
					{item.label}
					<div className={styles.RightSlot}>
						<ChevronRightIcon />
					</div>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.Portal>
					<DropdownMenu.SubContent
						className={styles.DropdownMenuSubContent}
						sideOffset={2}
						alignOffset={-5}
					>
						{item.submenu.map((subItem) => (
							<DropdownMenuItem
								key={subItem.value}
								item={subItem}
								onSelect={onSelect}
								theme={theme}
							/>
						))}
					</DropdownMenu.SubContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Sub>
		);
	}

	return (
		<DropdownMenu.Item
			className={styles.DropdownMenuItem}
			disabled={item.disabled}
			onSelect={handleSelect}
		>
			{item.icon && (
				<span className={styles.IconSlot}>
					<Icon icon={item.icon} size={16} theme={theme} />
				</span>
			)}
			{item.label}
			{item.selected && (
				<div className={styles.RightSlot}>
					<CheckIcon />
				</div>
			)}
			{item.shortcut && <div className={styles.RightSlot}>{item.shortcut}</div>}
		</DropdownMenu.Item>
	);
};

const Dropdown = ({
	items,
	theme,
	onSelect,
	position = 'bottom',
	align = 'start',
	trigger,
	disabled = false,
	ariaLabel = 'Dropdown menu',
}: DropdownProps) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				{trigger || (
					<button className={styles.IconButton} aria-label={ariaLabel}>
						<Icon icon={moreIcon} theme={theme} size={16} />
					</button>
				)}
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className={styles.DropdownMenuContent}
					sideOffset={5}
					align={align}
					side={position}
				>
					{items.map((group, groupIndex) => (
						<React.Fragment key={`group-${group.label || groupIndex}`}>
							{groupIndex > 0 && (
								<DropdownMenu.Separator className={styles.DropdownMenuSeparator} />
							)}
							{group.label && (
								<DropdownMenu.Label className={styles.DropdownMenuLabel}>
									{group.label}
								</DropdownMenu.Label>
							)}
							{group.items.map((item) => (
								<DropdownMenuItem
									key={item.value}
									item={item}
									onSelect={onSelect}
									theme={theme}
								/>
							))}
						</React.Fragment>
					))}
					<DropdownMenu.Arrow className={styles.DropdownMenuArrow} />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default React.memo(Dropdown);
