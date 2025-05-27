// https://react-postprocessing.docs.pmnd.rs/effects/ramp
import {
	ChromaticAberration,
	DepthOfField,
	EffectComposer,
	Outline,
	Glitch,
	Bloom,
	Noise,
	ToneMapping,
	Vignette,
	LensFlare,
	Pixelation,
	Scanline,
	DotScreen,
	SMAA,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize, GlitchMode } from 'postprocessing';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

export default function PostProcess() {
	const {
		scene,
		size: { width, height },
	} = useThree();

	// Create empty refs as placeholders - these should be replaced with actual mesh refs
	const meshRef1 = useRef(null);
	const meshRef2 = useRef(null);

	return (
		<>
			<EffectComposer>
				<></>
				{/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
				{/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
				{/* <Noise opacity={10} /> */}
				{/* <SMAA /> */}
				{/* <ToneMapping
					blendFunction={BlendFunction.NORMAL} // blend mode
					adaptive={true} // toggle adaptive luminance map usage
					resolution={256} // texture resolution of the luminance map
					middleGrey={0.6} // middle grey factor
					maxLuminance={16.0} // maximum luminance
					averageLuminance={1.0} // average luminance
					adaptationRate={1.0} // luminance adaptation rate
				/> */}

				{/* <LensFlare /> */}
				{/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
				{/* <ChromaticAberration
					blendFunction={BlendFunction.NORMAL}
					offset={new THREE.Vector2(0.01, 0.01)}
					radialModulation={false}
					modulationOffset={0.5}
				/> */}
				{/* <DotScreen
					blendFunction={BlendFunction.NORMAL} // blend mode
					angle={Math.PI * 0.5} // angle of the dot pattern
					scale={1} // scale of the dot pattern
				/> */}
				{/* <Grid
					blendFunction={BlendFunction.OVERLAY} // blend mode
					scale={2} // grid pattern scale
					lineWidth={0.25} // grid pattern line width
					size={{ width, height }} // overrides the default pass width and height
				/> */}
				{/* <Outline
					selection={
						meshRef1 && meshRef2
							? [meshRef1.current, meshRef2.current].filter(Boolean)
							: []
					} // selection of objects that will be outlined
					selectionLayer={10} // selection layer
					blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
					patternTexture={null} // a pattern texture
					edgeStrength={2.5} // the edge strength
					pulseSpeed={0.0} // a pulse speed. A value of zero disables the pulse effect
					visibleEdgeColor={0xffffff} // the color of visible edges
					hiddenEdgeColor={0x22090a} // the color of hidden edges
					width={width} // render width
					height={height} // render height
					kernelSize={KernelSize.LARGE} // blur kernel size
					blur={false} // whether the outline should be blurred
					xRay={true} // indicates whether X-Ray outlines are enabled
				/> */}
				{/* <Pixelation granularity={5} /> */}
				{/* <Glitch
					delay={new THREE.Vector2(1, 3)} // min and max glitch delay
					duration={new THREE.Vector2(0.05, 0.1)} // min and max glitch duration
					strength={new THREE.Vector2(0.1, 0.25)} // min and max glitch strength
					mode={GlitchMode.SPORADIC} // glitch mode
					active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
					ratio={0.5} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
				/> */}
				{/* <Scanline
					blendFunction={BlendFunction.OVERLAY} // blend mode
					density={0.25} // scanline density
				/> */}
			</EffectComposer>
		</>
	);
}
