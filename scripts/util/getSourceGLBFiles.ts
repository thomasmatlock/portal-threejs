import fs from 'fs';
import chalk from 'chalk';

export default function getSourceGLBFiles(folder: string) {
	const files = fs.readdirSync(folder);
	let glbFiles = files.filter((file) => file.includes('.glb'));
	// exclude transformed files
	const transformedFiles = glbFiles.filter((file) => file.includes('transformed'));
	// remove transformed files from glbFiles
	transformedFiles.forEach((file) => {
		const index = glbFiles.indexOf(file);
		glbFiles.splice(index, 1);
	});
	return glbFiles;
}
