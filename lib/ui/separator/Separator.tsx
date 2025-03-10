import { CSSProperties } from 'react';
import styles from './Separator.module.scss';

type Props = {
	theme: 'dark' | 'light' | 'system';
	opacity?: number;
	// style?: CSSProperties;
	style?: CSSProperties;
};
export default function Separator({ theme, opacity = 1, style = {} }: Props) {
	return (
		<div
			className={theme === 'light' ? styles.separator : styles.separator_dark}
			style={{ opacity, ...style }}
		/>
	);
}

Separator.defaultProps = {
	style: {},
	opacity: 1,
};
