import { Detailed } from '@react-three/drei';

type Props = {
	models: any[];
	distances: number[];
	position ?: [number, number, number];
};
export function LODS(props: Props) {
	const { models, distances, position } = props;
	return (
		<Detailed distances={distances}>
			{models.map((Model, index) => Model && <Model key={index} position={position}
			/>)}
		</Detailed>
	);
}
