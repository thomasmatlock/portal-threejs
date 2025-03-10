import Panel from '../layout/Panel';
import Button from '../ui/button/Button';
import ButtonHyper from '../ui/button/ButtonHyper';
import ButtonInkReveal from '../ui/button/ButtonInkReveal';
// import steamIcon from '../public/icons/steam.svg';
import steamIcon from '../../public/icons/ram.svg';
import AppleIcon from '../../public/icons/platforms/apple.svg';

type Props = {
	theme: 'dark' | 'light';
};
export default function TestLib({ theme }: Props) {
	return (
		<>
			{/* <Panel /> */}
			{/* <Panel /> */}
			{/* <Panel /> */}
			<ButtonHyper
				href="/sandbox"
				theme="magenta"
				label="Download"
				target="_blank"
				icon={AppleIcon}
			/>
			{/* <Panel /> */}
			<ButtonHyper
				href="/sandbox"
				theme="blue"
				label="Download"
				target="_blank"
				icon={AppleIcon}
			/>
			{/* <Panel /> */}
			{/* <ButtonHyper
				href="/sandbox"
				theme="orange"
				label="Download"
				target="_blank"
				icon={AppleIconW}
			/> */}
			{/* <Panel /> */}
			<ButtonHyper
				href="/sandbox"
				theme={theme}
				label="Download"
				target="_blank"
				icon={AppleIcon}
			/>
			{/* <Panel /> */}
			<Button
				href="/sandbox"
				theme={theme}
				label="Download"
				target="_blank"
				icon={AppleIcon}
			/>
			{/* <Panel /> */}
			<ButtonInkReveal
				theme={theme}
				href="/sandbox"
				label="Wishlist on Steam"
				icon={steamIcon}
			/>

			{/* <Panel /> */}
		</>
	);
}
