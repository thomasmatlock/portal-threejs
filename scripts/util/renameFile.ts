import fs from 'fs';
import chalk from 'chalk';

export default async function renameFile(source: string, target: string) {
	try {
		return await fs.renameSync(source, target);
	} catch (error) {
		console.log(chalk.red(`Error renaming ${source} to ${target}`));
	}
}
