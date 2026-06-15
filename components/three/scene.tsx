"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Color, MathUtils } from "three";
import type {
  AmbientLight,
  DirectionalLight,
  Group,
  HemisphereLight,
} from "three";
import { EDUCATION } from "@/lib/site";
import {
  chapterLocalP,
  easeInOut,
  easeOutBack,
  lerp,
  range,
  scenePointer,
  scrollState,
  WIN,
} from "@/lib/scroll";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Avatar } from "./avatar";
import { PopSet } from "./pop-set";
import {
  Bush,
  Clouds,
  Hills,
  MapleLeaves,
  Pine,
  StarField,
  SunAndMoon,
} from "./nature";
import { Bear, Moose } from "./creatures";
import {
  Aurora,
  BookStack,
  Campfire,
  Canoe,
  Fireflies,
  GrainElevator,
  HayBale,
  Lake,
  Laptop,
  LogSeat,
  MountainRange,
  OrbitShapes,
  RippleRings,
  Signpost,
} from "./landmarks";

const HERO_LEAVES = {
  enter: 0,
  start: 0,
  end: WIN.education.start,
  exit: WIN.education.start + 0.1,
};

const CONFETTI = {
  enter: chapterLocalP("education", 0.7),
  start: chapterLocalP("education", 0.76),
  end: WIN.education.end,
  exit: WIN.education.exit,
};

/** Smooths scroll progress + drives camera parallax. Runs before everything. */
function Updater({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      scenePointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scenePointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    scrollState.smooth = MathUtils.damp(scrollState.smooth, scrollState.p, 7, dt);
    scrollState.night = range(
      scrollState.smooth,
      WIN.travel.end,
      WIN.newfoundland.start + 0.015
    );
    // On phones the tall aspect ratio sinks the ground-level campfire scene to the
    // very bottom edge. Ease the camera into a lower look-angle (and drop it a
    // touch) for the contact finale so the avatar-on-the-log rises into full view.
    const campfire = isMobile
      ? easeInOut(range(scrollState.smooth, WIN.newfoundland.end, WIN.contact.start))
      : 0;
    const lookY = lerp(0.25, -1.55, campfire);
    const baseY = lerp(1.65, 0.55, campfire);
    camera.position.x = MathUtils.damp(camera.position.x, scenePointer.x * 0.38, 4, dt);
    camera.position.y = MathUtils.damp(
      camera.position.y,
      baseY - scenePointer.y * 0.18,
      4,
      dt
    );
    camera.lookAt(0, lookY, 0);
  }, -1);

  return null;
}

const KEY_DAY = new Color("#FFF1D6");
const KEY_NIGHT = new Color("#A9C3FF");
const HEMI_SKY_DAY = new Color("#BFE8FF");
const HEMI_SKY_NIGHT = new Color("#2B4B8A");
const HEMI_GROUND_DAY = new Color("#79C76B");
const HEMI_GROUND_NIGHT = new Color("#1F4A41");
const FILL_DAY = new Color("#BFD9FF");
const FILL_NIGHT = new Color("#5F76B8");

function Lights() {
  const ambient = useRef<AmbientLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const key = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const tmp = useMemo(() => new Color(), []);

  useFrame(() => {
    const n = scrollState.night;
    if (ambient.current) ambient.current.intensity = MathUtils.lerp(0.55, 0.34, n);
    if (hemi.current) {
      hemi.current.intensity = MathUtils.lerp(0.85, 0.5, n);
      hemi.current.color.copy(tmp.copy(HEMI_SKY_DAY).lerp(HEMI_SKY_NIGHT, n));
      hemi.current.groundColor.copy(
        tmp.copy(HEMI_GROUND_DAY).lerp(HEMI_GROUND_NIGHT, n)
      );
    }
    if (key.current) {
      key.current.intensity = MathUtils.lerp(1.3, 0.55, n);
      key.current.color.copy(tmp.copy(KEY_DAY).lerp(KEY_NIGHT, n));
    }
    if (fill.current) {
      fill.current.intensity = MathUtils.lerp(0.38, 0.22, n);
      fill.current.color.copy(tmp.copy(FILL_DAY).lerp(FILL_NIGHT, n));
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.55} />
      <hemisphereLight ref={hemi} intensity={0.85} />
      <directionalLight ref={key} position={[4.5, 7, 4]} intensity={1.3} />
      <directionalLight ref={fill} position={[-5, 3, 2]} intensity={0.38} />
      <directionalLight position={[0, 4.5, -7]} intensity={0.55} color="#BFE2FF" />
    </>
  );
}

/** Signposts pop one-by-one in sync with the education cards. */
function EducationProps() {
  const postA = useRef<Group>(null);
  const postB = useRef<Group>(null);
  const postC = useRef<Group>(null);
  const popPs = useMemo(
    () => [0.14, 0.46, 0.78].map((f) => chapterLocalP("education", f)),
    []
  );

  useFrame(() => {
    const p = scrollState.smooth;
    [postA, postB, postC].forEach((ref, i) => {
      const g = ref.current;
      if (!g) return;
      const v = easeOutBack(range(p, popPs[i], popPs[i] + 0.045));
      g.visible = v > 0.002;
      g.scale.setScalar(Math.max(0.001, v));
    });
  });

  const stones = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6;
    return {
      x: -1.4 + t * 4.1,
      z: 1.15 - t * 1.4 + Math.sin(t * Math.PI) * 0.35,
      s: 0.16 + (i % 2) * 0.045,
    };
  });

  return (
    <group>
      {stones.map((s, i) => (
        <mesh key={i} position={[s.x, 0.02, s.z]}>
          <cylinderGeometry args={[s.s, s.s * 1.1, 0.05, 10]} />
          <meshStandardMaterial color="#C9A86B" roughness={1} />
        </mesh>
      ))}
      <group ref={postA} position={[0.45, 0, 0.6]} rotation={[0, -0.06, 0]} visible={false}>
        <Signpost label={EDUCATION[0].sign} />
      </group>
      <group ref={postB} position={[1.7, 0, 0.18]} rotation={[0, 0.08, 0]} visible={false}>
        <Signpost label={EDUCATION[1].sign} />
      </group>
      <group ref={postC} position={[2.9, 0, -0.3]} rotation={[0, -0.05, 0]} visible={false}>
        <Signpost label={EDUCATION[2].sign} />
      </group>
      <BookStack position={[-0.55, 0, 0.35]} scale={0.9} />
      <Bush position={[3.6, 0, 0.4]} scale={0.85} />
    </group>
  );
}

function SceneContent({ gltf }: { gltf: GLTF | null }) {
  const { size } = useThree();
  const isMobile = size.width < 640;
  const stageScale = isMobile ? 0.6 : size.width < 1024 ? 0.85 : 1;

  return (
    <>
      <Updater isMobile={isMobile} />
      <Lights />
      <group position={[0, -2.25, 0]} scale={stageScale}>
        <Hills />
        <SunAndMoon />
        <Clouds count={isMobile ? 4 : 6} />
        <StarField count={isMobile ? 240 : 420} />
        <Aurora />
        <MapleLeaves
          win={HERO_LEAVES}
          count={isMobile ? 10 : 16}
          center={[0, 2.6, -1.6]}
          area={[11, 6.5, 3]}
        />
        <MapleLeaves
          win={CONFETTI}
          count={isMobile ? 14 : 24}
          colors={["#E63946", "#FFD23F", "#58C24A", "#4D96FF", "#F77F00"]}
          area={[5, 5, 3]}
          center={[-1.3, 2.2, 0.8]}
        />

        {/* Chapter sets */}
        <PopSet win={WIN.hero}>
          <Pine position={[-3.8, 0, -2.2]} scale={1.35} />
          <Pine position={[3.9, 0, -2.8]} scale={1.55} />
          <Pine position={[3.0, 0, -1.3]} scale={0.95} />
          <Bush position={[-2.7, 0, -0.5]} />
          <Bush position={[2.5, 0, -0.2]} scale={0.85} />
          <Bush position={[-4.6, 0, -1.3]} scale={1.2} />
        </PopSet>

        <PopSet win={WIN.education}>
          <EducationProps />
          <Pine position={[-3.9, 0, -2.6]} scale={1.2} />
          <Bush position={[-3, 0, -0.8]} scale={0.9} />
        </PopSet>

        <PopSet win={WIN.craft}>
          <Laptop position={[1.8, 1.5, 0.3]} scale={1.15} />
          <OrbitShapes position={[0, 0, 1.35]} />
          <Sparkles
            count={isMobile ? 18 : 40}
            scale={[7, 3.5, 4]}
            position={[0, 1.8, 0.4]}
            size={4}
            speed={0.35}
            opacity={0.65}
            color="#FFE9A8"
          />
          <Bush position={[-3.2, 0, -0.6]} />
          <Bush position={[3.4, 0, -1]} scale={0.9} />
        </PopSet>

        <PopSet win={WIN.work}>
          <Laptop position={[2.15, 1.5, 0.55]} scale={1.05} />
          <Pine position={[-3.7, 0, -2.1]} scale={1.25} />
          <Pine position={[3.7, 0, -2.5]} scale={1.05} />
          <Bush position={[-3.1, 0, -0.5]} scale={0.95} />
          <Bush position={[3.0, 0, -0.4]} scale={0.85} />
        </PopSet>

        <PopSet win={WIN.travel}>
          <MountainRange />
          <Pine position={[-4.4, 0, -5.2]} scale={1.3} />
          <Pine position={[-3.2, 0, -5.8]} scale={1.6} />
          <Pine position={[3.6, 0, -5.4]} scale={1.45} />
          <Pine position={[4.8, 0, -4.6]} scale={1.1} />
          <Pine position={[-5.4, 0, -4.4]} scale={1.15} />
          <Pine position={[5.8, 0, -5.6]} scale={1.5} />
          <Lake position={[-1.6, 0.02, 1.5]} />
          <Canoe position={[-1.7, 0.42, 1.55]} rotation={[0, 0.5, 0]} />
          <RippleRings position={[-1.7, 0.05, 1.55]} />
          <Moose position={[2.5, 0, -1.4]} rotation={[0, -0.5, 0]} scale={1.1} />
          <Bear position={[3.8, 0, 0.55]} rotation={[0, -0.35, 0]} scale={0.95} />
        </PopSet>

        {/* "newfoundland" chapter id is now the Manitoba scene: prairie under
            the northern lights — grain elevator, hay bales and a lake. */}
        <PopSet win={WIN.newfoundland}>
          <Lake position={[-2.3, 0.02, -1.6]} scaleX={1.7} />
          <RippleRings position={[-2.3, 0.05, -1.4]} />
          <GrainElevator position={[2.7, 0, -2.6]} scale={1.05} />
          <HayBale position={[-0.5, 0, 1.4]} />
          <HayBale position={[0.7, 0, 0.9]} scale={0.85} />
          <HayBale position={[-1.8, 0, 0.5]} scale={0.92} />
          <Pine position={[-4.7, 0, -3]} scale={0.85} />
          <Pine position={[4.7, 0, -3.4]} scale={0.8} />
          <Bush position={[3.5, 0, 0.1]} scale={0.9} />
        </PopSet>

        <PopSet win={WIN.contact}>
          <Campfire position={[-0.45, 0, 1.6]} />
          <LogSeat position={[-1.7, 0.4, 1.42]} rotation={[0, 0.15, 0]} />
          <Moose position={[1.5, 0, 0.7]} rotation={[0, -1.9, 0]} scale={0.85} />
          <Fireflies position={[0, 0.4, 0.8]} count={isMobile ? 5 : 8} />
          <Pine position={[-3.6, 0, -1.8]} scale={1.25} />
          <Pine position={[3.3, 0, -2.3]} scale={1.05} />
          <Bush position={[2.7, 0, -0.5]} scale={0.9} />
        </PopSet>

        {gltf && <Avatar gltf={gltf} />}
      </group>
    </>
  );
}

export function Scene({ gltf }: { gltf: GLTF | null }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      <Canvas
        flat
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.65, 10.4], fov: 38, near: 0.1, far: 90 }}
      >
        <SceneContent gltf={gltf} />
      </Canvas>
    </div>
  );
}
