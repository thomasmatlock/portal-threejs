// Menu options list component
import { MenuOption } from '../utils/menuOptions';
import { SettingsState, SettingsActions } from '../utils/settingsHandlers';
import SettingsControls from './SettingsControls';
import styles from '../GameMenu.module.scss';

interface MenuOptionsListProps {
	options: MenuOption[];
	selectedOption: string;
	menuTransitioning: boolean;
	isSubmenu: boolean;
	settingsState: SettingsState;
	settingsActions: SettingsActions;
	onOptionClick: (option: MenuOption) => void;
	onOptionHover: (optionId: string | null) => void;
	onVolumeChange?: (volume: number) => void;
}

const MenuOptionsList: React.FC<MenuOptionsListProps> = ({
	options,
	selectedOption,
	menuTransitioning,
	isSubmenu,
	settingsState,
	settingsActions,
	onOptionClick,
	onOptionHover,
	onVolumeChange,
}) => {
	return (
		<div
			className={`${styles.menuOptions} ${
				menuTransitioning ? styles.menuTransitioning : ''
			} ${isSubmenu ? styles.submenuBackground : ''}`}
		>
			{options.map((option) => (
				<div
					key={option.id}
					className={`${styles.menuOption} ${
						selectedOption === option.id ? styles.selected : ''
					} ${option.disabled ? styles.disabled : ''}`}
					onClick={() => onOptionClick(option)}
					onMouseEnter={() => onOptionHover(option.id)}
					onMouseLeave={() => onOptionHover(null)}
				>
					<span>{option.label}</span>
					{option.value !== undefined && (
						<SettingsControls
							option={option}
							settingsState={settingsState}
							settingsActions={settingsActions}
							onVolumeChange={onVolumeChange}
						/>
					)}
					{option.disabled && <div className={styles.comingSoonTag}>COMING SOON</div>}
				</div>
			))}
		</div>
	);
};

export default MenuOptionsList;
