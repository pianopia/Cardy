"use client";

import React, { useMemo, useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { Card3DProps } from "@/types";

function CardMesh({ frontImage, backImage, scale = 1, onClick, rotation }: {
  frontImage: string;
  backImage: string;
  scale?: number;
  onClick?: () => void;
  rotation: { x: number; y: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const [frontTexture, backTexture] = useLoader(TextureLoader, [frontImage, backImage]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1.4, 1, 1), []);

  // Materials: front and back
  const frontMaterial = useMemo(() => new THREE.MeshBasicMaterial({ map: frontTexture }), [frontTexture]);
  const backMaterial = useMemo(() => new THREE.MeshBasicMaterial({ map: backTexture }), [backTexture]);

  return (
    <group scale={scale} rotation={[rotation.x, rotation.y, 0]}>
      {/* Front plane */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={onClick}
        material={frontMaterial}
      />
      {/* Back plane */}
      <mesh
        geometry={geometry}
        rotation={[0, Math.PI, 0]}
        material={backMaterial}
      />
    </group>
  );
}

export default function Card3D({ frontImage, backImage, cardData, interactive = true, onCardClick, scale = 1 }: Card3DProps) {
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: -0.1, y: 0.3 });
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    dragStart.current = null;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragStart.current) return;
    const dx = (e.clientX - dragStart.current.x) / 200;
    const dy = (e.clientY - dragStart.current.y) / 200;
    setRotation((prev) => ({ x: THREE.MathUtils.clamp(prev.x - dy, -Math.PI / 2, Math.PI / 2), y: prev.y + dx }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      className="w-full h-[360px]"
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {/* keep aspect ratio area */}
      <Canvas camera={{ position: [0, 0, 2.4], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={0.6} />
        <CardMesh
          frontImage={frontImage}
          backImage={backImage}
          scale={scale}
          rotation={rotation}
          onClick={() => onCardClick?.(cardData.id)}
        />
      </Canvas>
    </div>
  );
}
