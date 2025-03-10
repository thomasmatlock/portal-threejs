export default function removeDecays(newTsxFileContents) {
	const decayInstances = [];
	// search for decay instances
	const decayStr = `decay={`;
	const decayRegex = new RegExp(decayStr, 'g');
	let decayStartIndex = newTsxFileContents.indexOf(decayStr);
	let decayEndIndex = newTsxFileContents.indexOf('}', decayStartIndex);
	while (decayStartIndex !== -1) {
		const decayInstance = newTsxFileContents.substring(decayStartIndex, decayEndIndex + 1);
		decayInstances.push(decayInstance);
		decayStartIndex = newTsxFileContents.indexOf(decayStr, decayEndIndex);
		decayEndIndex = newTsxFileContents.indexOf('}', decayStartIndex);
	}
	// remove decay instances
	decayInstances.forEach((decayInstance) => {
		newTsxFileContents = newTsxFileContents.replace(decayInstance, '');
	});
	return newTsxFileContents;
}
