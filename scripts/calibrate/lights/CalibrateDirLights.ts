import getInstances from '../../util/getInstances';
import removeDecays from './removeDecays';
import castShadow from './removeCastShadow';
import shadowMapDirLight from './shadowMapDirLight';
export function intensity(newTsxFileContents) {
	const intensityDivider = 683; // 1 watt in blender = 683 lumens intensity in three.js
	let strInstances = [];
	const strStart = `<directionalLight`;
	// const strEnd = `/>`;
	const strEnd = `userData`;
	strInstances = getInstances(strStart, strEnd, newTsxFileContents);
	strInstances.forEach((strInstance) => {
		const intensityStr = `intensity={`;
		const currentIntensity = strInstance.substring(
			strInstance.indexOf(intensityStr) + intensityStr.length,
			strInstance.indexOf('}', strInstance.indexOf(intensityStr))
		);
		const newIntensity = currentIntensity / intensityDivider; // new intensity
		const newIntensityRounded = Math.round(newIntensity * 10) / 10; // round to 1 decimal place
		const newStr = ` intensity={${newIntensityRounded / 4}`; // new intensity string
		const regex = new RegExp(intensityStr + currentIntensity, 'g'); // regex to find current intensity
		newTsxFileContents = removeDecays(newTsxFileContents); // remove decay instances
		newTsxFileContents = newTsxFileContents.replace(regex, newStr); // replace current intensity with new intensity
	});
	// newTsxFileContents = shadowMapDirLight(strStart, strEnd, newTsxFileContents);
	newTsxFileContents = castShadow(strStart, strEnd, newTsxFileContents);
	return newTsxFileContents;
}
export default function CalibrateDirLights(newTsxFileContents) {
	newTsxFileContents = intensity(newTsxFileContents);
	return newTsxFileContents;
}
