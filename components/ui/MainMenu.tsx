// do not remove commented out code
import { useState, useEffect, useRef } from 'react';
import styles from './GameMenu.module.scss';
import AudioPlayer from './AudioPlayer';
import { portalSoundtracks } from '../../utils/soundtrackData';
import { GameMenuProps } from './GameMenu.props';
import { useBackgroundRotation } from '../../utils/backgroundUtils';

type MenuOption = {
	id: string;
	label: string;
	action?: () => void;
	submenu?: MenuOption[];
	disabled?: boolean;
	value?: string | number | boolean;
	options?: (string | number | boolean)[];
};

const GameMenu: React.FC<GameMenuProps> = ({
	onStartGame,
	onSettings,
	onExit,
	onLoadGame = () => console.log('Load game...'),
	onContinueGame = () => console.log('Continue game...'),
}) => {
	const [selectedOption, setSelectedOption] = useState<string>('singleplayer');
	const [menuVisible, setMenuVisible] = useState<boolean>(true);
	const [logoAnimated, setLogoAnimated] = useState<boolean>(false);
	const [currentMenu, setCurrentMenu] = useState<
		| 'main'
		| 'singleplayer'
		| 'multiplayer'
		| 'extras'
		| 'options'
		| 'video'
		| 'audio'
		| 'keyboard'
	>('main');
	const [menuTransitioning, setMenuTransitioning] = useState<boolean>(false);
	const [showComingSoon, setShowComingSoon] = useState<boolean>(false);
	const [comingSoonMessage, setComingSoonMessage] = useState<string>('');
	const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
	// const { currentBackground } = useBackgroundRotation();

	// Video settings
	const [antiAliasing, setAntiAliasing] = useState<string>('Off');
	const [shadowQuality, setShadowQuality] = useState<string>('High');
	const [textureQuality, setTextureQuality] = useState<string>('High');
	const [effectsQuality, setEffectsQuality] = useState<string>('High');

	// Audio settings
	const [masterVolume, setMasterVolume] = useState<number>(100);
	const [musicVolume, setMusicVolume] = useState<number>(20);
	const [sfxVolume, setSfxVolume] = useState<number>(100);
	const [voiceVolume, setVoiceVolume] = useState<number>(100);
	const [audioQuality, setAudioQuality] = useState<string>('High');

	// Keyboard & Mouse settings
	const [mouseSensitivity, setMouseSensitivity] = useState<number>(5);
	const [reverseMouse, setReverseMouse] = useState<boolean>(false);

	// Audio player state
	const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(true);

	const containerRef = useRef<HTMLDivElement>(null);
	const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

	// Function to get menu options without the back button
	const getMenuOptionsWithoutBack = (options: MenuOption[]): MenuOption[] => {
		return options.filter((option) => option.id !== 'back');
	};

	// Function to get the back button from menu options
	const getBackButton = (options: MenuOption[]): MenuOption | null => {
		return options.find((option) => option.id === 'back') || null;
	};

	const mainMenuOptions: MenuOption[] = [
		{
			id: 'singleplayer',
			label: 'SINGLE PLAYER',
			submenu: [
				{ id: 'continue', label: 'CONTINUE GAME', action: onContinueGame, disabled: true },
				{ id: 'newgame', label: 'NEW GAME', action: onStartGame },
				{ id: 'loadgame', label: 'LOAD GAME', action: onLoadGame, disabled: true },
				{ id: 'back', label: 'BACK' },
			],
		},
		{
			id: 'multiplayer',
			label: 'MULTIPLAYER',
			disabled: true,
			action: () => showComingSoonNotification('Multiplayer mode coming soon!'),
		},

		// {
		// 	id: 'extras',
		// 	label: 'EXTRAS',
		// 	disabled: true,
		// 	action: () => showComingSoonNotification('Extras coming soon!'),
		// },
		{
			id: 'options',
			label: 'OPTIONS',
			submenu: [
				{
					id: 'audio',
					label: 'AUDIO',
					submenu: [
						{
							id: 'master_volume',
							label: 'MASTER VOLUME',
							value: masterVolume,
							options: [0, 20, 40, 60, 80, 100],
							action: () => incrementOption('master_volume'),
						},
						{
							id: 'music_volume',
							label: 'MUSIC VOLUME',
							value: musicVolume,
							options: [0, 20, 40, 60, 80, 100],
							action: () => incrementOption('music_volume'),
						},
						{
							id: 'sfx_volume',
							label: 'SOUND EFFECTS',
							value: sfxVolume,
							options: [0, 20, 40, 60, 80, 100],
							action: () => incrementOption('sfx_volume'),
						},

						{ id: 'back', label: 'BACK' },
					],
				},
				{
					id: 'video',
					label: 'VIDEO',
					submenu: [
						{
							id: 'anti_aliasing',
							label: 'ANTI-ALIASING',
							value: antiAliasing,
							options: ['Off', 'On'],
							action: () => incrementOption('anti_aliasing'),
						},
						{
							id: 'shadow_quality',
							label: 'SHADOW QUALITY',
							value: shadowQuality,
							options: ['Off', 'Low', 'Medium', 'High'],
							action: () => incrementOption('shadow_quality'),
						},
						{
							id: 'texture_quality',
							label: 'TEXTURE QUALITY',
							value: textureQuality,
							options: ['Low', 'Medium', 'High'],
							action: () => incrementOption('texture_quality'),
						},
						{
							id: 'effects_quality',
							label: 'EFFECTS QUALITY',
							value: effectsQuality,
							options: ['Low', 'Medium', 'High'],
							action: () => incrementOption('effects_quality'),
						},
						{ id: 'back', label: 'BACK' },
					],
				},
				{
					id: 'keyboard',
					label: 'KEYBOARD & MOUSE',
					submenu: [
						{
							id: 'mouse_sensitivity',
							label: 'MOUSE SENSITIVITY',
							value: mouseSensitivity,
							options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
							action: () => incrementOption('mouse_sensitivity'),
						},
						{
							id: 'reverse_mouse',
							label: 'REVERSE MOUSE',
							value: reverseMouse ? 'ON' : 'OFF',
							options: [false, true],
							action: () => incrementOption('reverse_mouse'),
						},
						{ id: 'back', label: 'BACK' },
					],
				},
				{
					id: 'controller',
					label: 'CONTROLLER',
					disabled: true,
					action: () => showComingSoonNotification('Controller options coming soon!'),
				},
				{ id: 'back', label: 'BACK' },
			],
		},
	];

	useEffect(() => {
		// Animate logo after component mounts
		setTimeout(() => {
			setLogoAnimated(true);
		}, 500);
	}, []);

	// Add subtle parallax effect on mouse move
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			// Calculate distance from center (normalized to -1 to 1)
			const offsetX = (e.clientX - centerX) / (rect.width / 2);
			const offsetY = (e.clientY - centerY) / (rect.height / 2);

			// Apply subtle parallax effect
			setParallaxOffset({
				x: offsetX * -10, // Adjust multiplier for effect intensity
				y: offsetY * -10,
			});
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	const showComingSoonNotification = (message: string) => {
		setComingSoonMessage(message);
		setShowComingSoon(true);

		setTimeout(() => {
			setShowComingSoon(false);
		}, 3000);
	};

	// Add these new functions to handle incrementing and decrementing
	const decrementOption = (optionId: string) => {
		switch (optionId) {
			case 'anti_aliasing':
				const aaOptions = ['Off', 'On'];
				const currentAAIndex = aaOptions.indexOf(antiAliasing);
				const prevAAIndex = (currentAAIndex - 1 + aaOptions.length) % aaOptions.length;
				setAntiAliasing(aaOptions[prevAAIndex]);
				break;
			case 'shadow_quality':
				const shadowOptions = ['Off', 'Low', 'Medium', 'High'];
				const currentShadowIndex = shadowOptions.indexOf(shadowQuality);
				const prevShadowIndex =
					(currentShadowIndex - 1 + shadowOptions.length) % shadowOptions.length;
				setShadowQuality(shadowOptions[prevShadowIndex]);
				break;
			case 'texture_quality':
				const textureOptions = ['Low', 'Medium', 'High'];
				const currentTextureIndex = textureOptions.indexOf(textureQuality);
				const prevTextureIndex =
					(currentTextureIndex - 1 + textureOptions.length) % textureOptions.length;
				setTextureQuality(textureOptions[prevTextureIndex]);
				break;
			case 'effects_quality':
				const effectsOptions = ['Low', 'Medium', 'High'];
				const currentEffectsIndex = effectsOptions.indexOf(effectsQuality);
				const prevEffectsIndex =
					(currentEffectsIndex - 1 + effectsOptions.length) % effectsOptions.length;
				setEffectsQuality(effectsOptions[prevEffectsIndex]);
				break;
			case 'master_volume':
				const masterOptions = [0, 20, 40, 60, 80, 100];
				const currentMasterIndex = masterOptions.indexOf(masterVolume);
				const prevMasterIndex =
					(currentMasterIndex - 1 + masterOptions.length) % masterOptions.length;
				setMasterVolume(masterOptions[prevMasterIndex]);
				break;
			case 'music_volume':
				const musicOptions = [0, 20, 40, 60, 80, 100];
				const currentMusicIndex = musicOptions.indexOf(musicVolume);
				const prevMusicIndex =
					(currentMusicIndex - 1 + musicOptions.length) % musicOptions.length;
				setMusicVolume(musicOptions[prevMusicIndex]);
				break;
			case 'sfx_volume':
				const sfxOptions = [0, 20, 40, 60, 80, 100];
				const currentSfxIndex = sfxOptions.indexOf(sfxVolume);
				const prevSfxIndex = (currentSfxIndex - 1 + sfxOptions.length) % sfxOptions.length;
				setSfxVolume(sfxOptions[prevSfxIndex]);
				break;
			case 'voice_volume':
				const voiceOptions = [0, 20, 40, 60, 80, 100];
				const currentVoiceIndex = voiceOptions.indexOf(voiceVolume);
				const prevVoiceIndex =
					(currentVoiceIndex - 1 + voiceOptions.length) % voiceOptions.length;
				setVoiceVolume(voiceOptions[prevVoiceIndex]);
				break;
			case 'audio_quality':
				const audioOptions = ['Low', 'Medium', 'High'];
				const currentAudioIndex = audioOptions.indexOf(audioQuality);
				const prevAudioIndex =
					(currentAudioIndex - 1 + audioOptions.length) % audioOptions.length;
				setAudioQuality(audioOptions[prevAudioIndex]);
				break;
			case 'mouse_sensitivity':
				const sensitivityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
				const currentSensitivityIndex = sensitivityOptions.indexOf(mouseSensitivity);
				const prevSensitivityIndex =
					(currentSensitivityIndex - 1 + sensitivityOptions.length) %
					sensitivityOptions.length;
				setMouseSensitivity(sensitivityOptions[prevSensitivityIndex]);
				break;
			case 'reverse_mouse':
				setReverseMouse(!reverseMouse);
				break;
			case 'show_audio_player':
				setShowAudioPlayer(!showAudioPlayer);
				break;
		}
	};

	// Rename the existing cycleOption to incrementOption for clarity
	const incrementOption = (optionId: string) => {
		// This is the same as your existing cycleOption function
		switch (optionId) {
			case 'anti_aliasing':
				const aaOptions = ['Off', 'On'];
				const currentAAIndex = aaOptions.indexOf(antiAliasing);
				const nextAAIndex = (currentAAIndex + 1) % aaOptions.length;
				setAntiAliasing(aaOptions[nextAAIndex]);
				break;
			case 'shadow_quality':
				const shadowOptions = ['Off', 'Low', 'Medium', 'High'];
				const currentShadowIndex = shadowOptions.indexOf(shadowQuality);
				const nextShadowIndex = (currentShadowIndex + 1) % shadowOptions.length;
				setShadowQuality(shadowOptions[nextShadowIndex]);
				break;
			case 'texture_quality':
				const textureOptions = ['Low', 'Medium', 'High'];
				const currentTextureIndex = textureOptions.indexOf(textureQuality);
				const nextTextureIndex = (currentTextureIndex + 1) % textureOptions.length;
				setTextureQuality(textureOptions[nextTextureIndex]);
				break;
			case 'effects_quality':
				const effectsOptions = ['Low', 'Medium', 'High'];
				const currentEffectsIndex = effectsOptions.indexOf(effectsQuality);
				const nextEffectsIndex = (currentEffectsIndex + 1) % effectsOptions.length;
				setEffectsQuality(effectsOptions[nextEffectsIndex]);
				break;
			case 'master_volume':
				const masterOptions = [0, 20, 40, 60, 80, 100];
				const currentMasterIndex = masterOptions.indexOf(masterVolume);
				const nextMasterIndex = (currentMasterIndex + 1) % masterOptions.length;
				setMasterVolume(masterOptions[nextMasterIndex]);
				break;
			case 'music_volume':
				const musicOptions = [0, 20, 40, 60, 80, 100];
				const currentMusicIndex = musicOptions.indexOf(musicVolume);
				const nextMusicIndex = (currentMusicIndex + 1) % musicOptions.length;
				setMusicVolume(musicOptions[nextMusicIndex]);
				break;
			case 'sfx_volume':
				const sfxOptions = [0, 20, 40, 60, 80, 100];
				const currentSfxIndex = sfxOptions.indexOf(sfxVolume);
				const nextSfxIndex = (currentSfxIndex + 1) % sfxOptions.length;
				setSfxVolume(sfxOptions[nextSfxIndex]);
				break;
			case 'voice_volume':
				const voiceOptions = [0, 20, 40, 60, 80, 100];
				const currentVoiceIndex = voiceOptions.indexOf(voiceVolume);
				const nextVoiceIndex = (currentVoiceIndex + 1) % voiceOptions.length;
				setVoiceVolume(voiceOptions[nextVoiceIndex]);
				break;
			case 'audio_quality':
				const audioOptions = ['Low', 'Medium', 'High'];
				const currentAudioIndex = audioOptions.indexOf(audioQuality);
				const nextAudioIndex = (currentAudioIndex + 1) % audioOptions.length;
				setAudioQuality(audioOptions[nextAudioIndex]);
				break;
			case 'mouse_sensitivity':
				const sensitivityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
				const currentSensitivityIndex = sensitivityOptions.indexOf(mouseSensitivity);
				const nextSensitivityIndex =
					(currentSensitivityIndex + 1) % sensitivityOptions.length;
				setMouseSensitivity(sensitivityOptions[nextSensitivityIndex]);
				break;
			case 'reverse_mouse':
				setReverseMouse(!reverseMouse);
				break;
			case 'show_audio_player':
				setShowAudioPlayer(!showAudioPlayer);
				break;
		}
	};

	// Add a handler for volume changes from the audio player
	const handleMusicVolumeChange = (volume: number) => {
		// Find the closest valid option value
		const musicOptions = [0, 20, 40, 60, 80, 100];
		const closestOption = musicOptions.reduce((prev, curr) => {
			return Math.abs(curr - volume) < Math.abs(prev - volume) ? curr : prev;
		});

		// Only update if the value is different to avoid unnecessary re-renders
		if (closestOption !== musicVolume) {
			setMusicVolume(closestOption);
		}
	};

	const navigateToMenu = (
		menuId:
			| 'main'
			| 'singleplayer'
			| 'multiplayer'
			| 'extras'
			| 'options'
			| 'video'
			| 'audio'
			| 'keyboard'
	) => {
		setMenuTransitioning(true);

		setTimeout(() => {
			setCurrentMenu(menuId);
			setMenuTransitioning(false);

			// Set default selected option for the menu
			if (menuId === 'main') {
				setSelectedOption('singleplayer');
			} else if (menuId === 'singleplayer') {
				setSelectedOption('continue');
			} else if (menuId === 'extras') {
				setSelectedOption('developer');
			} else if (menuId === 'options') {
				setSelectedOption('audio');
			} else if (menuId === 'video') {
				setSelectedOption('anti_aliasing');
			} else if (menuId === 'audio') {
				setSelectedOption('master_volume');
			} else if (menuId === 'keyboard') {
				setSelectedOption('mouse_sensitivity');
			}
		}, 200);
	};

	const handleOptionClick = (option: MenuOption) => {
		if (option.disabled) {
			if (option.action) {
				option.action();
			}
			return;
		}

		setSelectedOption(option.id);

		// Handle back button
		if (option.id === 'back') {
			// If we're in a sub-submenu, go back to the parent submenu
			if (currentMenu === 'video' || currentMenu === 'audio' || currentMenu === 'keyboard') {
				navigateToMenu('options');
			} else {
				// Otherwise go back to main menu
				navigateToMenu('main');
			}
			return;
		}

		if (option.submenu) {
			// If option has submenu, navigate to it
			if (option.id === 'singleplayer') {
				navigateToMenu('singleplayer');
			} else if (option.id === 'extras') {
				navigateToMenu('extras');
			} else if (option.id === 'options') {
				navigateToMenu('options');
			} else if (option.id === 'video') {
				navigateToMenu('video');
			} else if (option.id === 'audio') {
				navigateToMenu('audio');
			} else if (option.id === 'keyboard') {
				navigateToMenu('keyboard');
			}
		} else if (option.action) {
			// If the option has a value (it's a setting), just call the action
			if (option.value !== undefined) {
				option.action();
				return;
			}

			// Otherwise, it's a menu action (like starting the game)
			setTimeout(() => {
				setMenuVisible(false);
				setTimeout(() => {
					option.action?.();
				}, 300);
			}, 100);
		}
	};

	// Get current menu options based on state
	const getCurrentMenuOptions = () => {
		if (currentMenu === 'singleplayer') {
			return mainMenuOptions.find((option) => option.id === 'singleplayer')?.submenu || [];
		} else if (currentMenu === 'extras') {
			return mainMenuOptions.find((option) => option.id === 'extras')?.submenu || [];
		} else if (currentMenu === 'options') {
			return mainMenuOptions.find((option) => option.id === 'options')?.submenu || [];
		} else if (currentMenu === 'video') {
			return (
				mainMenuOptions
					.find((option) => option.id === 'options')
					?.submenu?.find((option) => option.id === 'video')?.submenu || []
			);
		} else if (currentMenu === 'audio') {
			return [
				{
					id: 'master_volume',
					label: 'MASTER VOLUME',
					value: masterVolume,
					options: [0, 20, 40, 60, 80, 100],
					action: () => incrementOption('master_volume'),
				},
				{
					id: 'music_volume',
					label: 'MUSIC VOLUME',
					value: musicVolume,
					options: [0, 20, 40, 60, 80, 100],
					action: () => incrementOption('music_volume'),
				},
				{
					id: 'sfx_volume',
					label: 'SFX VOLUME',
					value: sfxVolume,
					options: [0, 20, 40, 60, 80, 100],
					action: () => incrementOption('sfx_volume'),
				},

				{
					id: 'show_audio_player',
					label: 'AUDIO PLAYER',
					value: showAudioPlayer ? 'On' : 'Off',
					action: () => incrementOption('show_audio_player'),
				},
				{
					id: 'back',
					label: 'Back',
					action: () => navigateToMenu('options'),
				},
			];
		} else if (currentMenu === 'keyboard') {
			return (
				mainMenuOptions
					.find((option) => option.id === 'options')
					?.submenu?.find((option) => option.id === 'keyboard')?.submenu || []
			);
		}
		return mainMenuOptions;
	};

	// Add this effect to listen for the audio unlock event
	useEffect(() => {
		const handleAudioUnlock = () => {
			if (showAudioPlayer) {
				// Find the audio element in the AudioPlayer component
				const audioElement = document.querySelector('audio');
				if (audioElement && audioElement.paused) {
					audioElement.play().catch((error) => {
						console.error('Failed to play audio:', error);
					});
				}
			}
		};

		window.addEventListener('audioUnlocked', handleAudioUnlock);

		return () => {
			window.removeEventListener('audioUnlocked', handleAudioUnlock);
		};
	}, [showAudioPlayer]);

	// Check if we're in a submenu
	const isSubmenu = currentMenu !== 'main';

	// Get current menu options and back button
	const currentMenuOptions = getCurrentMenuOptions();
	const menuOptionsWithoutBack = getMenuOptionsWithoutBack(currentMenuOptions);
	const backButton = getBackButton(currentMenuOptions);

	// Update the renderOptionValue function to handle arrow clicks
	const renderOptionValue = (option: MenuOption) => {
		if (option.value === undefined) return null;

		const handleLeftArrowClick = (e: React.MouseEvent) => {
			e.stopPropagation(); // Prevent the main option click from firing
			decrementOption(option.id);
		};

		const handleRightArrowClick = (e: React.MouseEvent) => {
			e.stopPropagation(); // Prevent the main option click from firing
			incrementOption(option.id);
		};

		return (
			<div className={styles.optionValue}>
				<span className={styles.leftArrow} onClick={handleLeftArrowClick}>
					◀
				</span>
				<span>{option.value}</span>
				<span className={styles.rightArrow} onClick={handleRightArrowClick}>
					▶
				</span>
			</div>
		);
	};

	return (
		<div
			ref={containerRef}
			className={`${styles.menuContainer} ${menuVisible ? styles.visible : styles.hidden}`}
		>
			{/* <div
				className={styles.parallaxBackground}
				style={{
					transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
					backgroundImage: `url(${currentBackground})`,
				}}
			/> */}

			{/* {renderBreadcrumb()} */}

			<div className={`${styles.logo} ${logoAnimated ? styles.logoAnimated : ''}`}>
				<span className={styles.portalText}>PORTAL</span>
				<span className={styles.portalNumber}>THREE</span>
				<span className={styles.portalNumberJS}>.js</span>
			</div>

			<div className={styles.menuWrapper}>
				<div
					className={`${styles.menuOptions} ${
						menuTransitioning ? styles.menuTransitioning : ''
					} ${isSubmenu ? styles.submenuBackground : ''}`}
				>
					{menuOptionsWithoutBack.map((option) => (
						<div
							key={option.id}
							className={`${styles.menuOption} ${
								selectedOption === option.id ? styles.selected : ''
							} ${option.disabled ? styles.disabled : ''}`}
							onClick={() => handleOptionClick(option)}
						>
							<span>{option.label}</span>
							{option.value !== undefined && renderOptionValue(option)}
							{option.disabled && (
								<div className={styles.comingSoonTag}>COMING SOON</div>
							)}
						</div>
					))}
				</div>

				{backButton && (
					<div
						className={`${styles.backButton} ${
							isSubmenu ? styles.submenuBackground : ''
						}`}
						onClick={() => handleOptionClick(backButton)}
					>
						<span>{backButton.label}</span>
					</div>
				)}
			</div>

			{showComingSoon && <div className={styles.notification}>{comingSoonMessage}</div>}

			{showAudioPlayer && (
				<AudioPlayer
					tracks={portalSoundtracks}
					initialVolume={musicVolume}
					onVolumeChange={handleMusicVolumeChange}
					autoplay={true}
					randomizeTrack={true}
				/>
			)}
		</div>
	);
};

export default GameMenu;
