"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PROFILE: [number, number][] = [
  [-0.56, 0.035], [-0.48, 0.19], [-0.34, 0.34], [-0.18, 0.49],
  [0.02, 0.68], [0.24, 0.80], [0.47, 0.83], [0.67, 0.76],
  [0.84, 0.61], [1.00, 0.38], [1.10, 0.13], [1.115, 0.002],
];

function smoothProfile(y: number) {
  let i = 0;
  while (i < PROFILE.length - 2 && y > PROFILE[i + 1][0]) i++;
  const [y0, r0] = PROFILE[i];
  const [y1, r1] = PROFILE[i + 1];
  const t = THREE.MathUtils.clamp((y - y0) / (y1 - y0), 0, 1);
  const eased = t * t * (3 - 2 * t);
  return THREE.MathUtils.lerp(r0, r1, eased);
}

function createCrownGeometry(scaleX = 1, scaleZ = 1) {
  const heightSegments = 110;
  const radialSegments = 100;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const yMin = PROFILE[0][0];
  const yMax = PROFILE[PROFILE.length - 1][0];

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments;
    const y = THREE.MathUtils.lerp(yMin, yMax, v);
    const baseRadius = smoothProfile(y);
    for (let ix = 0; ix <= radialSegments; ix++) {
      const u = ix / radialSegments;
      const angle = u * Math.PI * 2;
      const cusp = y > 0.42 ? Math.cos(angle * 4) * Math.max(0, y - 0.42) * 0.025 : 0;
      const cheek = 1 + 0.045 * Math.cos(angle * 2);
      const radius = Math.max(0.001, baseRadius + cusp) * cheek;
      positions.push(Math.cos(angle) * radius * scaleX, y, Math.sin(angle) * radius * scaleZ);
      uvs.push(u, v);
      if (iy < heightSegments && ix < radialSegments) {
        const a = iy * (radialSegments + 1) + ix;
        const b = a + radialSegments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function Root({ position, rotation, scale = 1, color = "#e8dfcf" }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const geometry = useMemo(() => new THREE.CapsuleGeometry(0.14 * scale, 0.71 * scale, 12, 40), [scale]);
  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow receiveShadow>
      <meshPhysicalMaterial color={color} roughness={0.24} metalness={0.01} clearcoat={0.95} clearcoatRoughness={0.16} sheen={0.24} />
    </mesh>
  );
}

function ToothSculpture() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const crownGeometry = useMemo(() => createCrownGeometry(), []);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0.2 + pointer.x * 0.2 + Math.sin(state.clock.elapsedTime * 0.22) * 0.08, 2.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.12 + Math.sin(state.clock.elapsedTime * 0.3) * 0.025, 2, delta);
  });

  return (
    <group ref={group} position={[0, -0.03, 0]} rotation={[0, -0.3, -0.08]} scale={1.06}>
      <mesh geometry={crownGeometry} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#fff5e6"
          roughness={0.16}
          metalness={0.015}
          clearcoat={1}
          clearcoatRoughness={0.1}
          sheen={0.46}
          sheenColor="#e8d5ba"
          envMapIntensity={1.5}
        />
      </mesh>
      <Root position={[-0.34, -0.79, 0.03]} rotation={[0.04, 0, -0.22]} scale={1.05} color="#e9dfcd" />
      <Root position={[0.02, -0.82, 0.08]} rotation={[-0.04, 0.02, -0.02]} scale={1.12} color="#f3eadb" />
      <Root position={[0.36, -0.73, -0.03]} rotation={[0.08, 0, 0.22]} scale={0.95} color="#e7d7c2" />
      <mesh position={[0, 0.62, 0.55]} scale={[0.49, 0.18, 0.12]} rotation={[-0.15, 0, -0.18]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.29} />
      </mesh>
    </group>
  );
}

function GoldFilament({ radius, tube, rotation }: { radius: number; tube: number; rotation: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 0.18) * 0.025;
  });
  return (
    <mesh ref={ref} rotation={rotation} position={[0, 0, -0.55]}>
      <torusGeometry args={[radius, tube, 8, 180]} />
      <meshStandardMaterial color="#c6a477" metalness={0.78} roughness={0.28} transparent opacity={0.64} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#16231d"]} />
      <fog attach="fog" args={["#16231d", 5.7, 11]} />
      <ambientLight intensity={1.1} color="#e1e8d8" />
      <directionalLight position={[4, 5, 4]} intensity={3.2} color="#fff4e1" castShadow />
      <directionalLight position={[-4, 1, 2]} intensity={2.6} color="#d5b47f" />
      <pointLight position={[0, 3, -2]} intensity={18} color="#fff0d6" distance={8} />
      <pointLight position={[-3, -1, -1]} intensity={8} color="#74896d" distance={6} />
      <pointLight position={[3, -2, 3]} intensity={4} color="#d6bb8d" distance={5} />
      <GoldFilament radius={1.86} tube={0.004} rotation={[0.95, 0.18, -0.4]} />
      <GoldFilament radius={1.55} tube={0.003} rotation={[1.3, -0.6, 0.5]} />
      <Float speed={0.8} rotationIntensity={0.035} floatIntensity={0.14}>
        <ToothSculpture />
      </Float>
      <Sparkles count={100} scale={[4.8, 5.2, 3.6]} size={1.15} speed={0.16} opacity={0.45} color="#e5d0a9" />
      <Environment preset="studio" />
    </>
  );
}

export default function ToothScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.05, 5.1], fov: 39 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      onCreated={({ gl }) => {
        gl.setClearColor("#16231d", 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <Scene />
    </Canvas>
  );
}
