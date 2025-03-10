import { ButtonProps, defaultButtonProps } from './ButtonProps';
import styles from './Button.module.scss';
import Icon from '../icon/Icon';

export default function Button({
	href = defaultButtonProps.href,
	label,
	icon,
	target = defaultButtonProps.target,
	theme = defaultButtonProps.theme,
	onClick,
}: ButtonProps) {
	// Get theme-based className
	const themeClass = styles[`cta_${theme}`] || styles.cta;

	// Invert the icon theme
	const iconTheme = theme === 'dark' ? 'light' : 'dark';

	return (
		<a className={themeClass} href={href} target={target} onClick={onClick}>
			{icon && (
				<Icon icon={icon} size={16} style={{ marginRight: '8px' }} theme={iconTheme} />
			)}
			<p>{label}</p>
		</a>
	);
}
