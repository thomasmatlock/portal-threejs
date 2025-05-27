import { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as THREE from 'three';
import UserContextProvider from './userContext';
import { useRouter } from 'next/router';

const InputContext = createContext({
	testing: false as any,
	setTesting: (interacted: boolean) => {},
});
export function InputContextProvider(props) {
	const [testing, setTesting] = useState(false); // user

	return (
		<InputContext.Provider
			value={{
				testing,
				setTesting,
			}}
		>
			{props.children}
		</InputContext.Provider>
	);
}

export default InputContext;
