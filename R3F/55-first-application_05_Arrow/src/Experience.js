
import * as THREE from 'three';
import { useMemo } from 'react';



export default function Experience() {

    const ArrowTail = useMemo(() => {
        const shape1 = new THREE.BufferGeometry();

        const tail_Vertices = new Float32Array([
            // top : 0,1,2,3  //color-red   
            1.0, 1.0, -0.75,
            -2.0, 1.0, -0.75,
            -2.0, 1.0, 0.75,
            1.0, 1.0, 0.75,

            // bottom: 4,5,6,7  //color-green 
            1.0, -1.0, -0.75,
            -2.0, -1.0, -0.75,
            -2.0, -1.0, 0.75,
            1.0, -1.0, 0.75,

            // front: 8,9,10,11  //color-blue  
            1.0, 1.0, 0.75,
            -2.0, 1.0, 0.75,
            -2.0, -1.0, 0.75,
            1.0, -1.0, 0.75,

            // back: 12,13,14,15  //color-cyan   
            1.0, 1.0, -0.75,
            -2.0, 1.0, -0.75,
            -2.0, -1.0, -0.75,
            1.0, -1.0, -0.75,

            // right: 16,17,18,19  //color-magenta  
            1.0, 1.0, -0.75,
            1.0, 1.0, 0.75,
            1.0, -1.0, 0.75,
            1.0, -1.0, -0.75,

            // left: 20,21,22,23  //color-yellow   
            -2.0, 1.0, 0.75,
            -2.0, 1.0, -0.75,
            -2.0, -1.0, -0.75,
            -2.0, -1.0, 0.75,
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

        const tail_Colors = new Float32Array([
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

        shape1.setAttribute("position", new THREE.BufferAttribute(tail_Vertices, 3));
        shape1.setAttribute("color", new THREE.BufferAttribute(tail_Colors, 3));

        // shape1.setIndex(indices);
        shape1.setIndex(Array.from(indices));

        shape1.computeVertexNormals();


        return (shape1);
    }, []);


    const ArrowHead = useMemo(() => {
        const shape2 = new THREE.BufferGeometry();

        const arrowHead_Vertices = new Float32Array([
              // front
            0.0, 1.0, 0.0,
            -1.0, -1.0, 0.75,
            1.0, -1.0, 0.75,

            // right
            0.0, 1.0, 0.0,
            1.0, -1.0, 0.75,
            1.0, -1.0, -0.75,

            // back
            0.0, 1.0, 0.0,
            1.0, -1.0, -0.75,
            -1.0, -1.0, -0.75,

            // left
            0.0, 1.0, 0.0,
            -1.0, -1.0, -0.75,
            -1.0, -1.0, 0.75,
        ]);

        const arrowHead_Colors = new Float32Array([
            // front
            1.0,0.0,0.0,
            1.0,.0,0.0,
            1.0,0.0,.0,

            // right
            0.0,1.0,0.0,
            0.0,1.0,0.0,
            0.0,1.0,0.0,
            
            // back
            0.0,0.0,1.0,
            0.0,0.0,1.0,
            0.0,0.0,1.0,

            // left
            1.0,1.0,0.0,
            1.0,1.0,0.0,
            1.0,1.0,0.0,
        ]);

        shape2.setAttribute("position", new THREE.BufferAttribute(arrowHead_Vertices, 3));
        shape2.setAttribute("color", new THREE.BufferAttribute(arrowHead_Colors, 3));

        // shape2.setIndex(indices);
        //shape2.setIndex(Array.from(indices));

        shape2.computeVertexNormals();


        return (shape2);
    }, []);


    return (
        <>
        <mesh geometry={ArrowTail} scale={[1.0, 1.0, 1]} position={[-4.0,0.0,0.0]}>
            <meshBasicMaterial
                vertexColors
                side={THREE.DoubleSide}
            />
        </mesh>
        
        <mesh geometry={ArrowHead} scale={[1.0,1, 1]} position={[-2.0, 0, 0.0]} rotation={[0, 0, -Math.PI/2]}>
            <meshBasicMaterial
                vertexColors
                side={THREE.DoubleSide}
            />
        </mesh>
        </>
    );
}
