

# TEXTURE NOTES:

Types:
1. Color (Albedo)
2. Alpha
3. Height
4. Normal Map
5. Ambient Occlusion
6. Metalness
7. Roughtness
8. PBR




a. implement CUBE + Textures   	: DONE
b. use THREE.js Texture Loader 	: DONE
c. UV Unwrapping 				: WIP
d. texture Transoform			: WIP
e. texture Filtering			: WIP


//**** TO LOAD  A TEXTURE *****

Like other features, Texture is Also a Class in THREE.js.

Also there is class named TextureLoader() which directlyhelps us loading multiple textures instead of our own image.load().


//*** LoadingManager Class : to handle multiple texture loading and see its progress ******








# CAMERA NOTES:

//* Mouse Control Camera : 08May2026:

// Mouse Controls:
window.addEventListener('mousemove',(event)=>{
console.log('X = ',event.clientX);
console.log('Y = ',event.clientY);
})
The code we added at first shows x,y values in PIXELS and its better to adjust them.
We need values with an Amplitude of '1' and that can be both Negative and Positive.

//* Normalize above X and Y inside 'window.addEventListener()
//..............
cursor.x = event.clientX/sizes.width - 0.5;
cursor.y = (event.clientY/sizes.height -0.5);
// .... set these values to camera's x and y:
camera.position.x = cursor.x * 5;
camera.position.y = cursor.y * 5;

//* To Fix the common Inversion Problem of 'Y'
//.... inside addEventListener().......
cursor.x = event.clientX/sizes.width - 0.5;
cursor.y = (event.clientY/sizes.height -0.5);
cursor.y = -1.0 * cursor.y;

//* Actual Rotation using Circle Formula:
//....update camera's x,y as below:
camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
camera.position.y = cursor.y * 3;
camera.lookAt(cube2.position);
//** BUT THREE.js has Integrated Diff New Classes to control and do similar Camera Handling
//** They are part of BUILT-IN Controls
Device Orientation : NOT SUPPORTED Now.
FlyControl
FirstPersonControl (Not FPS)
Pointer Lock Controls (FPS Game,collisions)
Orbit Control. (Google Maps)
Trackball Control. (No Limits)
Transform Control (Blender)
Drag Controls (Obj Transform with Picking)

// Orbit Controls:
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.jsm'


# ANIMATION NOTES:

The main purpose of requestAnimationFrame is to call the function provided on the next Frame.
This is like recursion to call our display() in game Loop.

In WebGL we have variable 'requestAnimationFrame' which will support multiple browsers.



//! Animation1: tick() will be called recursively, like Game Loop, inside it we can put our any Display and Update like code.


--------------- ADAPTION TO FRAMERATE ----------------

//! TIME 1:


//! TIME 2:



****** DO NOT USE getDelta() it will mess internal class logic for Clock ******

















//! METHOD1: This will normalize our Translate Values:
//cube1.position.normalize();

//! METHOD2: To Set Translate X,Y,Z directly :
cube1.position.set(/*Tx*/-1.5,/*Ty*/0.95,/*Tz*/0.0);


//! METHOD3:  distance betweem Center of Scene and Object
console.log(cube3.position.length())



//! METHOD4: distance betweem Camera and Object:
console.log(cube3.position.distanceTo(camera.position))


//! METHOD5: Axes Helper:

//! METHOD6: for obj.scale.set() :Scale Matrix:


IF you update rotation it also updates the quaternion And viceversa.

//! METHOD7: rotation:
cube2.rotation.y = 1.87;
cube2.rotation.z = 10.87;


many softwares are using Quaternion as solution to fix the Gimble Lock problems. Its entirely diff topic to study later.


//! METHOD8: lookAt

// to change make Camera Look At Right Side
// camera.lookAt(new THREE.Vector3(3,0,0));

//To make camera look at the cube2's position or any other cube's position:
camera.lookAt(cube2.position);


/* You can Combine the Transformations in any Order still it gives same properties so far */


//! METHOD9: sceneGraph: to apply transformations to Entire Group of Objects at same time:





