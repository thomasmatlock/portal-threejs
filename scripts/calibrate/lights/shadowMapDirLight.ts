import getInstances from '../../util/getInstances';
import config from '@/scripts/config';

export default function shadowMapDirLight(strStart, strEnd, newTsxFileContents) {
	let instances = [];
	instances = getInstances(strStart, strEnd, newTsxFileContents);
	const shadowRange = config.dirLight.range;
	const shadowMapSize = `mobile ? ${config.dirLight.shadowMapSize} : ${
		config.dirLight.shadowMapSize * 2
	}`;
	const shadowCameraFar = config.dirLight.far;
	const shadowCameraFarStr = `shadow-camera-far={${shadowCameraFar}} `;
	const shadowCameraNear = config.dirLight.near;
	const shadowCameraNearStr = `shadow-camera-near={${shadowCameraNear}} `;
	const shadowCameraTop = `${shadowRange}`;
	const shadowCameraTopStr = `shadow-camera-top={${shadowCameraTop}} `;
	const shadowCameraBottom = `-${shadowRange}`;
	const shadowCameraBottomStr = `shadow-camera-bottom={${shadowCameraBottom}} `;
	const shadowCameraLeft = `-${shadowRange}`;
	const shadowCameraLeftStr = `shadow-camera-left={${shadowCameraLeft}} `;
	const shadowCameraRight = `${shadowRange}`;
	const shadowCameraRightStr = `shadow-camera-right={${shadowCameraRight}}
	`;

	instances.forEach((instance) => {
		if (!instance.includes('shadow-mapSize-width')) {
			// shadow-mapSize-width={${shadowMapSize}}
			// shadow-mapSize-height={${shadowMapSize}}
			const newStr = instance.replace(
				strEnd,
				` 
				${shadowCameraFarStr}
				${shadowCameraNearStr}
				${shadowCameraTopStr}
				${shadowCameraBottomStr}
				${shadowCameraLeftStr}
				${shadowCameraRightStr}
				${strEnd}`
			);
			newTsxFileContents = newTsxFileContents.replace(instance, newStr);
		}
	});
	return newTsxFileContents;
}
