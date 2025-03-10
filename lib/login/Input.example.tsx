import React, { useState } from 'react';
import Input from './Input';
import styles from './Input.example.module.scss';
import {
	SearchIcon,
	MailIcon,
	LockIcon,
	CheckIcon,
	AlertCircleIcon,
	LoaderIcon,
} from 'lucide-react';

interface InputExampleProps {
	theme: 'light' | 'dark';
}

const InputExample: React.FC<InputExampleProps> = ({ theme }) => {
	const [value, setValue] = useState('');

	return (
		<div className={styles.container}>
			{/* Basic Input */}
			<section className={styles.section}>
				<h6>Basic Input</h6>
				<Input
					theme={theme}
					placeholder="Basic input"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</section>

			{/* With Icons */}
			<section className={styles.section}>
				<h6>Input with Icons</h6>
				<div className={styles.group}>
					<Input
						theme={theme}
						placeholder="Search..."
						leftIcon={<SearchIcon size={16} />}
					/>
					<Input theme={theme} placeholder="Email" leftIcon={<MailIcon size={16} />} />
					<Input
						theme={theme}
						type="password"
						placeholder="Password"
						leftIcon={<LockIcon size={16} />}
					/>
				</div>
			</section>

			{/* With Label and Helper Text */}
			<section className={styles.section}>
				<h6>Input with Label and Helper Text</h6>
				<div className={styles.group}>
					<Input
						theme={theme}
						label="Email"
						placeholder="Enter your email"
						helperText="We'll never share your email"
					/>
					<Input
						theme={theme}
						label="Username"
						placeholder="Choose a username"
						helperText="Must be at least 3 characters"
					/>
				</div>
			</section>

			{/* States */}
			<section className={styles.section}>
				<h6>Input States</h6>
				<div className={styles.group}>
					<Input
						theme={theme}
						placeholder="Error state"
						error
						helperText="This field is required"
						rightIcon={<AlertCircleIcon size={16} />}
					/>
					<Input
						theme={theme}
						placeholder="Success state"
						success
						helperText="Looks good!"
						rightIcon={<CheckIcon size={16} />}
					/>
					<Input
						theme={theme}
						placeholder="Loading state"
						loading
						rightIcon={<LoaderIcon size={16} />}
					/>
					<Input theme={theme} placeholder="Disabled state" disabled />
				</div>
			</section>

			{/* Sizes */}
			<section className={styles.section}>
				<h6>Input Sizes</h6>
				<div className={styles.group}>
					<Input theme={theme} placeholder="Small input" className={styles.input_sm} />
					<Input theme={theme} placeholder="Default input" />
					<Input theme={theme} placeholder="Large input" className={styles.input_lg} />
				</div>
			</section>

			{/* With Form Validation */}
			<section className={styles.section}>
				<h6>Form Validation Example</h6>
				<form className={styles.form}>
					<Input
						theme={theme}
						label="Email"
						type="email"
						placeholder="Enter your email"
						required
						leftIcon={<MailIcon size={16} />}
					/>
					<Input
						theme={theme}
						label="Password"
						type="password"
						placeholder="Enter your password"
						required
						leftIcon={<LockIcon size={16} />}
						helperText="Must be at least 8 characters"
					/>
				</form>
			</section>

			{/* Custom Styling */}
			<section className={styles.section}>
				<h6>Custom Styled Inputs</h6>
				<div className={styles.group}>
					<Input
						theme={theme}
						placeholder="Rounded input"
						className={styles.input_rounded}
					/>
					<Input
						theme={theme}
						placeholder="Borderless input"
						className={styles.input_borderless}
					/>
					<Input
						theme={theme}
						placeholder="Custom background"
						className={styles.input_custom_bg}
					/>
				</div>
			</section>
		</div>
	);
};

export default InputExample;
