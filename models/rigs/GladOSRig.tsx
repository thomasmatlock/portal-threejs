import dynamic from 'next/dynamic';
const GladOS = dynamic(() => import('../GladOS').then((mod) => mod.Model), {
	ssr: false,
});
export function GladOSRig() {
	return (
		<group>
			<group>
				<GladOS scale={0.15} position={[0.5, 1, 0]} />
			</group>
		</group>
	);
}
