import fs from 'fs';
import chalk from 'chalk';

export default function removeSrcGlbFiles(folder: string, ext: string) {
	const files = fs.readdirSync(folder);
	let targetFiles = files.filter((file) => file.includes(ext));
	targetFiles.forEach((file) => {
		fs.unlinkSync(`${folder}/${file}`);
	});
}
