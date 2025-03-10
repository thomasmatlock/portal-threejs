import { CSSProperties, FC } from 'react';
import classNames from 'classnames';
import { IconProps, defaultIconProps } from './Icon.props';
import styles from './Icon.module.scss';

const Icon: FC<IconProps> = ({
	icon,
	size = defaultIconProps.size,
	color = defaultIconProps.color,
	className = defaultIconProps.className,
	label,
	theme,
	style,
}) => {
	const iconSrc = typeof icon === 'string' ? icon : icon.src;

	const baseStyles: CSSProperties = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: size,
		height: size,
		color,
		...style,
	};

	// Use theme-specific class based on props
	const iconClass = classNames(
		styles.icon,
		theme === 'dark' ? styles.iconDark : styles.iconLight,
		className
	);

	return (
		<span role="img" aria-label={label || 'icon'} className={iconClass} style={baseStyles}>
			<img
				src={iconSrc}
				alt={label || 'icon'}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'contain',
				}}
				loading="eager"
			/>
		</span>
	);
};

export default Icon;
