// MultiSelectSortableTabs.tsx
import React, { useState, useId, useMemo } from 'react';
import classnames from 'classnames';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	horizontalListSortingStrategy,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableTab } from './MultiSelectSortableTab';
import styles from './MultiSelectSortableTabs.module.scss';
import type { MultiSelectSortableTabsProps } from './MultiSelectSortableTabs.props';

const MultiTabs: React.FC<MultiSelectSortableTabsProps> = ({
	tabs,
	onSelectionChange,
	theme = 'light',
	orientation = 'horizontal',
	defaultSelected = [],
	maxSelections,
	ariaLabel = 'Multi-select tab group',
	className,
	onOrderChange,
	dragConstraints = {
		lockAxis: true,
		restrictToGroup: true,
		dragDelay: 150,
		minIndex: undefined,
		maxIndex: undefined,
	},
}) => {
	const stableId = useId();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [selectedTabs, setSelectedTabs] = useState<string[]>(defaultSelected);
	const [orderedTabs, setOrderedTabs] = useState(tabs);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: dragConstraints.dragDelay ?? 150,
				tolerance: 5,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: dragConstraints.dragDelay ?? 150,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const modifiers = useMemo(() => {
		if (!dragConstraints.lockAxis) return [];
		return [orientation === 'horizontal' ? restrictToHorizontalAxis : restrictToVerticalAxis];
	}, [dragConstraints.lockAxis, orientation]);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over || active.id === over.id) return;

		const oldIndex = orderedTabs.findIndex((tab) => tab.id === active.id);
		const newIndex = orderedTabs.findIndex((tab) => tab.id === over.id);

		if (
			(dragConstraints.minIndex !== undefined && newIndex < dragConstraints.minIndex) ||
			(dragConstraints.maxIndex !== undefined && newIndex > dragConstraints.maxIndex)
		) {
			return;
		}

		const newOrder = arrayMove(orderedTabs, oldIndex, newIndex);
		setOrderedTabs(newOrder);
		onOrderChange?.(newOrder);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const tabId = event.target.value;
		const newSelectedTabs = event.target.checked
			? maxSelections && selectedTabs.length >= maxSelections
				? [...selectedTabs.slice(1), tabId]
				: [...selectedTabs, tabId]
			: selectedTabs.filter((id) => id !== tabId);

		setSelectedTabs(newSelectedTabs);
		onSelectionChange?.(newSelectedTabs);
	};

	return (
		<DndContext
			id={`dnd-context-${stableId}`}
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			modifiers={modifiers}
		>
			<div
				className={classnames(
					theme === 'light' ? styles.multi_tabs : styles.multi_tabs_dark,
					orientation === 'vertical' && styles.vertical,
					className
				)}
				role="tablist"
				aria-label={ariaLabel}
				aria-orientation={orientation}
			>
				<SortableContext
					id={`sortable-context-${stableId}`}
					items={orderedTabs.map((tab) => tab.id)}
					strategy={
						orientation === 'vertical'
							? verticalListSortingStrategy
							: horizontalListSortingStrategy
					}
				>
					{orderedTabs.map((tab, index) => (
						<SortableTab
							key={tab.id}
							tab={tab}
							index={index}
							checked={selectedTabs.includes(tab.id)}
							onChange={handleChange}
							theme={theme}
							orientation={orientation}
							dragHandleId={`drag-handle-${stableId}-${tab.id}`}
						/>
					))}
				</SortableContext>
			</div>
		</DndContext>
	);
};

export default React.memo(MultiTabs);
