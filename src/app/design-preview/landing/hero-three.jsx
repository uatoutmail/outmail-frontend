"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * three.js hero backdrop — a drifting particle field that reacts to the cursor.
 *
 * Isolated in its own file and loaded dynamically so three.js only reaches the
 * browsers that render this option. It is ~150KB gzipped and runs a render loop
 * continuously, which is a real cost on the laptops these students own.
 */
/**
 * Deterministic scatter rather than Math.random().
 *
 * Two reasons, and neither is the lint rule. A pure function of the index means
 * the field is identical on the server and the client, so there is no hydration
 * mismatch; and it is identical between renders, so the particles never jump
 * when React re-renders the component for an unrelated reason.
 */
function scatter(i, salt) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x); // 0..1
}

function Particles({ count = 900 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      a[i * 3] = (scatter(i, 1) - 0.5) * 14;
      a[i * 3 + 1] = (scatter(i, 2) - 0.5) * 8;
      a[i * 3 + 2] = (scatter(i, 3) - 0.5) * 6;
    }
    return a;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.045;
    // lean toward the pointer — cheap parallax, reads as depth
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.18, 0.05);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.pointer.x * 0.6, 0.05);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#a78bfa" transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroThree() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <Particles />
      </Canvas>
    </div>
  );
}
