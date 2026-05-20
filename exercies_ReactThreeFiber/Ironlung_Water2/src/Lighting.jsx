import { useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";

export function Lighting() {
  const lightRef = useRef();
  useHelper(lightRef, THREE.DirectionalLightHelper, 1);

  return (
    <>
      <ambientLight color="#ffffff" intensity={1.1} />
      <directionalLight
        ref={lightRef}
        position={[50, 5, 5]}
        intensity={10}
        color="#ffffff"
        castShadow
      />
      {/* <pointLight position={[-200, 0, -5]} intensity={15} color="#7c9cff" /> */}
    </>
  );
}
