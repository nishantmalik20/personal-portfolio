"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { makeSyrupLabelTexture } from "@/lib/textures";
import { BlobShadow } from "./nature";

interface PlacedProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/** Cozy red toque with a white band and pompom. */
export function Toque({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PlacedProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.3, 20, 14, 0, Math.PI * 2, 0, 1.25]} />
        <meshStandardMaterial color="#E63946" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.305, 0.315, 0.14, 20]} />
        <meshStandardMaterial color="#FFF6E5" roughness={1} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.1, 14, 10]} />
        <meshStandardMaterial color="#FFF6E5" roughness={1} />
      </mesh>
    </group>
  );
}

function Antler({ side }: { side: 1 | -1 }) {
  return (
    <group
      position={[side * 0.28, 0.34, -0.02]}
      rotation={[0, 0, side * 0.38]}
    >
      <mesh position={[side * 0.2, 0.12, 0]}>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshStandardMaterial color="#E9C46A" roughness={0.9} />
      </mesh>
      {[0, 0.16, 0.32].map((dx, i) => (
        <mesh key={i} position={[side * (0.06 + dx), 0.3 + (i === 1 ? 0.06 : 0), 0]}>
          <sphereGeometry args={[0.075, 10, 8]} />
          <meshStandardMaterial color="#E9C46A" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Friendly chibi moose, optionally wearing a toque between his antlers. */
export function Moose({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  toque = true,
}: PlacedProps & { toque?: boolean }) {
  const head = useRef<Group>(null);
  const earL = useRef<Group>(null);
  const earR = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (head.current) {
      head.current.rotation.x = Math.sin(t * 0.9) * 0.05 - 0.04;
      head.current.rotation.z = Math.sin(t * 0.6 + 1) * 0.04;
    }
    const twitch = Math.max(0, Math.sin(t * 2.6)) * 0.18;
    if (earL.current) earL.current.rotation.z = 0.55 + twitch;
    if (earR.current) earR.current.rotation.z = -0.55 - twitch;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <BlobShadow radius={0.95} />
      {/* body */}
      <mesh position={[0, 0.98, 0]} scale={[1.25, 1, 0.9]}>
        <sphereGeometry args={[0.62, 24, 18]} />
        <meshStandardMaterial color="#8A5A33" roughness={1} />
      </mesh>
      {/* legs */}
      {[
        [0.34, 0.28],
        [-0.34, 0.28],
        [0.34, -0.28],
        [-0.34, -0.28],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.62, 10]} />
            <meshStandardMaterial color="#6E4525" roughness={1} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.105, 0.115, 0.12, 10]} />
            <meshStandardMaterial color="#3E2A1B" roughness={1} />
          </mesh>
        </group>
      ))}
      {/* tail */}
      <mesh position={[0, 1.06, -0.56]}>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color="#6E4525" roughness={1} />
      </mesh>
      {/* head */}
      <group ref={head} position={[0, 1.34, 0.44]}>
        <mesh scale={[0.95, 0.9, 1.05]}>
          <sphereGeometry args={[0.38, 24, 18]} />
          <meshStandardMaterial color="#8A5A33" roughness={1} />
        </mesh>
        {/* muzzle */}
        <mesh position={[0, -0.1, 0.32]} scale={[0.85, 0.72, 1.05]}>
          <sphereGeometry args={[0.27, 20, 16]} />
          <meshStandardMaterial color="#A77245" roughness={1} />
        </mesh>
        {[0.08, -0.08].map((x, i) => (
          <mesh key={i} position={[x, -0.13, 0.57]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <meshStandardMaterial color="#3E2A1B" roughness={1} />
          </mesh>
        ))}
        {/* eyes */}
        {[0.17, -0.17].map((x, i) => (
          <group key={i} position={[x, 0.12, 0.32]}>
            <mesh>
              <sphereGeometry args={[0.085, 12, 10]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.055]}>
              <sphereGeometry args={[0.042, 10, 8]} />
              <meshStandardMaterial color="#241813" roughness={0.3} />
            </mesh>
          </group>
        ))}
        {/* ears */}
        <group ref={earL} position={[0.3, 0.26, -0.06]}>
          <mesh scale={[1, 0.62, 0.32]}>
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshStandardMaterial color="#6E4525" roughness={1} />
          </mesh>
        </group>
        <group ref={earR} position={[-0.3, 0.26, -0.06]}>
          <mesh scale={[1, 0.62, 0.32]}>
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshStandardMaterial color="#6E4525" roughness={1} />
          </mesh>
        </group>
        <Antler side={1} />
        <Antler side={-1} />
        {toque && <Toque position={[0, 0.32, 0.06]} rotation={[0.14, 0, 0]} scale={1.05} />}
      </group>
    </group>
  );
}

/** Amber maple syrup jug with a leaf label. */
export function SyrupJug({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PlacedProps) {
  const label = useMemo(() => makeSyrupLabelTexture(), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh scale={[1, 1.15, 1]}>
        <sphereGeometry args={[0.24, 20, 16]} />
        <meshStandardMaterial
          color="#C9742E"
          roughness={0.35}
          emissive="#7A3E12"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.085, 0.1, 0.14, 12]} />
        <meshStandardMaterial color="#C9742E" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
        <meshStandardMaterial color="#5A3A1E" roughness={0.8} />
      </mesh>
      <mesh position={[0.25, 0.12, 0]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.09, 0.028, 10, 16]} />
        <meshStandardMaterial color="#B5651D" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0.235]}>
        <planeGeometry args={[0.26, 0.26]} />
        <meshStandardMaterial map={label} transparent roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Round happy grizzly hugging a syrup jug. */
export function Bear({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PlacedProps) {
  const body = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!body.current) return;
    const t = clock.elapsedTime;
    body.current.scale.y = 1 + Math.sin(t * 1.7) * 0.012;
    body.current.rotation.z = Math.sin(t * 0.8) * 0.02;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <BlobShadow radius={0.85} />
      <group ref={body}>
        {/* body + belly */}
        <mesh position={[0, 0.66, 0]} scale={[1.05, 1, 0.95]}>
          <sphereGeometry args={[0.68, 24, 18]} />
          <meshStandardMaterial color="#7A4E2D" roughness={1} />
        </mesh>
        <mesh position={[0, 0.6, 0.38]} scale={[1, 0.95, 0.55]}>
          <sphereGeometry args={[0.44, 20, 16]} />
          <meshStandardMaterial color="#B98A5E" roughness={1} />
        </mesh>
        {/* legs */}
        {[0.3, -0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.16, 0.34]} scale={[1, 0.55, 1.1]}>
            <sphereGeometry args={[0.26, 16, 12]} />
            <meshStandardMaterial color="#6B4226" roughness={1} />
          </mesh>
        ))}
        {/* head */}
        <group position={[0, 1.42, 0.06]} rotation={[-0.18, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.46, 24, 18]} />
            <meshStandardMaterial color="#7A4E2D" roughness={1} />
          </mesh>
          <mesh position={[0, -0.1, 0.38]} scale={[1, 0.8, 0.9]}>
            <sphereGeometry args={[0.2, 16, 12]} />
            <meshStandardMaterial color="#C89F77" roughness={1} />
          </mesh>
          <mesh position={[0, -0.04, 0.55]}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color="#2B1B10" roughness={0.6} />
          </mesh>
          {/* happy closed eyes */}
          {[0.18, -0.18].map((x, i) => (
            <mesh key={i} position={[x, 0.1, 0.41]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.06, 0.016, 8, 12, Math.PI]} />
              <meshStandardMaterial color="#241813" roughness={0.5} />
            </mesh>
          ))}
          {/* ears */}
          {[0.3, -0.3].map((x, i) => (
            <group key={i} position={[x, 0.36, -0.02]}>
              <mesh>
                <sphereGeometry args={[0.15, 12, 10]} />
                <meshStandardMaterial color="#7A4E2D" roughness={1} />
              </mesh>
              <mesh position={[0, 0.01, 0.08]}>
                <sphereGeometry args={[0.08, 10, 8]} />
                <meshStandardMaterial color="#C89F77" roughness={1} />
              </mesh>
            </group>
          ))}
        </group>
        {/* arms hugging the jug */}
        {[0.44, -0.44].map((x, i) => (
          <mesh
            key={i}
            position={[x, 0.92, 0.3]}
            rotation={[0, 0, x > 0 ? -0.7 : 0.7]}
            scale={[0.75, 1.15, 0.75]}
          >
            <sphereGeometry args={[0.24, 16, 12]} />
            <meshStandardMaterial color="#6B4226" roughness={1} />
          </mesh>
        ))}
        <SyrupJug position={[0, 1.0, 0.52]} rotation={[-0.55, 0, 0]} scale={1.1} />
      </group>
    </group>
  );
}
