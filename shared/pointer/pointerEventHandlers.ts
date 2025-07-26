// shared/pointerEventHandlers.ts
/*
Goals:
- Provide reusable event handlers for all R3F mesh components
- Type-safe event handling with proper ThreeEvent types
- Consistent logging and debugging information
- Track interaction states and positions
*/

import chalk from 'chalk';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { hoverManager } from './HoverManager';

const { log } = console;

// Track the current hovered mesh to avoid duplicate logs
let currentHoveredMesh: string | null = null;

interface PointerEventHandlers {
	handleClick: (e: ThreeEvent<MouseEvent>) => void;
	handleContextMenu: (e: ThreeEvent<MouseEvent>) => void;
	handleDoubleClick: (e: ThreeEvent<MouseEvent>) => void;
	handleWheel: (e: ThreeEvent<WheelEvent>) => void;
	handlePointerUp: (e: ThreeEvent<PointerEvent>) => void;
	handlePointerDown: (e: ThreeEvent<PointerEvent>) => void;
	handlePointerOver: (e: ThreeEvent<PointerEvent>) => void;
	handlePointerOut: (e: ThreeEvent<PointerEvent>) => void;
	handlePointerEnter: (e: ThreeEvent<PointerEvent>) => void;
	handlePointerLeave: (e: ThreeEvent<PointerEvent>) => void;
	handlePointerMove: (e: ThreeEvent<PointerEvent>) => void;
	handlePointerMissed: () => void;
	handleUpdate: (self: THREE.Object3D) => void;
}

const pointerEventHandlers: PointerEventHandlers = {
	handleClick: (e) => {
		e.stopPropagation();
		const meshName = e.object.userData.name || 'unnamed-mesh';
		const customName = e.object.userData.customName || '';
		const displayName = customName ? `${meshName} (${customName})` : meshName;
		log(chalk.green(`Click: ${displayName}`));
		log(chalk.blue(`Position: ${e.point.toArray().join(', ')}`));
	},

	handleContextMenu: (e) => {
		e.nativeEvent.preventDefault();
		const meshName = e.object.userData.name || 'unnamed-mesh';
		const customName = e.object.userData.customName || '';
		const displayName = customName ? `${meshName} (${customName})` : meshName;
		log(chalk.cyan(`Context menu: ${displayName}`));
	},

	handleDoubleClick: (e) => {
		const meshName = e.object.userData.name || 'unnamed-mesh';
		const customName = e.object.userData.customName || '';
		const displayName = customName ? `${meshName} (${customName})` : meshName;
		log(chalk.magenta(`Double click: ${displayName}`));
	},

	handleWheel: (e) => {
		log(chalk.blue(`Mouse wheel delta: ${e.deltaY}`));
	},

	handlePointerUp: (e) => {
		const meshName = e.object.userData.name || 'unnamed-mesh';
		const customName = e.object.userData.customName || '';
		const displayName = customName ? `${meshName} (${customName})` : meshName;
		log(chalk.green(`Pointer up: ${displayName}`));
	},

	handlePointerDown: (e) => {
		const meshName = e.object.userData.name || 'unnamed-mesh';
		const customName = e.object.userData.customName || '';
		const displayName = customName ? `${meshName} (${customName})` : meshName;
		log(chalk.green(`Pointer down: ${displayName}`));
	},

	handlePointerOver: (e) => {
		// log(chalk.blue(`Distance: ${e.distance.toFixed(1)}`));
	},

	handlePointerOut: (e) => {
		// Disabled to reduce noise
	},

	handlePointerEnter: (e) => {
		const meshName = e.object.userData.name || 'unnamed-mesh';
		const customName = e.object.userData.customName || '';
		const displayName = customName ? `${meshName} (${customName})` : meshName;
		log(chalk.cyan(`Pointer enter: ${displayName}`));

		// Update global hover state
		if (customName) {
			hoverManager.setHovered(customName);
		}
	},

	handlePointerLeave: (e) => {
		const meshName = e.object.userData.name || 'unnamed-mesh';
		const customName = e.object.userData.customName || '';
		const displayName = customName ? `${meshName} (${customName})` : meshName;
		log(chalk.yellow(`Pointer leave: ${displayName}`));

		// Clear hover if leaving the current piece
		if (customName && hoverManager.current === customName) {
			hoverManager.setHovered(null);
		}
	},

	handlePointerMove: (e) => {
		// Disabled to reduce noise
	},

	handlePointerMissed: () => {
		// log(chalk.gray('Pointer missed any interactive objects'));
	},

	handleUpdate: (self) => {
		// Disabled to reduce noise
	},
};

// Usage example in your mesh components:
/*
<mesh
  {...props}
  onClick={meshEventHandlers.handleClick}
  onContextMenu={meshEventHandlers.handleContextMenu}
  onDoubleClick={meshEventHandlers.handleDoubleClick}
  onWheel={meshEventHandlers.handleWheel}
  onPointerUp={meshEventHandlers.handlePointerUp}
  onPointerDown={meshEventHandlers.handlePointerDown}
  onPointerOver={meshEventHandlers.handlePointerOver}
  onPointerOut={meshEventHandlers.handlePointerOut}
  onPointerEnter={meshEventHandlers.handlePointerEnter}
  onPointerLeave={meshEventHandlers.handlePointerLeave}
  onPointerMove={meshEventHandlers.handlePointerMove}
  onPointerMissed={meshEventHandlers.handlePointerMissed}
  onUpdate={meshEventHandlers.handleUpdate}
/>
*/
export default pointerEventHandlers;
