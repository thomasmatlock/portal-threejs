import {
	EffectComposer,
	TiltShift2,
	HueSaturation,
	DotScreen,
	Vignette,
	ShockWave,
	Scanline,
	Pixelation,
	Glitch,
} from '@react-three/postprocessing';
export default function EffectController() {
	return (
		<>
			{/* <EffectComposer disableNormalPass multisampling={2}> */}
			{/* <Scanline opacity={0.1} density={1} /> */}
			{/* <Glitch strength={0.01} /> */}
			{/* <Vignette offset={0.6} darkness={0.5} /> */}
			{/* <Pixelation granularity={6} /> */}

			{/* <HueSaturation saturation={-1} /> */}
			{/* <TiltShift2 blur={0.2} /> */}
			{/* <DotScreen scale={0.1} /> */}
			{/* </EffectComposer> */}
		</>
	);
}
