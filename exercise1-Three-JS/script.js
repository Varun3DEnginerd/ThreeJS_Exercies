console.log(' JavaScript is Walking. and will Run fast')

import * as THREE from 'three'

//! CANVAS:
const canvas = document.querySelector('canvas.threeJS')
console.log(canvas)

console.log(THREE)

// Scene:
const scene = new THREE.Scene()

//Object:
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:'red'})
const mesh = new THREE.Mesh(geometry,material)

scene.add(mesh)

//sizes:
const sizes = 
{
    width:800,
    height:600
}

//Camera:
const camera = new THREE.PerspectiveCamera(45.0,sizes.width/sizes.height,0.1,1000.0)
camera.position.z = 3

scene.add(camera)

//Renderer:
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas
    }
)

renderer.setSize(sizes.width,sizes.height)

renderer.render(scene,camera)

