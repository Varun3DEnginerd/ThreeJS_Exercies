

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





