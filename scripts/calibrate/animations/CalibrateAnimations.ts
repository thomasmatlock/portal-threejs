export function checkIfAnimations(tsxFileContents) {
	const str = `}

type ActionName `;
	const strExists = tsxFileContents.includes(str); // check if str exists
	return strExists;
}
export function replaceAnimationsInterface(tsxFileContents) {
	const actionNameStr = `type ActionName =`; // str to find
	const actionNameRegex = new RegExp(actionNameStr, 'g'); // regex to find str
	const actionNameExists = actionNameRegex.test(tsxFileContents); // check if str exists
	if (actionNameExists) {
		const interfaceStr = `export function`;
		const interFaceReplaceStr = `interface GLTFAction extends THREE.AnimationClip {
	name: ActionName;
}
export  function`;
		const interfaceRegex = new RegExp(interfaceStr, 'g');
		return tsxFileContents.replace(interfaceRegex, interFaceReplaceStr);
	} else {
		return tsxFileContents;
	}
}
export function replaceUseAnimationsStr(tsxFileContents) {
	const str = `useAnimations<GLTFActions>`; // str to replace
	const strExists = tsxFileContents.includes(str); // check if str exists
	if (!strExists) return tsxFileContents; // if str does not exist, return tsx file contents
	const newStr = `useAnimations`; // new str
	const regex = new RegExp(str, 'g'); // regex to find str
	return tsxFileContents.replace(regex, newStr); // replace str with new str
}
export function insertAnimationsType(tsxFileContents) {
	// check if 'type ActionName' exists
	const str = `}type ActionName `;
	const actionNameRegex = new RegExp(str, 'g');
	const actionNameExists = actionNameRegex.test(tsxFileContents);
	if (!actionNameExists) return tsxFileContents; // if it exists, return tsx file contents
	const newStr = ` animations: GLTFAction[]; }

type ActionName `;
	const newRegex = new RegExp(str, 'g');
	return tsxFileContents.replace(newRegex, newStr);
}
export function addUseFrame(newTsxFileContents) {
	const str = `return`;
	const newStr = `useFrame((state) => {
	}); return`;
	const regex = new RegExp(str, 'g');
	return newTsxFileContents.replace(regex, newStr);
}
export function getAnimationNames(newTsxFileContents) {
	const animationNames = [];
	// all names after type ActionName ='
	const str = `type ActionName =`; // str to find
	const regex = new RegExp(str, 'g'); // regex to find str
	const startIndex = newTsxFileContents.search(regex) + str.length; // start index of animation names
	const endIndex = newTsxFileContents.indexOf('type GLTFActions', startIndex); // end index of animation names
	const animationNamesStr = newTsxFileContents.substring(startIndex, endIndex);
	const animationNamesArr = animationNamesStr.split('|');
	animationNamesArr.forEach((name) => {
		animationNames.push(name.trim());
	});
	return animationNames;
}
export function addAnimations(newTsxFileContents, animations) {
	const str = `return`; // search for return
	const animationStrings = []; // array of strings to insert into useFrame
	// create array of strings to insert into useFrame
	animations.forEach((animation) => {
		if (animation.length > 0) {
			// animationStrings.push(`actions[${animation}].time =  timestamp.current;
			// animationStrings.push(`actions[${animation}].time = state.clock.getElapsedTime();
			// 2.9 is the speed of the animation, less means it wont get to the end, more means it will go past the end
			// maybe in second
			// go slightly less than duration to prevent going past the end
			animationStrings.push(`
			if(scrollable){
				actions[${animation}].time = scroll.offset * clipDuration
				if(scrolling.current){
					actions[${animation}].play()
				}else{
					actions[${animation}].play().paused = true
				}
			}
			if(!scrollable){
				actions[${animation}].play() ;
				actions['windmill_3.002Action'].time = elapsedTime;
			}
		`);
		}
	});
	// create useFrame with all animations inserted
	let clipStr = ``;
	// check if actions exist
	animations.forEach((animation) => {
		if (animation.length > 0) {
			clipStr = `if (actions[${animation}].getClip().duration > clipDuration)
			setClipDuration(actions[${animation}].getClip().duration);`;
		}
	});

	// if (animations[1].animation.length > 0) {
	// 	clipStr = `if (actions[${animations[0]}].getClip().duration > clipDuration)
	// 	setClipDuration(actions[${animations[0]}].getClip().duration);`;
	// }
	// if (actions[${animations[0]}].getClip().duration > clipDuration)
	// setClipDuration(actions[${animations[0]}].getClip().duration);
	const newStr = `useFrame((state) => {
		const clock = state.clock;
		const controls = state.controls;
		const camera = state.camera;
		const scene = state.scene;
		const elapsedTime = clock.getElapsedTime();
		${clipStr}
		${animationStrings}
	}); return`;
	// remove commas from newStr
	const commaRegex = new RegExp(',', 'g');
	const newStrNoCommas = newStr.replace(commaRegex, '');
	const regex = new RegExp(str, 'g');
	return newTsxFileContents.replace(regex, newStrNoCommas);
}
export default function CalibrateAnimations(newTsxFileContents) {
	let animations = []; // animations array
	const hasAnimations = checkIfAnimations(newTsxFileContents); // check if glb has animations
	if (hasAnimations) {
		animations = getAnimationNames(newTsxFileContents);
		newTsxFileContents = insertAnimationsType(newTsxFileContents);
		newTsxFileContents = replaceAnimationsInterface(newTsxFileContents);
		newTsxFileContents = replaceUseAnimationsStr(newTsxFileContents);
		animations = getAnimationNames(newTsxFileContents);
		newTsxFileContents = addAnimations(newTsxFileContents, animations);
	}
	return newTsxFileContents;
}
