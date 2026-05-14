import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log(' JavaScript is Walking. and will Run fast')


import testVertexShader from './shaders/test/test_vertex.glsl'
//!console.log(testVertexShader)

import testFragmentShader from './shaders/test/test_fragment.glsl'
//!console.log(testFragmentShader)



/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.threeJS')

// Scene
const scene = new THREE.Scene()

//! Texutres:
const textureLoader = new THREE.TextureLoader()

const textureFlag = textureLoader.load('./textures/flag-IND.png');

/**
 * Shape
 */

const shape_1 = new THREE.PlaneGeometry(1,1,32, 32)

const verticesCount = shape_1.attributes.position.count;
console.log('vertices count ',verticesCount);

const randoms = new Float32Array(verticesCount);
for(let i=0;i<verticesCount;i++)
{
    randoms[i] = Math.random();
}

console.log('--------- Printing randoms ------------');
//console.log(randoms);

shape_1.setAttribute('a_Random',new THREE.BufferAttribute(randoms,1))

console.log(shape_1)

//! Material with Shader:

const material_1 = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms:
    {
        uFreqeuncy: { value: new THREE.Vector2(10,5) },
        uTime :{value:0},
        uTexture:{value:textureFlag},
    },
    //!wireframe: true,
    side: THREE.DoubleSide,
    transparent: true
})


//! MESH:
const mesh_1 = new THREE.Mesh(shape_1,material_1)

mesh_1.scale.y = 2/3;

scene.add(mesh_1)


//* Sizes:
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//* Camera 
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, -0.25, 1)
scene.add(camera)

//* Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//* Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

//! ********* GAME LOOP ************
let time = Date.now();

const tick = () =>
{
    //* update();
    const currentTime = Date.now();
    const deltaTime = currentTime - time
    time = currentTime

    // Update controls
    controls.update()
    material_1.uniforms.uTime.value += deltaTime*0.005;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()