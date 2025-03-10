import styles from './PreloaderSpinners.module.scss';

type Props = {
	theme: string;
	style?: React.CSSProperties;
};
export default function Loader(props: Props) {
	const { theme, style } = props;
	const styling = theme === 'dark' ? { filter: 'invert(0)' } : { filter: 'invert(1)' };
	return (
		<div
			className={styles.loader_container}
			style={{
				...style,
			}}
		>
			<div className={`${styles.loader} ${styles.loader1}`} style={styling} />
			<div className={`${styles.loader} ${styles.loader2}`} style={styling} />
			<div className={`${styles.loader} ${styles.loader3}`} style={styling} />
		</div>
	);
}
