/**
 * API route for text-to-speech conversion
 *
 * Goals:
 * - Securely handle ElevenLabs API calls from the server
 * - Protect API key from client exposure
 * - Support customizable voice, text, and model parameters
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { ElevenLabsClient } from 'elevenlabs';
import chalk from 'chalk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log(chalk.cyan('🔊 Text-to-Speech API route called'));

	// Only allow POST requests
	if (req.method !== 'POST') {
		console.log(chalk.red('❌ Method not allowed:', req.method));
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const {
			text,
			voiceId = 'Qp2jP4wqfVrgjJ3nj5Pr',
			modelId = 'eleven_multilingual_v2',
			outputFormat = 'mp3_44100_128',
		} = req.body;

		// Validate required fields
		if (!text) {
			console.log(chalk.red('❌ Missing required field: text'));
			return res.status(400).json({ error: 'Text is required' });
		}

		console.log(chalk.blue('📝 TTS API Request:'), {
			text: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
			voiceId,
			modelId,
			outputFormat,
		});

		// Following the exact pattern from the ElevenLabs documentation
		try {
			// Create the client without explicitly passing API key (it will use process.env.ELEVENLABS_API_KEY)
			console.log(chalk.blue('🔄 Creating ElevenLabs client...'));
			const client = new ElevenLabsClient();

			console.log(chalk.blue('🔄 Converting text to speech...'));
			const audio = await client.textToSpeech.convert(voiceId, {
				text,
				model_id: modelId,
				output_format: outputFormat,
			});

			console.log(chalk.green('✅ Received audio from ElevenLabs API'));

			// Convert the audio to Base64
			// For handling in the browser, we need to convert the stream/buffer to base64
			const chunks = [];
			for await (const chunk of audio) {
				chunks.push(Buffer.from(chunk));
			}

			const audioBuffer = Buffer.concat(chunks);
			console.log(chalk.green(`📊 Audio buffer size: ${audioBuffer.length} bytes`));

			const audioBase64 = audioBuffer.toString('base64');

			// Send the audio data back to the client
			console.log(chalk.green('🚀 Sending audio data to client'));
			res.status(200).json({ audio: audioBase64 });
		} catch (conversionError) {
			console.error(chalk.red('❌ TTS Conversion error:'), conversionError);
			console.error(chalk.red('❌ Error details:'), JSON.stringify(conversionError, null, 2));

			return res.status(500).json({
				error: 'Failed to convert text to speech',
				details:
					conversionError instanceof Error
						? conversionError.message
						: String(conversionError),
				stack: conversionError instanceof Error ? conversionError.stack : undefined,
			});
		}
	} catch (error) {
		console.error(chalk.red('❌ TTS API error:'), error);
		res.status(500).json({
			error: 'Failed to convert text to speech',
			details: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
	}
}
