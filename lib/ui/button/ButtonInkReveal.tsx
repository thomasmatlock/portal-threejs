import { ButtonProps, defaultButtonProps } from './ButtonProps';
import styles from './ButtonInkReveal.module.scss';
import Icon from '../icon/Icon';

export default function ButtonInkReveal({
	href = defaultButtonProps.href,
	label,
	icon,
	target = defaultButtonProps.target,
	theme = defaultButtonProps.theme,
	onClick,
}: ButtonProps) {
	return (
		<a
			className={`${styles.cta} ${styles[`cta_${theme}`]}`}
			href={href}
			target={target}
			onClick={(e) => {
				if (onClick) {
					e.preventDefault();
					onClick();
				}
			}}
		>
			{/* {icon && (
				<img
					className={styles.cta_icon}
					src={typeof icon === 'string' ? icon : icon.src}
					alt="Button icon"
					width={16}
					height={16}
				/>
			)} */}

			{icon && <Icon icon={icon} size={24} style={{ marginRight: '8px' }} />}
			<p
				style={{
					transform: 'translateY(-1px)',
				}}
			>
				{label}
			</p>
		</a>
	);
}

// Remove ButtonInkReveal.defaultProps as we're now using defaultButtonProps
