import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log(' JavaScript is Walking. and will Run fast')



/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.threeJS')
//const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//! Texutres:
const textureLoader = new THREE.TextureLoader()

/**
 * Shape
 */

const shape_1 = new THREE.PlaneGeometry(1,1,32, 32)

//! Material with Shader:

const material_1 = new THREE.RawShaderMaterial({
    vertexShader: `
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;

        attribute vec3 position;

        void main()
        {
            gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.0);
        }
    `,
    fragmentShader: `
        precision mediump float;

        void main()
        {
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }
    `
})


//! MESH:
const mesh_1 = new THREE.Mesh(shape_1,material_1)

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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()