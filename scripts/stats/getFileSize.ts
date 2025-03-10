import fs from 'fs';

export function getFileSizeKB(file) {
	try {
		const stats = fs.statSync(file);
		const fileSizeInKB = stats.size / 1000.0;
		return fileSizeInKB;
	} catch (error) {
		console.log('no file found');
	}
}
export function getFileSizeMB(file) {
	try {
		const stats = fs.statSync(file);
		const fileSizeInMB = stats.size / 1000000.0;
		return fileSizeInMB;
	} catch (error) {
		console.log('no file found');
	}
}
