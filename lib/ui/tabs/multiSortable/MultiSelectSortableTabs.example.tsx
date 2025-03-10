// MultiSelectSortableTabs.example.tsx
import React, { useState } from 'react';
import MultiTabs from './MultiSelectSortableTabs';
import type { MultiTab } from './MultiSelectSortableTabs.props';
import styles from './MultiSelectSortableTabs.example.module.scss';

// Import your icons
import processIcon from '../../../../public/icons/processSolid.svg';
import dragAndDrop from '../../../../public/icons/drag_and_drop.svg';
import analyticsIcon from '../../../../public/icons/charts.svg';

interface ExampleProps {
	// theme: 'light' | 'dark';
	theme: 'light' | 'dark';
}

const initialTabs: MultiTab[] = [
	{
		id: 'javascript',
		label: 'JavaScript',
		selected: true,
		icon: dragAndDrop,
	},
	{
		id: 'typescript',
		label: 'TypeScript',
		icon: processIcon,
	},
	{
		id: 'python',
		label: 'Python',
		icon: analyticsIcon,
	},
	{
		id: 'rust',
		label: 'Rust',
		icon: dragAndDrop,
	},
	{
		id: 'go',
		label: 'Go',
		icon: processIcon,
	},
];

const MultiTabsExample: React.FC<ExampleProps> = ({ theme }) => {
	const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
	const [tabOrder, setTabOrder] = useState<MultiTab[]>(initialTabs);

	const handleOrderChange = (newOrder: MultiTab[]) => {
		setTabOrder(newOrder);
		// console.log('New order:', newOrder.map((tab) => tab.label).join(', '));
	};

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h6>Horizontal Draggable Multi-Selection Tabs</h6>
				<div className={styles.example}>
					<MultiTabs
						tabs={tabOrder}
						theme={theme}
						orientation="horizontal"
						onSelectionChange={setSelectedTabs}
						onOrderChange={handleOrderChange}
						ariaLabel="Programming languages"
					/>
				</div>
			</section>

			<section className={styles.section}>
				<h6>Vertical Draggable Tabs</h6>
				<div className={styles.example}>
					<MultiTabs
						tabs={tabOrder}
						theme={theme}
						orientation="vertical"
						onSelectionChange={setSelectedTabs}
						onOrderChange={handleOrderChange}
						ariaLabel="Vertical tabs example"
					/>
				</div>
			</section>
		</div>
	);
};

export default MultiTabsExample;
