import { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as THREE from 'three';
import UserContextProvider from './userContext';
import { useRouter } from 'next/router';

const InputContext = createContext({
	testGameState: false as any,
	setTestGameState: (interacted: boolean) => {},
});
export function InputContextProvider(props) {
	const [testGameState, setTestGameState] = useState(false);

	return (
		<InputContext.Provider
			value={{
				testGameState,
				setTestGameState,
			}}
		>
			{props.children}
		</InputContext.Provider>
	);
}

export default InputContext;
