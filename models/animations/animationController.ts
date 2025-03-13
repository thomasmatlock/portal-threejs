/*
 * File goals: Character animation controller for Portal Three.js
 * - Manage animation states and transitions
 * - Handle blending between animations
 * - Support scrollable and non-scrollable modes
 */

import * as THREE from 'three';
import { AnimationAction, AnimationMixer } from 'three';
import animationLibrary, { AnimationCategory, AnimationMetadata } from './animationLibrary';
import chalk from 'chalk';

export class CharacterAnimationController {
	private mixer: AnimationMixer;
	private actions: Map<string, AnimationAction> = new Map();
	private currentAction: AnimationAction | null = null;
	private currentAnimationId: string | null = null;
	private isScrollable: boolean = false;
	private scrollOffset: number = 0;
	private isScrolling: boolean = false;

	constructor(model: THREE.Object3D) {
		this.mixer = new THREE.AnimationMixer(model);
		console.log(chalk.green('Animation controller initialized'));
	}

	/**
	 * Load an animation and create an action
	 */
	async loadAnimation(animationId: string): Promise<AnimationAction> {
		// Check if already loaded
		if (this.actions.has(animationId)) {
			return this.actions.get(animationId)!;
		}

		try {
			// Load the animation clip
			const clip = await animationLibrary.loadAnimation(animationId);

			// Create an action
			const action = this.mixer.clipAction(clip);
			this.actions.set(animationId, action);

			console.log(chalk.green(`Created action for animation: ${animationId}`));
			return action;
		} catch (error) {
			console.error(chalk.red(`Failed to load animation ${animationId}:`), error);
			throw error;
		}
	}

	/**
	 * Play an animation
	 */
	async playAnimation(animationId: string, crossFadeDuration: number = 0.5): Promise<void> {
		try {
			// Load the animation if not already loaded
			const targetAction = await this.loadAnimation(animationId);
			const metadata = animationLibrary.getAnimationMetadata(animationId);

			// If we have a current action, crossfade to the new one
			if (this.currentAction && this.currentAction !== targetAction) {
				console.log(
					chalk.blue(`Crossfading from ${this.currentAnimationId} to ${animationId}`)
				);

				// Set looping based on metadata
				if (metadata.loopable) {
					targetAction.setLoop(THREE.LoopRepeat, Infinity);
				} else {
					targetAction.setLoop(THREE.LoopOnce, 1);
					targetAction.clampWhenFinished = true;
				}

				// Start the new action
				targetAction.reset();
				targetAction.play();

				// Crossfade from current to target
				this.currentAction.crossFadeTo(targetAction, crossFadeDuration, true);
			} else {
				// Just play the action
				console.log(chalk.blue(`Playing animation: ${animationId}`));

				if (metadata.loopable) {
					targetAction.setLoop(THREE.LoopRepeat, Infinity);
				} else {
					targetAction.setLoop(THREE.LoopOnce, 1);
					targetAction.clampWhenFinished = true;
				}

				targetAction.reset();
				targetAction.play();
			}

			this.currentAction = targetAction;
			this.currentAnimationId = animationId;
		} catch (error) {
			console.error(chalk.red(`Error playing animation ${animationId}:`), error);
		}
	}

	/**
	 * Set scrollable mode
	 */
	setScrollable(scrollable: boolean): void {
		this.isScrollable = scrollable;
		console.log(chalk.blue(`Animation scrollable mode set to: ${scrollable}`));

		if (this.currentAction) {
			if (scrollable) {
				this.currentAction.paused = !this.isScrolling;
			} else {
				this.currentAction.paused = false;
			}
		}
	}

	/**
	 * Update scroll state
	 */
	updateScrollState(offset: number, isScrolling: boolean): void {
		this.scrollOffset = offset;
		this.isScrolling = isScrolling;

		if (this.isScrollable && this.currentAction && this.currentAnimationId) {
			const metadata = animationLibrary.getAnimationMetadata(this.currentAnimationId);
			if (metadata.duration) {
				this.currentAction.time = offset * metadata.duration;
				this.currentAction.paused = !isScrolling;
			}
		}
	}

	/**
	 * Update the animation mixer
	 */
	update(deltaTime: number): void {
		if (!this.isScrollable || this.isScrolling) {
			this.mixer.update(deltaTime);

			// Debug animation state
			if (this.currentAction && this.currentAnimationId) {
				// Log animation state every 60 frames (about once per second at 60fps)
				if (Math.floor(performance.now() / 1000) % 5 === 0) {
					console.log(
						chalk.cyan(
							`Animation ${
								this.currentAnimationId
							} - Time: ${this.currentAction.time.toFixed(
								2
							)}, Weight: ${this.currentAction.weight.toFixed(2)}, Paused: ${
								this.currentAction.paused
							}`
						)
					);
				}
			}
		}
	}

	/**
	 * Get the current animation ID
	 */
	getCurrentAnimationId(): string | null {
		return this.currentAnimationId;
	}

	/**
	 * Get animation metadata for the current animation
	 */
	getCurrentAnimationMetadata(): AnimationMetadata | null {
		if (!this.currentAnimationId) return null;
		return animationLibrary.getAnimationMetadata(this.currentAnimationId);
	}

	/**
	 * Stop all animations
	 */
	stopAll(): void {
		this.actions.forEach((action) => {
			action.stop();
		});
		this.currentAction = null;
		this.currentAnimationId = null;
		console.log(chalk.yellow('Stopped all animations'));
	}
}

export default CharacterAnimationController;
