export default function InjectImports(newTsxFileContents) {
	const imports = ` import { useFrame, useThree } from "@react-three/fiber";
	import { useScroll } from '@react-three/drei';
	import UserContextProvider from '@/context/userContext';
import InputContextProvider from '@/context/inputContext';
    import {useContext} from 'react';


	`;
	const str = `import { GLTF } from 'three-stdlib'`;
	const regex = new RegExp(str, 'g');
	return newTsxFileContents.replace(regex, `${str};${imports}`);
}
