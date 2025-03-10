import '../styles/App.css';
import type { AppProps } from 'next/app';
import { UserContextProvider } from '../context/userContext';
import { UIContextProvider } from '../context/uiContext';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<UserContextProvider>
			<UIContextProvider>
				<Component {...pageProps} />
			</UIContextProvider>
		</UserContextProvider>
	);
}
