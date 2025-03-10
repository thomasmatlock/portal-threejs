import fs from 'fs';
import chalk from 'chalk';

export default function removeSrcGlbFiles() {
	const files = fs.readdirSync('./public/models/src');
	let glbFiles = files.filter((file) => file.includes('.glb'));
	glbFiles.forEach((file) => {
		fs.unlinkSync(`./public/models/src/${file}`);
	});
}
