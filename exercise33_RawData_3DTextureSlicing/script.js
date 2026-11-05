console.log(' JavaScript is Walking. and will Run fast')

import * as THREE from 'three'
// Orbit Controls:
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { BlendMode } from 'three/webgpu'


//! Cursor:
const cursor=
{
    x:0,
    y:0
}

//! CANVAS:
const canvas = document.querySelector('canvas.threeJS')

// Creating a new scene:
const scene = new THREE.Scene()


let volumeData = null;
let volumeTexture = null;


const EPSILON = 0.0001;
const MAX_SLICES = 512;
const MAX_SLICE_VERTICES = MAX_SLICES *12;

let num_slices = 256;

const edges= [
    [0,1],
    [1,2],
    [2,3],
    [3,0],
    [0,4],
    [1,5],
    [2,6],
    [3,7],
    [4,5],
    [5,6],
    [6,7],
    [7,4],
];

const edgeList= [
	[0,1,5,6,   4,8,11,9,  3,7,2,10 ],      // v0 is front
	[0,4,3,11,  1,2,6,7,   5,9,8,10 ],      // v1 
	[1,5,0,8,   2,3,7,4,   6,10,9,11],      // v2 
	[7,11,10,8, 2,6,1,9,   3,0,4,5  ],      // v3 

    [8, 5, 9, 1, 11, 10, 7, 6, 4, 3, 0, 2], // v4 
    [9, 6, 10, 2, 8, 11, 4, 7, 5, 0, 1, 3], // v5 
    [9, 8, 5, 4, 6, 1, 2, 0, 10, 7, 11, 3], // v6 
    [10, 9, 6, 5, 7, 2, 3, 1, 11, 4, 8, 0], // v7 
];

const vTextureSlices = new Array(512 *12);

for(let i =0;i<vTextureSlices.length;i++)
{
    vTextureSlices[i]=new THREE.Vector3();
}

const viewDirection = new THREE.Vector3(1.0,1.0,1.0);
const vertices = [
    new THREE.Vector3(-0.5, -0.5, -0.5), // v0
    new THREE.Vector3( 0.5, -0.5, -0.5), // v1
    new THREE.Vector3( 0.5,  0.5, -0.5), // v2
    new THREE.Vector3(-0.5,  0.5, -0.5), // v3

    new THREE.Vector3(-0.5, -0.5,  0.5), // v4
    new THREE.Vector3( 0.5, -0.5,  0.5), // v5
    new THREE.Vector3( 0.5,  0.5,  0.5), // v6
    new THREE.Vector3(-0.5,  0.5,  0.5)  // v7
];


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

        let minValue = 255;
        let maxValue = 0;
        let sum = 0;

        for (let i = 0; i < uint8Array.length; i++)
        {
            const value = uint8Array[i];

            minValue = Math.min(minValue, value);
            maxValue = Math.max(maxValue, value);
            sum += value;
        }

        console.log("Minimum:", minValue);
        console.log("Maximum:", maxValue);
        console.log("Average:", sum / uint8Array.length);
        console.log("Total bytes:", uint8Array.length);

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

    layout(location = 0) out vec4 FragColor;
    void main()
    {
        FragColor = texture(uVolumeTexture,oTexCoords).rrrr;
    }
`;



function SliceVolume(geometry_)
{
    // local:
    let maxDistance = viewDirection.dot(vertices[0]);
    let minDistance = maxDistance;
    let maxIndex =0;

    // code:

    for(let i =1;i<8;i++)
    {
        const fDistance = viewDirection.dot(vertices[i]);

        if(fDistance > maxDistance)
        {
            maxDistance = fDistance;
            maxIndex = i;
        }

        if(fDistance <minDistance)
            minDistance = fDistance;

    }

    minDistance-=EPSILON;
    maxDistance+=EPSILON;

    // edge intersection calculations:
    const vecStart=[];
    const vecDir = [];
    const lambda = new Float32Array(12);
    const lambda_inc = new Float32Array(12);
    let denom = 0;

    // calc slicing plane distances:
    let plane_dist = minDistance;

    const plane_dist_inc = (maxDistance-minDistance)/num_slices;

    // calc start and direction vectors for all 12 edges:

    for(let i=0;i<12;i++)
    {
        const edgeIndex = edgeList[maxIndex][i];
        const startIndex = edges[edgeIndex][0];
        const endIndex = edges[edgeIndex][1];

        vecStart[i] = vertices[startIndex].clone();

        vecDir[i] = vertices[endIndex].clone().sub(vecStart[i]);

        denom = vecDir[i].dot(viewDirection);

        if(1.0 +denom !== 1.0)
        {
            lambda_inc[i] = plane_dist_inc/denom;
            lambda[i]=(plane_dist - vecStart[i].dot(viewDirection))/denom;
        }
        else
        {
            lambda[i] = -1.0;
            lambda_inc[i]=0.0;
        }
    }

    // calc intersection points:
    const intersection=[];
    for(let i=0;i<6;i++)
    {
        intersection[i] = new THREE.Vector3();
    }

    const dL = new Float32Array(12);

    const indeices =[
        0,1,2,
        0,2,3,
        0,3,4,
        0,4,5
    ];

    let count = 0;

    // Helper to calculate an edge intersection.
    function getIntersection(edgeIndex)
    {
        return vecStart[edgeIndex].clone().addScaledVector(
            vecDir[edgeIndex],
            dL[edgeIndex]
            );
    }

    // looping through slicing planes:

    // for(let i = num_slices-1;i>=0;i--)
    for(let i = 0;i<num_slices;i++)
    {
        for(let e=0;e<12;e++)
        {
            dL[e]= lambda[e]+i*lambda_inc[e];
        }

        // first intersection:
        if(dL[0] >= 0.0 && dL[0] <1.0)
        {
            intersection[0].copy(getIntersection(0));
        }
        else if(dL[1] >= 0.0 && dL[1]<1.0)
        {
            intersection[0].copy(getIntersection(1));
        }
        else if(dL[3] >= 0.0 && dL[3]<1.0)
        {
            intersection[0].copy(getIntersection(3));
        }
        else
        {
            continue;
        }

        // second intersection:
        if(dL[2] >= 0.0 && dL[2] <1.0)
        {
            intersection[1].copy(getIntersection(2));
        }
        else if(dL[0] >= 0.0 && dL[0]<1.0)
        {
            intersection[1].copy(getIntersection(0));
        }
        else if(dL[1] >= 0.0 && dL[1]<1.0)
        {
            intersection[1].copy(getIntersection(1));
        }
        else
        {
            intersection[1].copy(getIntersection(3));
        }

        // third intersection:
        if(dL[4] >= 0.0 && dL[4] <1.0)
        {
            intersection[2].copy(getIntersection(4));
        }
        else if(dL[5] >= 0.0 && dL[5] <1.0)
        {
            intersection[2].copy(getIntersection(5));
        }
        else
        {
            intersection[2].copy(getIntersection(7));
        }

        // 4th intersection:
        if(dL[6] >= 0.0 && dL[6] <1.0)
        {
            intersection[3].copy(getIntersection(6));
        }
        else if(dL[4] >= 0.0 && dL[4] <1.0)
        {
            intersection[3].copy(getIntersection(4));
        }
        else if(dL[5] >= 0.0 && dL[5] <1.0)
        {
            intersection[3].copy(getIntersection(5));
        }
        else
        {
            intersection[3].copy(getIntersection(7));
        }

        // 5th intersection:
        if(dL[8] >= 0.0 && dL[8] <1.0)
        {
            intersection[4].copy(getIntersection(8));
        }
        else if(dL[9] >= 0.0 && dL[9] <1.0)
        {
            intersection[4].copy(getIntersection(9));
        }
        else
        {
            intersection[4].copy(getIntersection(11));
        }

        // 6th intersection:
        if(dL[10] >= 0.0 && dL[10] <1.0)
        {
            intersection[5].copy(getIntersection(10));
        }
        else if(dL[8] >= 0.0 && dL[8] <1.0)
        {
            intersection[5].copy(getIntersection(8));
        }
        else if(dL[9] >= 0.0 && dL[9] <1.0)
        {
            intersection[5].copy(getIntersection(9));
        }
        else
        {
            intersection[5].copy(getIntersection(11));
        }

        // triangle fan vertices:

        for(let j=0;j<12;j++)
        {
            vTextureSlices[count].copy(intersection[indeices[j]]);
            count++;
        }

    }

    // Update VAO geometry:
    const positionAttribute = geometry_.getAttribute('position');
    for(let i=0;i<count;i++)
    {
        const v = vTextureSlices[i];
        positionAttribute.setXYZ(i,v.x,v.y,v.z);
    }

    positionAttribute.needsUpdate=true;

    geometry_.setDrawRange(0,count);

    // if(!geometry_.boundingSphere)
    // {
    //     geometry_.computeBoundingSphere();
        
    // }
    geometry_.computeBoundingSphere();

    //console.log("Generated vertex count:", count);
    //console.log("Draw range:", geometry_.drawRange);
}


const boundingBoxGeometry = new THREE.BufferGeometry();
const positionVertexArray=new Float32Array(MAX_SLICE_VERTICES*3);

const vao_BoundingBox = new THREE.BufferAttribute(
    positionVertexArray,3
);

vao_BoundingBox.setUsage(THREE.DynamicDrawUsage);

boundingBoxGeometry.setAttribute('position',vao_BoundingBox);
boundingBoxGeometry.setDrawRange(0,0);


console.log(" Geometry attributes:",boundingBoxGeometry.attributes);
console.log(" vao_BoundingBox.itemSize :",vao_BoundingBox.itemSize);
console.log(" vao_BoundingBox.array.length :",vao_BoundingBox.array.length);

const material = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,

    uniforms: {
        uVolumeTexture: {
            value: null
        },
    },
    transparent: true,

    depthTest:true,
    depthWrite:false,
    side: THREE.DoubleSide
});


const mesh_1 = new THREE.Mesh(boundingBoxGeometry, material);
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

const cameraWorldPosition = new THREE.Vector3();

const tick = ()=>
{
    //* update()
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
                                    
    controls.update();

    
    camera.updateMatrixWorld();
    mesh_1.updateMatrixWorld();

    camera.getWorldPosition(cameraWorldPosition);
    mesh_1.worldToLocal(cameraWorldPosition);

    viewDirection.copy(cameraWorldPosition).normalize();
    SliceVolume(boundingBoxGeometry);

    //* display()
    renderer.render(scene, camera)

    //* request Next Frame: like SwapBuffers(...)
    window.requestAnimationFrame(tick);
}

tick();


