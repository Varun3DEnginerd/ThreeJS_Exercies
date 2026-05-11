console.log(' JavaScript is Walking. and will Run fast')

import * as THREE from 'three'

// Orbit Controls:
import { OrbitControls } from 'three/examples/jsm/Addons.js'
//console.log(OrbitControls)

//! Cursor:
const cursor=
{
    x:0,
    y:0
}

// Mouse Controls:
window.addEventListener('mousemove',(event)=>{
    
    cursor.x = event.clientX/sizes.width - 0.5;
    cursor.y = (event.clientY/sizes.height -0.5);
    cursor.y = -1.0 * cursor.y;
})

//! CANVAS:
const canvas = document.querySelector('canvas.threeJS')
//console.log(canvas)
//console.log(THREE)




// Creating a new scene:
const scene = new THREE.Scene()


// Create and add DEBUG Axes in our 'scene'
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);


// Create and add GROUP in our 'scene'
const group_1 = new THREE.Group();
scene.add(group_1);


//! Loading Manager:
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () =>
{
    console.log('----- onStart() ----') 
}
loadingManager.onLoad = () =>
{
    console.log('----- onLoad() ----') 
}
loadingManager.onProgress = () =>
{
    console.log('----- onProgress() ----') 
}
loadingManager.onError = () =>
{
    console.log('----- onError() ----') 
}

//! TEXTURE LOADER: 
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/static/color.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace;

const alphaTexture = textureLoader.load('/static/textures/door/alpha.jpg')
alphaTexture.colorSpace = THREE.SRGBColorSpace;

const heightTexture = textureLoader.load('/static/textures/door/height.jpg')
heightTexture.colorSpace = THREE.SRGBColorSpace;

const normalTexture = textureLoader.load('/static/textures/door/normal.jpg')
normalTexture.colorSpace = THREE.SRGBColorSpace;

const ambientOcclusionTexture = textureLoader.load('/static/textures/door/ambientOcclusion.jpg')
ambientOcclusionTexture.colorSpace = THREE.SRGBColorSpace;

const metalnessTexture = textureLoader.load('/static/textures/door/metalness.jpg')
metalnessTexture.colorSpace = THREE.SRGBColorSpace;

const roughnessTexture = textureLoader.load('/static/textures/door/roughness.jpg')
roughnessTexture.colorSpace = THREE.SRGBColorSpace;



// const exampleTexture = textureLoader.load(
//     '/static/color.jpg',
//     () =>
//     {
//        console.log('exampleTexture Load success.') 
//     },
//     () =>
//     {
//        console.log('-- progress -- ?? ') 
//     },
//     () =>
//     {
//        console.log('error for exampleTexture.') 
//     }
// )
// exampleTexture.colorSpace = THREE.SRGBColorSpace;



// Create and add CUBE in our 'group_1' which is already added in 'scene'
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    // new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // new THREE.MeshBasicMaterial({color: 0x00ff00,map:colorTexture})
    // new THREE.MeshBasicMaterial({map:normalTexture})
    // new THREE.MeshBasicMaterial({map:ambientOcclusionTexture})
    new THREE.MeshBasicMaterial({color: 0xffffff,map:colorTexture}),
)

//! printing texcoords for BoxGeometry() class:
console.log(cube2.geometry.attributes.uv.array);

// translation:
cube2.position.x = 0.0
cube2.position.z = 0.0
// rotation:
cube2.rotation.x = 0.0;
cube2.rotation.y = 0.0;
cube2.rotation.z = 0.0;

group_1.add(cube2);


const geometry_2 = new THREE.Mesh(
    // new THREE.SphereGeometry(1,32,32),
    // new THREE.ConeGeometry(1,1,32),
    // new THREE.TorusGeometry(1,0.35,32,100),
    // new THREE.CylinderGeometry(1,1,0.5,20,20),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xffffff,map:colorTexture})
)
// translation:
geometry_2.position.x = 0.0;
geometry_2.position.z = 0.0;

// group_1.add(geometry_2);


// Object to save resize related variables:
const sizes = {
    width: 800,
    height: 600
}


// create and add "Camera Object for Perspective Projection Matrix" into our 'scene'
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Orbit Controls:

const controls = new OrbitControls(camera,canvas);

//!test: controls.target.y =2;
controls.enableDamping = true;
controls.enablePan= true;


//! create new Renderer for drawing on our canvas:
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

//! resize our renderer:
renderer.setSize(sizes.width, sizes.height)


//! ********* GAME LOOP ************
let time = Date.now();

const tick = ()=>
{
    //* update()
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
                                    //OLD: //cube2.rotation.y += 0.001 * deltaTime;
    //!camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
    //!camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
    //!camera.position.y = cursor.y * 3;
    //!camera.lookAt(cube2.position);
    controls.update();


    //* display()
    renderer.render(scene, camera)

    //* request Next Frame: like SwapBuffers(...)
    window.requestAnimationFrame(tick);
}

tick();


