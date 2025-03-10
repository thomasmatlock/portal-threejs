import React, { useState } from 'react';
import ContextMenu from './ContextMenu';
import { ContextMenuItem } from './ContextMenu.props';
import styles from './ContextMenu.example.module.scss';
import Toolbar from '../toolbar/Toolbar';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const ContextMenuExample: React.FC<ExampleProps> = ({ theme }) => {
	const [bookmarksChecked, setBookmarksChecked] = useState(true);
	const [urlsChecked, setUrlsChecked] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState('pedro');
	const [lastSelected, setLastSelected] = useState<string>('');
	// const [lastSelected, setLastSelected] = useState<string>('');

	const items: ContextMenuItem[] = [
		{
			type: 'item',
			id: 'back',
			label: 'Back',
			shortcut: '⌘+[',
		},
		{
			type: 'item',
			id: 'forward',
			label: 'Forward',
			shortcut: '⌘+]',
			disabled: true,
		},
		{
			type: 'item',
			id: 'reload',
			label: 'Reload',
			shortcut: '⌘+R',
		},
		{
			type: 'submenu',
			label: 'More Tools',
			items: [
				{
					type: 'item',
					id: 'save',
					label: 'Save Page As…',
					shortcut: '⌘+S',
				},
				{
					type: 'item',
					id: 'shortcut',
					label: 'Create Shortcut…',
				},
				{
					type: 'item',
					id: 'window',
					label: 'Name Window…',
				},
				{ type: 'separator' },
				{
					type: 'item',
					id: 'devtools',
					label: 'Developer Tools',
				},
			],
		},
		{ type: 'separator' },
		{
			type: 'checkbox',
			id: 'bookmarks',
			label: 'Show Bookmarks',
			checked: bookmarksChecked,
			onCheckedChange: setBookmarksChecked,
			shortcut: '⌘+B',
		},
		{
			type: 'checkbox',
			id: 'urls',
			label: 'Show Full URLs',
			checked: urlsChecked,
			onCheckedChange: setUrlsChecked,
		},
		{ type: 'separator' },
		{ type: 'label', label: 'People' },
		{
			type: 'radio',
			value: selectedPerson,
			options: [
				{ value: 'pedro', label: 'Pedro Duarte' },
				{ value: 'colm', label: 'Colm Tuite' },
			],
			onValueChange: setSelectedPerson,
		},
	];

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h6>Basic Context Menu</h6>
				<div className={styles.example}>
					<Toolbar>
						{/* <ContextMenu theme={theme} /> */}
						<ContextMenu items={items} theme={theme} onSelect={setLastSelected} />
					</Toolbar>
					{/* <ContextMenu items={items} theme={theme} onSelect={setLastSelected} /> */}
					{lastSelected && (
						<p className={styles.selectionText}>Last selected: {lastSelected}</p>
					)}
				</div>
			</section>
		</div>
	);
};

export default ContextMenuExample;
