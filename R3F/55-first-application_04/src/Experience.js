
import * as THREE from 'three';
import { useMemo } from 'react';



export default function Experience() {

    const newGeometry = useMemo(() => {
        const shape1 = new THREE.BufferGeometry();

        const vertices = new Float32Array([
            // top : 0,1,2,3
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,

            // bottom: 4,5,6,7
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,

            // front: 8,9,10,11
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,

            // back: 12,13,14,15
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,

            // right: 16,17,18,19
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,

            // left: 20,21,22,23
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0
        ]);

        const indices = new Uint16Array([
            // Top
            0, 1, 2,
            0, 2, 3,

            // Bottom
            4, 6, 5,
            4, 7, 6,

            // Front
            8, 9, 10,
            8, 10, 11,

            // Back
            12, 14, 13,
            12, 15, 14,

            // Right
            16, 17, 18,
            16, 18, 19,

            // Left
            20, 22, 21,
            20, 23, 22

        ]);

        const colors = new Float32Array([
            //color-red      
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            //color-green    
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            //color-blue     
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            //color-cyan     
            0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,

            //color-magenta  
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,

            //color-yellow   
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
        ]);

        shape1.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        shape1.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        // shape1.setIndex(indices);
        shape1.setIndex(Array.from(indices));

        shape1.computeVertexNormals();


        return (shape1);
    }, []);


    return (
        <mesh geometry={newGeometry} scale={[1.25, 0.5, 1]}>
            <meshBasicMaterial
                vertexColors
                side={THREE.DoubleSide}
            //wireframe
            />
        </mesh>
    );
}