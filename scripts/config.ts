export const config = {
	// resolutions: [512, 1024, 2048, 4096],
	resolutions: [512],
	glbSrcFolder: './public/models/src',
	rootFolder: './',
	pointLight: {
		shadowMapSize: 1024,
		castShadow: false,
		range: 7,
		far: 10,
	},
	dirLight: {
		shadowMapSize: 2048,
		castShadow: true,
		range: 8,
		far: 40,
		near: 0.1,
		// shadowCameraTop: 12,
	},
	fog: {
		// near: 24,
		near: 30,
		// near: 80,
		// far: 64,
		// far: 30,
		far: 50,
		changeSpeed: 0.1,
	},
};
export default config;
