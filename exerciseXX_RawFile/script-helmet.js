console.log(' JavaScript is Walking. and will Run fast')

import * as THREE from 'three'
// Orbit Controls:
import { OrbitControls } from 'three/examples/jsm/Addons.js'

import { GLTFLoader } from 'three/examples/jsm/Addons.js'

//! Cursor:
const cursor=
{
    x:0,
    y:0
}

//! CANVAS:
const canvas = document.querySelector('canvas.threeJS')
//console.log(canvas)
//console.log(THREE)

// Creating a new scene:
const scene = new THREE.Scene()

//! MODEL LOADING:

const gltfLoader_1 = new GLTFLoader();

gltfLoader_1.load(
    //'/static/models/Duck/glTF/Duck.gltf',
    //'/static/models/Duck/glTF-Embedded/Duck.gltf',
    '/static/models/FlightHelmet/glTF/FlightHelmet.gltf',


    (gltf) =>
    {
        // console.log(gltf);

        //scene.add(gltf.scene.children[0])

        //for(const child of gltf.scene.children)
        //{
        //    scene.add(child);
        //}

        //while(gltf.scene.children.length)
        //{
        //    scene.add(gltf.scene.children[0]);
        //}

        //! Native JavaScript technique to Duplicate Array into new:
        //const children = [...gltf.scene.children]
        //for(const child of children)
        //{
        //    scene.add(child)
        //}
        
        //! directly add 'scene':
        scene.add(gltf.scene);

    },
)

// Create and add DEBUG Axes in our 'scene'
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Create and add CUBE in our 'group_1' which is already added in 'scene'
const floor_1 = new THREE.Mesh(
    // new THREE.BoxGeometry(1, 1, 1),
    new THREE.PlaneGeometry(10,10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness:0,
        roughness:0.5,
    })
)

floor_1.receiveShadow = true;

// translation:
floor_1.position.x = 0
floor_1.position.z = 0
// rotation:
floor_1.rotation.x = -Math.PI * 0.5;
floor_1.rotation.y = 0.0;
floor_1.rotation.z = 0.0;

scene.add(floor_1);


//** LIGHTS **:
const ambientLight = new THREE.AmbientLight(0xffffff,2.4);
scene.add(ambientLight);

const directionalLight_1 = new THREE.DirectionalLight(0xffffff,1.8);
directionalLight_1.castShadow = true;
directionalLight_1.shadow.mapSize.set(1024,1024);
directionalLight_1.shadow.camera.far =15;
directionalLight_1.shadow.camera.left =-7;
directionalLight_1.shadow.camera.top=7;
directionalLight_1.shadow.camera.right=7;
directionalLight_1.shadow.camera.bottom=-7;
directionalLight_1.position.set(5,5,5);
scene.add(directionalLight_1);


// Object to save resize related variables:
const sizes =
{
    width: innerWidth,
    height: innerHeight
}

// Mouse Controls:
window.addEventListener('mousemove',(event)=>{
    
    cursor.x = event.clientX/sizes.width - 0.5;
    cursor.y = (event.clientY/sizes.height -0.5);
    cursor.y = -1.0 * cursor.y;
})

window.addEventListener('resize',()=>
{
    //* update size:
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //* update Camera:
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    //*update renderer:
    renderer.setSize(sizes.width,sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})



// create and add "Camera Object for Perspective Projection Matrix" into our 'scene'
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(2, 2, 2)
scene.add(camera)

// Orbit Controls:
const controls = new OrbitControls(camera,canvas);
controls.target.set(0,0.75,0);
controls.enableDamping = true;

//! create new Renderer for drawing on our canvas:
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

//! resize and update our renderer:
renderer.shadowMap.enabled=true;
renderer.shadowMap.type= THREE.PCFShadowMap;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));


//! ********* GAME LOOP ************
let time = Date.now();

const tick = ()=>
{
    //* update()
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
                                    
    controls.update();

    //* display()
    renderer.render(scene, camera)

    //* request Next Frame: like SwapBuffers(...)
    window.requestAnimationFrame(tick);
}

tick();


