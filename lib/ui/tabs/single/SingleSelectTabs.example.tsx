import React from 'react';
import SingleSelectTabs from './SingleSelectTabs';
import { createSingleSelectTabs } from './SingleSelectTabs.types';
import styles from './SingleSelectTabs.example.module.scss';

// Import your icons
import processIcon from '../../../../public/icons/processSolid.svg';
import dragAndDrop from '../../../../public/icons/drag_and_drop.svg';
import analyticsIcon from '../../../../public/icons/charts.svg';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const SingleSelectTabsExample: React.FC<ExampleProps> = ({ theme }) => {
	// Basic tabs example
	// Basic tabs example
	const basicTabs = createSingleSelectTabs([
		{
			id: 'dropzone',
			label: 'Dropzone',
			active: true,
			icon: dragAndDrop,
		},
		{
			id: 'tab2',
			label: 'Workflows',
			icon: processIcon,
		},
		// {
		// 	id: 'tab3',
		// 	label: 'Analytics',
		// 	icon: analyticsIcon,
		// },
	]);

	// Vertical tabs example
	const verticalTabs = createSingleSelectTabs([
		{
			id: 'mode1',
			label: 'Active',
			active: true,
			icon: dragAndDrop,
		},
		{
			id: 'mode2',
			label: 'Disabled',
			disabled: true,
			icon: processIcon,
		},
		{
			id: 'mode3',
			label: 'Normal',
			icon: analyticsIcon,
		},
	]);

	return (
		<div className={styles.container}>
			{/* Horizontal Layout */}
			<section className={styles.section}>
				<h6>Horizontal Single Select Tabs</h6>
				<div className={styles.example}>
					<SingleSelectTabs
						tabs={basicTabs}
						theme={theme}
						orientation="horizontal"
						onTabChange={(id) => console.log(`Tab changed to: ${id}`)}
						ariaLabel="Horizontal tabs example"
					/>
				</div>
			</section>

			{/* Vertical Layout */}
			<section className={styles.section}>
				<h6>Vertical Single Select Tabs</h6>
				<div className={styles.example}>
					<SingleSelectTabs
						tabs={verticalTabs}
						theme={theme}
						orientation="vertical"
						onTabChange={(id) => console.log(`Tab changed to: ${id}`)}
						ariaLabel="Vertical tabs example"
					/>
				</div>
			</section>
		</div>
	);
};

export default SingleSelectTabsExample;
