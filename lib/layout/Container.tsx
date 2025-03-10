import styles from '../../styles/App.module.scss';
// test
type Props = {
	id?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
	left?: boolean;
	top?: boolean;
};
export default function Container({ id, style, top, left, children }: Props) {
	return (
		<div
			className={styles.container}
			id={id}
			style={{
				...style,
				justifyContent: left ? 'flex-start' : 'center',
				alignItems: top ? 'flex-start' : 'center',
			}}
		>
			{children}
		</div>
	);
}
