console.log(' JavaScript is Walking. and will Run fast')

import * as THREE from 'three'
// Orbit Controls:
import { OrbitControls } from 'three/examples/jsm/Addons.js'

import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { VOXLoader } from 'three/addons/loaders/VOXLoader.js';

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
    '/static/models/Duck/glTF-Embedded/Duck.gltf',
    (gltf) =>
    {
        console.log(gltf);
        // scene.add(gltf.scene.children[0])
    },
)

let volumeData = null;
let volumeTexture = null;


// function handleVolumeFileUpload(event)
function handleVolumeFileUpload(event, dim)
{
    // code:
    const file = event.target.files[0];

    if(!file)
    {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e)
    {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        const data = new Uint8Array(dim * dim * dim);
        for (let i = 0; i < uint8Array.length; i++)
        {
            data[i] = uint8Array[i];
        }

        volumeData =data;

        console.log("Raw file loaded successfully.");
        console.log("File Name",file.name);
        console.log("File size",volumeData.length,"bytes");
        console.log("first voxel value[0] ",volumeData[0]);

        volumeTexture = new THREE.Data3DTexture(volumeData,dim,dim,dim);

        volumeTexture.format = THREE.RedFormat;
        volumeTexture.type= THREE.UnsignedByteType;

        volumeTexture.minFilter = THREE.LinearFilter;
        volumeTexture.magFilter = THREE.LinearFilter;
        volumeTexture.wrapS = THREE.ClampToEdgeWrapping;
        volumeTexture.wrapT = THREE.ClampToEdgeWrapping;
        volumeTexture.wrapR = THREE.ClampToEdgeWrapping;
        volumeTexture.needsUpdate= true;

        material.uniforms.uVolumeTexture.value = volumeTexture;

        console.log("3D Texture creation done ");
    };

    reader.onerror= function()
    {
        console.error(" Failed to read the RAW file");
    }

    reader.readAsArrayBuffer(file);
}

const maxDim=256;

document.getElementById("volumeFile").addEventListener("change",
    function(event)
    {
        handleVolumeFileUpload(event,maxDim);
    }
);


const vertexShader = `
    out vec3 oTexCoords;
    void main()
    {
        gl_Position = projectionMatrix
                    * modelViewMatrix
                    * vec4(position, 1.0);

        oTexCoords = position + vec3(0.5);
    }
`;

const fragmentShader = `

    precision highp float;
    precision highp sampler3D;

    in vec3 oTexCoords;

    uniform sampler3D uVolumeTexture;
    uniform vec3 u_cameraPosition;
    uniform vec3 u_stepSize;
    
    const int MAX_SAMPLES = 300;
    const vec3 texMin = vec3(0.0);
    const vec3 texMax = vec3(1.0);

    layout(location = 0) out vec4 FragColor;

    void main()
    {
        // Initialize FragColor
        // FragColor = vec4(0.0);

        // Step 1: Initial 3D texture position.
        vec3 dataPosition = oTexCoords;

        // Step 2: Calculate ray marching direction.
        vec3 geometryDirection = normalize((oTexCoords - vec3(0.5)) - u_cameraPosition);

        // Step 3: Calculate the incremental step.
        vec3 directionStep = geometryDirection * u_stepSize;

        for (int i = 0; i < MAX_SAMPLES; i++)
        {
            dataPosition += directionStep;

            // Stop if the position is outside the volume.
            bool bStop =dot(sign(dataPosition - texMin),sign(texMax - dataPosition)) < 3.0;

            if (bStop)
                break;

            // Sample the red channel of the 3D texture.
            float fSample = texture(uVolumeTexture, dataPosition).r;

            // Front-to-back compositing.
            float prev_alpha = fSample * (1.0 - FragColor.a);

            FragColor.rgb += prev_alpha * vec3(fSample);
            FragColor.a += prev_alpha;

            //Ray Termination : if the currently composited colour alpha is already fully saturated,we terminated the loop
            if (FragColor.a > 0.99)
                break;
        }
    }
`;
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,

    uniforms: {
        uVolumeTexture: {
            value: null
        },
        u_cameraPosition: {
            value: new THREE.Vector3()
        },

        u_stepSize: {
            value: new THREE.Vector3(
                1.0 / 256.0,
                1.0 / 256.0,
                1.0 / 256.0
            )
        }
    },
    transparent: true,
    side: THREE.FrontSide
});

const mesh_1 = new THREE.Mesh(geometry, material);

scene.add(mesh_1);


// Create and add DEBUG Axes in our 'scene'
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Create and add CUBE in our 'group_1' which is already added in 'scene'
const floor_1 = new THREE.Mesh(
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

// scene.add(floor_1);


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

    camera.updateMatrixWorld();
    material.uniforms.u_cameraPosition.value.copy(
        mesh_1.worldToLocal(
            camera.getWorldPosition(new THREE.Vector3())
        )
    );

    //* display()
    renderer.render(scene, camera)

    //* request Next Frame: like SwapBuffers(...)
    window.requestAnimationFrame(tick);
}

tick();


