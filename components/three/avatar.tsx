"use client";

import { useEffect, useMemo, useRef } from "react";
import { createPortal, useFrame } from "@react-three/fiber";
import { AnimationMixer, MathUtils, MeshStandardMaterial, Quaternion, Vector3 } from "three";
import type { AnimationAction, Bone, Group, Object3D, SkinnedMesh } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  chapterLocalP,
  easeInOut,
  easeOutBounce,
  lerp,
  range,
  scenePointer,
  scrollState,
  WIN,
  type ChapterId,
} from "@/lib/scroll";
import { canoeBob } from "./landmarks";
import { BlobShadow } from "./nature";

type PoseName = "idle" | "paddle" | "sit";

const ORDER: ChapterId[] = [
  "hero",
  "education",
  "craft",
  "work",
  "travel",
  "newfoundland",
  "contact",
];

/** Where the avatar stands during each chapter (stage-local units). */
const MARKS: Record<ChapterId, [number, number, number]> = {
  hero: [0, 0, 0.7],
  education: [-2.05, 0, 0.9],
  craft: [0, 0, 1.35],
  work: [2.1, 0, 0.7],
  travel: [-1.7, 0.3, 1.55],
  newfoundland: [1.2, 0, 0.7],
  contact: [-1.7, 0.28, 1.42],
};

const YAWS: Record<ChapterId, number> = {
  hero: 0,
  education: 0.45,
  craft: 0,
  work: -0.3,
  // Seat the paddler facing ALONG the canoe's long axis, not across it. The canoe
  // sits at yaw 0.5 with its length on local X; the avatar's forward is local Z,
  // so it must face (canoe yaw − 90°) or the legs extend over the side into the water.
  travel: 0.5 - Math.PI / 2,
  newfoundland: -0.15,
  contact: 0.6,
};

/* Standing chapters lean entirely on the natural full-body idle clip; only the
   canoe and campfire need a custom (seated) pose the idle can't provide. */
const POSES: Record<ChapterId, PoseName> = {
  hero: "idle",
  education: "idle",
  craft: "idle",
  work: "idle",
  travel: "paddle",
  newfoundland: "idle",
  contact: "sit",
};

/**
 * Absolute stage-local root height for seated poses (measured so hips meet the
 * canoe rim / log top and feet reach the ground). Standing poses use the mark Y.
 */
const SEAT_ROOT_Y: Partial<Record<PoseName, number>> = {
  paddle: -0.72,
  sit: -0.48,
};

const GRAD_IN_START = chapterLocalP("education", 0.72);
const GRAD_IN_END = chapterLocalP("education", 0.8);

/**
 * Pose deltas layered on top of the idle clip. Named by visible effect, applied
 * as quaternion rotations about the CHARACTER's world axes (see apply block) so
 * a bone's own skewed/mirrored local frame never matters — works for any
 * humanoid GLB, and keeps the two legs symmetric.
 * armFwd/hipFwd > 0 swing the limb forward; armOut > 0 raises it to that side;
 * foreBend/kneeBend > 0 fold the joint.
 */
interface PoseOffsets {
  armFwdL: number;
  armFwdR: number;
  armOutL: number;
  armOutR: number;
  foreBendL: number;
  foreBendR: number;
  hipFwdL: number;
  hipFwdR: number;
  adductL: number; // bring the knees together (frontal-plane swing)
  adductR: number;
  kneeBendL: number;
  kneeBendR: number;
  ankleL: number;
  ankleR: number;
  chestTwist: number;
}

const ZERO_OFFSETS: PoseOffsets = {
  armFwdL: 0,
  armFwdR: 0,
  armOutL: 0,
  armOutR: 0,
  foreBendL: 0,
  foreBendR: 0,
  hipFwdL: 0,
  hipFwdR: 0,
  adductL: 0,
  adductR: 0,
  kneeBendL: 0,
  kneeBendR: 0,
  ankleL: 0,
  ankleR: 0,
  chestTwist: 0,
};

const CHAR_X = new Vector3(1, 0, 0); // character left/right (sagittal swing / hinge)
const CHAR_Y = new Vector3(0, 1, 0); // character up (twist)
const CHAR_Z = new Vector3(0, 0, 1); // character forward (frontal raise / adduct)
const qRoot = new Quaternion();
const qParent = new Quaternion();
const qDelta = new Quaternion();
const qLocal = new Quaternion();
const vAxis = new Vector3();

/**
 * Rotate a bone by `angle` about one of the CHARACTER's world axes, on top of
 * whatever the idle clip wrote this frame. Because the axis is the character's
 * (not the bone's own), left/right limbs move identically in world space even
 * when their bind frames are mirrored — which is exactly what keeps both legs
 * inside the canoe instead of one splaying out into the water.
 */
function rotateBoneAboutCharAxis(bone: Bone | null, axis: Vector3, angle: number) {
  if (!bone || !bone.parent || Math.abs(angle) < 1e-4) return;
  vAxis.copy(axis).applyQuaternion(qRoot);
  qDelta.setFromAxisAngle(vAxis, angle);
  bone.parent.getWorldQuaternion(qParent);
  qLocal.copy(qParent).invert().multiply(qDelta).multiply(qParent);
  bone.quaternion.premultiply(qLocal);
}

export function Avatar({ gltf }: { gltf: GLTF }) {
  const root = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const shadow = useRef<Group>(null);
  const headWrap = useRef<Group>(null);
  const wristWrap = useRef<Group>(null);
  const gradCap = useRef<Group>(null);
  const paddle = useRef<Group>(null);
  const stick = useRef<Group>(null);
  const offsets = useRef<PoseOffsets>({ ...ZERO_OFFSETS });
  const headTrack = useRef({ yaw: 0, pitch: 0 });

  const scene = gltf.scene;
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const actions = useMemo(() => {
    const map: Record<string, AnimationAction> = {};
    gltf.animations.forEach((clip) => {
      map[clip.name] = mixer.clipAction(clip);
    });
    return map;
  }, [gltf, mixer]);

  const darkMat = useMemo(
    () => new MeshStandardMaterial({ color: "#20242E", roughness: 0.8 }),
    []
  );
  const goldMat = useMemo(
    () => new MeshStandardMaterial({ color: "#FFD23F", roughness: 0.6 }),
    []
  );

  const bones = useMemo(() => {
    // Tolerate Mixamo/Avaturn names, Quaternius dotted names, and GLTFLoader's
    // sanitized variants ("Wrist.R" → "WristR"). First match wins.
    const find = (...names: string[]): Bone | null => {
      for (const n of names) {
        const hit =
          (scene.getObjectByName(n) as Bone | undefined) ??
          (scene.getObjectByName(n.replace(/[^A-Za-z0-9_]/g, "")) as Bone | undefined);
        if (hit) return hit;
      }
      return null;
    };
    return {
      head: find("Head"),
      neck: find("Neck"),
      chest: find("Spine2", "Spine1", "Spine", "Chest"),
      upperArmL: find("LeftArm", "UpperArm.L"),
      upperArmR: find("RightArm", "UpperArm.R"),
      lowerArmL: find("LeftForeArm", "LowerArm.L"),
      lowerArmR: find("RightForeArm", "LowerArm.R"),
      wristR: find("RightHand", "Wrist.R"),
      upperLegL: find("LeftUpLeg", "UpperLeg.L"),
      upperLegR: find("RightUpLeg", "UpperLeg.R"),
      lowerLegL: find("LeftLeg", "LowerLeg.L"),
      lowerLegR: find("RightLeg", "LowerLeg.R"),
      footL: find("LeftFoot", "Foot.L"),
      footR: find("RightFoot", "Foot.R"),
    };
  }, [scene]);

  /* one-time setup: keep skinned meshes from being culled mid-animation */
  useEffect(() => {
    scene.traverse((obj: Object3D) => {
      const mesh = obj as SkinnedMesh;
      if (mesh.isSkinnedMesh) mesh.frustumCulled = false;
    });
  }, [scene]);

  /* play the idle clip as the always-on base layer */
  useEffect(() => {
    const first = gltf.animations[0];
    const action = first && actions[first.name];
    if (!action) return;
    action.reset().fadeIn(0.4).play();
    return () => {
      action.fadeOut(0.2);
    };
  }, [gltf, actions]);

  useFrame(({ clock }, dt) => {
    mixer.update(dt);
    const r = root.current;
    if (!r) return;
    const p = scrollState.smooth;
    const t = clock.elapsedTime;

    /* ----- which chapter / transition hop ----- */
    let idx = ORDER.findIndex((id) => p < WIN[id].exit);
    if (idx === -1) idx = ORDER.length - 1;
    const id = ORDER[idx];
    const w = WIN[id];
    let target = MARKS[id];
    let yaw = YAWS[id];
    let pose: PoseName = POSES[id];
    let hop = 0;

    if (idx < ORDER.length - 1 && p > w.end) {
      const tt = range(p, w.end, w.exit);
      const e = easeInOut(tt);
      const nextId = ORDER[idx + 1];
      const a = MARKS[id];
      const b = MARKS[nextId];
      target = [lerp(a[0], b[0], e), lerp(a[1], b[1], e), lerp(a[2], b[2], e)];
      hop = Math.sin(Math.PI * tt) * 0.35; // light hop-step (hides foot slide)
      const arc = Math.sin(Math.PI * tt);
      const dirYaw = MathUtils.clamp(Math.atan2(b[0] - a[0], b[2] - a[2]), -1.25, 1.25);
      yaw = lerp(tt < 0.5 ? YAWS[id] : YAWS[nextId], dirYaw * 0.55, arc * 0.8);
      if (tt > 0.5) pose = POSES[nextId];
    }

    /* ----- root transform ----- */
    const extraY = pose === "paddle" ? canoeBob(t) : 0;
    const seatY = SEAT_ROOT_Y[pose];
    const yTarget = (seatY ?? target[1]) + hop + extraY;
    r.position.x = MathUtils.damp(r.position.x, target[0], 8, dt);
    r.position.y = MathUtils.damp(r.position.y, yTarget, 10, dt);
    r.position.z = MathUtils.damp(r.position.z, target[2], 8, dt);
    r.rotation.y = MathUtils.damp(r.rotation.y, yaw, 6, dt);

    /* ----- procedural pose layered over the idle clip (seated only) ----- */
    const o = offsets.current;
    const targets = { ...ZERO_OFFSETS };
    if (pose === "paddle") {
      const s = Math.sin(t * 1.5); // slow, easy stroke
      // knees together & forward so both legs stay inside the narrow hull
      targets.hipFwdL = 1.45;
      targets.hipFwdR = 1.45;
      targets.adductL = -0.18;
      targets.adductR = 0.18;
      targets.kneeBendL = 1.5;
      targets.kneeBendR = 1.5;
      targets.ankleL = 0.3;
      targets.ankleR = 0.3;
      targets.armFwdL = 0.95 + s * 0.16;
      targets.armFwdR = 0.95 - s * 0.16;
      targets.foreBendL = 0.6;
      targets.foreBendR = 0.6;
      targets.chestTwist = s * 0.08;
    } else if (pose === "sit") {
      targets.hipFwdL = 1.4;
      targets.hipFwdR = 1.4;
      targets.adductL = -0.1;
      targets.adductR = 0.1;
      targets.kneeBendL = 1.4;
      targets.kneeBendR = 1.4;
      targets.ankleL = 0.25;
      targets.ankleR = 0.25;
      targets.armFwdL = 0.22;
      targets.foreBendL = 0.4;
      targets.armFwdR = 0.5; // right hand forward holding the stick
      targets.foreBendR = 0.75;
    }
    // ease seated poses in/out a touch slower than a snap for a settled feel
    (Object.keys(o) as (keyof PoseOffsets)[]).forEach((k) => {
      o[k] = MathUtils.damp(o[k], targets[k], 6, dt);
    });

    /* ----- head tracking toward the pointer ----- */
    const ht = headTrack.current;
    const trackable = pose !== "paddle";
    ht.yaw = MathUtils.damp(
      ht.yaw,
      trackable ? MathUtils.clamp(scenePointer.x * 0.55 - r.rotation.y * 0.4, -0.65, 0.65) : 0,
      6,
      dt
    );
    ht.pitch = MathUtils.damp(
      ht.pitch,
      trackable ? MathUtils.clamp(scenePointer.y * 0.3, -0.35, 0.35) : 0,
      6,
      dt
    );

    /* apply pose deltas after the mixer has written this frame, all about the
       CHARACTER's world axes. -fwd about CHAR_X swings a limb toward +Z (camera);
       a sign-mirrored turn about CHAR_Z brings the knees together; +bend about
       CHAR_X folds a joint downward. */
    r.getWorldQuaternion(qRoot);
    rotateBoneAboutCharAxis(bones.upperArmL, CHAR_X, -o.armFwdL);
    rotateBoneAboutCharAxis(bones.upperArmL, CHAR_Z, o.armOutL);
    rotateBoneAboutCharAxis(bones.upperArmR, CHAR_X, -o.armFwdR);
    rotateBoneAboutCharAxis(bones.upperArmR, CHAR_Z, o.armOutR);
    rotateBoneAboutCharAxis(bones.lowerArmL, CHAR_X, -o.foreBendL);
    rotateBoneAboutCharAxis(bones.lowerArmR, CHAR_X, -o.foreBendR);
    // legs: adduct first (knees toward centre while the thigh still hangs down),
    // then flex the hip forward, then fold the knee and tip the foot — every step
    // about a character axis so the left and right legs stay mirror-identical.
    rotateBoneAboutCharAxis(bones.upperLegL, CHAR_Z, o.adductL);
    rotateBoneAboutCharAxis(bones.upperLegL, CHAR_X, -o.hipFwdL);
    rotateBoneAboutCharAxis(bones.upperLegR, CHAR_Z, o.adductR);
    rotateBoneAboutCharAxis(bones.upperLegR, CHAR_X, -o.hipFwdR);
    rotateBoneAboutCharAxis(bones.lowerLegL, CHAR_X, o.kneeBendL);
    rotateBoneAboutCharAxis(bones.lowerLegR, CHAR_X, o.kneeBendR);
    rotateBoneAboutCharAxis(bones.footL, CHAR_X, o.ankleL);
    rotateBoneAboutCharAxis(bones.footR, CHAR_X, o.ankleR);
    rotateBoneAboutCharAxis(bones.chest, CHAR_Y, o.chestTwist);
    if (bones.head) {
      bones.head.rotation.y += ht.yaw;
      bones.head.rotation.x += ht.pitch;
    }

    /* ----- graduation cap drop ----- */
    if (gradCap.current) {
      const gIn = easeOutBounce(range(p, GRAD_IN_START, GRAD_IN_END));
      const gOut =
        1 - range(p, WIN.education.end, (WIN.education.end + WIN.education.exit) / 2);
      const visible = gIn > 0.01 && gOut > 0.01;
      gradCap.current.visible = visible;
      if (visible) {
        gradCap.current.position.y = 0.24 + (1 - gIn) * 3.2;
        gradCap.current.rotation.z = (1 - gIn) * 0.5 - 0.06;
        gradCap.current.scale.setScalar(Math.max(0.001, gOut));
      }
    }

    /* ----- props & shadow ----- */
    if (paddle.current) {
      paddle.current.visible = pose === "paddle";
      if (pose === "paddle") {
        // gentle stroke around the resting tilt set in JSX
        paddle.current.rotation.x = 0.3 + Math.sin(t * 1.5) * 0.16;
        paddle.current.rotation.z = -0.82;
      }
    }
    if (stick.current) stick.current.visible = pose === "sit";
    if (shadow.current) {
      // keep the blob on the ground plane (stage-local y = 0) under the avatar,
      // and fade it away while seated (it would float on the lake / under the log)
      shadow.current.position.y = -r.position.y;
      const seated = pose === "paddle" || pose === "sit";
      const sc = seated ? 0.001 : Math.max(0.55, 1 - hop * 0.3);
      shadow.current.scale.setScalar(sc);
    }
  });

  return (
    <group ref={root} position={[0, 0, 0.7]}>
      <group ref={shadow}>
        <BlobShadow radius={0.68} />
      </group>

      <group ref={inner} scale={1.3}>
        <primitive object={scene} />
      </group>

      {/* worn items live inside the Head bone so they follow every animation.
          Authored in head-local units (Avaturn head radius ≈ 0.1). */}
      {bones.head &&
        createPortal(
          <group ref={headWrap} position={[0, 0.06, 0.012]}>
            {/* graduation cap (drops in at the M.Sc. moment) */}
            <group ref={gradCap} position={[0, 0.16, 0]} visible={false}>
              <mesh position={[0, -0.03, 0]} material={darkMat}>
                <cylinderGeometry args={[0.075, 0.085, 0.065, 14]} />
              </mesh>
              <mesh rotation={[0, Math.PI / 4, 0]} material={darkMat}>
                <boxGeometry args={[0.26, 0.015, 0.26]} />
              </mesh>
              <mesh position={[0, 0.015, 0]} material={goldMat}>
                <sphereGeometry args={[0.013, 10, 8]} />
              </mesh>
              <group rotation={[0, Math.PI / 4, 0]}>
                <mesh position={[0.12, -0.045, 0.12]} material={goldMat}>
                  <cylinderGeometry args={[0.004, 0.004, 0.09, 6]} />
                </mesh>
                <mesh position={[0.12, -0.095, 0.12]} material={goldMat}>
                  <sphereGeometry args={[0.014, 10, 8]} />
                </mesh>
              </group>
            </group>
          </group>,
          bones.head!
        )}

      {/* canoe paddle — anchored to the body (not the hand bone, whose frame
          made it point wrong) so it reliably hangs blade-down into the water,
          gripped by the forward hands. */}
      <group ref={paddle} position={[-0.02, 1.52, 0.44]} rotation={[0.3, 0, -0.82]} visible={false}>
        {/* grip knob at the top, in the hands */}
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshStandardMaterial color="#8A5A33" roughness={0.9} />
        </mesh>
        {/* shaft running from the hands down past the gunwale to the water */}
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 1.15, 10]} />
          <meshStandardMaterial color="#B07B4F" roughness={0.9} />
        </mesh>
        {/* blade at the bottom (dips into the water beside the boat) */}
        <mesh position={[0, -1.08, 0]} scale={[0.62, 1, 0.16]}>
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshStandardMaterial color="#E8923A" roughness={0.8} />
        </mesh>
      </group>

      {/* marshmallow stick lives in the right hand for the campfire scene */}
      {bones.wristR &&
        createPortal(
          <group ref={wristWrap}>
            <group ref={stick} rotation={[0.45, 0, 0]} visible={false}>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.17]}>
                <cylinderGeometry args={[0.007, 0.007, 0.36, 8]} />
                <meshStandardMaterial color="#8A5A33" roughness={1} />
              </mesh>
              <mesh position={[0, 0, 0.36]}>
                <capsuleGeometry args={[0.02, 0.026, 6, 10]} />
                <meshStandardMaterial color="#FFF6E5" roughness={0.95} />
              </mesh>
            </group>
          </group>,
          bones.wristR!
        )}
    </group>
  );
}
