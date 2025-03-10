// Login.example.tsx
import React from 'react';
import Login from './Login';
import styles from './Login.example.module.scss';

interface LoginExampleProps {
	theme: 'light' | 'dark';
}

const LoginExample: React.FC<LoginExampleProps> = ({ theme }) => {
	const handleLogin = (email: string, password: string) => {
		console.log('Login:', { email, password });
	};

	const handleSSOLogin = (provider: 'google' | 'github') => {
		console.log('SSO Login:', provider);
		// console.log('SSO Login:', provider);
		// console.log('SSO Login:', provider);
	};

	const handleForgotPassword = () => {
		console.log('Forgot password');
	};

	const handleSignUp = () => {
		console.log('Sign up');
	};

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				{/* <h6>Login Screen</h6> */}
				<div className={styles.example}>
					<Login
						theme={theme}
						onLogin={handleLogin}
						onSSOLogin={handleSSOLogin}
						onForgotPassword={handleForgotPassword}
						onSignUp={handleSignUp}
					/>
				</div>
			</section>
		</div>
	);
};

export default LoginExample;
