export function InjectImports(newTsxFileContents) {
	const searchStr = `import { GLTF } from 'three-stdlib'`;
	const inject = `
    import { useFrame, useThree } from "@react-three/fiber";
	import { useScroll } from '@react-three/drei';
	import { easing, geometry } from 'maath';

	import UserContextProvider from '@/context/userContext';
    import InputContextProvider from '@/context/inputContext';
    import {useContext} from 'react';
	`;
	const regex = new RegExp(searchStr, 'g');
	return newTsxFileContents.replace(regex, `${searchStr};${inject}`);
}
export function CommentOutTypeContextType(newTsxFileContents) {
	const searchStr = `type ContextType`;
	const inject = `// `;
	const regex = new RegExp(searchStr, 'g');
	return newTsxFileContents.replace(regex, `${inject}${searchStr}`);
}

export function InjectCustomParams(newTsxFileContents) {
	const searchStrStart = `props: `;
	// const searchStrEnd = `) {`;
	const injectionStr = `  {scrollable?: boolean} &`;
	const regex = new RegExp(searchStrStart, 'g');
	return newTsxFileContents.replace(regex, `${searchStrStart}${injectionStr}`);
}
export function InjectDestructuredVariables(newTsxFileContents) {
	const searchStr = `const { nodes`;
	const scrollPropsInjection = `const { scrollable } = props.scrollable ? props : { scrollable: false };`;
	const userContextInjection = `const { frameloop, dev , mobile} = useContext(UserContextProvider);`;
	const inputContextInjection = `const { timestamp , scrollSpeed, scrollDirection, scrolling, activeObject, clipDuration, setClipDuration } = useContext(InputContextProvider);`;
	const useScrollInjection = `const scroll = useScroll();`;
	const injection = `
	${userContextInjection}
	${inputContextInjection}
	${scrollPropsInjection}
	${useScrollInjection}
	`;
	const regex = new RegExp(searchStr, 'g');
	return newTsxFileContents.replace(regex, `${injection}${searchStr}`);
}
function injectGroupRef(newTsxFileContents) {
	const searchStr = `const { nodes, materials } = useGLTF`;
	const inject = `const group = useRef<THREE.Group>();`;
	const regex = new RegExp(searchStr, 'g');
	// const searchStr2 = `<group`;
	// const inject2 = `<group ref={group}`;
	// const regex2 = new RegExp(searchStr2, 'g');
	// newTsxFileContents = newTsxFileContents.replace(regex2, `${inject2}`);
	return newTsxFileContents.replace(regex, `${inject}${searchStr}`);
}
export default function Inject(newTsxFileContents) {
	newTsxFileContents = InjectImports(newTsxFileContents);
	newTsxFileContents = CommentOutTypeContextType(newTsxFileContents);
	newTsxFileContents = InjectCustomParams(newTsxFileContents);
	newTsxFileContents = InjectDestructuredVariables(newTsxFileContents);
	newTsxFileContents = injectGroupRef(newTsxFileContents);
	return newTsxFileContents;
}
