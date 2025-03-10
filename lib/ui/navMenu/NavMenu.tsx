// @ts-nocheck

import React, { Suspense } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import config from '@/config';
import AppleIcon from '@/public/icons/platforms/apple.svg';
import WindowsIcon from '@/public/icons/platforms/windows.svg';
import downloadIcon from '@/public/icons/download.svg';
import styles from './NavMenu.module.scss';

const { log } = console;

interface ListItemProps {
	title: string;
	href: string;
	children: React.ReactNode;
	className?: string;
	target?: string;
	iconSrc?: string;
}

const ListItem: React.FC<ListItemProps> = React.forwardRef(
	(
		{ className, children, title, iconSrc, ...props },
		forwardedRef: React.Ref<HTMLAnchorElement>
	) => (
		<li>
			<NavigationMenu.Link asChild>
				<a
					className={`${styles.ListItemLink} ${className || ''}`}
					{...props}
					ref={forwardedRef}
				>
					<div className={styles.ListItemHeading}>
						{iconSrc && (
							<Image
								src={iconSrc}
								alt={title}
								height={iconSrc === AppleIcon || iconSrc === WindowsIcon ? 12 : 16}
								width={iconSrc === AppleIcon || iconSrc === WindowsIcon ? 12 : 16}
								style={{
									transform: 'translateY(0px)',
									margin: 0,
									padding: 0,
									marginRight: '4px',
								}}
							/>
						)}
						{title}
					</div>
					<p className={styles.ListItemText}>{children}</p>
				</a>
			</NavigationMenu.Link>
		</li>
	)
);

ListItem.displayName = 'ListItem';

const NavigationMenuDemo: React.FC = () => {
	const { nav, downloads } = config;

	// Render download items
	const renderDownloadItems = () => (
		<>
			{[
				{ ...downloads.windows.x64, iconSrc: WindowsIcon },
				{ ...downloads.mac.x64, iconSrc: AppleIcon },
				{ ...downloads.mac.arm64, iconSrc: AppleIcon },
				{ ...nav.download, iconSrc: downloadIcon },
			].map((item) => (
				<ListItem
					key={item.label}
					title={item.label}
					href={item.href}
					iconSrc={item.iconSrc}
				>
					{item.description}
				</ListItem>
			))}
		</>
	);

	// Render overview items
	const renderOverviewItems = () => (
		<>
			{(['home', 'dropzone', 'workflows'] as const).map((key) => (
				<ListItem key={key} title={nav[key].label} href={nav[key].href}>
					{nav[key].description}
				</ListItem>
			))}
		</>
	);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<NavigationMenu.Root className={styles.NavigationMenuRoot}>
				<NavigationMenu.List className={styles.NavigationMenuList}>
					<NavigationMenu.Item>
						<NavigationMenu.Trigger className={styles.NavigationMenuTrigger}>
							Overview
							<CaretDownIcon className={styles.CaretDown} aria-hidden />
						</NavigationMenu.Trigger>
						<NavigationMenu.Content className={styles.NavigationMenuContent}>
							<ul className={`${styles.List} ${styles.two}`}>
								{renderOverviewItems()}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Trigger className={styles.NavigationMenuTrigger}>
							Download <CaretDownIcon className={styles.CaretDown} aria-hidden />
						</NavigationMenu.Trigger>
						<NavigationMenu.Content className={styles.NavigationMenuContent}>
							<ul className={`${styles.List} ${styles.two}`}>
								{renderDownloadItems()}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
					<NavigationMenu.Indicator className={styles.NavigationMenuIndicator}>
						<div className={styles.Arrow} />
					</NavigationMenu.Indicator>
				</NavigationMenu.List>

				<div className={styles.ViewportPosition}>
					<NavigationMenu.Viewport className={styles.NavigationMenuViewport} />
				</div>
			</NavigationMenu.Root>
		</Suspense>
	);
};

export default NavigationMenuDemo;
