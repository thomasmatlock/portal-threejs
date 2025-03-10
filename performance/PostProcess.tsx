// @ts-nocheck
import { DepthOfField } from '@react-three/postprocessing';
import { Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import {
	EffectComposer,
	Pixelation,
	ChromaticAberration,
	Vignette,
	SMAA,
	ToneMapping,
	Bloom,
} from '@react-three/postprocessing';
import { LensFlare } from '@react-three/postprocessing';

import { useFrame } from '@react-three/fiber';
import { useState, useCallback } from 'react';
import { BlendFunction, Resizer, KernelSize, Resolution, BlurPass } from 'postprocessing';
import * as THREE from 'three';
import { Scanline, Grid, Outline } from '@react-three/postprocessing';

import chalk from 'chalk';

const { log } = console;

export function PostProcess() {
	useFrame((state, delta) => {});

	return (
		<>
			<EffectComposer>
				<Vignette
					offset={0.5} // vignette offset
					darkness={0.5} // vignette darkness
					eskil={false} // Eskil's vignette technique
					blendFunction={BlendFunction.NORMAL} // blend mode
				/>
				{/* <SMAA /> */}
				{/* <ToneMapping
					blendFunction={BlendFunction.NORMAL} // Blend mode - Standard blend works well for dramatic scenes
					adaptive={true} // Dynamically adjusts to scene lighting - Essential for varying chess piece interactions
					resolution={512} // Texture resolution of the luminance map - Higher value (512) captures magical effect details
					middleGrey={0.4} // Middle grey factor - Lowered to 0.4 for moodier Hogwarts-style contrast
					maxLuminance={20.0} // Maximum luminance - Increased to 20 to handle bright magical highlights/explosions
					averageLuminance={0.8} // Average luminance - Set to 0.8 for slightly darker mysterious atmosphere
					adaptationRate={2.0} // How fast eyes adjust to light changes - Faster (2.0) for responsive magical effects
				/> */}

				{/* <Pixelation granularity={10} /> */}
				{/* <Bloom
					intensity={1.0} // The bloom intensity.
					blurPass={undefined} // A blur pass.
					kernelSize={KernelSize.LARGE} // blur kernel size
					luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
					luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
					mipmapBlur={false} // Enables or disables mipmap blur.
					resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
					resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
				/> */}
				{/* <Scanline
					blendFunction={BlendFunction.OVERLAY} // blend mode
					density={1.25} // scanline density
				/> */}
				{/* <DotScreen
				blendFunction={BlendFunction.NORMAL} // blend mode
				angle={Math.PI * 0.5} // angle of the dot pattern
				scale={1.0} // scale of the dot pattern
				/> */}
			</EffectComposer>
		</>
	);
}

export default PostProcess;
