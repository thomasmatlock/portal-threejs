import React, { useState } from 'react';
import Toast from './Toast';
import styles from './Toast.module.scss';

interface ToastExampleProps {
	theme: 'light' | 'dark';
}

const ToastExample: React.FC<ToastExampleProps> = ({ theme }) => {
	const [successOpen, setSuccessOpen] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	const [customOpen, setCustomOpen] = useState(false);
	const [persistentOpen, setPersistentOpen] = useState(false);

	const showSuccessToast = () => {
		setSuccessOpen(false);
		// Small delay to ensure animation reset
		// Small delay to ensure animation reset

		setTimeout(() => setSuccessOpen(true), 100);
	};

	const showErrorToast = () => {
		setErrorOpen(false);
		setTimeout(() => setErrorOpen(true), 100);
	};

	const showCustomToast = () => {
		setCustomOpen(false);
		setTimeout(() => setCustomOpen(true), 100);
	};

	const showPersistentToast = () => {
		setPersistentOpen(true);
	};

	return (
		<div className={styles.exampleContainer}>
			{/* Basic Success Toast */}
			<section className={styles.section}>
				<h6>Basic Success Toast</h6>
				<button
					onClick={showSuccessToast}
					className={theme === 'light' ? styles.button : styles.buttonDark}
				>
					Show Success Toast
				</button>
				<Toast
					theme={theme}
					open={successOpen}
					onOpenChange={setSuccessOpen}
					title="Success!"
					description="Your changes have been saved successfully."
					duration={300}
				/>
			</section>

			{/* Error Toast */}
			<section className={styles.section}>
				<h6>Error Toast with Action</h6>
				<button
					onClick={showErrorToast}
					className={theme === 'light' ? styles.button : styles.buttonDark}
				>
					Show Error Toast
				</button>
				<Toast
					theme={theme}
					open={errorOpen}
					onOpenChange={setErrorOpen}
					title="Error"
					description="Failed to save changes. Please try again."
					actionLabel="Retry"
					onAction={() => {
						setErrorOpen(false);
						console.log('Retrying action...');
					}}
				/>
			</section>

			{/* Custom Duration Toast */}
			<section className={styles.section}>
				<h6>Custom Duration Toast</h6>
				<button
					onClick={showCustomToast}
					className={theme === 'light' ? styles.button : styles.buttonDark}
				>
					Show Custom Toast
				</button>
				<Toast
					theme={theme}
					open={customOpen}
					onOpenChange={setCustomOpen}
					title="Quick Note"
					description="This toast will disappear in 2 seconds"
					duration={1000}
				/>
			</section>

			{/* Persistent Toast */}
			<section className={styles.section}>
				<h6>Persistent Toast</h6>
				<button
					onClick={showPersistentToast}
					className={theme === 'light' ? styles.button : styles.buttonDark}
				>
					Show Persistent Toast
				</button>
				<Toast
					theme={theme}
					open={persistentOpen}
					onOpenChange={setPersistentOpen}
					title="Important Message"
					description="This toast won't auto-dismiss. You must click the action button."
					duration={null}
					actionLabel="Acknowledge"
					onAction={() => setPersistentOpen(false)}
				/>
			</section>
		</div>
	);
};

export default ToastExample;
