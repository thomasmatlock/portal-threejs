// meshEventHandlers.ts
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

const { log } = console;

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
		log(chalk.green(`Click: ${e.object.userData.name}`));
		log(chalk.blue(`Position: ${e.point.toArray().join(', ')}`));
	},

	handleContextMenu: (e) => {
		e.nativeEvent.preventDefault();
		log(chalk.cyan(`Context menu: ${e.object.userData.name}`));
	},

	handleDoubleClick: (e) => {
		log(chalk.magenta(`Double click: ${e.object.userData.name}`));
	},

	handleWheel: (e) => {
		log(chalk.blue(`Mouse wheel delta: ${e.deltaY}`));
	},

	handlePointerUp: (e) => {
		log(chalk.green(`Pointer up: ${e.object.userData.name}`));
	},

	handlePointerDown: (e) => {
		log(chalk.green(`Pointer down: ${e.object.userData.name}`));
	},

	handlePointerOver: (e) => {
		// log(chalk.cyan(`Pointer over: ${e.object.userData.name}`));
		log(chalk.blue(`Distance: ${e.distance.toFixed(1)}`));
	},

	handlePointerOut: (e) => {
		// log(chalk.yellow(`Pointer out: ${e.object.userData.name}`));
	},

	handlePointerEnter: (e) => {
		log(chalk.cyan(`Pointer enter: ${e.object.userData.name}`));
	},

	handlePointerLeave: (e) => {
		log(chalk.yellow(`Pointer leave: ${e.object.userData.name}`));
	},

	handlePointerMove: (e) => {
		// Using debug level for move events to reduce console noise
		// log(chalk.blue(`Pointer move: ${e.point.toArray().join(', ')}`));
	},

	handlePointerMissed: () => {
		// log(chalk.gray('Pointer missed any interactive objects'));
	},

	handleUpdate: (self) => {
		// log(chalk.magenta(`${self.userData.name} updated`));
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
