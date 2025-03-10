import fs from 'fs';
import path from 'path';

/**
 * Transforms a GLTFJSX component file to be instance-ready
 * @param inputPath Path to the input .tsx component
 * @param outputPath Optional path for transformed file. If not provided, will modify original
 */
function transformToInstanceable(inputPath: string, outputPath?: string) {
	// Read the input file
	let content = fs.readFileSync(inputPath, 'utf-8');

	// Extract the mesh name and material name from the content
	const meshMatch = content.match(/nodes\.(\w+)\.geometry/);
	const materialMatch = content.match(/materials\.(\w+)/);

	if (!meshMatch || !materialMatch) {
		console.error('Could not find mesh or material in component');
		return;
	}

	const meshName = meshMatch[1];
	const materialName = materialMatch[1];

	// Create the provider component
	const providerComponent = `
// Provider component for instancing
export function ${capitalizeFirst(meshName)}Provider({ children }: { 
  children: (geometry: THREE.BufferGeometry, material: THREE.Material) => React.ReactNode 
}) {
  const { nodes, materials } = useGLTF(/* your gltf path */) as GLTFResult;
  return <>{children(nodes.${meshName}.geometry, materials.${materialName})}</>;
}`;

	// Insert the provider before the main Model component
	const modelMatch = content.match(/export function Model/);
	if (!modelMatch) {
		console.error('Could not find Model export');
		return;
	}

	const insertIndex = modelMatch.index;
	content =
		content.slice(0, insertIndex) + providerComponent + '\n\n' + content.slice(insertIndex);

	// Add THREE.BufferGeometry and THREE.Material to imports if needed
	if (!content.includes('THREE.BufferGeometry')) {
		content = content.replace(
			"import * as THREE from 'three'",
			"import * as THREE from 'three'\nimport { BufferGeometry, Material } from 'three'"
		);
	}

	// Write the transformed content
	const finalPath = outputPath || inputPath;
	fs.writeFileSync(finalPath, content);

	console.log(`✅ Component transformed and saved to ${finalPath}`);
	console.log(`\nTo use with instances:
  <${capitalizeFirst(meshName)}Provider>
    {(geometry, material) => (
      <Instances limit={count} geometry={geometry} material={material}>
        <Instance position={[x, y, z]} scale={scale} />
      </Instances>
    )}
  </${capitalizeFirst(meshName)}Provider>
  `);
}

function capitalizeFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Example usage
// transformToInstanceable('./models/MyComponent.tsx');
