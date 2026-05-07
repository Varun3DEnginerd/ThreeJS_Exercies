console.log(' JavaScript is Walking. and will Run fast')

import * as THREE from 'three'

//! CANVAS:
const canvas = document.querySelector('canvas.threeJS')
console.log(canvas)

console.log(THREE)

// Scene:
const scene = new THREE.Scene()

let xAngle =1;

/* Axes Helper */
//! METHOD5: Axes Helper:
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

/**
 * Objects
 */


//! METHOD9: sceneGraph:
const group_1 = new THREE.Group();
group_1.y=1.0;
scene.add(group_1);


const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = - 1.5
cube1.position.y = 1.0
group_1.add(cube1);

//! METHOD1: This will normalize our Translate Values:
//cube1.position.normalize();

//! METHOD2: To Set Translate X,Y,Z directly :
cube1.position.set(/*Tx*/-1.5,/*Ty*/0.95,/*Tz*/0.0);


const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = 0
cube2.position.z = -1.0


//! METHOD7: rotation:

//cube2.rotation.reorder('YZX');
cube2.rotation.x = 10.0;
cube2.rotation.y = 20.87;
cube2.rotation.z = 10.87;

group_1.add(cube2);


const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 1.5
cube3.position.y = -1.5
cube3.position.z = -2.0

//! METHOD6: for obj.scale.set() :Scale Matrix:
cube3.scale.set(0.65,1.1,0.5)

group_1.add(cube3);

//! METHOD3:  distance betweem Center of Scene and Object
console.log(cube3.position.length())



/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
//camera.position.x = 1
//camera.position.y = 1

//! METHOD8: lookAt
camera.lookAt(new THREE.Vector3(1,0,0));
//camera.lookAt(cube2.position);


scene.add(camera)

//! METHOD4: distance betweem Camera and Object:
console.log(cube3.position.distanceTo(camera.position))


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


//! TIME 1:

let time = Date.now();

//! TIME 2:
const clockTime  = new THREE.Clock();


//! Animation1:
const tick = ()=>
{
    //code:

    //console.log('tick......');

    //UPDATE:
    //cube3.position.x +=0.01; 
    
    

    //! TIME 1: TIME
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
    // console.log(deltaTime);

    cube1.rotation.y += 0.001 * deltaTime;


    //! TIME 2:
    const elapsedTime = clockTime.getElapsedTime();
    console.log(elapsedTime);
    cube2.rotation.y = elapsedTime;
    

    cube3.position.y = Math.sin(elapsedTime);
    cube3.position.x = Math.cos(elapsedTime);
    

    //DISPLAY:
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick);
}


//! Animation1:
tick();


