// MultiToggle.example.tsx
import React, { useState } from 'react';
import MultiToggle from './MultiToggle';
import styles from './MultiToggle.example.module.scss';
import Icon from '../ui/icon/Icon';
import portalEnterIcon from '../../../public/icons/portalEnter.svg';
import portalExitIcon from '../../../public/icons/portalExit.svg';

interface MultiToggleExampleProps {
	theme: 'light' | 'dark';
}

const MultiToggleExample: React.FC<MultiToggleExampleProps> = ({ theme }) => {
	const [selected, setSelected] = useState('login');

	const options = [
		{
			id: 'login',
			label: 'Log in',
			icon: <Icon icon={portalEnterIcon} size={16} theme={theme} />,
		},
		{
			id: 'signup',
			label: 'Sign up',
			icon: <Icon icon={portalExitIcon} size={16} theme={theme} />,
		},
	];

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h6>Basic Toggle</h6>
				<div className={styles.example}>
					<MultiToggle
						options={options}
						value={selected}
						onChange={setSelected}
						theme={theme}
					/>
					<div className={styles.selectedValue}>Selected: {selected}</div>
				</div>
			</section>

			<section className={styles.section}>
				<h6>Connected Below</h6>
				<div className={styles.example}>
					<MultiToggle
						options={options}
						value={selected}
						onChange={setSelected}
						theme={theme}
						isConnectedBelow
					/>
					<div className={styles.connectedContent}>Connected content below</div>
				</div>
			</section>
		</div>
	);
};

export default MultiToggleExample;
