import { Html } from '@react-three/drei';
import { useRef } from 'react';
import styles from '../components/2D/Intro/IntroName.module.scss';
export default function HtmlComponent({ domnodeRef, groupProps, divProps }) {
	const ref = useRef();
	// const domnodeRef = useRef();
	return (
		<Html
			as="div" // Wrapping element (default: 'div')
			// wrapperClass // The className of the wrapping element (default: undefined)
			// prepend // Project content behind the canvas (default: false)
			// center // Adds a -50%/-50% css transform (default: false) [ignored in transform mode]
			// fullscreen // Aligns to the upper-left corner, fills the screen (default:false) [ignored in transform mode]
			// distanceFactor={10} // If set (default: undefined), children will be scaled by this factor, and also by distance to a PerspectiveCamera / zoom by a OrthographicCamera.
			// zIndexRange={[100, 0]} // Z-order range (default=[16777271, 0])
			// portal={domnodeRef} // Reference to target container (default=undefined)
			// transform // If true, applies matrix3d transformations (default=false)
			// sprite // Renders as sprite, but only in transform mode (default=false)
			// calculatePosition={(el: Object3D, camera: Camera, size: { width: number; height: number }) => number[]} // Override default positioning function. (default=undefined) [ignored in transform mode]
			// occlude={[ref]} // Can be true or a Ref<Object3D>[], true occludes the entire scene (default: undefined)
			onOcclude={(hidden) => null} // Callback when the visibility changes (default: undefined)
			{...groupProps} // All THREE.Group props are valid
			{...divProps} // All HTMLDivElement props are valid
		>
			<div
				style={{
					margin: '0 auto',
					// padding: '0',
					// top: '0',
					// left: '0',
					// position: 'fixed',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					transform: 'translate(-100%, -200%)',
					// border: '1px solid red',
					// width: '100px',
					// height: '100vh',
				}}
				className={styles.name}
			>
				<h1
					className={`${styles.name_span} ${styles.name_span_appearLeftUp}`}
					style={{ color: 'black' }}
				>
					VALHEIM
				</h1>
				<h1
					className={`${styles.name_span} ${styles.name_span_appearLeftUp}`}
					style={{
						color: 'black',
						fontSize: '1rem',
						marginTop: '1rem',
						textTransform: 'lowercase',
						// fontWeight: '100',
						// fontFamily: 'monospace',
						// width: '100%',
						// 	font-family: 'GreycliffCF-Bold', sans-serif !important;
						// border: '1px solid red',
						width: '250px',
						fontFamily: 'GreycliffCF-Bold, sans-serif',
					}}
				>
					an experiment in 3D
				</h1>
			</div>
		</Html>
	);
}
