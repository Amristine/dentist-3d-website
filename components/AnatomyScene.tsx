"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const SHAPE: [number, number][] = [
  [-0.48, 0.02], [-0.39, 0.17], [-0.24, 0.31], [-0.08, 0.46],
  [0.1, 0.61], [0.31, 0.7], [0.51, 0.69], [0.69, 0.59],
  [0.85, 0.43], [0.96, 0.22], [1.02, 0.04],
];

function createLayer(width: number, depth: number, heightScale: number) {
  const vertical = 86;
  const radial = 72;
  const verts: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];
  for (let iy = 0; iy <= vertical; iy++) {
    const t = iy / vertical;
    const y = THREE.MathUtils.lerp(SHAPE[0][0], SHAPE[SHAPE.length - 1][0], t);
    let i = 0;
    while (i < SHAPE.length - 2 && y > SHAPE[i + 1][0]) i++;
    const [y0, r0] = SHAPE[i];
    const [y1, r1] = SHAPE[i + 1];
    const k = THREE.MathUtils.clamp((y - y0) / (y1 - y0), 0, 1);
    const r = THREE.MathUtils.lerp(r0, r1, k * k * (3 - 2 * k));
    for (let ix = 0; ix <= radial; ix++) {
      const u = ix / radial;
      const a = u * Math.PI * 2;
      const cheek = 1 + Math.cos(a * 2) * 0.025;
      const rr = Math.max(.001, r * cheek);
      verts.push(Math.cos(a) * rr * width, y * heightScale, Math.sin(a) * rr * depth);
      uvs.push(u, t);
      if (iy < vertical && ix < radial) {
        const n = iy * (radial + 1) + ix;
        const next = n + radial + 1;
        indices.push(n, next, n + 1, next, next + 1, n + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function LayerRoots({ x, scale, materialColor }: { x: number; scale: number; materialColor: string }) {
  return (
    <group position={[x, -0.12 * scale, 0]}>
      <mesh position={[-.19 * scale, -.53 * scale, 0]} rotation={[0, 0, -.2]}>
        <capsuleGeometry args={[.073 * scale, .51 * scale, 8, 20]} />
        <meshPhysicalMaterial color={materialColor} roughness={.28} clearcoat={.52} />
      </mesh>
      <mesh position={[.02 * scale, -.56 * scale, 0]}>
        <capsuleGeometry args={[.075 * scale, .55 * scale, 8, 20]} />
        <meshPhysicalMaterial color={materialColor} roughness={.28} clearcoat={.52} />
      </mesh>
      <mesh position={[.21 * scale, -.48 * scale, -.015]} rotation={[0, 0, .2]}>
        <capsuleGeometry args={[.064 * scale, .42 * scale, 8, 20]} />
        <meshPhysicalMaterial color={materialColor} roughness={.3} clearcoat={.48} />
      </mesh>
    </group>
  );
}

function AnatomyModel() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const enamel = useMemo(() => createLayer(.82, .66, 1.14), []);
  const dentin = useMemo(() => createLayer(.67, .54, 1.04), []);
  const pulp = useMemo(() => createLayer(.37, .32, .82), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * .14 + Math.sin(state.clock.elapsedTime * .25) * .025, 2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * .08, 2, delta);
  });

  return (
    <group ref={group} rotation={[0.02, -0.25, -0.02]} scale={.96}>
      <Float speed={.5} floatIntensity={.04} rotationIntensity={.015}>
        <group position={[.45, .12, -.18]}>
          <mesh geometry={enamel} castShadow receiveShadow>
            <meshPhysicalMaterial color="#fff5e4" roughness={.2} metalness={.01} clearcoat={1} clearcoatRoughness={.13} envMapIntensity={1.25} side={THREE.DoubleSide} />
          </mesh>
          <LayerRoots x={0} scale={.78} materialColor="#eee0c9" />
        </group>
      </Float>
      <Float speed={.57} floatIntensity={.06} rotationIntensity={.012}>
        <group position={[-.43, .02, .05]} rotation={[0, .12, -.02]}>
          <mesh geometry={dentin} castShadow>
            <meshPhysicalMaterial color="#c9945f" roughness={.3} metalness={.02} clearcoat={.65} side={THREE.DoubleSide} />
          </mesh>
          <LayerRoots x={0} scale={.69} materialColor="#c48e5c" />
        </group>
      </Float>
      <Float speed={.65} floatIntensity={.07} rotationIntensity={.018}>
        <group position={[-.86, -.1, .31]} rotation={[0, -.08, -.03]}>
          <mesh geometry={pulp} castShadow>
            <meshPhysicalMaterial color="#9d5e54" roughness={.34} metalness={.01} clearcoat={.55} side={THREE.DoubleSide} />
          </mesh>
          <LayerRoots x={0} scale={.5} materialColor="#a66c60" />
        </group>
      </Float>
    </group>
  );
}

export default function AnatomyScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.1], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#e2dacb", 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <ambientLight intensity={1.45} />
      <directionalLight position={[2, 4, 4]} intensity={3} color="#fff6e7" castShadow />
      <directionalLight position={[-3, 1, -2]} intensity={2.3} color="#b9895a" />
      <pointLight position={[0, 2, 1]} intensity={7} color="#fff5df" distance={5} />
      <pointLight position={[-2, -1, 2]} intensity={3.8} color="#b78267" distance={4} />
      <Environment preset="studio" />
      <AnatomyModel />
    </Canvas>
  );
}
