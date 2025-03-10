/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: false,
//     swcMinify: true,
// };

// module.exports = nextConfig;
module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	compiler: {
		// removeConsole: true,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		// ignoreDuringBuilds: true,
		// no double lines
	},
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.(glsl|vs|fs|vert|frag)$/,
			use: ['raw-loader', 'glslify-loader'],
		});

		return config;
	},
};
