// MultiSelectSortableTab.tsx
import React, { forwardRef, useId } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classnames from 'classnames';
import styles from './MultiSelectSortableTabs.module.scss';
import Icon from '../../icon/Icon';
import { createStableId } from './MultiSelectSortableTabs.props';

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
	dragHandleId?: string;
}

export const SortableTab = forwardRef<HTMLLabelElement, SortableTabProps>(
	({ tab, checked, onChange, theme, orientation, dragHandleId }, ref) => {
		const stableId = useId();
		const inputId = createStableId('input', `${stableId}-${tab.id}`);
		const labelId = createStableId('label', `${stableId}-${tab.id}`);

		const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
			useSortable({
				id: tab.id,
				data: {
					type: 'tab',
					id: tab.id,
					dragHandleId,
				},
			});

		const style = {
			transform: CSS.Transform.toString({
				x: transform?.x ?? 0,
				y: transform?.y ?? 0,
				scaleX: 1,
				scaleY: 1,
			}),
			transition,
			zIndex: isDragging ? 2 : 1,
			position: 'relative' as const,
		};

		return (
			<>
				<input
					type="checkbox"
					name="multi_tabs"
					value={tab.id}
					id={inputId}
					checked={checked}
					onChange={onChange}
					className={styles.multi_input}
					disabled={tab.disabled}
					aria-label={tab.label}
				/>
				<label
					ref={(el) => {
						setNodeRef(el);
						if (typeof ref === 'function') ref(el);
						else if (ref) ref.current = el;
					}}
					htmlFor={inputId}
					id={labelId}
					className={classnames(styles.multi_tabs_label, {
						[styles.disabled]: tab.disabled,
						[styles.dragging]: isDragging,
					})}
					style={style}
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
