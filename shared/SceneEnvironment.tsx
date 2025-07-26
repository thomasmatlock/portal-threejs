import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'

export function Model() {
    const { scene, gl } = useThree()
    
    useEffect(() => {
        const loader = new EXRLoader()
        loader.setDataType(THREE.HalfFloatType)
        
        loader.load('/models/environments/studio_small_05_4k.exr', 
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping
                
                const rotMat4 = new THREE.Matrix4()
                rotMat4.makeRotationFromEuler(new THREE.Euler(0, 0, 0))

                const rotMat3 = new THREE.Matrix3()
                rotMat3.setFromMatrix4(rotMat4)
                
                texture.matrix.copy(rotMat3)
                texture.matrixAutoUpdate = false
                texture.needsUpdate = true
                
                const pmremGenerator = new THREE.PMREMGenerator(gl)
                pmremGenerator.compileEquirectangularShader()
                
                const envMap = pmremGenerator.fromEquirectangular(texture).texture
                
                scene.environment = envMap
                scene.background = envMap
                
                if ('environmentIntensity' in scene) {
                    scene.environmentIntensity = 0.05000000074505806 // doesnt matter
                }
                if ('backgroundIntensity' in scene) {
                    scene.backgroundIntensity = 0.012500000186264515
                }
                
                if ('outputColorSpace' in gl) {
                    gl.outputColorSpace = THREE.SRGBColorSpace
                }
                gl.toneMapping = THREE.ACESFilmicToneMapping
                // gl.toneMappingExposure = 0.05000000074505806
                gl.toneMappingExposure = 1
                
                scene.traverse((object) => {
                    if (object instanceof THREE.Mesh && object.material) {
                        if ('envMapIntensity' in object.material) {
                            object.material.envMapIntensity = 0.05000000074505806
                        }
                    }
                })

                texture.dispose()
                pmremGenerator.dispose()
            },
            (progress) => {
                if (progress.total) {
                    console.log(`Loading hdri: ${(progress.loaded / progress.total * 100).toFixed(0)}%`)
                }
            },
            (error) => {
                console.error('Error loading HDRI:', error)
            }
        )
        
        return () => {
            if (scene.environment) {
                scene.environment.dispose()
            }
            if (scene.background && scene.background instanceof THREE.Texture) {
                scene.background.dispose()
            }
            scene.environment = null
            scene.background = null
        }
    }, [scene, gl])
    
    return null
}