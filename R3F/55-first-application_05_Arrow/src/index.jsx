import './style.css'
import ReactDOM from 'react-dom/client'

import { Canvas } from '@react-three/fiber'
import Experience from './Experience.js'

import { OrbitControls } from "@react-three/drei";

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
        <div style={{ width: "800px", height: "600px" }}>
        <Canvas camera={{position:[0,0,5], fov:50.0}}>
            <Experience />

        <OrbitControls />
        </Canvas>
        </div>
    </>
)