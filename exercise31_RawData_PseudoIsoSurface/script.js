console.log(' JavaScript is Walking. and will Run fast')

import * as THREE from 'three'
// Orbit Controls:
import { OrbitControls } from 'three/examples/jsm/Addons.js'


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


let volumeData = null;
let volumeTexture = null;

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
    uniform float u_isoValue;

    const int MAX_SAMPLES = 300;
    const vec3 texMin = vec3(0.0);
    const vec3 texMax = vec3(1.0);
    const float DELTA = 0.01;

    layout(location = 0) out vec4 FragColor;

    vec3 BiSection(vec3 left,vec3 right,float iso)
    {
        for(int i=0;i<4;i++)
        {
            // get mid value betwn left and right:
            vec3 midpoint = (left+right)*0.5;
            //sample texture at mid value:
            float cMid = texture(uVolumeTexture,midpoint).x;
            // compare value at middle with isoValue
            if(cMid <iso)
                left=midpoint;
            else
                right = midpoint;
        }
        // return middle point betwn left and right limit:
        return (vec3(left+right)*0.5);
    }
    
    vec3 GetGradient(vec3 uvW)
    {
        vec3 s1,s2;

        // use center finitie different:
        s1.x = texture(uVolumeTexture, uvW-vec3(DELTA,0.0,0.0)).x ;
        s2.x = texture(uVolumeTexture, uvW+vec3(DELTA,0.0,0.0)).x ;

        s1.y = texture(uVolumeTexture, uvW-vec3(0.0,DELTA,0.0)).x ;
        s2.y = texture(uVolumeTexture, uvW+vec3(0.0,DELTA,0.0)).x ;

        s1.z = texture(uVolumeTexture, uvW-vec3(0.0,0.0,DELTA)).x ;
        s2.z = texture(uVolumeTexture, uvW+vec3(0.0,0.0,DELTA)).x ;
        
        return (normalize((s1-s2)/2.0));         
    }

    vec4 PhongLighting(vec3 L, vec3 N, vec3 V, float specPower, vec3 diffuseColor)
    {
        float diffuse = max(dot(L,N),0.0);
        vec3 halfVec = normalize(L+V);
        float specular = pow(max(0.00001,dot(halfVec,N)),specPower);	
        return vec4((diffuse*diffuseColor + specular),1.0);
    }

    void main()
    {
        float isoValue = u_isoValue/255.0;

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
            float fSample2 = texture(uVolumeTexture, dataPosition+directionStep).r;

            if((fSample - isoValue) < 0.0 && (fSample2 - isoValue) >= 0.0)
		    {
                //If there is a zero crossing, we refine the detected iso-surface location by using bisection based refinement.
                vec3 xN = dataPosition;
                vec3 xF = dataPosition + directionStep;
                vec3 tc = BiSection(xN,xF,isoValue);

                //This returns the first hit surface //vFragColor = make_float4(xN,1);
                
                //To get the shaded iso-surface, we first estimate the normal at the refined position
                vec3 N = GetGradient(tc);					

                //The view vector is simply opposite to the ray marching direction
                vec3 V = -geometryDirection;

                //We keep the view vector as the light vector to give us a head light
                vec3 L =  V;

                //Finally, we call PhongLighing function to get the final colour with diffuse and specular components. Try changing this call to this
    			//vFragColor =  PhongLighting(L,N,V,250,  tc); to get a multi colour
    			//iso-surface
    			FragColor =  PhongLighting(L,N,V,250.0, vec3(0.5));	
    			break;
            }
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
        },
        u_isoValue:{
            value: 50.0
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


