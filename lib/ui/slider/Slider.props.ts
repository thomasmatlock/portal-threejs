export type SliderProps = {
	theme: 'dark' | 'light' | 'system'; // Added 'system' to match usage in Slider.tsx
	id: string;
	value: number;
	min?: number;
	max?: number;
	step?: number;
	//
	onValueChange: (sliderID: string, value: number) => void; // Function to handle value changes
};
