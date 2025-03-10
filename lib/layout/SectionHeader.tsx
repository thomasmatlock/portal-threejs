import styles from '@/styles/App.module.scss';
import { ReactNode, CSSProperties } from 'react';

type SectionProps = {
	id?: string;
	style?: CSSProperties;
	title?: string;
	subtitle?: string;
	tagline?: string;
};
export default function Section({ style, id, title, subtitle, tagline }: SectionProps) {
	return (
		<>
			{title && (
				<h2
					style={{
						margin: '1rem ',
						// border: '1px solid red ',
						// width: '100%',
					}}
				>
					{title}
				</h2>
			)}
			{subtitle && (
				<h6
					style={{
						marginBottom: '1rem ',
					}}
				>
					{subtitle}
				</h6>
			)}
			{tagline && (
				<p
					style={{
						fontSize: '12px',
						marginBottom: '1rem ',
					}}
				>
					{tagline}
				</p>
			)}
		</>
	);
}
