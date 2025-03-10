import fs from 'fs';
import chalk from 'chalk';

export default function getFiles(folder: string, filterStr: string) {
	const files = fs.readdirSync(folder);
	return files.filter((file) => file.includes(filterStr));
}
