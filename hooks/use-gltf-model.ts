"use client";

import { useEffect, useState } from "react";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Loads a GLB outside the R3F tree (plain effect, no suspense).
 * Suspending inside the Canvas breaks effect flushing with React 19's
 * reconciler, which silently kills every useFrame subscription — so the
 * model is fetched here in DOM-land and handed to the scene as a prop.
 */
export function useGltfModel(url: string): GLTF | null {
  const [gltf, setGltf] = useState<GLTF | null>(null);

  useEffect(() => {
    let alive = true;
    new GLTFLoader().load(url, (loaded) => {
      if (alive) setGltf(loaded);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  return gltf;
}
