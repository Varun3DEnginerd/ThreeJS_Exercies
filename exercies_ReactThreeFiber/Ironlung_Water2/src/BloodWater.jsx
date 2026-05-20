import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

import vertexShader from "./shaders/bloodWater.vert.glsl?raw";
import fragmentShader from "./shaders/bloodWater.frag.glsl?raw";

export function BloodWater() {
  const meshRef = useRef();

  const {
    waveAmplitude,
    waveSpeed,
    gerstnerAmplitude,
    fbmStrength,
    fbmSpeed,
    bloodColor,
    darkBloodColor,
    ambientColor,
    shininess,
    fresnelStrength,
    envMapIntensity,
    sunIntensity,
    subsurfaceStrength,
    resolution,
  } = useControls("Blood Water", {
    waveAmplitude: { value: 0.1, min: 0, max: 3, step: 0.1 },
    waveSpeed: { value: 1.0, min: 0, max: 3, step: 0.1 },
    gerstnerAmplitude: { value: 1.0, min: 0, max: 3, step: 0.1 },
    fbmStrength: { value: 3.0, min: 0, max: 3, step: 0.1 },
    fbmSpeed: { value: 3.0, min: 0, max: 3, step: 0.1 },
    bloodColor: { value: "#4d0808" },
    darkBloodColor: { value: "#260303" },
    ambientColor: { value: "#0d0202" },
    shininess: { value: 400, min: 10, max: 500, step: 10 },
    fresnelStrength: { value: 1.5, min: 0, max: 3, step: 0.1 },
    envMapIntensity: { value: 0.8, min: 0, max: 3, step: 0.1 },
    sunIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    subsurfaceStrength: { value: 0.8, min: 0, max: 3, step: 0.1 },
    resolution: { value: 512, min: 64, max: 512, step: 64 },
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaveAmplitude: { value: waveAmplitude },
      uWaveSpeed: { value: waveSpeed },
      uGerstnerAmplitude: { value: gerstnerAmplitude },
      uFBMStrength: { value: fbmStrength },
      uFBMSpeed: { value: fbmSpeed },
      uSunDirection: { value: new THREE.Vector3(0, -1, 0.3) },
      uSunColor: {
        value: new THREE.Color(1.2, 1.1, 1.0).multiplyScalar(sunIntensity),
      },
      uAmbient: { value: new THREE.Color(ambientColor) },
      uBloodColor: { value: new THREE.Color(bloodColor) },
      uDarkBloodColor: { value: new THREE.Color(darkBloodColor) },
      uShininess: { value: shininess },
      uFresnelStrength: { value: fresnelStrength },
      uEnvMapIntensity: { value: envMapIntensity },
      uSubsurfaceStrength: { value: subsurfaceStrength },
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uWaveAmplitude.value = waveAmplitude;
      uniforms.uWaveSpeed.value = waveSpeed;
      uniforms.uGerstnerAmplitude.value = gerstnerAmplitude;
      uniforms.uFBMStrength.value = fbmStrength;
      uniforms.uFBMSpeed.value = fbmSpeed;
      uniforms.uSunColor.value.set(1.2, 1.1, 1.0).multiplyScalar(sunIntensity);
      uniforms.uAmbient.value.set(ambientColor);
      uniforms.uBloodColor.value.set(bloodColor);
      uniforms.uDarkBloodColor.value.set(darkBloodColor);
      uniforms.uShininess.value = shininess;
      uniforms.uFresnelStrength.value = fresnelStrength;
      uniforms.uEnvMapIntensity.value = envMapIntensity;
      uniforms.uSubsurfaceStrength.value = subsurfaceStrength;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
      <planeGeometry args={[10, 10, resolution, resolution]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
