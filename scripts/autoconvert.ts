import chalk from 'chalk';
const chokidar = require('chokidar');
const log = console.log.bind(console);
const { exec } = require('child_process');
import removeFiles from './util/removeFiles';
import removeFile from './util/removeFile';
import getFiles from './util/getFiles';
import * as fs from 'fs';
import * as path from 'path';

import config from './config';

let jobRunning = false;
function convert(path?: string) {
	let srcGlbFiles = getFiles(config.glbSrcFolder, '.glb');

	if (srcGlbFiles.length === 0) {
		jobRunning = false;
		return;
	}
	if (jobRunning) return;
	if (srcGlbFiles.length > 0) {
		const srcGlbName = `${srcGlbFiles[0].split('.')[0]}`;
		console.log(chalk.yellow(`${srcGlbName} started ⏱️`));
		jobRunning = true;
		// removeFiles(config.rootFolder, '.glb');
		exec('npm run convert', (err: any, stdout: any, stderr: any) => {
			if (err) {
				return;
			}
			log(
				chalk.green(srcGlbName + ` finished ✅`)
				// + `\n${stdout}`
			);
			srcGlbFiles = getFiles(config.glbSrcFolder, '.glb');
			const currentPath = srcGlbFiles[0];
			removeFile(`${config.glbSrcFolder}/${currentPath}`);
			removeFiles(config.rootFolder, '.glb');
			jobRunning = false;
			// setTimeout(() => {
			convert();
			// }, 100);
		});
	}
}
// check if config.glbSrcFolder exists, if not create it
// if (!config.glbSrcFolder) {
// 	fs.mkdirSync(config.glbSrcFolder);
// }
function ensureDirectoryExists(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		console.log(`Directory created: ${dirPath}`);
	} else {
		// console.log(`Directory already exists: ${dirPath}`);
	}
}
ensureDirectoryExists(config.glbSrcFolder);
const watcher = chokidar.watch(config.glbSrcFolder, {
	persistent: true,
});
watcher
	.on('add', (path) => convert(path))
	.on('change', (path) => {})
	.on('unlink', (path) => {});
watcher.on('ready', () => {
	removeFiles(config.glbSrcFolder, '.glb');
	console.log(chalk.green(`Pipeline ready...`));
});
const puppeteer = require('puppeteer');
