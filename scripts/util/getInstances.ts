export default function getInstances(strStart, strEnd, newTsxFileContents) {
	const instances = [];
	let strStartIndex = newTsxFileContents.indexOf(strStart);
	let strEndIndex = newTsxFileContents.indexOf(strEnd, strStartIndex);
	while (strStartIndex !== -1) {
		const instance = newTsxFileContents.substring(strStartIndex, strEndIndex + strEnd.length);
		instances.push(instance);
		strStartIndex = newTsxFileContents.indexOf(strStart, strEndIndex);
		strEndIndex = newTsxFileContents.indexOf(strEnd, strStartIndex);
	}
	return instances;
}
