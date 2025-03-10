import React, { useState } from 'react';
import Select from './Select';
import { createSelectOptions } from './Select.props';
import styles from './Select.example.module.scss';

interface SelectExampleProps {
	theme: 'light' | 'dark';
}

const SelectExample: React.FC<SelectExampleProps> = ({ theme }) => {
	const [selectedValue, setSelectedValue] = useState<string>('');

	// Basic options
	// Basic options
	const basicOptions = createSelectOptions([
		{
			items: [
				{ value: 'apple', label: 'Apple', default: true },
				{ value: 'banana', label: 'Banana' },
				{ value: 'orange', label: 'Orange' },
			],
		},
	]);

	// Grouped options
	const groupedOptions = createSelectOptions([
		{
			// label: 'Fruits',
			items: [
				{ value: 'apple', label: 'Apple' },
				{ value: 'banana', label: 'Banana' },
				{ value: 'orange', label: 'Orange' },
			],
		},
		{
			label: 'Vegetables',
			items: [
				{ value: 'carrot', label: 'Carrot' },
				{ value: 'broccoli', label: 'Broccoli', disabled: true },
				{ value: 'spinach', label: 'Spinach' },
			],
		},
	]);

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h6>Basic Select</h6>
				<Select
					items={basicOptions}
					theme={theme}
					onValueChange={setSelectedValue}
					placeholder="Choose a fruit"
				/>
				{selectedValue && <p className={styles.selectionText}>Selected: {selectedValue}</p>}
			</section>

			<section className={styles.section}>
				<h6>Grouped Select with Disabled Options</h6>
				<Select
					items={groupedOptions}
					theme={theme}
					onValueChange={setSelectedValue}
					placeholder="Choose a food"
				/>
			</section>
		</div>
	);
};

export default SelectExample;
