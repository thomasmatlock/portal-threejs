import React from 'react';
import styles from './Login.module.scss';
import { LoginProps } from './Login.props';
import Input from './Input';
import Icon from '../ui/icon/Icon';
import googleIcon from '../../public/icons/google.svg';
import githubIcon from '../../public/icons/github.svg';
import portalEnterIcon from '../../public/icons/portalEnter.svg';
import portalExitIcon from '../../public/icons/portalExit.svg';

import Separator from '../ui/separator/Separator';

const Login: React.FC<LoginProps> = ({
	theme,
	onLogin,
	onSSOLogin,
	onForgotPassword,
	onSignUp,
}) => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) return;

		try {
			setIsLoading(true);
			await onLogin?.(email, password);
		} catch (error) {
			console.error('Login error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.formContainer}>
				<div className={styles.formContent}>
					{/* Logo */}
					<div
						className={styles.logo}
						style={{
							color: theme === 'light' ? '#000' : '#fff',
						}}
					>
						WARP
					</div>

					{/* Welcome Text */}
					<p className={styles.welcomeText}>
						Log in below or{' '}
						<button onClick={onSignUp} className={styles.linkButton} type="button">
							sign up
						</button>{' '}
						to create a Warp account
					</p>

					{/* SSO Buttons */}
					<div className={styles.ssoButtons}>
						<button
							className={styles.ssoButton}
							onClick={() => onSSOLogin?.('google')}
							disabled={isLoading}
						>
							<Icon icon={googleIcon} theme={theme} size={16} />
							<span className={styles.ssoButtonText}>Google</span>
						</button>

						<button
							className={styles.ssoButton}
							onClick={() => onSSOLogin?.('github')}
							disabled={isLoading}
						>
							<Icon icon={githubIcon} theme={theme} size={16} />
							<span className={styles.ssoButtonText}>Github</span>
						</button>
					</div>

					{/* Divider */}
					{/* <div className={styles.divider}>
						<span>or</span>
					</div> */}
					<div className={styles.divider}>
						<Separator theme={theme} />
						<span>or</span>
						<Separator theme={theme} />
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className={styles.form}>
						<Input
							id="emailInput"
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={styles.input}
							disabled={isLoading}
							theme={theme}
							required
							// required
						/>

						<Input
							id="passwordInput"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={styles.input}
							disabled={isLoading}
							theme={theme}
							required
						/>

						{/* <button type="submit" className={styles.loginButton} disabled={isLoading}>
							{isLoading ? 'Logging in...' : 'Log in'}
						</button> */}
						<button type="submit" className={styles.loginButton} disabled={isLoading}>
							<Icon
								icon={portalEnterIcon}
								theme="dark"
								size={16}
								style={{
									marginRight: '0.5rem',
								}}
							/>
							{isLoading ? 'Logging in...' : 'Log in'}
						</button>
					</form>

					{/* Footer Links */}
					<div className={styles.footer}>
						<button
							onClick={() => {}}
							className={styles.footerLink}
							type="button"
							disabled={isLoading}
						>
							Log in with SSO
						</button>
						<button
							onClick={onForgotPassword}
							className={styles.footerLink}
							type="button"
							disabled={isLoading}
						>
							Forgot password?
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
