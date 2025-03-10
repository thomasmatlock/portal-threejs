import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import { InputContextProvider } from '../context/inputContext';
import Main from '../components/Main';
import { useState } from 'react';
import Head from 'next/head';
export default function Home() {
	return (
		<UserContextProvider>
			<InputContextProvider>
				<Head>
					<title>Portal Three.js</title>
					<meta name="description" content="Portal Three.js" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/portal.svg" />
				</Head>
				<Main />
			</InputContextProvider>
		</UserContextProvider>
	);
}
