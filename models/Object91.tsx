// Placeholder model - replace with gltfjsx output
import * as THREE from 'three';
import React from 'react';
import { Text, Center } from '@react-three/drei';

export function Model(
    props: JSX.IntrinsicElements['group']
) {
    return (
        <group {...props} dispose={null}>
            {/* TODO: Run gltfjsx to generate actual Object91 model */}
            <Center>
                <Text
                    color="#ff6b6b"
                    fontSize={0.1}
                    maxWidth={2}
                    lineHeight={1}
                    letterSpacing={0.02}
                    textAlign="center"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPNyC0IT4ttDfA.woff2"
                >
                    Object91
                </Text>
            </Center>
        </group>
    );
}
