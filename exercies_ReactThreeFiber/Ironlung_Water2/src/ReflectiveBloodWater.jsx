import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

import vertexShader from "./shaders/bloodWater_2.vert.glsl?raw";
import fragmentShader from "./shaders/bloodWaterReflective_2.frag.glsl?raw";

export function ReflectiveBloodWater() {
  const meshRef = useRef();
  const { scene, gl } = useThree();

  const cubeRenderTarget = useMemo(() => {
    return new THREE.WebGLCubeRenderTarget(512, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
  }, []);

  const cubeCamera = useMemo(() => {
    const cam = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
    return cam;
  }, [cubeRenderTarget]);

  const {
    waveAmplitude,
    waveSpeed,
    gerstnerAmplitude,
    bloodColor,
    darkBloodColor,
    ambientColor,
    shininess,
    fresnelStrength,
    reflectionStrength,
    sunIntensity,
    subsurfaceStrength,
    resolution,
  } = useControls("New Water", {
    waveAmplitude: { value: 0.3, min: 0, max: 6, step: 0.1 },
    waveSpeed: { value: 2.6, min: 0, max: 9, step: 0.1 },
    gerstnerAmplitude: { value: 0.7, min: 0, max: 6, step: 0.1 },
    bloodColor: { value: "#3e93b7" },
    darkBloodColor: { value: "#2265b1" },
    ambientColor: { value: "#0d2031" },
    shininess: { value: 400, min: 10, max: 500, step: 10 },
    fresnelStrength: { value: 1.5, min: 0, max: 6, step: 0.1 },
    reflectionStrength: { value: 1.0, min: 0, max: 6, step: 0.1 },
    sunIntensity: { value: 1.5, min: 0, max: 6, step: 0.1 },
    subsurfaceStrength: { value: 0.8, min: 0, max: 6, step: 0.1 },
    resolution: { value: 256, min: 64, max: 1024, step: 64 },
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaveAmplitude: { value: waveAmplitude },
      uWaveSpeed: { value: waveSpeed },
      uGerstnerAmplitude: { value: gerstnerAmplitude },
      uSunDirection: { value: new THREE.Vector3(0, -1, 0.3) },
      uSunColor: {
        value: new THREE.Color(1.2, 1.1, 1.0).multiplyScalar(sunIntensity),
      },
      uAmbient: { value: new THREE.Color(ambientColor) },
      uBloodColor: { value: new THREE.Color(bloodColor) },
      uDarkBloodColor: { value: new THREE.Color(darkBloodColor) },
      uShininess: { value: shininess },
      uFresnelStrength: { value: fresnelStrength },
      uReflectionMap: { value: cubeRenderTarget.texture },
      uReflectionStrength: { value: reflectionStrength },
      uSubsurfaceStrength: { value: subsurfaceStrength },
    }),
    [cubeRenderTarget],
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uWaveAmplitude.value = waveAmplitude;
      uniforms.uWaveSpeed.value = waveSpeed;
      uniforms.uGerstnerAmplitude.value = gerstnerAmplitude;
      uniforms.uSunColor.value.set(1.2, 1.1, 1.0).multiplyScalar(sunIntensity);
      uniforms.uAmbient.value.set(ambientColor);
      uniforms.uBloodColor.value.set(bloodColor);
      uniforms.uDarkBloodColor.value.set(darkBloodColor);
      uniforms.uShininess.value = shininess;
      uniforms.uFresnelStrength.value = fresnelStrength;
      uniforms.uReflectionStrength.value = reflectionStrength;
      uniforms.uSubsurfaceStrength.value = subsurfaceStrength;

      meshRef.current.visible = false;

      cubeCamera.position.set(0, -0.2, 0);

      cubeCamera.update(gl, scene);

      meshRef.current.visible = true;
    }
  });
  // 19May2026: new local variables for Canal and Land
  const waterLength = 20;
  const waterBreadth = 6;
  const shoreBreadth = 4;
  const shoreGap = 0.025;
  const shoreOffsetZ = waterBreadth / 2 + shoreBreadth / 2 + shoreGap;


  return (
    <group>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
      >
        <planeGeometry args={[waterLength, waterBreadth, resolution, resolution]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.DoubleSide}
        />
      </mesh>

    // 19May2026: Two new Meshes addeded in return for Land Geometry -------- START
      {/* Left shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, shoreOffsetZ]}>
        <planeGeometry args={[waterLength, shoreBreadth]} />
        <meshStandardMaterial color={"#0b3d0b"} />
      </mesh>

      {/* Right shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -shoreOffsetZ]}>
        <planeGeometry args={[waterLength, shoreBreadth]} />
        <meshStandardMaterial color={"#0b3d0b"} />
      </mesh>
    </group>

    // 19May2026: Two new Meshes addeded in return for Land Geometry -------- END

  );
}
