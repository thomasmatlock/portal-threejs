import React, { useState } from 'react';
// import { FileIcon, TrashIcon } from '@radix-ui/react-icons';
import Dropdown from './Dropdown';
import { createDropdownOptions } from './Dropdown.props';
import styles from './Dropdown.example.module.scss';
import processIcon from '../../../public/icons/processSolid.svg';
import dragAndDrop from '../../../public/icons/drag_and_drop.svg';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const DropdownExample: React.FC<ExampleProps> = ({ theme }) => {
	const [selected, setSelected] = useState<string>('');

	// Basic dropdown items
	// Basic dropdown items
	const basicItems = createDropdownOptions([
		{
			items: [
				{ value: 'new', label: 'New File', icon: processIcon },
				{ value: 'edit', label: 'Edit', icon: dragAndDrop },
				{ value: 'delete', label: 'Delete', icon: dragAndDrop },
			],
		},
	]);

	// Grouped items with shortcuts
	const groupedItems = createDropdownOptions([
		{
			label: 'Actions',
			items: [
				{ value: 'share', label: 'Share', icon: processIcon, shortcut: '⌘+S' },
				{ value: 'delete', label: 'Delete', icon: processIcon, shortcut: '⌫' },
			],
		},
		{
			label: 'Options',
			items: [
				{ value: 'preview', label: 'Preview', disabled: true },
				{ value: 'publish', label: 'Publish' },
			],
		},
	]);

	// Nested items
	const nestedItems = createDropdownOptions([
		{
			items: [
				{
					value: 'file',
					label: 'File',
					submenu: [
						{ value: 'new', label: 'New' },
						{ value: 'open', label: 'Open' },
						{
							value: 'recent',
							label: 'Recent',
							submenu: [
								{ value: 'doc1', label: 'Document 1' },
								{ value: 'doc2', label: 'Document 2' },
							],
						},
					],
				},
				{
					value: 'edit',
					label: 'Edit',
					submenu: [
						{ value: 'undo', label: 'Undo', shortcut: '⌘+Z' },
						{ value: 'redo', label: 'Redo', shortcut: '⌘+Y' },
					],
				},
			],
		},
	]);

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h6>Basic Dropdown</h6>
				<div className={styles.example}>
					<Dropdown
						items={basicItems}
						theme={theme}
						onSelect={setSelected}
						value={selected}
					/>
					<p className={styles.helperText}>Click the dots to open menu</p>
				</div>
			</section>

			<section className={styles.section}>
				<h6>Grouped Items with Shortcuts</h6>
				<div className={styles.example}>
					<Dropdown
						items={groupedItems}
						theme={theme}
						onSelect={setSelected}
						value={selected}
						position="right"
					/>
					<p className={styles.helperText}>Opens to the right with shortcuts</p>
				</div>
			</section>

			<section className={styles.section}>
				<h6>Nested Menu</h6>
				<div className={styles.example}>
					<Dropdown
						items={nestedItems}
						theme={theme}
						onSelect={setSelected}
						value={selected}
						align="center"
					/>
					<p className={styles.helperText}>With submenu support</p>
				</div>
			</section>

			<section className={styles.section}>
				<h6>Disabled State</h6>
				<div className={styles.example}>
					<Dropdown
						items={basicItems}
						theme={theme}
						onSelect={setSelected}
						value={selected}
						disabled
					/>
					<p className={styles.helperText}>Dropdown in disabled state</p>
				</div>
			</section>
		</div>
	);
};

export default DropdownExample;
