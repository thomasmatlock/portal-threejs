import React, { useState } from 'react';
import MultiTabs from './MultiSelectTabs';
import { createMultiSelectTabs } from './MultiSelectTabs.types';
import styles from './MultiSelectTabs.example.module.scss';

// Import your icons
import processIcon from '../../../../public/icons/processSolid.svg';
import dragAndDrop from '../../../../public/icons/drag_and_drop.svg';
import analyticsIcon from '../../../../public/icons/charts.svg';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const MultiTabsExample: React.FC<ExampleProps> = ({ theme }) => {
	const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
	// const [selectedVerticalTabs, setSelectedVerticalTabs] = useState<string[]>([]);
	const [selectedVerticalTabs, setSelectedVerticalTabs] = useState<string[]>([]);

	const languageTabs = createMultiSelectTabs([
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
	]);

	const frameworkTabs = createMultiSelectTabs([
		{
			id: 'react',
			label: 'React',
			icon: dragAndDrop,
		},
		{
			id: 'vue',
			label: 'Vue',
			icon: processIcon,
		},
		{
			id: 'angular',
			label: 'Angular',
			icon: analyticsIcon,
		},
		{
			id: 'svelte',
			label: 'Svelte',
			icon: analyticsIcon,
		},
	]);

	const toolingTabs = createMultiSelectTabs([
		{
			id: 'webpack',
			label: 'Webpack',
			icon: dragAndDrop,
		},
		{
			id: 'vite',
			label: 'Vite',
			disabled: true,
			icon: processIcon,
		},
		{
			id: 'rollup',
			label: 'Rollup',
			icon: analyticsIcon,
		},
		{
			id: 'parcel',
			label: 'Parcel',
			icon: analyticsIcon,
		},
	]);

	return (
		<div className={styles.container}>
			{/* Horizontal Layout */}
			<section className={styles.section}>
				<h6>Horizontal Multi-Select Tabs</h6>
				<div className={styles.example}>
					<MultiTabs
						tabs={languageTabs}
						theme={theme}
						orientation="horizontal"
						onSelectionChange={(selected) => console.log('Selected:', selected)}
						ariaLabel="Programming languages"
					/>
				</div>
			</section>

			{/* Vertical Layout */}
			<section className={styles.section}>
				<h6>Vertical Multi-Select Tabs</h6>
				<div className={styles.example}>
					<MultiTabs
						tabs={frameworkTabs}
						theme={theme}
						orientation="vertical"
						onSelectionChange={setSelectedVerticalTabs}
						ariaLabel="Frontend frameworks"
					/>
				</div>
			</section>

			{/* Limited Selection */}
			{/* <section className={styles.section}>
				<h6>Maximum Two Selections</h6>
				<div className={styles.example}>
					<MultiTabs
						tabs={toolingTabs}
						theme={theme}
						orientation="vertical"
						maxSelections={2}
						onSelectionChange={(selected) => console.log('Limited:', selected)}
						ariaLabel="Build tools"
					/>
					<p className={styles.helperText}>Select up to 2 build tools</p>
				</div>
			</section> */}
		</div>
	);
};

export default MultiTabsExample;
