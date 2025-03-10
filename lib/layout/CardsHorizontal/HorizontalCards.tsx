import styles from './HorizontalCards.module.scss';
import CardHorizontal from './HorizontalCard';
type Items = [
	{
		id: string;
		title: string;
		theme: string;
		description: string;
		descriptionAlt?: string;
		icon: string;
	}
];

export default function HorizontalCards(props: any) {
	const { items } = props;
	return (
		<ul className={styles.horizontal_cards}>
			{items.map(
				(item: {
					id: any;
					title: any;
					titleAlt?: any;
					theme: any;
					description: any;
					descriptionAlt?: any;
					icon: any;
					backgroundImage?: any;
				}) => (
					<CardHorizontal
						id={item.id}
						key={item.id}
						title={item.title}
						titleAlt={item.titleAlt}
						theme={item.theme}
						description={item.description}
						descriptionAlt={item.descriptionAlt}
						icon={item.icon}
						backgroundImage={item.backgroundImage}
						// getCardID={props.getCardID}
						// activeCard={props.activeCard}
					/>
				)
			)}
		</ul>
	);
}
