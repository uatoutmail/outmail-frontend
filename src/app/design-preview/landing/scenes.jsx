"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * three.js scenes for the landing page, isolated so three only loads for the
 * options that use it.
 *
 * Smoothness notes, since that was the feedback: every motion here is either
 * driven by elapsed time (continuous, never stutters) or lerped toward a target
 * with a small factor. Nothing snaps to a value per frame, and dpr is capped at
 * 1.5 so a retina laptop is not rendering four times the pixels it needs.
 */

const BRAND = "#4c1fff";
const LAVENDER = "#a78bfa";

/* Deterministic scatter — identical on server and client, stable across renders. */
function rnd(i, salt) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/* ---------- 1. Floating geometry — slow, weightless, no jitter ---------- */
function Shapes() {
  const group = useRef();
  useFrame((state) => {
    // time-driven, so it can never stutter on a dropped frame
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.08;
      group.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }
  });
  const items = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({
      pos: [(rnd(i, 1) - 0.5) * 8, (rnd(i, 2) - 0.5) * 4.5, (rnd(i, 3) - 0.5) * 3],
      scale: 0.28 + rnd(i, 4) * 0.42,
      kind: i % 3,
    })), []);
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float key={i} speed={1.1} rotationIntensity={0.5} floatIntensity={1.1}>
          <mesh position={it.pos} scale={it.scale}>
            {it.kind === 0 && <icosahedronGeometry args={[1, 0]} />}
            {it.kind === 1 && <torusGeometry args={[0.75, 0.28, 16, 40]} />}
            {it.kind === 2 && <octahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial
              color={i % 2 ? BRAND : LAVENDER}
              roughness={0.25} metalness={0.65}
              emissive={i % 2 ? BRAND : LAVENDER} emissiveIntensity={0.28}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function SceneShapes() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 5]} intensity={1.6} />
        <pointLight position={[-5, -3, 2]} intensity={2.2} color={LAVENDER} />
        <Shapes />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

/* ---------- 2. A single morphing blob — one object, maximum smoothness ---------- */
function Blob() {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!mesh.current) return;
    mesh.current.rotation.y = t * 0.18;
    mesh.current.rotation.z = Math.sin(t * 0.2) * 0.12;
    // ease toward the pointer instead of tracking it exactly — no snapping
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, state.pointer.x * 0.9, 0.04);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, state.pointer.y * 0.5, 0.04);
  });
  return (
    <mesh ref={mesh} scale={2.1}>
      <sphereGeometry args={[1, 96, 96]} />
      <MeshDistortMaterial color={BRAND} distort={0.42} speed={1.3} roughness={0.1} metalness={0.85}
        emissive={BRAND} emissiveIntensity={0.22} />
    </mesh>
  );
}

export function SceneBlob() {
  return (
    <div className="absolute inset-0 -z-10 opacity-90">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <pointLight position={[-4, -2, 3]} intensity={3} color={LAVENDER} />
        <Blob />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}

/* ---------- 3. Connection network — recruiters, reached ---------- */
function Network({ count = 26 }) {
  const group = useRef();
  const nodes = useMemo(
    () => Array.from({ length: count }, (_, i) => new THREE.Vector3(
      (rnd(i, 5) - 0.5) * 9, (rnd(i, 6) - 0.5) * 5, (rnd(i, 7) - 0.5) * 3.5
    )), [count]);

  // lines from a single origin — the student — out to every recruiter
  const lineGeo = useMemo(() => {
    const pts = [];
    nodes.forEach((n) => { pts.push(new THREE.Vector3(0, 0, 0), n); });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.06;
      group.current.rotation.x = Math.sin(t * 0.1) * 0.12;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={BRAND} transparent opacity={0.28} />
      </lineSegments>
      {nodes.map((n, i) => (
        <Float key={i} speed={0.9} floatIntensity={0.5}>
          <mesh position={n} scale={0.09 + rnd(i, 8) * 0.06}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={i % 3 === 0 ? LAVENDER : BRAND} />
          </mesh>
        </Float>
      ))}
      <mesh scale={0.22}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function SceneNetwork() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Network />
      </Canvas>
    </div>
  );
}
