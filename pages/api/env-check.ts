import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// Get environment variables
	const elevenlabsApiKey = process.env.ELEVENLABS_API_KEY;

	// Mask the API key for security
	const maskedKey = elevenlabsApiKey
		? `${elevenlabsApiKey.substring(0, 5)}...${elevenlabsApiKey.substring(
				elevenlabsApiKey.length - 5
		  )}`
		: 'not set';

	// Return information about environment variables
	res.status(200).json({
		elevenlabsApiKeySet: !!elevenlabsApiKey,
		maskedKey,
		nodeEnv: process.env.NODE_ENV,
		allEnvKeys: Object.keys(process.env).filter(
			(key) => !key.includes('SECRET') && !key.includes('KEY')
		),
	});
}
