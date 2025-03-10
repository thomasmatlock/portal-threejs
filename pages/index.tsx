import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import { InputContextProvider } from '../context/inputContext';
import Main from '../components1/Main';

export default function Home() {
	return (
		<UserContextProvider>
			<InputContextProvider>
				<div className={styles['app']}>
					<Main />
				</div>
			</InputContextProvider>
		</UserContextProvider>
	);
}
