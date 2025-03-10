// Login.props.ts
export type SSOProvider = 'google' | 'github';

export interface LoginProps {
	/** Visual theme - light or dark mode */
	theme: 'light' | 'dark';
	/** Handler for traditional email/password login */
	onLogin?: (email: string, password: string) => void;
	/** Handler for SSO login buttons */
	onSSOLogin?: (provider: SSOProvider) => void;
	/** Handler for forgot password link */
	/** Handler for forgot password link */
	onForgotPassword?: () => void;
	/** Handler for sign up link */
	onSignUp?: () => void;
}
