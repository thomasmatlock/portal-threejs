// SortableTab.tsx
import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classnames from 'classnames';
import styles from './MultiTabs.module.scss';
import Icon from '../../icon/Icon';

interface SortableTabProps {
	tab: {
		id: string;
		label: string;
		icon?: string | { src: string } | null;
		disabled?: boolean;
	};
	index: number;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	theme: 'light' | 'dark';
	orientation?: 'horizontal' | 'vertical';
}

export const SortableTab = forwardRef<HTMLLabelElement, SortableTabProps>(
	({ tab, checked, onChange, theme, orientation }, ref) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
			useSortable({ id: tab.id });

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
			zIndex: isDragging ? 1 : 0,
			opacity: isDragging ? 0.8 : 1,
			cursor: 'grab',
		};

		return (
			<>
				<input
					type="checkbox"
					name="multi_tabs"
					value={tab.id}
					id={`tab-${tab.id}`}
					checked={checked}
					onChange={onChange}
					className={styles.multi_input}
					disabled={tab.disabled}
					aria-label={tab.label}
				/>
				<label
					ref={(el) => {
						// Combine the refs
						setNodeRef(el);
						if (typeof ref === 'function') {
							ref(el);
						} else if (ref) {
							ref.current = el;
						}
					}}
					htmlFor={`tab-${tab.id}`}
					className={classnames(styles.multi_tabs_label, {
						[styles.disabled]: tab.disabled,
						[styles.dragging]: isDragging,
					})}
					style={{
						...style,
						color: theme === 'dark' ? '#fff' : '#000',
					}}
					aria-checked={checked}
					{...attributes}
					{...listeners}
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
			</>
		);
	}
);

SortableTab.displayName = 'SortableTab';
