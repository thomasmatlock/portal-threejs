import Image from 'next/image';
import styles from './HorizontalCards.module.scss';
import { useState } from 'react';
import ink1 from '../../public/img/ink1.webp';
import ink2 from '../../public/img/ink2.webp';
import { url } from 'inspector';

export default function CardHorizontal(props: any) {
	const {
		theme,
		id,
		getCardID,
		icon,
		title,
		titleAlt,
		description,
		descriptionAlt,
		backgroundImage,
	} = props;
	// const mouseEnterHandler = (e: any) => getCardID(props.id);

	// const activeCardClass = [
	// 	cardStyling,
	// 	props.id === props.activeCard ? styles.horizontal_card_active : styles.horizontal_card,
	// ].join(' ');
	const [hovered, setHovered] = useState(false);
	const mouseEnterHandler = (e: any) => {
		setHovered(true);
	};
	const mouseLeaveHandler = (e: any) => {
		setHovered(false);
	};
	// console.log(backgroundImage);

	return (
		<div
			onMouseEnter={mouseEnterHandler}
			onMouseLeave={mouseLeaveHandler}
			id={id}
			className={styles.horizontal_card}
			style={{
				backgroundColor: theme === 'light' ? '#eee' : '#1a1a1a',
				backgroundImage: backgroundImage ? `url(${backgroundImage.src})` : 'none',
			}}
		>
			<div
				className={styles.horizontal_card_header}
				style={{
					backgroundColor: theme === 'light' ? '#fff' : '#252525',

					// backgroundImage: id % 2 === 0 ? `url(${ink1.src})` : `url(${ink2.src})`,
				}}
			>
				{icon && (
					<Image
						src={icon}
						alt="icon"
						className={styles.horizontal_card_header__icon}
						loading="lazy"
					/>
				)}
				<h4
					className={styles.title}
					style={{
						margin: '0.25rem',
					}}
				>
					{hovered ? titleAlt : title}
				</h4>
			</div>
			<div
				className={styles.horizontal_card_description}
				style={{
					color: theme === 'light' ? '#000' : '#fff',
				}}
			>
				<p
					style={{
						color: theme === 'light' ? '#000' : '#fff',
					}}
				>
					{hovered ? description : description}
				</p>
			</div>
		</div>
	);
}
