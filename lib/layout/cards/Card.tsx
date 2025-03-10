import Link from 'next/link';
import Image from 'next/image';
import { useContext, useState } from 'react';
import styles from './Cards.module.scss';
import radioTower from '../../public/img/radioTower.png';
import UserContext from '../../../context/userContext';

type Props = {
	children: React.ReactNode;
	style?: React.CSSProperties;
};
export default function GridCard(props: Props) {
	const { theme } = useContext(UserContext);
	const { style } = props;

	return (
		<li
			className={styles.card}
			style={
				style
					? { ...style, backgroundColor: theme === 'dark' ? '#000' : '#fff' }
					: { backgroundColor: theme === 'dark' ? '#000' : '#fff' }
			}
		>
			<div
				className={styles.card_content}
				style={{
					backgroundColor: theme === 'dark' ? '#000' : '#fff',
				}}
			>
				<div
					className={styles.card_info_wrapper}
					style={{
						color: theme === 'dark' ? '#fff' : '#000',
					}}
				>
					<div
						className={styles.card_info}
						style={{
							color: theme === 'dark' ? '#fff' : '#000',
						}}
					>
						{props.children}
					</div>
				</div>
			</div>
		</li>
	);
}
