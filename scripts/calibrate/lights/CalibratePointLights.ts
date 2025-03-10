import getInstances from '../../util/getInstances';
import removeCastShadow from './removeCastShadow';
import removeCastShadowMobile from './removeCastShadowMobile';

export function lightIntensity(newTsxFileContents) {
	const intensityDivider = 54.351; // 1 watt in blender = 54.351 lumens intensity in three.js
	let strInstances = [];
	const strStart = `<pointLight`;
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
		// round to 1 decimal place
		const newIntensityRounded = Math.round(newIntensity * 10) / 10;
		const newStr = `intensity={${newIntensityRounded}`;
		const regex = new RegExp(intensityStr + currentIntensity, 'g');
		newTsxFileContents = newTsxFileContents.replace(regex, newStr);
	});
	// newTsxFileContents = removeCastShadow(strStart, strEnd, newTsxFileContents);
	newTsxFileContents = removeCastShadowMobile(strStart, strEnd, newTsxFileContents);
	return newTsxFileContents;
}
export default function CalibratePointLights(newTsxFileContents) {
	newTsxFileContents = lightIntensity(newTsxFileContents);
	return newTsxFileContents;
}
