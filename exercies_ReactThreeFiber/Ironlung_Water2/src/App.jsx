import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { ReflectiveBloodWater } from "./ReflectiveBloodWater";
import "./App.css";

function App() {
  return (
    <div className="canvas-full">
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
        <Perf position="top-left" showGraph={true}/>
        <color attach="background" args={["#0a0c12"]} />
        <Lighting />
        {/* <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#7c9cff"
            roughness={0.3}
            metalness={0.2}
            emissive="#7c9cff"
            emissiveIntensity={0.3}
          />
        </mesh> */}
        <Suspense fallback={null}>
          <ReflectiveBloodWater />
        </Suspense>
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}

export default App;
