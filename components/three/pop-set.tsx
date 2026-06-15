"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import {
  easeOutBack,
  scrollState,
  setAmount,
  type ChapterWindow,
} from "@/lib/scroll";

interface PopSetProps {
  win: ChapterWindow;
  children: ReactNode;
  position?: [number, number, number];
}

/**
 * Pop-up-book scene wrapper: contents rise out of the ground with a playful
 * overshoot while their chapter scrolls into view, and sink away as it leaves.
 */
export function PopSet({ win, children, position = [0, 0, 0] }: PopSetProps) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const v = setAmount(scrollState.smooth, win);
    g.visible = v > 0.002;
    if (!g.visible) return;
    const s = Math.max(0.001, easeOutBack(v));
    g.scale.setScalar(s);
    g.position.set(position[0], position[1] - (1 - v) * 1.7, position[2]);
  });

  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  );
}
