import styles from '@/styles/App.module.scss';
import { ReactNode, CSSProperties } from 'react';

type SectionProps = {
	id?: string;
	style?: CSSProperties;
	children?: ReactNode; // Add children prop
};
export default function Section({ style, id, children }: SectionProps) {
	return (
		<section id={id} className={styles.section} style={style}>
			{children}
		</section>
	);
}
