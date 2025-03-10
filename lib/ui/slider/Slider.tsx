import React, { useCallback } from 'react';
import * as SliderUI from '@radix-ui/react-slider';
import styles from './Slider.module.scss';
import { SliderProps } from './Slider.props';

function Slider({ value, min = 0, max = 100, step = 1, onValueChange, id, theme }: SliderProps) {
	// const { theme } = useContext(UserContext);
	const handleSliderChange = useCallback(
		(newValue: number[]) => {
			onValueChange(id, newValue[0]);
		},
		[id, onValueChange]
	);

	return (
		<SliderUI.Root
			id={id}
			className={styles.SliderRoot}
			value={[value]}
			min={min}
			max={max}
			step={step}
			onValueChange={handleSliderChange}
		>
			<SliderUI.Track className={styles.SliderTrack}>
				<SliderUI.Range className={styles.SliderRange} />
			</SliderUI.Track>
			<SliderUI.Thumb
				className={styles.SliderThumb}
				aria-label="Volume"
				style={{
					backgroundColor: theme === 'dark' ? '#fff' : '',
				}}
			/>
		</SliderUI.Root>
	);
}

export default React.memo(Slider);
Slider.defaultProps = {
	min: 0,
	max: 100,
	step: 1,
};
