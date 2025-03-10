import getInstances from '../../util/getInstances';
import config from '@/scripts/config';

export default function removeCastShadow(strStart, strEnd, newTsxFileContents) {
	let strInstances = [];

	strInstances = getInstances(strStart, strEnd, newTsxFileContents);
	strInstances.forEach((strInstance) => {
		if (!strInstance.includes('castShadow')) {
			const newStr = strInstance.replace(strEnd, ` castShadow={false} ${strEnd}`);
			newTsxFileContents = newTsxFileContents.replace(strInstance, newStr);
		}
	});
	return newTsxFileContents;
}
