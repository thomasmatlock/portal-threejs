/* eslint-disable react/no-array-index-key */
import {
	Layers,
	CuboidIcon as Cube,
	FlaskConical,
	Gamepad2,
	Clapperboard,
	Zap,
} from 'lucide-react';
import styles from './DarkGrid.module.scss';

const features = [
	// {
	// 	icon: Layers,
	// 	title: 'Bilbo',
	// 	subtitle: 'Started at the top, fell down, and took it out on Wokeez',
	// },
	// {
	// 	icon: Cube,
	// 	title: 'Loki',
	// 	subtitle: 'Endlessly happy head. Victim of Bilbo attacks.',
	// },
	// {
	// 	icon: Cube,
	// 	title: 'Ludwig',
	// 	subtitle: 'Thumps when angee. Referees Bilbo/Loki fights.',
	// },
	// {
	// 	icon: Layers,
	// 	title: 'Bilbo',
	// 	subtitle: 'Started at the top, fell down, and took it out on Wokeez',
	// },
	// {
	// 	icon: Cube,
	// 	title: 'Loki',
	// 	subtitle: 'Endlessly happy head. Victim of Bilbo attacks.',
	// },
	// {
	// 	icon: Cube,
	// 	title: 'Ludwig',
	// 	subtitle: 'Thumps when angee. Referees Bilbo/Loki fights.',
	// },
	{
		icon: Zap,
		title: 'Warp',
		description:
			'Award winning desktop app for converting and compressing audio, images, and video',
		subtitles: ['700,000 users', '20 terabytes processed'],
	},
	{
		icon: Gamepad2,
		title: 'Ideology',
		description: 'Videogame recreations for the web',
		subtitles: [
			'10+ million copies sold',
			'One of best selling games of all time',
			'Winner of multiple Game of the Year awards',
		],
	},
	{
		icon: Clapperboard,
		title: 'Piece By Piece',
		description: 'Videogame recreations for the web',
		subtitles: ['50 million views', 'Winner of multiple awards'],
	},
	{
		icon: FlaskConical,
		title: 'Games To Web',
		description: 'Videogame recreations for the web',
		subtitles: ['100+ million views'],
	},
];

export default function FeaturesGrid() {
	return (
		<section className={styles.container}>
			<div className={styles.wrapper}>
				<h2 className={styles.title}>Projects</h2>
				{/* <h2 className={styles.title}>Fats</h2> */}
				{/* <h2 style={{ marginBottom: '1rem' }}>Projects</h2> */}

				<div className={styles.grid}>
					{features.map((feature, index) => (
						<div key={index} className={styles.card}>
							<div className={styles.cardContent}>
								<div className={styles.iconWrapper}>
									<feature.icon className={`${styles.icon} text-gray-400`} />
								</div>
								<h3 className={styles.featureTitle}>{feature.title}</h3>
								{/* <h4>{feature.description}</h4> */}
								{/* <p style={{ fontSize: '14px', color: 'white' }}>
									{feature.description}
								</p> */}
								{feature.subtitles.map((subtitle, i) => (
									<p
										key={`${feature.title}-subtitle-${i}`}
										className={styles.featureSubtitle}
									>
										{subtitle}
									</p>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
