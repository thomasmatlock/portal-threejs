/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-multi-assign */
import { useRef, useState, useEffect, useCallback } from 'react';
import styles from './ButtonHyper.module.scss';
import { ButtonProps, defaultButtonProps } from './ButtonProps';
import Icon from '../icon/Icon';

const NUM_PARTICLES = 100;
const MAX_Z = 1;
const MAX_R = 1.25;
const Z_SPD = 0.005;
const HOVER_SPEED_MULTIPLIER = 10;

interface Vector {
	x: number;
	y: number;
	z: number;
}

class Particle {
	pos: Vector;

	vel: Vector;

	fill: string;

	stroke: string;

	baseSpeed: number;

	constructor(x: number, y: number, z: number, isDarkTheme: boolean) {
		this.pos = { x, y, z };
		this.baseSpeed = Z_SPD;
		this.vel = { x: 0, y: 0, z: -this.baseSpeed };
		this.fill = isDarkTheme ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,1)';
		this.stroke = this.fill;
	}

	update(isHovering: boolean): void {
		const currentSpeed = isHovering ? this.baseSpeed * HOVER_SPEED_MULTIPLIER : this.baseSpeed;
		this.vel.z = -currentSpeed;
		this.pos.z += this.vel.z;
		if (this.pos.z < 0) this.pos.z = MAX_Z;
	}

	render(
		ctx: CanvasRenderingContext2D,
		W: number,
		H: number,
		XO: number,
		YO: number,
		isHovering: boolean
	): void {
		const [X, Y] = to2d(this.pos, XO, YO);
		const R = ((MAX_Z - this.pos.z) / MAX_Z) * MAX_R;

		this.update(isHovering);
		ctx.beginPath();
		ctx.fillStyle = this.fill;
		ctx.strokeStyle = this.stroke;
		ctx.arc(X, Y, R, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
}

function to2d(v: Vector, XO: number, YO: number): [number, number] {
	const X_COORD = v.x - XO;
	const Y_COORD = v.y - YO;
	const PX = X_COORD / v.z;
	const PY = Y_COORD / v.z;
	return [PX + XO, PY + YO];
}

export default function HyperspaceButton({
	href = defaultButtonProps.href,
	label,
	icon,
	target = defaultButtonProps.target,
	theme = defaultButtonProps.theme,
	onClick,
}: ButtonProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isHovering, setIsHovering] = useState(false);
	const particlesRef = useRef<Particle[]>([]);
	const animationRef = useRef<number>();

	const handleClick = () => {
		if (onClick) onClick();
	};

	const createParticles = useCallback((W: number, H: number, isDarkTheme: boolean) => {
		return Array.from({ length: NUM_PARTICLES }, () => {
			const X = Math.random() * W;
			const Y = Math.random() * H;
			const Z = Math.random() * MAX_Z;
			return new Particle(X, Y, Z, isDarkTheme);
		});
	}, []);

	const render = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			W: number,
			H: number,
			XO: number,
			YO: number,
			buttonTheme: string
		) => {
			ctx.clearRect(0, 0, W, H);

			// Create gradient based on theme
			let gradient;
			switch (buttonTheme) {
				case 'light':
					gradient = ctx.createLinearGradient(0, 0, W, 0);
					gradient.addColorStop(0, '#000');
					gradient.addColorStop(1, '#000');
					break;
				case 'blue':
					gradient = ctx.createLinearGradient(0, 0, W, 0);
					gradient.addColorStop(0, '#5351fc');
					gradient.addColorStop(1, '#19a9fc');
					break;
				case 'orange':
					gradient = ctx.createLinearGradient(0, 0, W, 0);
					gradient.addColorStop(0, '#ff9900');
					gradient.addColorStop(1, '#ff6600');
					break;
				case 'magenta':
					gradient = ctx.createLinearGradient(0, 0, W, 0);
					gradient.addColorStop(0, 'rgb(112, 104, 222)');
					gradient.addColorStop(1, 'rgb(216, 90, 185)');
					break;
				default:
					gradient = ctx.createLinearGradient(0, 0, W, 0);
					gradient.addColorStop(0, '#fff');
					gradient.addColorStop(1, '#fff');
			}

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, W, H);

			particlesRef.current.forEach((particle) =>
				particle.render(ctx, W, H, XO, YO, isHovering)
			);
		},
		[isHovering]
	);

	const getThemeClass = () => {
		switch (theme) {
			case 'light':
				return styles.cta;
			case 'orange':
				return styles.cta_orange;
			case 'blue':
				return styles.cta_blue;
			case 'magenta':
				return styles.cta_magenta;
			default:
				return styles.cta_light;
		}
	};

	const isDarkTheme = theme === 'dark';

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const W = (canvas.width = canvas.offsetWidth);
		const H = (canvas.height = canvas.offsetHeight);
		const XO = W / 2;
		const YO = H / 2;

		particlesRef.current = createParticles(W, H, isDarkTheme);

		const loop = () => {
			render(ctx, W, H, XO, YO, theme || 'dark');
			animationRef.current = requestAnimationFrame(loop);
		};

		loop();

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [theme, createParticles, render, isDarkTheme]);

	// Invert the icon theme
	const iconTheme = theme === 'dark' ? 'light' : 'dark';

	return (
		<a
			className={`${styles.cta} ${getThemeClass()} ${isHovering ? styles.hover : ''}`}
			href={href}
			target={target}
			onClick={handleClick}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			<div className={styles.content}>
				{icon && <Icon icon={icon} style={{ marginRight: '8px' }} theme={iconTheme} />}
				<p
					style={{
						transform: 'translateY(-0.5px)',
					}}
				>
					{label}
				</p>
			</div>
			<canvas ref={canvasRef} className={styles.canvas} />
		</a>
	);
}
