'use client';
import styles from './Cards.module.scss';
import { useEffect, useContext } from 'react';
import UserContext from '../../../context/userContext';

import { useState, useMemo } from 'react';
type Props = {
	id: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
};
export default function Cards({ id, children, style }: Props) {
	const { theme, mobile } = useContext(UserContext);

	useEffect(() => {
		// if (mobile || theme === 'light') return;
		// if (mobile) return;

		const cards = document.getElementById(id) as any;
		const cardsArray = document.getElementsByClassName(styles.card);
		cards.onmousemove = (e: any) => {
			for (const card of cardsArray as any) {
				const rect = card.getBoundingClientRect(),
					x = e.clientX - rect.left,
					y = e.clientY - rect.top;
				card.style.setProperty('--mouse-x', `${x}px`);
				card.style.setProperty('--mouse-y', `${y}px`);
			}
		};
	}, [theme, id, mobile]);

	return (
		<ul id={id} className={styles.hoverCards} style={style}>
			{children}
		</ul>
	);
}
