import config from '../../config';
import CalibratePointLights from './CalibratePointLights';
import CalibrateDirLights from './CalibrateDirLights';
import CalibrateSpotLights from './CalibrateSpotLights';

export default function calibrateLights(newTsxFileContents) {
	newTsxFileContents = CalibrateDirLights(newTsxFileContents);
	newTsxFileContents = CalibratePointLights(newTsxFileContents);
	newTsxFileContents = CalibrateSpotLights(newTsxFileContents);
	return newTsxFileContents;
}
//
