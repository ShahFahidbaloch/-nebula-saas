"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshWobbleMaterial, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

/**
 * Subtle background scene for the login card — three soft icosahedrons that
 * float gently and reflect ambient color. Kept low-poly and slow so it
 * never distracts from the form.
 */
function Shape({
  position,
  color,
  size = 0.6,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.x += d * 0.15;
    ref.current.rotation.y += d * 0.1;
  });
  return (
    <Float speed={0.8} floatIntensity={1.5} rotationIntensity={0.3}>
      <Icosahedron ref={ref} args={[size, 0]} position={position}>
        <MeshWobbleMaterial
          color={color}
          factor={0.4}
          speed={0.6}
          roughness={0.2}
          metalness={0.5}
        />
      </Icosahedron>
    </Float>
  );
}

export default function LoginScene() {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#7c3aed" />
        <pointLight position={[-3, -2, 2]} intensity={1} color="#22d3ee" />

        <Shape position={[-2.5, 1.4, 0]} color="#7c3aed" size={0.7} />
        <Shape position={[2.7, -0.6, -1]} color="#22d3ee" size={0.9} />
        <Shape position={[1.6, 1.8, -2]} color="#3b82f6" size={0.45} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
