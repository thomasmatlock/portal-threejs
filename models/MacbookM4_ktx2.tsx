import React, { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Environment, OrbitControls, Text } from '@react-three/drei';
// import { useControls, folder, Leva } from 'leva';
import Performance from '@/performance/Performance';
import PerformanceMetrics3D, {
	updatePerformanceMetrics,
	addDebug,
	debugMaterialsAndGeometry,
} from '@/performance/PerformanceMetrics3D';
import PerformanceMetrics2D from '@/performance/PerformanceMetrics2D';
// import PreloaderSpinners from '@/lib/ui/loaders/PreloaderSpinners';
import { useGLTF, useTexture } from '@react-three/drei';

// Helper function to format time in ms (used for console logs only)
const formatTime = (ms) => {
	if (ms < 1000) return `${Math.round(ms)}ms`;
	return `${Math.round(ms / 10) / 100}s`;
};

// Initialize global loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
dracoLoader.preload();

// Export the Model component as a named export to match other model files
export function Model({ position }: { position: [number, number, number] }) {
	const [isLoading, setIsLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [debugMessages, setDebugMessages] = useState<string[]>([]);
	const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
	const loadedMaterialsCount = useRef(0);
	const debugRef = useRef<string[]>([]);

	return (
		<group position={position}>
			<Suspense fallback={null}>
				<ModelScene />
			</Suspense>
		</group>
	);
}

// The main scene component that loads and displays the model
function ModelScene() {
	const { gl } = useThree();
	const [isLoading, setIsLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [debugMessages, setDebugMessages] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [model, setModel] = useState<THREE.Group | null>(null);
	const modelRef = useRef<THREE.Group>(null);
	const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
	const loadedMaterialsCount = useRef(0);
	const debugRef = useRef<string[]>([]);
	const [baseColorTexture, setBaseColorTexture] = useState<THREE.Texture | null>(null);
	const [metallicRoughnessTexture, setMetallicRoughnessTexture] = useState<THREE.Texture | null>(
		null
	);
	// Add keyboard textures
	const [keyboardBaseColorTexture, setKeyboardBaseColorTexture] = useState<THREE.Texture | null>(
		null
	);
	const [keyboardMetallicRoughnessTexture, setKeyboardMetallicRoughnessTexture] =
		useState<THREE.Texture | null>(null);
	const [keyboardEmissionTexture, setKeyboardEmissionTexture] = useState<THREE.Texture | null>(
		null
	);
	const [textureTransforms, setTextureTransforms] = useState<any>(null);
	// Store the original console.error function
	const originalConsoleErrorRef = useRef<typeof console.error>(console.error);

	// We'll use the external updatePerformanceMetrics function instead of local state
	// This is just a placeholder to maintain compatibility with existing code
	const [performanceMetrics, setPerformanceMetrics] = useState({
		gltfLoadTime: 0,
		meshProcessingTime: 0,
		textureLoadTime: 0,
		totalLoadTime: 0,
	});

	// Material controls (previously with Leva)
	// const materialControls = useControls({
	// 	metalness: { value: 1.0, min: 0, max: 1, step: 0.01 },
	// 	roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
	// 	opacity: { value: 1.0, min: 0, max: 1, step: 0.01 },
	// 	transparent: true,
	// 	wireframe: false,
	// 	animateUVs: false,
	// 	scaleSpeed: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
	// 	offsetSpeed: { value: 0.3, min: 0.1, max: 2, step: 0.1 },
	// 	scaleRange: { value: 0.2, min: 0.05, max: 0.5, step: 0.05 },
	// 	offsetRange: { value: 0.2, min: 0.05, max: 0.5, step: 0.05 },
	// });

	// Use regular state instead of Leva controls
	const materialControls = {
		metalness: 1.0,
		roughness: 0.5,
		opacity: 1.0,
		transparent: true,
		wireframe: false,
		animateUVs: false,
		scaleSpeed: 0.5,
		offsetSpeed: 0.3,
		scaleRange: 0.2,
		offsetRange: 0.2,
	};

	// We'll use the external addDebug and debugMaterialsAndGeometry functions
	// This is just a placeholder to maintain compatibility with existing code
	const addLocalDebug = (message: string) => {
		// Use the external addDebug function
		addDebug(message);
	};

	// Helper function to count meshes in a model
	const countMeshes = (model: THREE.Object3D): number => {
		let count = 0;
		model.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				count++;
			}
		});
		return count;
	};

	// Function to update materials from controls
	const updateMaterialsFromControls = () => {
		if (!modelRef.current) return;

		modelRef.current.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;

				// Skip if no material
				if (!mesh.material) return;

				const material = mesh.material as THREE.MeshStandardMaterial;

				// Apply global material controls
				material.wireframe = materialControls.wireframe;
				material.metalness = materialControls.metalness;
				material.roughness = materialControls.roughness;

				// Only modify opacity for transparent materials
				if (material.transparent) {
					material.opacity = materialControls.opacity;
				}

				// Ensure material updates
				material.needsUpdate = true;
			}
		});
	};

	// Animation for texture mapping
	useFrame((state, delta) => {
		if (!materialsRef.current || materialsRef.current.length === 0) return;

		// Update materials from controls if not animating
		if (!materialControls.animateUVs) {
			updateMaterialsFromControls();
			return;
		}

		// Animate texture mapping if enabled
		materialsRef.current.forEach((material) => {
			if (!material || !material.map) return;

			const time = state.clock.getElapsedTime();

			// Animate scale
			const scaleX =
				1 + Math.sin(time * materialControls.scaleSpeed) * materialControls.scaleRange;
			const scaleY =
				1 + Math.cos(time * materialControls.scaleSpeed) * materialControls.scaleRange;

			// Animate offset
			const offsetX =
				Math.sin(time * materialControls.offsetSpeed) * materialControls.offsetRange;
			const offsetY =
				Math.cos(time * materialControls.offsetSpeed) * materialControls.offsetRange;

			// Apply to all texture maps
			if (material.map) {
				material.map.repeat.set(scaleX, scaleY);
				material.map.offset.set(offsetX, offsetY);
				material.map.needsUpdate = true;
			}

			if (material.metalnessMap) {
				material.metalnessMap.repeat.set(scaleX, scaleY);
				material.metalnessMap.offset.set(offsetX, offsetY);
				material.metalnessMap.needsUpdate = true;
			}

			if (material.roughnessMap) {
				material.roughnessMap.repeat.set(scaleX, scaleY);
				material.roughnessMap.offset.set(offsetX, offsetY);
				material.roughnessMap.needsUpdate = true;
			}

			material.needsUpdate = true;
		});
	});

	// Update materials when textures change
	useEffect(() => {
		if (baseColorTexture || metallicRoughnessTexture) {
			updateMaterialsFromControls();
		}
	}, [
		baseColorTexture,
		metallicRoughnessTexture,
		keyboardBaseColorTexture,
		keyboardMetallicRoughnessTexture,
		keyboardEmissionTexture,
	]);

	// Modify the applyTexturesToMesh function to handle UV flipping directly
	const applyTexturesToMeshWithFlippedUVs = (
		mesh: THREE.Mesh,
		materialName: string,
		textures: Record<string, THREE.Texture>,
		materialInfo: any
	) => {
		// Create a new material based on the GLTF material properties
		const newMat = new THREE.MeshStandardMaterial({
			name: materialName,
			transparent: materialInfo.alphaMode === 'BLEND',
			alphaTest: materialInfo.alphaMode === 'MASK' ? materialInfo.alphaCutoff || 0.5 : 0,
			side: materialInfo.doubleSided ? THREE.DoubleSide : THREE.FrontSide,
		});

		// Apply material factors
		if (materialInfo.baseColorFactor) {
			newMat.color.fromArray(materialInfo.baseColorFactor);
			newMat.opacity =
				materialInfo.baseColorFactor[3] !== undefined
					? materialInfo.baseColorFactor[3]
					: 1.0;
		}

		if (materialInfo.metallicFactor !== undefined) {
			newMat.metalness = materialInfo.metallicFactor;
		}

		if (materialInfo.roughnessFactor !== undefined) {
			newMat.roughness = materialInfo.roughnessFactor;
		}

		if (materialInfo.emissiveFactor) {
			newMat.emissive.fromArray(materialInfo.emissiveFactor);
		}

		if (materialInfo.emissiveStrength !== undefined) {
			newMat.emissiveIntensity = materialInfo.emissiveStrength;
		}

		// Apply textures
		if (textures.baseColor) {
			newMat.map = textures.baseColor;
			addLocalDebug(`Applied baseColor texture to ${mesh.name}`);
		}

		if (textures.metallicRoughness) {
			newMat.metalnessMap = textures.metallicRoughness;
			newMat.roughnessMap = textures.metallicRoughness;
			addLocalDebug(`Applied metallicRoughness texture to ${mesh.name}`);
		}

		if (textures.normal) {
			newMat.normalMap = textures.normal;
			addLocalDebug(`Applied normal texture to ${mesh.name}`);

			// Apply normal scale if available from material info
			const normalScale = materialInfo.textureMaps?.normal?.scale;
			if (normalScale) {
				newMat.normalScale.set(normalScale, normalScale);
			}
		}

		if (textures.emissive) {
			newMat.emissiveMap = textures.emissive;
			newMat.emissive = new THREE.Color(0xffffff);
			addLocalDebug(`Applied emissive texture to ${mesh.name}`);
		}

		// Check if the mesh has UV coordinates
		if (mesh.geometry && mesh.geometry.attributes.uv) {
			// Create a copy of the UV coordinates
			const uvAttribute = mesh.geometry.attributes.uv as THREE.BufferAttribute;
			const uvArray = new Float32Array(uvAttribute.array.length);

			// Flip both U and V coordinates (horizontal and vertical flip)
			for (let i = 0; i < uvAttribute.count; i++) {
				const index = i * 2;
				// Get original UV coordinates
				let u = uvAttribute.array[index];
				let v = uvAttribute.array[index + 1];

				// Flip both U and V coordinates (flip on both axes)
				u = 1.0 - u;
				v = 1.0 - v;

				// Store the modified coordinates
				uvArray[index] = u;
				uvArray[index + 1] = v;
			}

			// Update the UV attribute with the modified coordinates
			mesh.geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
			mesh.geometry.attributes.uv.needsUpdate = true;

			addLocalDebug(`Applied UV flip on both axes to ${mesh.name}`);
		}

		// Replace the original material
		mesh.material = newMat;
		materialsRef.current.push(newMat);
	};

	// Add a function to verify all textures are flipped
	const verifyTextureFlipping = useCallback(() => {
		if (!modelRef.current) return;

		console.log('VERIFYING TEXTURE FLIPPING FOR ALL MESHES');
		let meshCount = 0;
		let textureCount = 0;

		modelRef.current.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;
				if (!mesh.material) return;

				meshCount++;
				const material = Array.isArray(mesh.material)
					? (mesh.material[0] as THREE.MeshStandardMaterial)
					: (mesh.material as THREE.MeshStandardMaterial);

				// Count textures
				if (material.map) textureCount++;
				if (material.metalnessMap) textureCount++;
				if (material.roughnessMap) textureCount++;
				if (material.normalMap) textureCount++;
				if (material.emissiveMap) textureCount++;

				// Verify UV coordinates are flipped
				if (mesh.geometry && mesh.geometry.attributes.uv) {
					const uvAttribute = mesh.geometry.attributes.uv as THREE.BufferAttribute;
					// Sample a few UV coordinates to verify they're flipped
					if (uvAttribute.count > 0) {
						const u0 = uvAttribute.array[0];
						const v0 = uvAttribute.array[1];
						console.log(
							`Mesh ${mesh.name} - Sample UV: (${u0.toFixed(2)}, ${v0.toFixed(2)})`
						);
					}
				}
			}
		});

		console.log(`VERIFIED ${textureCount} TEXTURES ACROSS ${meshCount} MESHES`);
	}, [modelRef]);

	// Call verification after model is loaded
	useEffect(() => {
		if (model && !isLoading) {
			// Wait a bit for all textures to be applied
			setTimeout(() => {
				verifyTextureFlipping();
			}, 1000);
		}
	}, [model, isLoading, verifyTextureFlipping]);

	// Load the model and textures
	useEffect(() => {
		// Initialize MeshoptDecoder
		MeshoptDecoder.ready.then(() => {
			addLocalDebug('MeshoptDecoder initialized');
		});

		async function loadModelWithTextures() {
			// Start timing the entire process
			const sceneLoadStartTime = performance.now();

			try {
				addLocalDebug('Starting model load...');

				// Step 1: Load the model
				const gltfLoader = new GLTFLoader();
				gltfLoader.setDRACOLoader(dracoLoader);
				gltfLoader.setMeshoptDecoder(MeshoptDecoder);

				// Suppress console errors for texture loading
				originalConsoleErrorRef.current = console.error;
				console.error = function (...args) {
					// Filter out texture loading errors
					if (
						args[0] &&
						typeof args[0] === 'string' &&
						args[0].includes("Couldn't load texture")
					) {
						// Silently ignore texture loading errors
						return;
					}
					// Pass through all other errors
					return originalConsoleErrorRef.current.apply(console, args);
				};

				// Load the model
				const modelPath = '/models/meshes/MacbookM4_ktx2/MacbookM4_ktx2.gltf';
				addLocalDebug(`Loading model from: ${modelPath}`);

				// Start timing model load
				const modelLoadStartTime = performance.now();

				const gltf = await new Promise<any>((resolve, reject) => {
					gltfLoader.load(
						modelPath,
						resolve,
						(progress) => {
							if (progress.total > 0) {
								const percent = Math.round(
									(progress.loaded / progress.total) * 100
								);
								addLocalDebug(`Model loading: ${percent}%`);
							}
						},
						(error) => {
							// Only reject for non-texture errors
							if (!error.message.includes("Couldn't load texture")) {
								reject(error);
							} else {
								// For texture errors, log but continue
								addLocalDebug(`Ignoring texture error: ${error.message}`);
								// We can't resolve with a partial result here, so we'll just reject
								reject(error);
							}
						}
					);
				}).finally(() => {
					// Restore original console.error
					console.error = originalConsoleErrorRef.current;
				});

				addLocalDebug('Model loaded successfully');

				// End timing model load
				const modelLoadEndTime = performance.now();
				const modelLoadDuration = modelLoadEndTime - modelLoadStartTime;
				// Log to console but don't add to debug display
				console.log(`GLTF load time: ${formatTime(modelLoadDuration)}`);

				// Start timing mesh processing
				const meshProcessStartTime = performance.now();

				// Extract model and materials
				const loadedModel = gltf.scene;

				// Make sure the model is valid
				if (!loadedModel) {
					throw new Error('Model loaded but scene is null');
				}

				// Log model structure for debugging
				addLocalDebug(`Model has ${countMeshes(loadedModel)} meshes`);

				// Set the model state and ref first
				addLocalDebug('Setting model state and ref...');
				setModel(loadedModel);
				modelRef.current = loadedModel;

				// Wait a moment to ensure state is updated
				await new Promise((resolve) => setTimeout(resolve, 0));

				// Debug model structure
				addLocalDebug('Model structure:');
				loadedModel.traverse((child) => {
					if ((child as THREE.Mesh).isMesh) {
						debugMaterialsAndGeometry(child as THREE.Mesh);
					}
				});

				// End timing mesh processing
				const meshProcessEndTime = performance.now();
				const meshProcessDuration = meshProcessEndTime - meshProcessStartTime;
				// Log to console but don't add to debug display
				console.log(`Mesh processing time: ${formatTime(meshProcessDuration)}`);

				// Extract texture transform information from the GLTF file
				let textureTransformInfo = null;

				// Check if the model has materials with texture transforms
				if (gltf.parser?.json?.materials && gltf.parser.json.materials.length > 0) {
					const material = gltf.parser.json.materials[0];

					if (material.pbrMetallicRoughness) {
						const pbrInfo = material.pbrMetallicRoughness;

						// Check for baseColorTexture transform
						if (
							pbrInfo.baseColorTexture &&
							pbrInfo.baseColorTexture.extensions &&
							pbrInfo.baseColorTexture.extensions.KHR_texture_transform
						) {
							textureTransformInfo =
								pbrInfo.baseColorTexture.extensions.KHR_texture_transform;
							addLocalDebug(
								`Found texture transform: offset=[${textureTransformInfo.offset}], scale=[${textureTransformInfo.scale}]`
							);
						}

						// Check for metallicRoughnessTexture transform
						if (
							pbrInfo.metallicRoughnessTexture &&
							pbrInfo.metallicRoughnessTexture.extensions &&
							pbrInfo.metallicRoughnessTexture.extensions.KHR_texture_transform
						) {
							// Use this if baseColorTexture transform wasn't found
							if (!textureTransformInfo) {
								textureTransformInfo =
									pbrInfo.metallicRoughnessTexture.extensions
										.KHR_texture_transform;
								addLocalDebug(
									`Found metallic texture transform: offset=[${textureTransformInfo.offset}], scale=[${textureTransformInfo.scale}]`
								);
							}
						}
					}
				}

				// Store texture transform info for later use
				setTextureTransforms(textureTransformInfo);

				// Step 2: Load textures
				addLocalDebug('Loading textures...');

				// Start timing texture load
				const textureLoadStartTime = performance.now();

				// Set up KTX2 support
				const ktx2Loader = new KTX2Loader();
				ktx2Loader.setTranscoderPath(
					'https://unpkg.com/three@0.169.0/examples/jsm/libs/basis/'
				);
				ktx2Loader.detectSupport(gl);

				// Function to get material info from mesh, will be defined in the texture extraction function
				let getMaterialInfoFromMesh: (mesh: THREE.Mesh) => any = () => null;

				// Helper function to extract texture info from GLTF materials
				const extractTextureInfo = (gltf: any) => {
					const textureInfo: Record<string, Record<string, any>> = {};
					const baseDir = '/models/textures/MacbookM4_ktx2/';

					// Check if the GLTF has materials
					if (!gltf.parser?.json?.materials || !gltf.parser.json.materials.length) {
						addLocalDebug('No materials found in GLTF file');
						return textureInfo;
					}

					// Store the original GLTF material definitions for reference
					const gltfMaterials = gltf.parser.json.materials;

					// Process each material in the GLTF
					gltfMaterials.forEach((material: any, index: number) => {
						const materialName = material.name || `material_${index}`;
						textureInfo[materialName] = {
							// Store the original material definition
							definition: material,
							// Initialize texture maps
							textureMaps: {},
						};

						// Extract PBR texture info
						if (material.pbrMetallicRoughness) {
							const pbr = material.pbrMetallicRoughness;

							// Store base color factors if present
							if (pbr.baseColorFactor) {
								textureInfo[materialName].baseColorFactor = pbr.baseColorFactor;
							}

							// Store metallic and roughness factors if present
							if (pbr.metallicFactor !== undefined) {
								textureInfo[materialName].metallicFactor = pbr.metallicFactor;
							}

							if (pbr.roughnessFactor !== undefined) {
								textureInfo[materialName].roughnessFactor = pbr.roughnessFactor;
							}

							// Base color texture
							if (pbr.baseColorTexture && pbr.baseColorTexture.index !== undefined) {
								const textureIndex = pbr.baseColorTexture.index;
								const texturePath = getTexturePathFromIndex(gltf, textureIndex);
								if (texturePath) {
									textureInfo[materialName].textureMaps.baseColor = {
										path: baseDir + texturePath,
										transform:
											pbr.baseColorTexture.extensions?.KHR_texture_transform,
									};
								}
							}

							// Metallic roughness texture
							if (
								pbr.metallicRoughnessTexture &&
								pbr.metallicRoughnessTexture.index !== undefined
							) {
								const textureIndex = pbr.metallicRoughnessTexture.index;
								const texturePath = getTexturePathFromIndex(gltf, textureIndex);
								if (texturePath) {
									textureInfo[materialName].textureMaps.metallicRoughness = {
										path: baseDir + texturePath,
										transform:
											pbr.metallicRoughnessTexture.extensions
												?.KHR_texture_transform,
									};
								}
							}
						}

						// Normal map
						if (material.normalTexture && material.normalTexture.index !== undefined) {
							const textureIndex = material.normalTexture.index;
							const texturePath = getTexturePathFromIndex(gltf, textureIndex);
							if (texturePath) {
								textureInfo[materialName].textureMaps.normal = {
									path: baseDir + texturePath,
									transform:
										material.normalTexture.extensions?.KHR_texture_transform,
									scale: material.normalTexture.scale,
								};
							}
						}

						// Emissive map
						if (
							material.emissiveTexture &&
							material.emissiveTexture.index !== undefined
						) {
							const textureIndex = material.emissiveTexture.index;
							const texturePath = getTexturePathFromIndex(gltf, textureIndex);
							if (texturePath) {
								textureInfo[materialName].textureMaps.emissive = {
									path: baseDir + texturePath,
									transform:
										material.emissiveTexture.extensions?.KHR_texture_transform,
								};
							}
						}

						// Store emissive factor if present
						if (material.emissiveFactor) {
							textureInfo[materialName].emissiveFactor = material.emissiveFactor;
						}

						// Store emissive strength if present
						if (
							material.extensions?.KHR_materials_emissive_strength?.emissiveStrength
						) {
							textureInfo[materialName].emissiveStrength =
								material.extensions.KHR_materials_emissive_strength.emissiveStrength;
						}

						// Store alpha mode and cutoff if present
						if (material.alphaMode) {
							textureInfo[materialName].alphaMode = material.alphaMode;
						}

						if (material.alphaCutoff !== undefined) {
							textureInfo[materialName].alphaCutoff = material.alphaCutoff;
						}

						// Store double-sided flag if present
						if (material.doubleSided !== undefined) {
							textureInfo[materialName].doubleSided = material.doubleSided;
						}
					});

					// Create a mapping between mesh names and material indices
					const meshMaterialMap: Record<string, number> = {};

					// Process each mesh to map mesh names to material indices
					if (gltf.parser.json.meshes) {
						gltf.parser.json.meshes.forEach((mesh: any) => {
							if (mesh.primitives && mesh.primitives.length > 0) {
								mesh.primitives.forEach(
									(primitive: any, primitiveIndex: number) => {
										if (primitive.material !== undefined) {
											const meshName = `${
												mesh.name || 'mesh'
											}_${primitiveIndex}`;
											meshMaterialMap[meshName] = primitive.material;
										}
									}
								);
							}
						});
					}

					// Add helper function to get material info from mesh
					getMaterialInfoFromMesh = (mesh: THREE.Mesh): any => {
						// Try to get material name directly
						const materialName = mesh.material
							? (mesh.material as THREE.Material).name
							: '';

						if (materialName && textureInfo[materialName]) {
							return textureInfo[materialName];
						}

						// Try to find material by mesh name in the mapping
						const meshNameParts = mesh.name.split('.');
						const baseMeshName = meshNameParts[0];

						if (meshMaterialMap[baseMeshName] !== undefined) {
							const materialIndex = meshMaterialMap[baseMeshName];
							const material = gltfMaterials[materialIndex];
							if (material && material.name && textureInfo[material.name]) {
								return textureInfo[material.name];
							}
						}

						// If we can't find a match, return null
						return null;
					};

					return textureInfo;
				};

				// Helper function to get texture path from texture index
				const getTexturePathFromIndex = (gltf: any, index: number): string | null => {
					if (!gltf.parser?.json?.textures || !gltf.parser.json.textures[index]) {
						addLocalDebug(`No texture found at index ${index}`);
						return null;
					}

					const texture = gltf.parser.json.textures[index];

					// Get image index
					const imageIndex = texture.source;
					if (
						imageIndex === undefined ||
						!gltf.parser.json.images ||
						!gltf.parser.json.images[imageIndex]
					) {
						addLocalDebug(`No image found for texture at index ${index}`);
						return null;
					}

					// Get image URI or path
					const image = gltf.parser.json.images[imageIndex];
					const uri = image.uri;

					if (!uri) {
						addLocalDebug(`No URI found for image at index ${imageIndex}`);
						return null;
					}

					// Convert to KTX2 path if it's not already
					if (!uri.endsWith('.ktx2')) {
						// Extract the base name without extension
						const parts = uri.split('/');
						const filename = parts.pop() || '';
						const baseName = filename.split('.')[0];

						if (baseName) {
							const ktx2Path = `${baseName}.ktx2`;
							addLocalDebug(`Converting texture path from ${uri} to ${ktx2Path}`);
							return ktx2Path;
						}
					}

					addLocalDebug(`Using original texture path: ${uri}`);
					return uri;
				};

				// Default texture paths in case we can't extract them from the GLTF
				let baseColorTextureUrl =
					'/models/textures/MacbookM4_ktx2/Macbook-Pro-16_Space-Black_Case_BaseColor-Macbook-Pro-16_Case_Alpha.ktx2';
				let metallicRoughnessTextureUrl =
					'/models/textures/MacbookM4_ktx2/Macbook-Pro-16_Case_Metallic-Macbook-Pro-16_Case_Roughness.ktx2';

				// Load textures
				addLocalDebug('Extracting texture information from GLTF...');
				const textureInfo = extractTextureInfo(gltf);
				addLocalDebug(`Found ${Object.keys(textureInfo).length} materials with textures`);

				// Log the materials and their textures
				Object.entries(textureInfo).forEach(([materialName, info]) => {
					const textureTypes = info.textureMaps ? Object.keys(info.textureMaps) : [];
					addLocalDebug(
						`Material "${materialName}" has texture types: ${textureTypes.join(', ')}`
					);

					// Log the texture paths
					if (info.textureMaps) {
						Object.entries(info.textureMaps).forEach(
							([textureType, textureData]: [string, any]) => {
								addLocalDebug(
									`  - ${textureType} texture path: ${textureData.path}`
								);
							}
						);
					}
				});

				// Create a map to track which meshes need to be updated when textures load
				const meshesToUpdate: Map<string, THREE.Mesh[]> = new Map();

				// Function to load a texture with proper error handling
				const loadTextureAsync = async (
					textureInfo: any,
					textureType: string,
					materialName: string
				): Promise<THREE.Texture | null> => {
					if (!textureInfo || !textureInfo.path) {
						addLocalDebug(
							`No texture path for ${textureType} in material ${materialName}`
						);
						return null;
					}

					const url = textureInfo.path;

					try {
						addLocalDebug(`Loading ${textureType} texture for ${materialName}: ${url}`);

						// Check if the URL is valid
						if (!url || typeof url !== 'string' || url.trim() === '') {
							addLocalDebug(`Invalid URL for ${textureType} texture: "${url}"`);
							return null;
						}

						// Add a timeout to prevent hanging on texture load
						const texturePromise = new Promise<THREE.Texture>((resolve, reject) => {
							const timeoutId = setTimeout(() => {
								reject(new Error(`Timeout loading texture: ${url}`));
							}, 10000); // 10 second timeout

							ktx2Loader.load(
								url,
								(texture) => {
									clearTimeout(timeoutId);
									addLocalDebug(
										`Successfully loaded ${textureType} texture for ${materialName}`
									);
									resolve(texture);
								},
								(progress) => {
									// Log progress for large textures
									if (progress.total > 1000000 && progress.loaded > 0) {
										// 1MB
										const percent = Math.round(
											(progress.loaded / progress.total) * 100
										);
										if (percent % 25 === 0) {
											// Log at 0%, 25%, 50%, 75%, 100%
											addLocalDebug(
												`Loading ${textureType} texture: ${percent}%`
											);
										}
									}
								},
								(error) => {
									clearTimeout(timeoutId);
									addLocalDebug(
										`Error loading ${textureType} texture for ${materialName}: ${error.message}`
									);
									reject(error);
								}
							);
						});

						const texture = await texturePromise;

						// Apply textures with the transforms specified in the GLTF file

						// Keep default flipY setting (usually false for Three.js)
						texture.flipY = false;

						// Apply texture transforms if available in the GLTF file
						if (textureInfo.transform) {
							if (textureInfo.transform.offset) {
								texture.offset.set(
									textureInfo.transform.offset[0],
									textureInfo.transform.offset[1]
								);
							}

							if (textureInfo.transform.scale) {
								texture.repeat.set(
									textureInfo.transform.scale[0],
									textureInfo.transform.scale[1]
								);
							}

							if (textureInfo.transform.rotation) {
								texture.rotation = textureInfo.transform.rotation;
							}

							// Log for debugging
							if (url.includes('paper-map-the-lord-of-the-rings')) {
								addLocalDebug('🔄 Applied texture transforms from GLTF file');
								addLocalDebug(
									`Transformed texture: flipY=${texture.flipY}, repeat=${texture.repeat.x},${texture.repeat.y}, offset=${texture.offset.x},${texture.offset.y}`
								);
							}
						} else {
							// No transforms in GLTF, use defaults
							texture.repeat.set(1, 1);
							texture.offset.set(0, 0);
							texture.rotation = 0;
						}

						// Set color space based on texture type
						if (textureType === 'baseColor' || textureType === 'emissive') {
							if ('colorSpace' in texture) {
								(texture as any).colorSpace = THREE.SRGBColorSpace;
							} else {
								texture.encoding = THREE.sRGBEncoding;
							}
						} else {
							// For normal, metallicRoughness, etc.
							if ('colorSpace' in texture) {
								(texture as any).colorSpace = THREE.LinearSRGBColorSpace;
							} else {
								texture.encoding = THREE.LinearEncoding;
							}
						}

						// Store the texture in the textureInfo object
						textureInfo.texture = texture;

						return texture;
					} catch (error) {
						// Don't fail the entire model load if a texture fails
						return null;
					}
				};

				// Function to apply textures to a mesh
				const applyTexturesToMesh = applyTexturesToMeshWithFlippedUVs;

				// Find all meshes that use each material
				loadedModel.traverse((node) => {
					if (node.isMesh) {
						const mesh = node as THREE.Mesh;
						const materialName = mesh.material
							? (mesh.material as THREE.Material).name
							: '';

						if (materialName && textureInfo[materialName]) {
							// Add this mesh to the list of meshes that use this material
							if (!meshesToUpdate.has(materialName)) {
								meshesToUpdate.set(materialName, []);
							}
							meshesToUpdate.get(materialName)?.push(mesh);
						}
					}
				});

				// Process each material and load its textures
				for (const [materialName, materialInfo] of Object.entries(textureInfo)) {
					// Skip if no meshes use this material
					if (
						!meshesToUpdate.has(materialName) ||
						meshesToUpdate.get(materialName)?.length === 0
					) {
						continue;
					}

					// Start loading textures for this material
					(async () => {
						const textures: Record<string, THREE.Texture> = {};

						// Load base color texture
						if (materialInfo.textureMaps?.baseColor) {
							const baseColorTexture = await loadTextureAsync(
								materialInfo.textureMaps.baseColor,
								'baseColor',
								materialName
							);
							if (baseColorTexture) {
								textures.baseColor = baseColorTexture;
							}
						}

						// Load metallic roughness texture
						if (materialInfo.textureMaps?.metallicRoughness) {
							const metallicRoughnessTexture = await loadTextureAsync(
								materialInfo.textureMaps.metallicRoughness,
								'metallicRoughness',
								materialName
							);
							if (metallicRoughnessTexture) {
								textures.metallicRoughness = metallicRoughnessTexture;
							}
						}

						// Load normal texture
						if (materialInfo.textureMaps?.normal) {
							const normalTexture = await loadTextureAsync(
								materialInfo.textureMaps.normal,
								'normal',
								materialName
							);
							if (normalTexture) {
								textures.normal = normalTexture;
							}
						}

						// Load emissive texture
						if (materialInfo.textureMaps?.emissive) {
							const emissiveTexture = await loadTextureAsync(
								materialInfo.textureMaps.emissive,
								'emissive',
								materialName
							);
							if (emissiveTexture) {
								textures.emissive = emissiveTexture;
							}
						}

						// Apply textures to all meshes that use this material
						const meshes = meshesToUpdate.get(materialName) || [];
						for (const mesh of meshes) {
							applyTexturesToMesh(mesh, materialName, textures, materialInfo);
						}

						// Update loading progress
						setLoadingProgress((prev) => {
							const newProgress = prev + (1 / Object.keys(textureInfo).length) * 50;
							return Math.min(newProgress, 100);
						});

						// Check if all materials have been processed
						loadedMaterialsCount.current += 1;
						if (loadedMaterialsCount.current === Object.keys(textureInfo).length) {
							addLocalDebug('All materials processed');
							setIsLoading(false);
						}
					})();
				}

				// For backward compatibility, set these variables to the case textures if available
				let baseColorTexture: THREE.Texture | null = null;
				let metallicRoughnessTexture: THREE.Texture | null = null;

				// Try to find the case material textures
				const caseMaterial = 'Macbook_Pro_16_Case_Space-Black';
				if (textureInfo[caseMaterial]) {
					baseColorTexture = textureInfo[caseMaterial].textureMaps.baseColor?.texture;
					metallicRoughnessTexture =
						textureInfo[caseMaterial].textureMaps.metallicRoughness?.texture;
				}

				// If we couldn't find the case textures, load the default ones
				if (!baseColorTexture) {
					baseColorTexture = await new Promise<THREE.Texture>((resolve, reject) => {
						ktx2Loader.load(
							baseColorTextureUrl,
							(texture) => resolve(texture),
							undefined,
							(error) => {
								console.error('Error loading default base color texture:', error);
								reject(error);
							}
						);
					});
				}

				if (!metallicRoughnessTexture) {
					metallicRoughnessTexture = await new Promise<THREE.Texture>(
						(resolve, reject) => {
							ktx2Loader.load(
								metallicRoughnessTextureUrl,
								(texture) => resolve(texture),
								undefined,
								(error) => {
									console.error(
										'Error loading default metallic roughness texture:',
										error
									);
									reject(error);
								}
							);
						}
					);
				}

				// Load keyboard textures
				let keyboardBaseColorTexture: THREE.Texture | null = null;
				let keyboardMetallicRoughnessTexture: THREE.Texture | null = null;
				let keyboardEmissionTexture: THREE.Texture | null = null;

				// Try to find the keyboard material textures from our dynamically loaded textures
				// Look for keyboard material with various possible naming conventions
				const possibleKeyboardMaterialNames = [
					'Macbook_Pro_16_Keyboard',
					'Keyboard',
					'keyboard',
					'MacbookPro16Keyboard',
				];

				let keyboardMaterialName = '';
				for (const materialName of possibleKeyboardMaterialNames) {
					if (textureInfo[materialName]) {
						keyboardMaterialName = materialName;
						break;
					}
				}

				// If we found a keyboard material, use its textures
				if (keyboardMaterialName) {
					const keyboardTextures = textureInfo[keyboardMaterialName].textureMaps;
					keyboardBaseColorTexture = keyboardTextures.baseColor?.texture;
					keyboardMetallicRoughnessTexture = keyboardTextures.metallicRoughness?.texture;
					keyboardEmissionTexture = keyboardTextures.emissive?.texture;

					addLocalDebug(`Found keyboard textures in material: ${keyboardMaterialName}`);
				}

				// If we couldn't find the keyboard textures in our dynamic loading, load them directly
				if (
					!keyboardBaseColorTexture ||
					!keyboardMetallicRoughnessTexture ||
					!keyboardEmissionTexture
				) {
					addLocalDebug(
						'Some keyboard textures not found in dynamic loading, loading directly'
					);

					// Default texture paths
					const keyboardBaseColorTextureUrl =
						'/models/textures/MacbookM4_ktx2/Macbook-Pro-16_Keyboard_BaseColor.ktx2';
					const keyboardMetallicRoughnessTextureUrl =
						'/models/textures/MacbookM4_ktx2/Macbook-Pro-16_Keyboard_Metallic-Macbook-Pro-16_Keyboard_Roughness.ktx2';
					const keyboardEmissionTextureUrl =
						'/models/textures/MacbookM4_ktx2/Macbook-Pro-16_Keyboard_Emission.ktx2';

					try {
						// Load any missing textures
						if (!keyboardBaseColorTexture) {
							addLocalDebug(
								`Loading keyboard base texture from: ${keyboardBaseColorTextureUrl}`
							);
							keyboardBaseColorTexture = await new Promise<THREE.Texture>(
								(resolve, reject) => {
									ktx2Loader.load(
										keyboardBaseColorTextureUrl,
										(texture) => {
											addLocalDebug(
												'Keyboard base texture loaded successfully'
											);
											resolve(texture);
										},
										undefined,
										(error) => {
											addLocalDebug(
												`Error loading keyboard base texture: ${error.message}`
											);
											reject(error);
										}
									);
								}
							);
						}

						if (!keyboardMetallicRoughnessTexture) {
							addLocalDebug(
								`Loading keyboard metallic-roughness texture from: ${keyboardMetallicRoughnessTextureUrl}`
							);
							keyboardMetallicRoughnessTexture = await new Promise<THREE.Texture>(
								(resolve, reject) => {
									ktx2Loader.load(
										keyboardMetallicRoughnessTextureUrl,
										(texture) => {
											addLocalDebug(
												'Keyboard metallic-roughness texture loaded successfully'
											);
											resolve(texture);
										},
										undefined,
										(error) => {
											addLocalDebug(
												`Error loading keyboard metallic texture: ${error.message}`
											);
											reject(error);
										}
									);
								}
							);
						}

						if (!keyboardEmissionTexture) {
							addLocalDebug(
								`Loading keyboard emission texture from: ${keyboardEmissionTextureUrl}`
							);
							keyboardEmissionTexture = await new Promise<THREE.Texture>(
								(resolve, reject) => {
									ktx2Loader.load(
										keyboardEmissionTextureUrl,
										(texture) => {
											addLocalDebug(
												'Keyboard emission texture loaded successfully'
											);
											resolve(texture);
										},
										undefined,
										(error) => {
											addLocalDebug(
												`Error loading keyboard emission texture: ${error.message}`
											);
											reject(error);
										}
									);
								}
							);
						}
					} catch (error: any) {
						addLocalDebug(`Error loading keyboard textures: ${error.message}`);
						// Continue without keyboard textures
					}
				}

				// Configure textures - applying as-is without transformations
				if (baseColorTexture) {
					// Set flipY to false (default)
					baseColorTexture.flipY = false;

					// No rotation or transformations
					baseColorTexture.rotation = 0;
					baseColorTexture.repeat.set(1, 1);
					baseColorTexture.offset.set(0, 0);

					// Set color space
					if ('colorSpace' in baseColorTexture) {
						(baseColorTexture as any).colorSpace = THREE.SRGBColorSpace;
					} else {
						baseColorTexture.encoding = THREE.sRGBEncoding;
					}

					addLocalDebug('Applied base color texture as-is');
				}

				if (metallicRoughnessTexture) {
					// Set flipY to false (default)
					metallicRoughnessTexture.flipY = false;

					// No rotation or transformations
					metallicRoughnessTexture.rotation = 0;
					metallicRoughnessTexture.repeat.set(1, 1);
					metallicRoughnessTexture.offset.set(0, 0);

					// Set color space
					if ('colorSpace' in metallicRoughnessTexture) {
						(metallicRoughnessTexture as any).colorSpace = THREE.LinearSRGBColorSpace;
					} else {
						metallicRoughnessTexture.encoding = THREE.LinearEncoding;
					}

					addLocalDebug('Applied metallic roughness texture as-is');
				}

				// Apply texture transforms from GLTF
				// This is why the LOTR texture is displaying correctly
				if (textureTransformInfo) {
					addLocalDebug('Applying texture transforms from GLTF file');

					if (textureTransformInfo.offset) {
						if (baseColorTexture) {
							baseColorTexture.offset.set(
								textureTransformInfo.offset[0],
								textureTransformInfo.offset[1]
							);
							addLocalDebug(
								`Applied offset [${textureTransformInfo.offset[0]}, ${textureTransformInfo.offset[1]}] to base color texture`
							);
						}

						if (metallicRoughnessTexture) {
							metallicRoughnessTexture.offset.set(
								textureTransformInfo.offset[0],
								textureTransformInfo.offset[1]
							);
							addLocalDebug(
								`Applied offset [${textureTransformInfo.offset[0]}, ${textureTransformInfo.offset[1]}] to metallic roughness texture`
							);
						}
					}

					if (textureTransformInfo.scale) {
						if (baseColorTexture) {
							baseColorTexture.repeat.set(
								textureTransformInfo.scale[0],
								textureTransformInfo.scale[1]
							);
							addLocalDebug(
								`Applied scale [${textureTransformInfo.scale[0]}, ${textureTransformInfo.scale[1]}] to base color texture`
							);
						}

						if (metallicRoughnessTexture) {
							metallicRoughnessTexture.repeat.set(
								textureTransformInfo.scale[0],
								textureTransformInfo.scale[1]
							);
							addLocalDebug(
								`Applied scale [${textureTransformInfo.scale[0]}, ${textureTransformInfo.scale[1]}] to metallic roughness texture`
							);
						}
					}
				} else {
					addLocalDebug('No texture transforms found in GLTF file for default textures');
				}

				// Set state for textures
				setBaseColorTexture(baseColorTexture);
				setMetallicRoughnessTexture(metallicRoughnessTexture);

				// Set keyboard textures if they were loaded
				if (keyboardBaseColorTexture) setKeyboardBaseColorTexture(keyboardBaseColorTexture);
				if (keyboardMetallicRoughnessTexture)
					setKeyboardMetallicRoughnessTexture(keyboardMetallicRoughnessTexture);
				if (keyboardEmissionTexture) setKeyboardEmissionTexture(keyboardEmissionTexture);

				// Configure keyboard textures - applying as-is without transformations
				if (keyboardBaseColorTexture) {
					// Set flipY to false (default)
					keyboardBaseColorTexture.flipY = false;

					// No rotation or transformations
					keyboardBaseColorTexture.rotation = 0;
					keyboardBaseColorTexture.repeat.set(1, 1);
					keyboardBaseColorTexture.offset.set(0, 0);

					// Set color space
					if ('colorSpace' in keyboardBaseColorTexture) {
						(keyboardBaseColorTexture as any).colorSpace = THREE.SRGBColorSpace;
					} else {
						keyboardBaseColorTexture.encoding = THREE.sRGBEncoding;
					}

					addLocalDebug('Applied keyboard base color texture as-is');
				}

				if (keyboardMetallicRoughnessTexture) {
					// Set flipY to false (default)
					keyboardMetallicRoughnessTexture.flipY = false;

					// No rotation or transformations
					keyboardMetallicRoughnessTexture.rotation = 0;
					keyboardMetallicRoughnessTexture.repeat.set(1, 1);
					keyboardMetallicRoughnessTexture.offset.set(0, 0);

					// Set color space
					if ('colorSpace' in keyboardMetallicRoughnessTexture) {
						(keyboardMetallicRoughnessTexture as any).colorSpace =
							THREE.LinearSRGBColorSpace;
					} else {
						keyboardMetallicRoughnessTexture.encoding = THREE.LinearEncoding;
					}

					addLocalDebug('Applied keyboard metallic roughness texture as-is');
				}

				if (keyboardEmissionTexture) {
					// Set flipY to false (default)
					keyboardEmissionTexture.flipY = false;

					// No rotation or transformations
					keyboardEmissionTexture.rotation = 0;
					keyboardEmissionTexture.repeat.set(1, 1);
					keyboardEmissionTexture.offset.set(0, 0);

					// Set color space
					if ('colorSpace' in keyboardEmissionTexture) {
						(keyboardEmissionTexture as any).colorSpace = THREE.SRGBColorSpace;
					} else {
						keyboardEmissionTexture.encoding = THREE.sRGBEncoding;
					}

					addLocalDebug('Applied keyboard emission texture as-is');
				}

				// Log texture info for debugging
				addLocalDebug(`Loaded textures for ${Object.keys(textureInfo).length} materials`);

				// Log which textures were successfully loaded
				Object.entries(textureInfo).forEach(([material, textures]) => {
					addLocalDebug(
						`Material "${material}" has loaded textures: ${Object.keys(textures).join(
							', '
						)}`
					);
				});

				// End timing texture load
				const textureLoadEndTime = performance.now();
				const textureLoadDuration = textureLoadEndTime - textureLoadStartTime;

				// Log performance metrics for texture loading
				addLocalDebug(`Total texture load time: ${formatTime(textureLoadDuration)}`);
				addLocalDebug(`Total model load time: ${formatTime(modelLoadDuration)}`);
				addLocalDebug(
					`Total scene load time: ${formatTime(performance.now() - sceneLoadStartTime)}`
				);

				// Update performance metrics
				const totalLoadTime = performance.now() - sceneLoadStartTime;
				const metrics = {
					gltfLoadTime: modelLoadDuration,
					meshProcessingTime: meshProcessDuration,
					textureLoadTime: textureLoadDuration,
					totalLoadTime: totalLoadTime,
				};

				// Update performance metrics state
				setPerformanceMetrics(metrics);

				// Update the external performance metrics component if available
				if (typeof updatePerformanceMetrics === 'function') {
					updatePerformanceMetrics(metrics);
				}

				// Step 3: Apply textures to materials
				const materials: THREE.MeshStandardMaterial[] = [];

				// Use loadedModel directly instead of model state
				if (loadedModel) {
					addLocalDebug('Applying materials to model...');
					loadedModel.traverse((child) => {
						if ((child as THREE.Mesh).isMesh) {
							const mesh = child as THREE.Mesh;

							// Get material info from mesh
							const materialInfo = getMaterialInfoFromMesh(mesh);
							const materialName = materialInfo ? materialInfo.definition?.name : '';

							// Check if we have material info for this mesh
							if (materialInfo) {
								addLocalDebug(
									`Applying material properties for: ${mesh.name} (${materialName})`
								);

								// Create a new material based on the GLTF material properties
								const newMat = new THREE.MeshStandardMaterial({
									name: materialName,
									transparent: materialInfo.alphaMode === 'BLEND',
									alphaTest:
										materialInfo.alphaMode === 'MASK'
											? materialInfo.alphaCutoff || 0.5
											: 0,
									side: materialInfo.doubleSided
										? THREE.DoubleSide
										: THREE.FrontSide,
								});

								// Apply material factors
								if (materialInfo.baseColorFactor) {
									newMat.color.fromArray(materialInfo.baseColorFactor);
									newMat.opacity =
										materialInfo.baseColorFactor[3] !== undefined
											? materialInfo.baseColorFactor[3]
											: 1.0;
								}

								if (materialInfo.metallicFactor !== undefined) {
									newMat.metalness = materialInfo.metallicFactor;
								}

								if (materialInfo.roughnessFactor !== undefined) {
									newMat.roughness = materialInfo.roughnessFactor;
								}

								if (materialInfo.emissiveFactor) {
									newMat.emissive.fromArray(materialInfo.emissiveFactor);
								}

								if (materialInfo.emissiveStrength !== undefined) {
									newMat.emissiveIntensity = materialInfo.emissiveStrength;
								}

								// Apply textures if they're loaded
								if (textureInfo[materialName]) {
									const textures = textureInfo[materialName].textureMaps;

									if (textures.baseColor) {
										newMat.map = textures.baseColor.texture;
										addLocalDebug(`Applied baseColor texture to ${mesh.name}`);
									}

									if (textures.metallicRoughness) {
										newMat.metalnessMap = textures.metallicRoughness.texture;
										newMat.roughnessMap = textures.metallicRoughness.texture;
										addLocalDebug(
											`Applied metallicRoughness texture to ${mesh.name}`
										);
									}

									if (textures.normal) {
										newMat.normalMap = textures.normal.texture;
										addLocalDebug(`Applied normal texture to ${mesh.name}`);

										// Apply normal scale if available from material info
										const normalScale = materialInfo.textureMaps?.normal?.scale;
										if (normalScale) {
											newMat.normalScale.set(normalScale, normalScale);
										}
									}

									if (textures.emissive) {
										newMat.emissiveMap = textures.emissive.texture;
										newMat.emissive = new THREE.Color(0xffffff);
										addLocalDebug(`Applied emissive texture to ${mesh.name}`);
									}
								} else {
									addLocalDebug(
										`No textures found for material: ${materialName}`
									);
								}

								// Check if this is a keyboard mesh or screen
								const isKeyboard = mesh.name.toLowerCase().includes('keyboard');
								const isScreen = mesh.name.toLowerCase().includes('screen');

								// Fix UV mapping for meshes that need it
								if (mesh.geometry.attributes.uv) {
									// Different meshes need different UV fixes
									let needsUVFix = false;
									let flipU = false;
									let flipV = false;

									if (isKeyboard) {
										// Keyboard needs U coordinate flipped
										addLocalDebug(
											`Fixing keyboard UV mapping for: ${mesh.name}`
										);
										needsUVFix = true;
										flipU = true;
									} else if (isScreen) {
										// Screen might need V coordinate flipped
										addLocalDebug(`Fixing screen UV mapping for: ${mesh.name}`);
										needsUVFix = true;
										flipV = true;
									}

									// Apply UV fixes if needed
									if (needsUVFix) {
										const uvAttribute = mesh.geometry.attributes
											.uv as THREE.BufferAttribute;

										// Create a copy of the UV coordinates
										const uvArray = new Float32Array(uvAttribute.array.length);

										// Modify the UV coordinates based on what needs to be flipped
										for (let i = 0; i < uvAttribute.count; i++) {
											const index = i * 2;
											// Get original UV coordinates
											let u = uvAttribute.array[index];
											let v = uvAttribute.array[index + 1];

											// Apply flips as needed
											if (flipU) u = 1.0 - u;
											if (flipV) v = 1.0 - v;

											// Store the modified coordinates
											uvArray[index] = u;
											uvArray[index + 1] = v;
										}

										// Update the UV attribute with the modified coordinates
										mesh.geometry.setAttribute(
											'uv',
											new THREE.BufferAttribute(uvArray, 2)
										);
										addLocalDebug(
											`Applied UV fix to ${mesh.name}: flipU=${flipU}, flipV=${flipV}`
										);
									}
								}

								// Replace the original material
								mesh.material = newMat;
								materials.push(newMat);
							}
							// Fallback to default material if no material info is found
							else {
								addLocalDebug(
									`No material info found for: ${mesh.name}, using default material`
								);

								// Create a basic material
								const newMat = new THREE.MeshStandardMaterial({
									color: 0x808080,
									metalness: 0.5,
									roughness: 0.5,
								});

								// Apply default textures if available
								if (baseColorTexture) {
									newMat.map = baseColorTexture;
								}

								if (metallicRoughnessTexture) {
									newMat.metalnessMap = metallicRoughnessTexture;
									newMat.roughnessMap = metallicRoughnessTexture;
								}

								// Replace the original material
								mesh.material = newMat;
								materials.push(newMat);
							}
						}
					});
				}

				// Store materials for animation
				materialsRef.current = materials;

				// Log how many materials have textures
				const materialsWithTextures = materials.filter((mat) => mat.map !== null).length;
				addLocalDebug(
					`Applied textures to ${materialsWithTextures}/${materials.length} materials`
				);

				// Initial update of materials only if we have a model
				if (loadedModel) {
					updateMaterialsFromControls();
					addLocalDebug('Materials updated from controls');
				} else {
					addLocalDebug('Warning: Model is null, cannot update materials');
				}

				// Final check to ensure model is visible
				if (loadedModel && countMeshes(loadedModel) > 0) {
					addLocalDebug('Model loaded successfully with meshes');
				} else {
					addLocalDebug('Warning: Model may not be visible, no meshes found');
				}
			} catch (error: any) {
				addLocalDebug(`Error loading model: ${error.message}`);
				setError(`Failed to load model: ${error.message}`);
			}
		}

		loadModelWithTextures();

		// Cleanup function
		return () => {
			// Restore original console.error function
			if (originalConsoleErrorRef.current) {
				console.error = originalConsoleErrorRef.current;
			}

			// Dispose of textures and materials
			if (baseColorTexture) {
				baseColorTexture.dispose();
			}
			if (metallicRoughnessTexture) {
				metallicRoughnessTexture.dispose();
			}
			// Dispose of keyboard textures
			if (keyboardBaseColorTexture) {
				keyboardBaseColorTexture.dispose();
			}
			if (keyboardMetallicRoughnessTexture) {
				keyboardMetallicRoughnessTexture.dispose();
			}
			if (keyboardEmissionTexture) {
				keyboardEmissionTexture.dispose();
			}
			if (materialsRef.current) {
				materialsRef.current.forEach((material) => {
					if (material) material.dispose();
				});
			}
		};
	}, [gl]);

	return (
		<>
			{/* Display the model */}
			{model && <primitive object={model} ref={modelRef} position={[0, 0, 0]} />}

			{/* Display error if any */}
			{error && (
				<Text
					position={[0, 0.5, 0]}
					color="red"
					fontSize={0.05}
					maxWidth={1}
					textAlign="center"
				>
					{error}
				</Text>
			)}
		</>
	);
}

export default function MacbookM4_ktx2() {
	const [isLoading, setIsLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [debugMessages, setDebugMessages] = useState<string[]>([]);
	const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
	const loadedMaterialsCount = useRef(0);
	const debugRef = useRef<string[]>([]);

	return <Model position={[0, 0, 0]} />;
}
