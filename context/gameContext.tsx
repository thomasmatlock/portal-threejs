import { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as THREE from 'three';
import UserContextProvider from './userContext';
import { useRouter } from 'next/router';

const InputContext = createContext({
	interacted: false as any,
	setInteracted: (interacted: boolean) => {},
});
export function InputContextProvider(props) {
	const [interacted, setInteracted] = useState(false); // user

	return (
		<InputContext.Provider
			value={{
				interacted,
				setInteracted,
			}}
		>
			{props.children}
		</InputContext.Provider>
	);
}

export default InputContext;
