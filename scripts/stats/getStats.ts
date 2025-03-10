import chalk from 'chalk';

export default function getStats(totalOriginalGLBSize: number, totalCompressedGLBSize: number) {
	const howMuchFaster = totalOriginalGLBSize / totalCompressedGLBSize;
	const totalReductionPercent = (1 - totalCompressedGLBSize / totalOriginalGLBSize) * 100;
	// check if small enough to be in kb
	const original =
		totalOriginalGLBSize < 1000
			? `${totalOriginalGLBSize.toFixed(0)}KB`
			: `${(totalOriginalGLBSize / 1000).toFixed(1)}MB`;
	const compressed =
		totalCompressedGLBSize < 1000
			? `${totalCompressedGLBSize.toFixed(0)}KB`
			: `${(totalCompressedGLBSize / 1000).toFixed(1)}MB`;
	const percentFaster = chalk.greenBright(
		`${(howMuchFaster < 1 ? 1 / howMuchFaster : 1 - (1 - howMuchFaster) * 100).toFixed(0)}%`
	);
	const avgInternetSpeedMbps = 113;
	const avgInternetSpeedKBps = (avgInternetSpeedMbps * 1024) / 8;
	const downloadTime = totalOriginalGLBSize / avgInternetSpeedKBps;

	const fasterSlower = howMuchFaster < 1 ? `slower` : `faster`;
	const message = `${original} -> ${compressed}, ${totalReductionPercent.toFixed(
		0
	)}% smaller, ${percentFaster} ${fasterSlower}`;
	console.log(chalk.green(`${message}`));
}
