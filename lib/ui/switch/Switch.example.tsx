import React, { useState } from 'react';
import Switch from './Switch';
import styles from './Switch.example.module.scss';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const SwitchExample: React.FC<ExampleProps> = ({ theme }) => {
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	// const [soundEnabled, setSoundEnabled] = useState(true);
	const [soundEnabled, setSoundEnabled] = useState(true);

	return (
		<div className={styles.container}>
			{/* Basic Usage */}
			<section className={styles.section}>
				<h6>Basic Usage</h6>
				<Switch
					label="Notifications"
					checked={notificationsEnabled}
					onCheckedChange={setNotificationsEnabled}
					theme={theme}
				/>
			</section>

			{/* Size Variants */}
			<section className={styles.section}>
				<h6>Size Variants</h6>
				<div className={styles.sizeExamples}>
					<Switch label="Small" size="sm" theme={theme} />
					<Switch label="Medium (Default)" size="md" theme={theme} />
					<Switch label="Large" size="lg" theme={theme} />
				</div>
			</section>

			{/* States */}
			<section className={styles.section}>
				<h6>States</h6>
				<div className={styles.stateExamples}>
					<Switch label="Disabled" disabled theme={theme} />
					<Switch label="Disabled & Checked" disabled defaultChecked theme={theme} />
					<Switch
						label="With Default State"
						defaultChecked
						onCheckedChange={console.log}
						theme={theme}
					/>
				</div>
			</section>

			{/* Interactive Example */}
			<section className={styles.section}>
				<h6>Interactive Example</h6>
				<div className={styles.interactive}>
					<Switch
						label="Sound Enabled"
						checked={soundEnabled}
						onCheckedChange={setSoundEnabled}
						theme={theme}
					/>
					<p className={styles.state}>
						Sound is currently: {soundEnabled ? 'On' : 'Off'}
					</p>
				</div>
			</section>
		</div>
	);
};

export default SwitchExample;
