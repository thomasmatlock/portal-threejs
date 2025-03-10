import { MathUtils } from 'three';
import { easing, geometry } from 'maath';
import * as THREE from 'three';

// damp3 takes 4 arguments
// first is the object to be damped
// second is the target
// third is the damping factor
// fourth is the time delta

// GROUPS
export function LerpGroupPos(
	ref: React.MutableRefObject<THREE.Group>,
	target: THREE.Vector3,
	speed: number
) {
	ref.current.position.z = MathUtils.lerp(ref.current.position.z, target.z, speed);
	ref.current.position.x = MathUtils.lerp(ref.current.position.x, target.x, speed);
	ref.current.position.y = MathUtils.lerp(ref.current.position.y, target.y, speed);
}
export function LerpGroupRot(
	ref: React.MutableRefObject<THREE.Group>,
	target: THREE.Vector3,
	speed: number
) {
	ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, target.x, speed);
	ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, target.y, speed);
	ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, target.z, speed);
}
export function EaseGroupPos(
	ref: React.MutableRefObject<THREE.Group>,
	target: THREE.Vector3,
	dampingFactor: number,
	timeDelta: number
) {
	easing.damp3(ref.current.position, target, dampingFactor, timeDelta);
}
export function LerpGroupScale(
	ref: React.MutableRefObject<THREE.Group>,
	target: THREE.Vector3,
	speed: number
) {
	ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, target.x, speed);
	ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, target.y, speed);
	ref.current.scale.z = MathUtils.lerp(ref.current.scale.z, target.z, speed);
}
export function EaseGroupScale(
	ref: React.MutableRefObject<THREE.Group>,
	target: THREE.Vector3,
	dampingFactor: number,
	timeDelta: number
) {
	easing.damp3(ref.current.scale, target, dampingFactor, timeDelta);
}

// VECTORS
export function LerpVec(vec: THREE.Vector3, target: THREE.Vector3, speed: number) {
	vec.x = MathUtils.lerp(vec.x, target.x, speed);
	vec.y = MathUtils.lerp(vec.y, target.y, speed);
	vec.z = MathUtils.lerp(vec.z, target.z, speed);
}
export function EaseVec(
	vec: THREE.Vector3,
	target: THREE.Vector3,
	dampingFactor: number,
	timeDelta: number
) {
	easing.damp3(vec, target, dampingFactor, timeDelta);
}
