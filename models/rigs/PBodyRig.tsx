import dynamic from 'next/dynamic';
const PBody = dynamic(() => import('../PBody').then((mod) => mod.Model), {
	ssr: false,
});
export function PBodyRig() {
	return (
		<group>
			<group>
				<PBody scale={0.015} position={[0, -0.5, 0]} />
			</group>
		</group>
	);
}
