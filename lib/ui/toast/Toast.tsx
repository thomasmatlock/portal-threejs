import { useEffect, useRef, useState } from 'react';
import * as ToastUI from '@radix-ui/react-toast';
import classNames from 'classnames';
import chalk from 'chalk';
import styles from './Toast.module.scss';

const { log } = console;

function oneWeekAway(date: Date): Date {
	const inOneWeek = new Date(date);
	inOneWeek.setDate(inOneWeek.getDate() + 7);
	return inOneWeek;
}

function prettyDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'full',
		timeStyle: 'short',
	}).format(date);
}

interface ToastProps {
	theme: 'light' | 'dark';
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	duration?: number | null;
	actionLabel?: string;
	onAction?: () => void;
}

export default function Toast({
	theme,
	open,
	onOpenChange,
	title,
	description,
	duration,
	actionLabel,
	onAction,
}: ToastProps) {
	// console.log(theme);
	const eventDateRef = useRef(new Date());
	const timerRef = useRef(0);

	useEffect(() => {
		// Cleanup function to clear the timeout on component unmount
		return () => {
			clearTimeout(timerRef.current);
			// log(chalk.gray('Toast component unmounted, timer cleared'));
		};
	}, []);

	const handleAddToCalendar = () => {
		onOpenChange(false);
		window.clearTimeout(timerRef.current);
		timerRef.current = window.setTimeout(() => {
			eventDateRef.current = oneWeekAway(new Date());
			onOpenChange(true);
			// log(
			//   chalk.green(
			//     `Event added to calendar for ${prettyDate(eventDateRef.current)}`,
			//   ),
			// );
		}, 100);
	};

	return (
		<ToastUI.Provider swipeDirection="right">
			<button
				className={classNames(
					theme === 'light' ? styles.Button : styles.Button_dark,
					styles.large
				)}
				type="button"
				onClick={handleAddToCalendar}
			>
				Add to calendar
			</button>

			<ToastUI.Root
				className={theme === 'light' ? styles.ToastRoot : styles.ToastRoot_dark}
				open={open}
				onOpenChange={onOpenChange}
			>
				<ToastUI.Title
					className={theme === 'light' ? styles.ToastTitle : styles.ToastTitle_dark}
				>
					{title}
				</ToastUI.Title>
				<ToastUI.Description asChild>
					<time
						className={
							theme === 'light'
								? styles.ToastDescription
								: styles.ToastDescription_dark
						}
						dateTime={eventDateRef.current.toISOString()}
					>
						{/* {prettyDate(eventDateRef.current)} */}
						{description}
					</time>
				</ToastUI.Description>
				<ToastUI.Action
					className={styles.ToastAction}
					asChild
					altText="Goto schedule to undo"
				>
					<button
						type="button"
						// className={classNames(styles.Button, styles.small)}
						className={
							theme === 'light'
								? classNames(styles.Button, styles.small)
								: classNames(styles.Button_dark, styles.small)
						}
						onClick={onAction}
					>
						{actionLabel}
					</button>
				</ToastUI.Action>
			</ToastUI.Root>
			<ToastUI.Viewport className={styles.ToastViewport} />
		</ToastUI.Provider>
	);
}
