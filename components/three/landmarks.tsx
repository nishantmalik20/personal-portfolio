"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  DoubleSide,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";
import type { Group, Mesh, PointLight, Sprite } from "three";
import {
  makeAuroraTexture,
  makeCodeTexture,
  makeGlowTexture,
  makeLabelTexture,
} from "@/lib/textures";
import { scrollState } from "@/lib/scroll";
import { Mountain } from "./nature";

interface PlacedProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/** Shared bobbing used by the canoe and by the avatar sitting inside it. */
export const canoeBob = (t: number) => Math.sin(t * 1.6) * 0.05;

/* ------------------------------------------------------------------ */
/* Education props                                                     */
/* ------------------------------------------------------------------ */

export function Signpost({
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: PlacedProps & { label: string }) {
  const tex = useMemo(() => makeLabelTexture(label), [label]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.56, -0.07]} rotation={[0, 0, 0.03]}>
        <cylinderGeometry args={[0.055, 0.07, 1.12, 10]} />
        <meshStandardMaterial color="#7A5230" roughness={1} />
      </mesh>
      <mesh position={[0, 0.97, 0]}>
        <boxGeometry args={[0.95, 0.32, 0.07]} />
        <meshStandardMaterial color="#9A6B3F" roughness={1} />
      </mesh>
      <mesh position={[0, 0.97, 0.04]}>
        <planeGeometry args={[0.9, 0.27]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function BookStack({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  const books: { c: string; y: number; r: number }[] = [
    { c: "#D62839", y: 0.06, r: 0.25 },
    { c: "#1982C4", y: 0.18, r: -0.18 },
    { c: "#FFCA3A", y: 0.3, r: 0.08 },
  ];
  return (
    <group position={position} scale={scale}>
      {books.map((b, i) => (
        <mesh key={i} position={[0, b.y, 0]} rotation={[0, b.r, 0]}>
          <boxGeometry args={[0.52, 0.11, 0.38]} />
          <meshStandardMaterial color={b.c} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Craft props                                                         */
/* ------------------------------------------------------------------ */

export function Laptop({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  const ref = useRef<Group>(null);
  const screen = useMemo(() => makeCodeTexture(), []);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.y = position[1] + Math.sin(t * 1.3) * 0.14;
    g.rotation.y = Math.sin(t * 0.55) * 0.35;
    g.rotation.z = Math.sin(t * 0.8) * 0.05;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[0.9, 0.05, 0.62]} />
        <meshStandardMaterial color="#BBC8E6" roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.027, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.78, 0.42]} />
        <meshStandardMaterial color="#8E9DC4" roughness={0.6} />
      </mesh>
      <group position={[0, 0.02, -0.3]} rotation={[1.18, 0, 0]}>
        <mesh position={[0, 0.29, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.035]} />
          <meshStandardMaterial color="#BBC8E6" roughness={0.4} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.29, 0.02]}>
          <planeGeometry args={[0.82, 0.52]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export function OrbitShapes({ position = [0, 0, 0] }: PlacedProps) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.rotation.y = t * 0.45;
    g.children.forEach((c, i) => {
      c.position.y = 1.25 + Math.sin(t * 1.25 + i * 1.7) * 0.28;
      c.rotation.x += dt * (0.5 + i * 0.2);
      c.rotation.z += dt * 0.35;
    });
  });

  const radius = 2.15;
  const shapes = [
    { color: "#E63946" },
    { color: "#4D96FF" },
    { color: "#58C24A" },
    { color: "#FFD23F" },
  ];

  return (
    <group ref={ref} position={position}>
      {shapes.map((s, i) => {
        const a = (i / shapes.length) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius * 0.7;
        return (
          <mesh key={i} position={[x, 1.25, z]}>
            {i === 0 && <torusGeometry args={[0.22, 0.09, 12, 24]} />}
            {i === 1 && <boxGeometry args={[0.3, 0.3, 0.3]} />}
            {i === 2 && <coneGeometry args={[0.2, 0.38, 10]} />}
            {i === 3 && <icosahedronGeometry args={[0.22, 0]} />}
            <meshStandardMaterial color={s.color} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Travel scene                                                        */
/* ------------------------------------------------------------------ */

export function MountainRange() {
  return (
    <group>
      <Mountain position={[-5.6, 0, -8.5]} scale={1.25} rock="#8DA3C2" />
      <Mountain position={[-2.4, 0, -9.5]} scale={1.6} rock="#7E94B8" />
      <Mountain position={[1.2, 0, -10]} scale={1.35} rock="#90A6C6" />
      <Mountain position={[4.6, 0, -9]} scale={1.5} rock="#7E94B8" />
      <Mountain position={[7, 0, -8]} scale={1.05} rock="#9AB0CE" />
    </group>
  );
}

export function Lake({
  position = [0, 0, 0],
  scaleX = 1.35,
}: PlacedProps & { scaleX?: number }) {
  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[scaleX, 1, 1]}
    >
      <circleGeometry args={[2.35, 36]} />
      <meshStandardMaterial color="#4FA8DC" roughness={0.25} transparent opacity={0.96} />
    </mesh>
  );
}

export function RippleRings({ position = [0, 0, 0] }: PlacedProps) {
  const a = useRef<Mesh>(null);
  const b = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    [a.current, b.current].forEach((m, i) => {
      if (!m) return;
      const cycle = (t * 0.4 + i * 0.5) % 1;
      m.scale.setScalar(0.7 + cycle * 1.1);
      const mat = m.material as MeshBasicMaterial;
      mat.opacity = (1 - cycle) * 0.4;
    });
  });

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {[a, b].map((ref, i) => (
        <mesh key={i} ref={ref}>
          <ringGeometry args={[0.78, 0.84, 40]} />
          <meshBasicMaterial color="#EAF8FF" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export function Canoe({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PlacedProps) {
  const ref = useRef<Group>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.y = baseY + canoeBob(t);
    g.rotation.z = rotation[2] + Math.sin(t * 1.3) * 0.03;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* hull — elongated open bowl (rim at y≈0, opens upward) */}
      <mesh scale={[1.25, 0.6, 0.46]}>
        <sphereGeometry args={[1, 36, 20, 0, Math.PI * 2, Math.PI * 0.46, Math.PI * 0.54]} />
        <meshStandardMaterial color="#D62839" roughness={0.5} side={DoubleSide} />
      </mesh>
      {/* wooden interior, slightly inset so the hull reads as having thickness */}
      <mesh position={[0, 0.03, 0]} scale={[1.12, 0.52, 0.36]}>
        <sphereGeometry args={[1, 32, 18, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshStandardMaterial color="#8A5A33" roughness={0.95} side={DoubleSide} />
      </mesh>
      {/* gunwale rim around the opening */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.25, 0.46, 1]}>
        <torusGeometry args={[1, 0.05, 12, 44]} />
        <meshStandardMaterial color="#B23A2A" roughness={0.45} />
      </mesh>
      {/* pointed bow & stern */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[s * 1.18, 0.05, 0]}
          rotation={[0, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2]}
        >
          <coneGeometry args={[0.22, 0.55, 4]} />
          <meshStandardMaterial color="#D62839" roughness={0.5} />
        </mesh>
      ))}
      {/* centre thwart (seat brace) */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.18, 0.04, 0.62]} />
        <meshStandardMaterial color="#9A6B3F" roughness={1} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Newfoundland scene                                                  */
/* ------------------------------------------------------------------ */

export function Sea({ position = [0, 0.01, -8] }: PlacedProps) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[48, 22]} />
      <meshStandardMaterial color="#2563A8" roughness={0.2} />
    </mesh>
  );
}

export function Cliff({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[1.72, 2.2, 1.84, 7]} />
        <meshStandardMaterial color="#6E5F55" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 1.87, 0]}>
        <cylinderGeometry args={[1.74, 1.66, 0.12, 7]} />
        <meshStandardMaterial color="#3E7C4F" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

export function Lighthouse({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  const beams = useRef<Group>(null);
  const beamMatA = useRef<MeshBasicMaterial>(null);
  const beamMatB = useRef<MeshBasicMaterial>(null);
  const lamp = useRef<PointLight>(null);

  useFrame((_, dt) => {
    const n = scrollState.night;
    if (beams.current) {
      beams.current.rotation.y += dt * 0.55;
      beams.current.visible = n > 0.05;
    }
    if (beamMatA.current) beamMatA.current.opacity = n * 0.16;
    if (beamMatB.current) beamMatB.current.opacity = n * 0.16;
    if (lamp.current) lamp.current.intensity = 0.4 + n * 2.6;
  });

  const stripes: { color: string; h: number }[] = [
    { color: "#F8F4EC", h: 0.55 },
    { color: "#E63946", h: 0.42 },
    { color: "#F8F4EC", h: 0.55 },
    { color: "#E63946", h: 0.42 },
  ];
  let acc = 0;

  return (
    <group position={position} scale={scale}>
      {stripes.map((s, i) => {
        const y = acc + s.h / 2;
        acc += s.h;
        return (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.4 - i * 0.018, 0.42 - i * 0.018, s.h, 18]} />
            <meshStandardMaterial color={s.color} roughness={0.85} />
          </mesh>
        );
      })}
      {/* gallery + lamp room + roof */}
      <mesh position={[0, acc + 0.05, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 18]} />
        <meshStandardMaterial color="#283044" roughness={0.8} />
      </mesh>
      <mesh position={[0, acc + 0.26, 0]}>
        <cylinderGeometry args={[0.24, 0.26, 0.32, 14]} />
        <meshBasicMaterial color="#FFF3B0" toneMapped={false} />
      </mesh>
      <pointLight
        ref={lamp}
        position={[0, acc + 0.28, 0]}
        color="#FFE9A8"
        intensity={0.4}
        distance={9}
        decay={1.6}
      />
      <mesh position={[0, acc + 0.55, 0]}>
        <coneGeometry args={[0.32, 0.36, 14]} />
        <meshStandardMaterial color="#D62839" roughness={0.7} />
      </mesh>
      {/* rotating beams */}
      <group ref={beams} position={[0, acc + 0.27, 0]} visible={false}>
        <mesh position={[-3.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.95, 6.8, 14, 1, true]} />
          <meshBasicMaterial
            ref={beamMatA}
            color="#FFF3B0"
            transparent
            opacity={0}
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh position={[3.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.95, 6.8, 14, 1, true]} />
          <meshBasicMaterial
            ref={beamMatB}
            color="#FFF3B0"
            transparent
            opacity={0}
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

const HOUSE_COLORS = ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"];
const HOUSE_HEIGHTS = [0.85, 1.05, 0.9, 1.15, 0.95];

export function RowHouses({ position = [0, 0, 0], rotation = [0, 0, 0] }: PlacedProps) {
  const windowMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#FFE9B8",
        emissive: "#FFB13D",
        emissiveIntensity: 0.15,
        roughness: 0.6,
      }),
    []
  );

  useFrame(() => {
    windowMat.emissiveIntensity = 0.15 + scrollState.night * 1.9;
  });

  return (
    <group position={position} rotation={rotation}>
      {HOUSE_COLORS.map((color, i) => {
        const h = HOUSE_HEIGHTS[i];
        const x = (i - 2) * 0.78;
        return (
          <group key={i} position={[x, 0, (i % 2) * 0.12]}>
            <mesh position={[0, h / 2, 0]}>
              <boxGeometry args={[0.62, h, 0.55]} />
              <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            <mesh position={[0, h + 0.16, 0]} rotation={[0, Math.PI / 4, 0]}>
              <cylinderGeometry args={[0, 0.5, 0.34, 4]} />
              <meshStandardMaterial color="#2F3061" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.17, 0.281]}>
              <planeGeometry args={[0.16, 0.32]} />
              <meshStandardMaterial color="#FFF6E5" roughness={0.8} />
            </mesh>
            {[-0.16, 0.16].map((wx, w) => (
              <mesh key={w} position={[wx, h - 0.28, 0.281]} material={windowMat}>
                <planeGeometry args={[0.14, 0.16]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export function Iceberg({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  const ref = useRef<Group>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.y = baseY + Math.sin(t * 0.65) * 0.09;
    g.rotation.z = Math.sin(t * 0.5) * 0.04;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh scale={[1, 1.25, 1]}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color="#EAF8FF" roughness={0.25} flatShading />
      </mesh>
      <mesh position={[0.95, -0.25, 0.2]} scale={[1, 0.8, 1]}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#D8F0FF" roughness={0.25} flatShading />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Manitoba / prairie                                                  */
/* ------------------------------------------------------------------ */

export function GrainElevator({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: PlacedProps) {
  const label = useMemo(() => makeLabelTexture("MANITOBA", "#8C3A2B", "#F4ECD8"), []);
  const body = "#8C3A2B";
  const roof = "#2C3650";
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* main tower */}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[1.5, 3.4, 1.4]} />
        <meshStandardMaterial color={body} roughness={1} />
      </mesh>
      <mesh position={[0, 3.7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.25, 0.8, 4]} />
        <meshStandardMaterial color={roof} roughness={1} flatShading />
      </mesh>
      {/* headhouse on top */}
      <mesh position={[0, 4.15, 0]}>
        <boxGeometry args={[0.72, 0.55, 0.72]} />
        <meshStandardMaterial color={body} roughness={1} />
      </mesh>
      <mesh position={[0, 4.6, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.62, 0.4, 4]} />
        <meshStandardMaterial color={roof} roughness={1} flatShading />
      </mesh>
      {/* driveway annex */}
      <mesh position={[1.25, 0.75, 0]}>
        <boxGeometry args={[1, 1.5, 1.2]} />
        <meshStandardMaterial color="#7A3326" roughness={1} />
      </mesh>
      <mesh position={[1.25, 1.7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.82, 0.5, 4]} />
        <meshStandardMaterial color={roof} roughness={1} flatShading />
      </mesh>
      {/* painted name board */}
      <mesh position={[0, 2.5, 0.71]}>
        <planeGeometry args={[1.3, 0.65]} />
        <meshBasicMaterial map={label} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function HayBale({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.52, 18]} />
        <meshStandardMaterial color="#CBA85C" roughness={1} />
      </mesh>
      {[0.27, -0.27].map((x, i) => (
        <mesh key={i} rotation={[0, 0, Math.PI / 2]} position={[x, 0.33, 0]}>
          <cylinderGeometry args={[0.335, 0.335, 0.02, 18]} />
          <meshStandardMaterial color="#B5934A" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Campfire scene                                                      */
/* ------------------------------------------------------------------ */

export function Campfire({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  const flames = useRef<(Mesh | null)[]>([null, null, null]);
  const light = useRef<PointLight>(null);
  const sparks = useRef<(Mesh | null)[]>([null, null, null, null, null]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flames.current.forEach((f, i) => {
      if (!f) return;
      f.scale.y = 1 + Math.sin(t * 9 + i * 2.1) * 0.14 + Math.sin(t * 23 + i) * 0.07;
      f.rotation.y = t * (0.8 + i * 0.3);
    });
    if (light.current) {
      light.current.intensity = 3.2 + Math.sin(t * 9) * 0.55 + Math.sin(t * 23) * 0.35;
    }
    sparks.current.forEach((s, i) => {
      if (!s) return;
      const cycle = (t * (0.5 + i * 0.11) + i * 0.37) % 1;
      s.position.y = 0.55 + cycle * 1.25;
      s.position.x = Math.sin(t * 2 + i * 9) * 0.12;
      const mat = s.material as MeshBasicMaterial;
      mat.opacity = (1 - cycle) * 0.9;
    });
  });

  return (
    <group position={position} scale={scale}>
      {/* logs */}
      {[0.5, -0.6, 2.1].map((r, i) => (
        <mesh key={i} position={[0, 0.1, 0]} rotation={[0, r, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.85, 8]} />
          <meshStandardMaterial color="#6B4226" roughness={1} />
        </mesh>
      ))}
      {/* stones */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.58, 0.07, Math.sin(a) * 0.58]}>
            <sphereGeometry args={[0.11, 8, 6]} />
            <meshStandardMaterial color="#8E8B85" roughness={1} flatShading />
          </mesh>
        );
      })}
      {/* flames */}
      {[
        { r: 0.24, h: 0.55, c: "#FF5400", y: 0.38 },
        { r: 0.16, h: 0.72, c: "#FF9E00", y: 0.46 },
        { r: 0.09, h: 0.5, c: "#FFD23F", y: 0.42 },
      ].map((f, i) => (
        <mesh
          key={i}
          ref={(node) => {
            flames.current[i] = node;
          }}
          position={[0, f.y, 0]}
        >
          <coneGeometry args={[f.r, f.h, 8]} />
          <meshBasicMaterial color={f.c} toneMapped={false} transparent opacity={0.95} />
        </mesh>
      ))}
      {/* sparks */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          ref={(node) => {
            sparks.current[i] = node;
          }}
          position={[0, 0.6, 0]}
        >
          <sphereGeometry args={[0.025, 6, 4]} />
          <meshBasicMaterial color="#FFB13D" transparent opacity={0.9} toneMapped={false} />
        </mesh>
      ))}
      <pointLight
        ref={light}
        position={[0, 0.55, 0]}
        color="#FF8C42"
        intensity={3.2}
        distance={9}
        decay={1.7}
      />
    </group>
  );
}

export function LogSeat({ position = [0, 0, 0], rotation = [0, 0, 0] }: PlacedProps) {
  // radius 0.4 → seat top at +0.4 above the centre; place the centre at y=0.4
  // (in scene) so it rests on the ground and the seat meets the avatar's hips.
  return (
    <group position={position} rotation={[0, rotation[1], 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 1.35, 16]} />
        <meshStandardMaterial color="#7A5230" roughness={1} />
      </mesh>
      {/* bark end rings */}
      {[0.67, -0.67].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.405, 0.405, 0.04, 16]} />
          <meshStandardMaterial color="#C9A86B" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function Fireflies({
  position = [0, 0, 0],
  count = 8,
}: PlacedProps & { count?: number }) {
  const refs = useRef<(Sprite | null)[]>([]);
  const glow = useMemo(() => makeGlowTexture("216, 255, 122"), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        a: 0.4 + ((i * 13) % 7) / 9,
        b: 0.5 + ((i * 7) % 5) / 7,
        c: 0.35 + ((i * 17) % 6) / 10,
        phase: i * 1.7,
        rx: 1.6 + (i % 3),
        ry: 0.5 + ((i * 5) % 4) / 5,
        rz: 1 + (i % 2) * 0.8,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const n = scrollState.night;
    seeds.forEach((s, i) => {
      const sprite = refs.current[i];
      if (!sprite) return;
      sprite.position.set(
        Math.sin(t * s.a + s.phase) * s.rx,
        1 + Math.sin(t * s.b + s.phase * 2) * s.ry,
        Math.sin(t * s.c + s.phase) * s.rz
      );
      sprite.material.opacity =
        n * (0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.2 + s.phase * 3)));
    });
  });

  return (
    <group position={position}>
      {seeds.map((_, i) => (
        <sprite
          key={i}
          ref={(node) => {
            refs.current[i] = node;
          }}
          scale={[0.32, 0.32, 1]}
        >
          <spriteMaterial
            map={glow}
            transparent
            opacity={0}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Aurora                                                              */
/* ------------------------------------------------------------------ */

const RIBBONS = [
  { rgb: "110, 255, 190", y: 5.4, z: -13, phase: 0, speed: 0.55, opacity: 0.75 },
  { rgb: "120, 220, 255", y: 6.3, z: -14.5, phase: 2.1, speed: 0.4, opacity: 0.5 },
  { rgb: "190, 150, 255", y: 4.8, z: -12.5, phase: 4.2, speed: 0.7, opacity: 0.42 },
];

function AuroraRibbon({
  ribbon,
}: {
  ribbon: (typeof RIBBONS)[number];
}) {
  const mesh = useRef<Mesh>(null);
  const tex = useMemo(() => makeAuroraTexture(ribbon.rgb), [ribbon.rgb]);
  const geometry = useMemo(() => new PlaneGeometry(28, 6.5, 48, 6), []);
  const baseX = useMemo(() => {
    const arr = geometry.attributes.position.array as Float32Array;
    return Float32Array.from(arr);
  }, [geometry]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const n = scrollState.night;
    m.visible = n > 0.03;
    (m.material as MeshBasicMaterial).opacity = n * ribbon.opacity;
    if (!m.visible) return;
    const t = clock.elapsedTime * ribbon.speed + ribbon.phase;
    const pos = geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < pos.count; i++) {
      const x = baseX[i * 3];
      const y = baseX[i * 3 + 1];
      arr[i * 3 + 2] = Math.sin(x * 0.32 + t) * 1.15 + Math.sin(x * 0.13 - t * 0.6) * 0.6;
      arr[i * 3] = x + Math.sin(y * 0.5 + t * 0.4) * 0.35;
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, ribbon.y, ribbon.z]} visible={false}>
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0}
        side={DoubleSide}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

export function Aurora() {
  return (
    <group rotation={[0.08, 0, 0]}>
      {RIBBONS.map((r, i) => (
        <AuroraRibbon key={i} ribbon={r} />
      ))}
    </group>
  );
}
