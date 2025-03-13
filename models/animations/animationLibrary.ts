/*
 * File goals: Animation library for Portal Three.js
 * - Centralized management of character animations
 * - Support for loading and caching animations
 * - Categorization of animations by type
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import chalk from 'chalk';

// Animation categories
export enum AnimationCategory {
	IDLE = 'idle',
	WALK = 'walk',
	RUN = 'run',
	JUMP = 'jump',
	FALL = 'fall',
	INTERACT = 'interact',
	SPECIAL = 'special',
}

// Animation metadata
export interface AnimationMetadata {
	id: string;
	name: string;
	path: string;
	category: AnimationCategory;
	duration?: number;
	loopable: boolean;
	blendDuration?: number;
}

// Animation registry
const animations: Record<string, AnimationMetadata> = {
	// For testing, you can use the existing animation in your Mixamo.gltf
	test_animation: {
		id: 'test_animation',
		name: 'Test Animation',
		path: '/models/meshes/Mixamo/Mixamo.gltf',
		category: AnimationCategory.SPECIAL,
		loopable: true,
		blendDuration: 0.5,
	},

	// Happy Idle animation
	happy_idle: {
		id: 'happy_idle',
		name: 'Happy Idle',
		path: '/models/meshes/HappyIdle/HappyIdle.gltf',
		category: AnimationCategory.IDLE,
		loopable: true,
		blendDuration: 0.5,
	},
};

// Animation cache
const animationCache: Map<string, THREE.AnimationClip> = new Map();

// Set up loaders
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dracoLoader.setDecoderConfig({ type: 'js' }); // Use JavaScript decoder for compatibility
loader.setDRACOLoader(dracoLoader);

/**
 * Load an animation from file
 */
export const loadAnimation = async (animationId: string): Promise<THREE.AnimationClip> => {
	// Return from cache if available
	if (animationCache.has(animationId)) {
		return animationCache.get(animationId)!;
	}

	const metadata = animations[animationId];
	if (!metadata) {
		console.error(chalk.red(`Animation ${animationId} not found in registry`));
		throw new Error(`Animation ${animationId} not found in registry`);
	}

	return new Promise((resolve, reject) => {
		console.log(chalk.blue(`Loading animation: ${animationId} from ${metadata.path}`));

		loader.load(
			metadata.path,
			(gltf) => {
				if (gltf.animations && gltf.animations.length > 0) {
					const clip = gltf.animations[0];

					// Store duration in metadata if not already set
					if (!metadata.duration) {
						metadata.duration = clip.duration;
						console.log(
							chalk.green(`Animation ${animationId} duration: ${clip.duration}s`)
						);
					}

					// Rename clip to match our ID system
					clip.name = animationId;

					// Store in cache
					animationCache.set(animationId, clip);
					console.log(chalk.green(`Successfully loaded animation: ${animationId}`));
					resolve(clip);
				} else {
					const error = `No animations found in ${metadata.path}`;
					console.error(chalk.red(error));
					reject(new Error(error));
				}
			},
			(progress) => {
				// Optional loading progress
				if (progress.lengthComputable) {
					const percentComplete = (progress.loaded / progress.total) * 100;
					console.log(
						chalk.yellow(`Loading ${animationId}: ${Math.round(percentComplete)}%`)
					);
				}
			},
			(error) => {
				console.error(chalk.red(`Error loading animation ${animationId}:`), error);
				reject(error);
			}
		);
	});
};

/**
 * Preload commonly used animations
 */
export const preloadCommonAnimations = async (): Promise<void> => {
	console.log(chalk.blue('Preloading common animations...'));
	const commonAnimations = ['test_animation', 'happy_idle']; // Include happy_idle

	try {
		await Promise.all(commonAnimations.map((id) => loadAnimation(id)));
		console.log(chalk.green('Successfully preloaded common animations'));
	} catch (error) {
		console.error(chalk.red('Failed to preload some animations:'), error);
	}
};

/**
 * Get animation metadata
 */
export const getAnimationMetadata = (animationId: string): AnimationMetadata => {
	const metadata = animations[animationId];
	if (!metadata) {
		throw new Error(`Animation ${animationId} not found in registry`);
	}
	return metadata;
};

/**
 * Get all animations in a category
 */
export const getAnimationsByCategory = (category: AnimationCategory): AnimationMetadata[] => {
	return Object.values(animations).filter((anim) => anim.category === category);
};

/**
 * Get all animation IDs
 */
export const getAllAnimationIds = (): string[] => {
	return Object.keys(animations);
};

export default {
	loadAnimation,
	preloadCommonAnimations,
	getAnimationMetadata,
	getAnimationsByCategory,
	getAllAnimationIds,
	AnimationCategory,
};
