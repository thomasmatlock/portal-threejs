import React, { useState, useRef, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import styles from './SingleSelectTabs.module.scss';
import Icon from '../../icon/Icon';
import type { SingleSelectTabsProps } from './SingleSelectTabs.types';

const RadioTabs: React.FC<SingleSelectTabsProps> = ({
	tabs,
	onTabChange,
	theme = 'light',
	orientation = 'horizontal',
	defaultActiveTab,
	ariaLabel = 'Tab group',
	className,
}) => {
	const [activeTab, setActiveTab] = useState<string>(
		defaultActiveTab || tabs.find((tab) => tab.active)?.id || tabs[0].id
	);
	const [indicatorStyle, setIndicatorStyle] = useState({});
	const tabRefs = useRef<(HTMLLabelElement | null)[]>([]);

	const themeStyles = useMemo(
		() => ({
			color: theme === 'dark' ? '#fff' : '#000',
		}),
		[theme]
	);

	const updateIndicator = (tabId: string) => {
		const activeTabIndex = tabs.findIndex((tab) => tab.id === tabId);
		if (activeTabIndex !== -1 && tabRefs.current[activeTabIndex]) {
			const tabElement = tabRefs.current[activeTabIndex];
			if (!tabElement) return;

			if (orientation === 'vertical') {
				const topOffset = tabRefs.current
					.slice(0, activeTabIndex)
					.reduce((sum, tab) => sum + (tab?.offsetHeight || 0), 0);

				setIndicatorStyle({
					height: `${tabElement.offsetHeight}px`,
					top: `${topOffset + 4}px`,
				});
			} else {
				const offset = tabRefs.current
					.slice(0, activeTabIndex)
					.reduce((sum, tab) => sum + (tab?.offsetWidth || 0), 0);

				setIndicatorStyle({
					width: `${tabElement.offsetWidth}px`,
					transform: `translateX(${offset + 4}px)`,
				});
			}
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newActiveTab = event.target.value;
		setActiveTab(newActiveTab);
		if (onTabChange) {
			onTabChange(newActiveTab);
		}
	};

	useEffect(() => {
		updateIndicator(activeTab);
	}, [activeTab, tabs, orientation]);

	return (
		<div
			className={classnames(
				theme === 'light' ? styles.radio_tabs : styles.radio_tabs_dark,
				orientation === 'vertical' && styles.vertical,
				className
			)}
			role="tablist"
			aria-label={ariaLabel}
			aria-orientation={orientation}
		>
			{tabs.map((tab, index) => (
				<React.Fragment key={tab.id}>
					<input
						type="radio"
						name="radio_tabs"
						value={tab.id}
						id={`tab-${tab.id}`}
						checked={activeTab === tab.id}
						onChange={handleChange}
						className={styles.radio_input}
						disabled={tab.disabled}
						aria-label={tab.label}
					/>
					<label
						ref={(el) => {
							tabRefs.current[index] = el;
						}}
						htmlFor={`tab-${tab.id}`}
						className={classnames(styles.radio_tabs_label, {
							[styles.disabled]: tab.disabled,
						})}
						style={themeStyles}
						role="tab"
						aria-selected={activeTab === tab.id}
					>
						{tab.icon && (
							<Icon
								icon={tab.icon}
								size={16}
								theme={theme}
								style={{ marginRight: '8px' }}
							/>
						)}
						<span className={styles.radio_tabs_text}>{tab.label}</span>
					</label>
				</React.Fragment>
			))}
			<div
				className={
					theme === 'light'
						? styles.radio_tabs_active_color
						: styles.radio_tabs_active_color_dark
				}
				style={indicatorStyle}
				role="presentation"
			/>
		</div>
	);
};

export default React.memo(RadioTabs);
