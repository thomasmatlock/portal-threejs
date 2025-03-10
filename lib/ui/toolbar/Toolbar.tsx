/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import * as ToolbarUI from '@radix-ui/react-toolbar';
import styles from './Toolbar.module.scss';

type Props = {
	children: ReactNode;
	// children: ReactNode;
	// children: ReactNode;
};
function Toolbar({ children }: Props) {
	return <ToolbarUI.Root className={styles.ToolbarRoot}>{children}</ToolbarUI.Root>;
}

export default Toolbar;
