"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/3d-assets/197701168a124b83a466cf96390935ed_Textured.gltf";

/* ── Mutable model state — GSAP tweens this object, useFrame reads it ── */
export interface ModelState {
  rotationY: number;
  scale: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}

/* ── Inner model driven by stateRef ── */
function AtlasModel({
  stateRef,
  onLoaded,
}: {
  stateRef: React.MutableRefObject<ModelState>;
  onLoaded: () => void;
}) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null!);
  const hasNotifiedRef = useRef(false);

  /* Boost material quality to match sketchfab look */
  /* Boost golden parts to be shiny/reflective */
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.isMeshStandardMaterial) {
          // Detect golden/metallic parts by color hue
          const col = mat.color;
          const isGolden =
            col.r > 0.5 && col.g > 0.35 && col.b < col.r * 0.6;

          if (isGolden) {
            mat.metalness = 1.0;             // fully metallic
            mat.roughness = 0.12;            // very smooth / mirror-like
            mat.envMapIntensity = 1.8;       // strong reflections
          } else {
            mat.envMapIntensity = 1.2;       // subtle reflections on marble
          }
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!hasNotifiedRef.current) {
      onLoaded();
      hasNotifiedRef.current = true;
    }
  }, [onLoaded]);

  /* Every frame: read mutable state and apply to the Three.js group */
  useFrame(() => {
    if (!groupRef.current) return;
    const s = stateRef.current;

    groupRef.current.rotation.y = s.rotationY;
    groupRef.current.scale.setScalar(s.scale);
    groupRef.current.position.set(s.positionX, s.positionY, s.positionZ);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

/* ── Public component ── */
interface Model3DViewerProps {
  stateRef: React.MutableRefObject<ModelState>;
  onLoaded: () => void;
}

export function Model3DViewer({ stateRef, onLoaded }: Model3DViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 32 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.15;
      }}
    >
      <ambientLight intensity={0.15} />

      <Suspense fallback={null}>
        <AtlasModel stateRef={stateRef} onLoaded={onLoaded} />
        <Environment preset="city" environmentIntensity={0.9} />

        <ContactShadows
          position={[0, -3.25, 0]}
          opacity={0.35}
          scale={5}
          blur={6}
          far={8}
        />
      </Suspense>
    </Canvas>

  );
}
