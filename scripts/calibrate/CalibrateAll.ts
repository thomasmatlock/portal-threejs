import CalibrateAnimations from './animations/CalibrateAnimations';
import CalibrateCamera from './camera/CalibrateCamera';
import CalibrateAllLights from './lights/CalibrateAllLights';
export default function CalibrateAll(newTsxFileContents) {
	newTsxFileContents = CalibrateAnimations(newTsxFileContents);
	newTsxFileContents = CalibrateCamera(newTsxFileContents);
	newTsxFileContents = CalibrateAllLights(newTsxFileContents);
	return newTsxFileContents;
}
