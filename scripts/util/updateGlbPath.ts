import fs from 'fs';
export function updateGlbPath(glbFileName: string, newModelPath: string, newTsxOriginPath: string) {
	const transformedModelStr = `${glbFileName}-transformed.glb`; // new glb file path
	const tsxFileContents = fs.readFileSync(newTsxOriginPath, 'utf8'); // read contents of new tsx file
	const modelPathRegex = new RegExp(transformedModelStr, 'g'); // find
	return tsxFileContents.replace(modelPathRegex, newModelPath); // replace old model path with new model path
}
export default updateGlbPath;
