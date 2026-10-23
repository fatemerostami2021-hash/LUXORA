import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Shared studio: renderer, soft image-based lighting, warm key light with soft shadows and a champagne rim light.
export interface Studio { renderer: THREE.WebGLRenderer; scene: THREE.Scene; key: THREE.DirectionalLight; dispose: () => void }

export function createStudio(host: HTMLElement, opts: { mobile: boolean; shadows: boolean }): Studio | null {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !opts.mobile, powerPreference: "high-performance" }); } catch { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = opts.shadows; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  const envTex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex; scene.environmentIntensity = 0.85;
  scene.add(new THREE.HemisphereLight("#fff4e2", "#caa98a", 0.35));
  const key = new THREE.DirectionalLight("#fff0da", 2.1); key.position.set(-4, 9, 7);
  key.castShadow = opts.shadows; key.shadow.mapSize.set(opts.mobile ? 512 : 1536, opts.mobile ? 512 : 1536);
  const sc = key.shadow.camera; sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -8; sc.near = 1; sc.far = 30;
  key.shadow.bias = -0.0004; key.shadow.radius = 5; key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#ffd9b0", 1.1); rim.position.set(6, 3, -6); scene.add(rim);

  return {
    renderer, scene, key,
    dispose: () => { envTex.dispose(); pm.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); },
  };
}
