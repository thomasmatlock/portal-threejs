import getInstances from '../../util/getInstances';

export function makeCameraDefault(newTsxFileContents) {
	const strStart = `<PerspectiveCamera`;
	const strEnd = `/>`;

	const strInstances = getInstances(strStart, strEnd, newTsxFileContents);
	strInstances.forEach((strInstance) => {
		const newStr = strInstance.replace(
			'makeDefault={false}',
			`makeDefault={true} 
			zoom = { mobile? 1: 1.25 }
			`
		);
		newTsxFileContents = newTsxFileContents.replace(strInstance, newStr);
	});
	return newTsxFileContents;
}
export default function CalibrateCamera(newTsxFileContents) {
	newTsxFileContents = makeCameraDefault(newTsxFileContents);
	return newTsxFileContents;
}
