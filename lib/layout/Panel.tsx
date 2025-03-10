import styles from '../../styles/App.module.scss';
type Props = {
	id?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	left?: boolean;
	top?: boolean;
	hover?: boolean;
};
export default function Panel({ id, style, children, left, top, hover }: Props) {
	return (
		<div
			className={hover ? styles.panel_hover : styles.panel}
			style={{
				...style,
				justifyContent: left ? 'flex-start' : 'center',
				alignItems: top ? 'flex-start' : 'center',
			}}
			id={id}
		>
			{children}
		</div>
	);
}
