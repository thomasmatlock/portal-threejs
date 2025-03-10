import React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { DotFilledIcon, CheckIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import styles from './ContextMenu.module.scss';
// import styles from './ContextMenu.module.scss';
import { ContextMenuProps, ContextMenuItem } from './ContextMenu.props';

const ContextMenuComponent = React.forwardRef<HTMLDivElement, ContextMenuProps>(
	({ theme = 'light', items, trigger, onSelect }, ref) => {
		return (
			<ContextMenuPrimitive.Root>
				<ContextMenuPrimitive.Trigger
					className={classNames(styles.ContextMenuTrigger, {
						[styles.ContextMenuTriggerDark]: theme === 'dark',
					})}
					ref={ref}
				>
					{trigger || 'Right click here'}
				</ContextMenuPrimitive.Trigger>

				<ContextMenuPrimitive.Portal>
					<ContextMenuPrimitive.Content
						className={classNames(styles.ContextMenuContent, {
							[styles.ContextMenuContentDark]: theme === 'dark',
						})}
					>
						{items.map((item, index) => (
							<RenderMenuItem
								key={index}
								item={item}
								theme={theme}
								onSelect={onSelect}
							/>
						))}
					</ContextMenuPrimitive.Content>
				</ContextMenuPrimitive.Portal>
			</ContextMenuPrimitive.Root>
		);
	}
);

const RenderMenuItem = ({
	item,
	theme,
	onSelect,
}: {
	item: ContextMenuItem;
	theme: 'light' | 'dark';
	onSelect?: (value: string) => void;
}) => {
	if (item.type === 'separator') {
		return <ContextMenuPrimitive.Separator className={styles.ContextMenuSeparator} />;
	}

	if (item.type === 'label') {
		return (
			<ContextMenuPrimitive.Label className={styles.ContextMenuLabel}>
				{item.label}
			</ContextMenuPrimitive.Label>
		);
	}

	if (item.type === 'checkbox') {
		return (
			<ContextMenuPrimitive.CheckboxItem
				className={styles.ContextMenuCheckboxItem}
				checked={item.checked}
				onCheckedChange={(checked) => item.onCheckedChange?.(checked)}
				disabled={item.disabled}
			>
				<ContextMenuPrimitive.ItemIndicator className={styles.ContextMenuItemIndicator}>
					<CheckIcon />
				</ContextMenuPrimitive.ItemIndicator>
				{item.label}
				{item.shortcut && <div className={styles.RightSlot}>{item.shortcut}</div>}
			</ContextMenuPrimitive.CheckboxItem>
		);
	}

	if (item.type === 'radio') {
		return (
			<ContextMenuPrimitive.RadioGroup value={item.value} onValueChange={item.onValueChange}>
				{item.options?.map((option) => (
					<ContextMenuPrimitive.RadioItem
						key={option.value}
						className={styles.ContextMenuRadioItem}
						value={option.value}
						disabled={option.disabled}
					>
						<ContextMenuPrimitive.ItemIndicator
							className={styles.ContextMenuItemIndicator}
						>
							<DotFilledIcon />
						</ContextMenuPrimitive.ItemIndicator>
						{option.label}
					</ContextMenuPrimitive.RadioItem>
				))}
			</ContextMenuPrimitive.RadioGroup>
		);
	}

	if (item.type === 'submenu' && item.items) {
		return (
			<ContextMenuPrimitive.Sub>
				<ContextMenuPrimitive.SubTrigger className={styles.ContextMenuSubTrigger}>
					{item.label}
					<div className={styles.RightSlot}>
						<ChevronRightIcon />
					</div>
				</ContextMenuPrimitive.SubTrigger>
				<ContextMenuPrimitive.Portal>
					<ContextMenuPrimitive.SubContent
						className={classNames(styles.ContextMenuSubContent, {
							[styles.ContextMenuSubContentDark]: theme === 'dark',
						})}
						sideOffset={2}
						alignOffset={-5}
					>
						{item.items.map((subItem, index) => (
							<RenderMenuItem
								key={index}
								item={subItem}
								theme={theme}
								onSelect={onSelect}
							/>
						))}
					</ContextMenuPrimitive.SubContent>
				</ContextMenuPrimitive.Portal>
			</ContextMenuPrimitive.Sub>
		);
	}

	// Default item
	return (
		<ContextMenuPrimitive.Item
			className={styles.ContextMenuItem}
			disabled={item.disabled}
			onSelect={() => item.id && onSelect?.(item.id)}
		>
			{item.label}
			{item.shortcut && <div className={styles.RightSlot}>{item.shortcut}</div>}
		</ContextMenuPrimitive.Item>
	);
};

ContextMenuComponent.displayName = 'ContextMenu';

export default React.memo(ContextMenuComponent);
