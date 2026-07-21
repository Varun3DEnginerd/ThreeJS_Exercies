
import * as THREE from 'three';
import { useMemo } from 'react';

export default function Experience()
{

    const newGeometry = useMemo(()=>
    {
        const shape1 = new THREE.BufferGeometry();

        const vertices = new Float32Array([
            0.0,1.0,0.0,
            -1.0,-1.0,0.0,
            1.0,-1.0,0.0,
        ]);

        const colors = new Float32Array([
            1.0,0.0,0.0,
            0.0,1.0,0.0,
            0.0,0.0,1.0
        ]);

        shape1.setAttribute("position",new THREE.BufferAttribute(vertices,3));
        shape1.setAttribute("color",new THREE.BufferAttribute(colors,3));

        shape1.computeVertexNormals();


        return (shape1);
    },[]);

    
    return (
        <>
            <mesh geometry={newGeometry}>
                <meshBasicMaterial vertexColors side={THREE.DoubleSide}/>
            </mesh> 
        </>
    );
}