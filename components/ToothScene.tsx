"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Tooth() {
  const group = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.23;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.21) * 0.045;
    }
    if (crown.current) crown.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={group} position={[0, -0.12, 0]} rotation={[0.03, -0.32, -0.12]} scale={1.12}>
      <mesh ref={crown} position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.82, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={512}
          transmission={0.08}
          thickness={0.7}
          roughness={0.2}
          chromaticAberration={0.035}
          anisotropy={0.15}
          distortion={0.08}
          distortionScale={0.15}
          temporalDistortion={0.08}
          color="#fff5e9"
          metalness={0.02}
        />
      </mesh>
      <mesh position={[-0.38, -0.36, 0.02]} rotation={[0.15, 0, -0.12]} castShadow>
        <capsuleGeometry args={[0.19, 0.8, 8, 28]} />
        <meshPhysicalMaterial color="#efe4d4" roughness={0.26} metalness={0.02} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[0.12, -0.4, 0.05]} rotation={[-0.08, 0.05, 0.08]} castShadow>
        <capsuleGeometry args={[0.2, 0.9, 8, 28]} />
        <meshPhysicalMaterial color="#f5ebdf" roughness={0.23} metalness={0.01} clearcoat={0.9} clearcoatRoughness={0.17} />
      </mesh>
      <mesh position={[0.45, -0.31, -0.04]} rotation={[0.12, 0, 0.24]} castShadow>
        <capsuleGeometry args={[0.16, 0.67, 8, 28]} />
        <meshPhysicalMaterial color="#e8d8c7" roughness={0.28} clearcoat={0.7} />
      </mesh>
      <mesh position={[0, 0.58, 0.62]} scale={[0.58, 0.45, 0.2]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial color="#fffaf3" roughness={0.16} metalness={0.02} clearcoat={1} clearcoatRoughness={0.13} />
      </mesh>
    </group>
  );
}

function SceneContents() {
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 5, 5]} intensity={3.4} color="#fff2df" castShadow />
      <pointLight position={[-4, 1, 2]} intensity={7} color="#dcae83" />
      <pointLight position={[1, -2, -3]} intensity={5} color="#f6d8c3" />
      <spotLight position={[0, 5, 0]} intensity={1.8} color="#ffffff" angle={0.8} penumbra={1} />
      <Float speed={1.1} rotationIntensity={0.13} floatIntensity={0.25}>
        <Tooth />
      </Float>
      <Sparkles count={75} scale={5.8} size={1.6} speed={0.22} opacity={0.42} color="#f1cfa9" />
      <ContactShadows position={[0, -1.86, 0]} opacity={0.32} scale={4.8} blur={2.5} far={3.5} color="#8e634a" />
      <Environment preset="studio" />
    </>
  );
}

export default function ToothScene() {
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <SceneContents />
    </Canvas>
  );
}