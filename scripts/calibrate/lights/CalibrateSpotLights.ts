import getInstances from '../../util/getInstances';
import castShadow from './removeCastShadow';

export function lightIntensity(newTsxFileContents) {
	const intensityDivider = 54.351; // 1 watt in blender = 54.351 lumens intensity in three.js
	let strInstances = [];
	const strStart = `<spotLight`;
	// const strEnd = `/>`;
	const strEnd = `userData`;

	strInstances = getInstances(strStart, strEnd, newTsxFileContents);
	strInstances.forEach((strInstance) => {
		const intensityStr = `intensity={`;
		const currentIntensity = strInstance.substring(
			strInstance.indexOf(intensityStr) + intensityStr.length,
			strInstance.indexOf('}', strInstance.indexOf(intensityStr))
		);
		const newIntensity = currentIntensity / intensityDivider;
		const newIntensityRounded = Math.round(newIntensity * 10) / 10;
		const newStr = `intensity={${newIntensityRounded}`;
		const regex = new RegExp(intensityStr + currentIntensity, 'g');
		newTsxFileContents = newTsxFileContents.replace(regex, newStr);
	});
	newTsxFileContents = castShadow(strStart, strEnd, newTsxFileContents);
	// newTsxFileContents = addShadowMap(strStart, strEnd, newTsxFileContents);
	return newTsxFileContents;
}
export default function CalibrateSpotLights(newTsxFileContents) {
	newTsxFileContents = lightIntensity(newTsxFileContents);
	return newTsxFileContents;
}
