"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment, Torus } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

/**
 * AnimatedSphere
 * --------------
 * Distorted sphere with chromatic-gradient material. We rotate it on every
 * frame for an "alive" feel; distort speed is intentionally low so it
 * undulates rather than wobbles.
 */
function AnimatedSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.08;
    ref.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.4}>
      <Sphere ref={ref} args={[1.4, 96, 96]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#7c3aed"
          attach="material"
          distort={0.45}
          speed={1.6}
          roughness={0.15}
          metalness={0.6}
        />
      </Sphere>
    </Float>
  );
}

/**
 * OrbitingTorus
 * -------------
 * Two tilted neon rings that slowly counter-rotate around the sphere — a
 * cheap but visually rich addition that sells the "futuristic" vibe.
 */
function OrbitingTorus({ tilt = 0.6, speed = 0.3, color = "#22d3ee" }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * speed;
  });
  return (
    <Torus
      ref={ref}
      args={[2.2, 0.012, 16, 200]}
      rotation={[tilt, tilt * 0.5, 0]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.6}
        toneMapped={false}
      />
    </Torus>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      // dpr cap avoids melting laptops on retina screens.
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        {/* Three-point-ish lighting tuned for the violet sphere. */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
        <directionalLight position={[-5, -3, 2]} intensity={0.8} color="#22d3ee" />
        <pointLight position={[0, 0, 3]} intensity={1.5} color="#7c3aed" />

        <AnimatedSphere />
        <OrbitingTorus tilt={0.6} speed={0.25} color="#22d3ee" />
        <OrbitingTorus tilt={-0.4} speed={-0.18} color="#a855f7" />

        {/* Studio environment gives the distort material its specular highlights. */}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
