import type { SceneThing } from "@/util/AnimationLoop";
import {
  DoubleSide,
  Euler,
  Mesh,
  MeshLambertMaterial,
  NoBlending,
  Object3D,
  PlaneGeometry,
  type Scene,
} from "three";
import { CSS3DObject } from "three/examples/jsm/Addons.js";

export class VirtualCanvas implements SceneThing {
  root = new Object3D();
  canvas: CSS3DObject;
  constructor(
    canvas: HTMLElement,
    x = 0,
    y = 0,
    z = 0,
    euler = new Euler(),
    scale = 1
  ) {
    console.log(canvas);
    canvas.style.zIndex = "-1";
    this.canvas = new CSS3DObject(canvas);

    // Create GL plane
    const material = new MeshLambertMaterial({
      color: 0x000000,
      opacity: 0,
      transparent: true,
      side: DoubleSide,
      blending: NoBlending,
      depthTest: true,
      depthWrite: true,
    });

    // Create plane geometry
    const geometry = new PlaneGeometry(1.2, 1);

    // Create the GL plane mesh
    const mesh = new Mesh(geometry, material);
    const scaleFactor = 1 / scale;
    mesh.scale.set(1 * scaleFactor, 1 * scaleFactor, 1 * scaleFactor);

    this.root.add(mesh);
    this.root.add(this.canvas);

    this.root.position.set(x, y, z);
    this.root.setRotationFromEuler(euler);
    this.root.scale.set(scale, scale, scale);
  }

  init(scene: Scene): void {
    scene.add(this.root);
  }

  update(delta: number): void {}

  cleanup(scene: Scene): void {}
}
