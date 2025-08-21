import {
  AnimationLoop,
  type AnimationLoopSubscriber,
} from "@/util/AnimationLoop";
import {
  AlwaysStencilFunc,
  DoubleSide,
  Euler,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  ReplaceStencilOp,
  type Scene,
} from "three";
import { CSS3DObject } from "three/examples/jsm/Addons.js";

export class VirtualCanvas implements AnimationLoopSubscriber {
  root = new Object3D();
  cssRoot = new Object3D();
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

    new MeshPhongMaterial({});
    const material = new MeshPhongMaterial({
      color: "white",
      colorWrite: false,
      opacity: 0,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: AlwaysStencilFunc,
      stencilZPass: ReplaceStencilOp,
      side: DoubleSide,
    });

    // Create plane geometry
    const geometry = new PlaneGeometry(1.6, 1.4);

    // Create the GL plane mesh
    const mesh = new Mesh(geometry, material);
    mesh.renderOrder = 0;
    const scaleFactor = 1 / scale;
    mesh.scale.set(1 * scaleFactor, 1 * scaleFactor, 1 * scaleFactor);

    this.root.add(mesh);
    this.cssRoot.add(this.canvas);

    this.root.position.set(x, y, z);
    this.root.setRotationFromEuler(euler);
    this.root.scale.set(scale, scale, scale);

    this.cssRoot.position.set(x, y, z);
    this.cssRoot.setRotationFromEuler(euler);
    this.cssRoot.scale.set(scale, scale, scale);
  }

  init(scene: Scene): void {
    scene.add(this.root);
    AnimationLoop.Instance.cssScene.add(this.cssRoot);
  }

  update(delta: number): void {}

  cleanup(scene: Scene): void {}
}
