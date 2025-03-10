import dynamic from 'next/dynamic';
const Atlas = dynamic(() => import('../Atlas').then((mod) => mod.Model), {
	ssr: false,
});
export function AtlasRig() {
	return (
		<group>
			<group>
				<Atlas scale={0.15} position={[0, -0.5, 0]} />{' '}
			</group>
		</group>
	);
}
