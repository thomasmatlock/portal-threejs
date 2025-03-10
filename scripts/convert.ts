import fs from 'fs';
import config from './config';
// import getSourceGLBFiles from './util/getSourceGLBFiles';
import getFiles from './util/getFiles';
import copyFile from './util/copyFile';
import { getFileSizeMB, getFileSizeKB } from './stats/getFileSize';
import getStats from './stats/getStats';
import chalk from 'chalk';
const { exec } = require('child_process');
import Inject from './calibrate/inject/Inject';
import CalibrateAll from './calibrate/CalibrateAll';
import getCommand from './util/getCommand';
import initFolders from './util/initFolders';
import updateGlbPath from './util/updateGlbPath';
import stats from './stats/stats';

let totalOriginalGLBSizeMB = 0;
let totalCompressedGLBSizeMB = 0;
let totalOriginalGLBSizeKB = 0;
let totalCompressedGLBSizeKB = 0;
(async function convert() {
	const glbSrcFiles = getFiles(config.glbSrcFolder, '.glb');
	const file = glbSrcFiles[0];
	const srcGlbName = `${file.split('.')[0]}`;
	const srcGlbExtension = file.split('.')[1];
	const srcGlbNameWithExtension = `${file.split('.')[0]}.${srcGlbExtension}`;
	const srcGlbTargetFile = `${config.glbSrcFolder}/${srcGlbNameWithExtension}`;

	const totalOriginalGLBSIzeMB = getFileSizeMB(srcGlbTargetFile);
	const totalOriginalGLBSIzeKB = getFileSizeKB(srcGlbTargetFile);
	totalOriginalGLBSizeMB += totalOriginalGLBSIzeMB;
	totalOriginalGLBSizeKB += totalOriginalGLBSIzeKB;
	config.resolutions.forEach((res) => {
		initFolders(res);
		const newGlbTargetFolder = `./public/models/${res.toString()}`;
		const tsxFileCapitalized =
			srcGlbNameWithExtension.charAt(0).toUpperCase() + srcGlbNameWithExtension.slice(1);
		const newTsxPath = `models/${res.toString()}/${tsxFileCapitalized.split('.')[0]}.tsx`;
		const convertCommand = getCommand(srcGlbTargetFile, newTsxPath, res);
		exec(convertCommand, (err: any, stdout: any, stderr: any) => {
			const newGlbPath = `${srcGlbName}-transformed.glb`; // new glb file path
			const newModelPath = `models/${res}/${newGlbPath}`;
			let newTsxFileContents = updateGlbPath(srcGlbName, newModelPath, newTsxPath);
			newTsxFileContents = Inject(newTsxFileContents);
			newTsxFileContents = CalibrateAll(newTsxFileContents);
			fs.writeFileSync(newTsxPath, newTsxFileContents, 'utf8'); // replaces generated tsx file with updated tsx file contents
			const newGlbPathTargetPath = `${newGlbTargetFolder}/${newGlbPath}`; // new glb file in root
			const transformedFileSizeInMB = getFileSizeMB(newGlbPath); // new glb size in MB
			const transformedFileSizeInKB = getFileSizeKB(newGlbPath); // new glb size in MB
			totalCompressedGLBSizeMB += transformedFileSizeInMB; // add new glb size to total glb files compressed size
			totalCompressedGLBSizeKB += transformedFileSizeInKB; // add new glb size to total glb files compressed size
			getStats(totalOriginalGLBSizeKB, totalCompressedGLBSizeKB); // get stats KB
			copyFile(newGlbPath, newGlbPathTargetPath); // copy new glb file to target glb folder
			if (err) {
				console.log(chalk.bgRed(`Error converting glb to tsx`));
				convert();
			}
			return;
		});
	});
	// });
})();
