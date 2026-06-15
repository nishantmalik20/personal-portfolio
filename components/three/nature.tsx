"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  ExtrudeGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  Points,
  PointsMaterial,
} from "three";
import type { Group } from "three";
import { mapleShape } from "@/lib/maple";
import {
  makeBlobTexture,
  makeCrescentTexture,
  makeGlowTexture,
} from "@/lib/textures";
import {
  easeInOut,
  lerp,
  range,
  scrollState,
  setAmount,
  WIN,
  type ChapterWindow,
} from "@/lib/scroll";

/* ------------------------------------------------------------------ */
/* Ground & hills                                                      */
/* ------------------------------------------------------------------ */

const DAY_GROUND = new Color("#5BC14D");
const NIGHT_GROUND = new Color("#1F4A41");
const DAY_HILL_A = new Color("#7DD181");
const NIGHT_HILL_A = new Color("#27566B");
const DAY_HILL_B = new Color("#9BE3A0");
const NIGHT_HILL_B = new Color("#2E5F7A");

export function Hills() {
  const ground = useRef<MeshStandardMaterial>(null);
  const hillA = useRef<MeshStandardMaterial>(null);
  const hillB = useRef<MeshStandardMaterial>(null);
  const tmp = useMemo(() => new Color(), []);

  useFrame(() => {
    const n = scrollState.night;
    if (ground.current)
      ground.current.color.copy(tmp.copy(DAY_GROUND).lerp(NIGHT_GROUND, n));
    if (hillA.current)
      hillA.current.color.copy(tmp.copy(DAY_HILL_A).lerp(NIGHT_HILL_A, n));
    if (hillB.current)
      hillB.current.color.copy(tmp.copy(DAY_HILL_B).lerp(NIGHT_HILL_B, n));
  });

  return (
    <group>
      {/* main rolling ground — a giant squashed sphere so the horizon curves */}
      <mesh position={[0, -2.42, -1]} scale={[1.9, 0.12, 1.35]}>
        <sphereGeometry args={[20, 48, 24]} />
        <meshStandardMaterial ref={ground} color={DAY_GROUND} roughness={1} />
      </mesh>
      {/* distant hills */}
      <mesh position={[-7.5, -0.8, -11]} scale={[7.5, 2.4, 3.5]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial ref={hillA} color={DAY_HILL_A} roughness={1} />
      </mesh>
      <mesh position={[8, -1, -13]} scale={[9, 2.8, 4]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial ref={hillB} color={DAY_HILL_B} roughness={1} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Trees, mountains, bushes                                            */
/* ------------------------------------------------------------------ */

interface PlacedProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function Pine({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.45, 8]} />
        <meshStandardMaterial color="#6B4226" roughness={1} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <coneGeometry args={[0.62, 0.85, 9]} />
        <meshStandardMaterial color="#2F9E44" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <coneGeometry args={[0.48, 0.75, 9]} />
        <meshStandardMaterial color="#37B24D" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.33, 0.62, 9]} />
        <meshStandardMaterial color="#51CF66" roughness={0.95} />
      </mesh>
    </group>
  );
}

export function Bush({ position = [0, 0, 0], scale = 1 }: PlacedProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshStandardMaterial color="#3DA35D" roughness={1} />
      </mesh>
      <mesh position={[0.28, 0.14, 0.05]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color="#57CC74" roughness={1} />
      </mesh>
      <mesh position={[-0.26, 0.12, -0.02]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color="#2F9E44" roughness={1} />
      </mesh>
    </group>
  );
}

export function Mountain({
  position = [0, 0, 0],
  scale = 1,
  rock = "#8DA3C2",
}: PlacedProps & { rock?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[2.1, 3.2, 6]} />
        <meshStandardMaterial color={rock} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 2.74, 0]}>
        <coneGeometry args={[0.92, 1.15, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Clouds                                                              */
/* ------------------------------------------------------------------ */

const CLOUD_DAY = new Color("#FFFFFF");
const CLOUD_NIGHT = new Color("#93A9D8");

function CloudPuff({ scale = 1 }: { scale?: number }) {
  const mat = useRef<MeshStandardMaterial>(null);
  const tmp = useMemo(() => new Color(), []);
  useFrame(() => {
    if (!mat.current) return;
    mat.current.color.copy(
      tmp.copy(CLOUD_DAY).lerp(CLOUD_NIGHT, scrollState.night)
    );
    mat.current.opacity = lerp(0.96, 0.55, scrollState.night);
  });
  return (
    <group scale={[scale, scale * 0.78, scale]}>
      {[
        [0, 0, 0, 0.85],
        [0.8, -0.12, 0.1, 0.6],
        [-0.78, -0.08, -0.05, 0.66],
        [0.25, 0.42, -0.08, 0.55],
        [-0.3, 0.34, 0.06, 0.5],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 18, 14]} />
          <meshStandardMaterial
            ref={i === 0 ? mat : undefined}
            color="#FFFFFF"
            roughness={1}
            transparent
            emissive="#FFFFFF"
            emissiveIntensity={0.18}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Clouds({ count = 6 }: { count?: number }) {
  const ref = useRef<Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: -15 + (i * 31) / count + ((i * 7.3) % 3),
        y: 4.6 + ((i * 37) % 27) / 9,
        z: -9.5 - (i % 3) * 2.2,
        s: 0.75 + ((i * 53) % 40) / 50,
        speed: 0.12 + ((i * 29) % 20) / 130,
      })),
    [count]
  );

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.children.forEach((cloud, i) => {
      cloud.position.x += seeds[i].speed * dt;
      if (cloud.position.x > 17) cloud.position.x = -17;
    });
  });

  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <group key={i} position={[s.x, s.y, s.z]}>
          <CloudPuff scale={s.s} />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Sun & moon                                                          */
/* ------------------------------------------------------------------ */

export function SunAndMoon() {
  const sun = useRef<Group>(null);
  const moon = useRef<Group>(null);
  const sunGlow = useMemo(() => makeGlowTexture("255, 214, 90"), []);
  const moonGlow = useMemo(() => makeGlowTexture("190, 214, 255"), []);
  const crescent = useMemo(() => makeCrescentTexture(), []);

  useFrame(() => {
    const p = scrollState.smooth;
    const sunset = easeInOut(range(p, WIN.travel.start, WIN.travel.end));
    const night = scrollState.night;
    if (sun.current) {
      sun.current.position.set(5.4, lerp(5.7, -2.4, sunset), -13);
      const warm = range(p, WIN.education.end, WIN.craft.start);
      const scale = lerp(1, 1.45, warm);
      sun.current.scale.setScalar(scale);
      sun.current.visible = night < 0.98;
    }
    if (moon.current) {
      moon.current.position.set(-4.6, lerp(-2.4, 4.6, easeInOut(night)), -12.5);
      moon.current.visible = night > 0.02;
    }
  });

  return (
    <>
      <group ref={sun}>
        <mesh>
          <sphereGeometry args={[1.05, 24, 18]} />
          <meshBasicMaterial color="#FFD23F" />
        </mesh>
        <sprite scale={[6.5, 6.5, 1]}>
          <spriteMaterial
            map={sunGlow}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </sprite>
      </group>
      <group ref={moon} visible={false}>
        <mesh>
          <planeGeometry args={[2.1, 2.1]} />
          <meshBasicMaterial
            map={crescent}
            transparent
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
        <sprite scale={[5.5, 5.5, 1]}>
          <spriteMaterial
            map={moonGlow}
            transparent
            opacity={0.6}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </sprite>
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Stars                                                               */
/* ------------------------------------------------------------------ */

export function StarField({ count = 420 }: { count?: number }) {
  const points = useRef<Points>(null);
  const mat = useRef<PointsMaterial>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    let seed = 13;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = rand() * Math.PI * 0.42;
      const r = 42 + rand() * 14;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = 4 + r * Math.cos(phi) * 0.55;
      const z = -10 - Math.abs(r * Math.sin(phi) * Math.sin(theta)) * 0.7;
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [count]);

  useFrame(() => {
    const n = scrollState.night;
    if (points.current) points.current.visible = n > 0.03;
    if (mat.current) mat.current.opacity = n * 0.95;
  });

  return (
    <points ref={points} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.21}
        sizeAttenuation
        color="#FFF6D8"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Falling maple leaves (instanced)                                    */
/* ------------------------------------------------------------------ */

interface MapleLeavesProps {
  win: ChapterWindow;
  count?: number;
  colors?: string[];
  area?: [number, number, number];
  center?: [number, number, number];
}

export function MapleLeaves({
  win,
  count = 16,
  colors = ["#E63946", "#F77F00", "#FFB703"],
  area = [11, 6.5, 5],
  center = [0, 2.6, 0],
}: MapleLeavesProps) {
  const mesh = useRef<InstancedMesh>(null);
  const mat = useRef<MeshStandardMaterial>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const geometry = useMemo(() => {
    const g = new ExtrudeGeometry(mapleShape(0.2), {
      depth: 0.02,
      bevelEnabled: false,
    });
    g.center();
    return g;
  }, []);

  const seeds = useMemo(() => {
    let seed = 29;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * area[0],
      z: (rand() - 0.5) * area[2],
      speed: 0.35 + rand() * 0.5,
      phase: rand() * 40,
      sway: 0.7 + rand() * 0.9,
      spin: 0.6 + rand() * 1.6,
      scale: 0.75 + rand() * 0.8,
      color: new Color(colors[Math.floor(rand() * colors.length)]),
    }));
  }, [count, area, colors]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const vis = setAmount(scrollState.smooth, win);
    m.visible = vis > 0.01;
    if (mat.current) mat.current.opacity = vis;
    if (!m.visible) return;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const cycle = (t * s.speed + s.phase) % 1.6;
      const fall = cycle / 1.6;
      dummy.position.set(
        center[0] + s.x + Math.sin(t * s.sway + s.phase) * 1.1,
        center[1] + area[1] / 2 - fall * area[1],
        center[2] + s.z
      );
      dummy.rotation.set(
        Math.sin(t * s.sway + s.phase) * 0.55,
        Math.sin(t * 0.6 + s.phase) * 0.45,
        t * s.spin + s.phase
      );
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={(node) => {
        mesh.current = node;
        if (node) {
          seeds.forEach((s, i) => node.setColorAt(i, s.color));
          if (node.instanceColor) node.instanceColor.needsUpdate = true;
        }
      }}
      args={[geometry, undefined, count]}
      visible={false}
    >
      <meshStandardMaterial
        ref={mat}
        roughness={0.9}
        transparent
        side={DoubleSide}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Blob shadow                                                         */
/* ------------------------------------------------------------------ */

export function BlobShadow({
  radius = 0.7,
  position = [0, 0.02, 0],
  opacity = 1,
}: {
  radius?: number;
  position?: [number, number, number];
  opacity?: number;
}) {
  const tex = useMemo(() => makeBlobTexture(), []);
  return (
    <mesh rotation-x={-Math.PI / 2} position={position}>
      <circleGeometry args={[radius, 24]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

