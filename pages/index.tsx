import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import { InputContextProvider } from '../context/inputContext';
import Main from '../components/Main';
import { useState } from 'react';
import Head from 'next/head';
export default function Home() {
	return (
		<InputContextProvider>
			<Main />
		</InputContextProvider>
	);
}
