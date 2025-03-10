import styles from '../styles/App.module.scss';
import { UserContextProvider } from '../context/userContext';
import Main from '../components/Main';

export default function Home() {
	return (
		<UserContextProvider>
			<div className={styles['app']}>
				<Main />
			</div>
		</UserContextProvider>
	);
}
