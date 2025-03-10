import React, { useState, useRef, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import styles from './MultiSelectTabs.module.scss';
import Icon from '../../icon/Icon';
import type { MultiSelectTabsProps } from './MultiSelectTabs.types';

const MultiTabs: React.FC<MultiSelectTabsProps> = ({
	tabs,

	onSelectionChange,
	theme = 'light',
	orientation = 'horizontal',
	defaultSelected = [],
	maxSelections,
	ariaLabel = 'Multi-select tab group',
	className,
}) => {
	const [selectedTabs, setSelectedTabs] = useState<string[]>(defaultSelected);
	const [indicatorGroups, setIndicatorGroups] = useState<React.CSSProperties[]>([]);
	const tabRefs = useRef<(HTMLLabelElement | null)[]>([]);

	const themeStyles = useMemo(
		() => ({
			color: theme === 'dark' ? '#fff' : '#000',
		}),
		[theme]
	);

	const updateIndicators = () => {
		const groups: number[][] = [];
		let currentGroup: number[] = [];

		tabs.forEach((tab, index) => {
			if (selectedTabs.includes(tab.id)) {
				if (
					currentGroup.length === 0 ||
					currentGroup[currentGroup.length - 1] === index - 1
				) {
					currentGroup.push(index);
				} else {
					if (currentGroup.length > 0) {
						groups.push([...currentGroup]);
					}
					currentGroup = [index];
				}
			}
		});
		if (currentGroup.length > 0) {
			groups.push(currentGroup);
		}

		const newStyles = groups.map((group) => {
			const firstTabElement = tabRefs.current[group[0]];
			const lastTabElement = tabRefs.current[group[group.length - 1]];
			if (!firstTabElement || !lastTabElement) return {};

			if (orientation === 'vertical') {
				const topOffset = tabRefs.current
					.slice(0, group[0])
					.reduce((sum, tab) => sum + (tab?.offsetHeight || 0), 0);

				const totalHeight = group.reduce((sum, index) => {
					const tab = tabRefs.current[index];
					return sum + (tab?.offsetHeight || 0);
				}, 0);

				return {
					height: `${totalHeight}px`,
					top: `${topOffset + 4}px`,
				};
			} else {
				const offset = tabRefs.current
					.slice(0, group[0])
					.reduce((sum, tab) => sum + (tab?.offsetWidth || 0), 0);

				const totalWidth = group.reduce((sum, index) => {
					const tab = tabRefs.current[index];
					return sum + (tab?.offsetWidth || 0);
				}, 0);

				return {
					width: `${totalWidth}px`,
					transform: `translateX(${offset + 4}px)`,
				};
			}
		});

		setIndicatorGroups(newStyles);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const tabId = event.target.value;
		let newSelectedTabs: string[];

		if (event.target.checked) {
			if (maxSelections && selectedTabs.length >= maxSelections) {
				newSelectedTabs = [...selectedTabs.slice(1), tabId];
			} else {
				newSelectedTabs = [...selectedTabs, tabId];
			}
		} else {
			newSelectedTabs = selectedTabs.filter((id) => id !== tabId);
		}

		setSelectedTabs(newSelectedTabs);
		if (onSelectionChange) {
			onSelectionChange(newSelectedTabs);
		}
	};

	useEffect(() => {
		updateIndicators();
	}, [selectedTabs, tabs, orientation]);

	return (
		<div
			className={classnames(
				theme === 'light' ? styles.multi_tabs : styles.multi_tabs_dark,
				orientation === 'vertical' && styles.vertical,
				className
			)}
			role="group"
			aria-label={ariaLabel}
			aria-orientation={orientation}
		>
			{tabs.map((tab, index) => (
				<React.Fragment key={tab.id}>
					<input
						type="checkbox"
						name="multi_tabs"
						value={tab.id}
						id={`tab-${tab.id}`}
						checked={selectedTabs.includes(tab.id)}
						onChange={handleChange}
						className={styles.multi_input}
						disabled={tab.disabled}
						aria-label={tab.label}
					/>
					<label
						ref={(el) => {
							tabRefs.current[index] = el;
						}}
						htmlFor={`tab-${tab.id}`}
						className={classnames(styles.multi_tabs_label, {
							[styles.disabled]: tab.disabled,
						})}
						style={themeStyles}
						role="checkbox"
						aria-checked={selectedTabs.includes(tab.id)}
					>
						{tab.icon && (
							<Icon
								icon={tab.icon}
								size={16}
								theme={theme}
								style={{ marginRight: '8px' }}
							/>
						)}
						<span className={styles.multi_tabs_text}>{tab.label}</span>
					</label>
				</React.Fragment>
			))}
			{indicatorGroups.map((style, index) => (
				<div
					key={`indicator-${index}`}
					className={classnames(
						theme === 'light'
							? styles.multi_tabs_active_color
							: styles.multi_tabs_active_color_dark,
						styles.merging
					)}
					style={style}
					role="presentation"
				/>
			))}
		</div>
	);
};

export default React.memo(MultiTabs);
