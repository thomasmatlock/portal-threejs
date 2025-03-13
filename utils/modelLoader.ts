/*
 * File goals: Model loading utility for Portal Three.js
 * - Centralized model loading with proper configuration
 * - Support for Draco compression
 * - Caching for better performance
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import chalk from 'chalk';

// Model cache to avoid reloading the same models
const modelCache = new Map<string, any>();

// Configure loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dracoLoader.setDecoderConfig({ type: 'js' }); // Use JavaScript decoder for compatibility

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Load a GLTF/GLB model with proper configuration
 */
export const loadModel = (
	url: string,
	onProgress?: (event: ProgressEvent<EventTarget>) => void
): Promise<any> => {
	// Return from cache if available
	if (modelCache.has(url)) {
		console.log(chalk.blue(`Using cached model: ${url}`));
		return Promise.resolve(modelCache.get(url));
	}

	return new Promise((resolve, reject) => {
		console.log(chalk.blue(`Loading model: ${url}`));

		gltfLoader.load(
			url,
			(gltf) => {
				console.log(chalk.green(`Successfully loaded model: ${url}`));
				modelCache.set(url, gltf);
				resolve(gltf);
			},
			(progress) => {
				if (onProgress && progress.lengthComputable) {
					onProgress(progress);
				}
			},
			(error) => {
				console.error(chalk.red(`Error loading model ${url}:`), error);
				reject(error);
			}
		);
	});
};

/**
 * Clear the model cache
 */
export const clearModelCache = (): void => {
	modelCache.clear();
	console.log(chalk.yellow('Model cache cleared'));
};

/**
 * Preload a model without using it immediately
 */
export const preloadModel = async (url: string): Promise<void> => {
	try {
		await loadModel(url);
		console.log(chalk.green(`Preloaded model: ${url}`));
	} catch (error) {
		console.error(chalk.red(`Failed to preload model ${url}:`), error);
		throw error;
	}
};

export default {
	loadModel,
	clearModelCache,
	preloadModel,
	gltfLoader,
	dracoLoader,
};
