// Menu header component with Portal logo
import styles from '../GameMenu.module.scss';

interface MenuHeaderProps {
	logoAnimated: boolean;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ logoAnimated }) => {
	return (
		<div className={`${styles.logo} ${logoAnimated ? styles.logoAnimated : ''}`}>
			<span className={styles.portalText}>PORTAL</span>
			<span className={styles.portalNumber}>THREE</span>
			<span className={styles.portalNumberJS}>.js</span>
		</div>
	);
};

export default MenuHeader;
