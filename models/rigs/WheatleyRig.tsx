import dynamic from 'next/dynamic';
import { Float } from '@react-three/drei';
import { useWheatleyBehavior } from '../../hooks/useWheatleyBehavior';

const Wheatley = dynamic(() => import('../WheatleyAnimated').then((mod) => mod.Model), {
	ssr: false,
});

export function WheatleyRig() {
	const { wheatleyRef } = useWheatleyBehavior();

	return (
		<group ref={wheatleyRef} rotation={[0, Math.PI / 2, 0]}>
			<Float rotationIntensity={0.5} floatIntensity={0.5} speed={1}>
				<Wheatley scale={0.025} position={[0, -0.5, 0]} rotation={[0, Math.PI - 0.2, 0]} />
			</Float>
		</group>
	);
}
