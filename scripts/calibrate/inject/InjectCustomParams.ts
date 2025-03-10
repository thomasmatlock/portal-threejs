export default function InjectCustomParams(newTsxFileContents) {
	const searchStrStart = `props: `;
	const searchStrEnd = `) {`;
	const injectionStr = `& {scroll?: boolean}`;
	const startIndex = newTsxFileContents.indexOf(searchStrStart);
	const endIndex = newTsxFileContents.indexOf(searchStrEnd, startIndex);
	const before = newTsxFileContents.slice(0, endIndex);
	const after = newTsxFileContents.slice(endIndex);
	const newTsxFileContentsWithInjection = `${before}${injectionStr}${after}`;
	return newTsxFileContentsWithInjection;
}
