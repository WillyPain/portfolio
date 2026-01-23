import { type AnimationLoopSubscriber } from "@/util/AnimationLoop";
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
    canvas.style.zIndex = "-1";
    this.canvas = new CSS3DObject(canvas);
    this.cssRoot.add(this.canvas);

    this.cssRoot.position.set(x, y, z);
    this.cssRoot.setRotationFromEuler(euler);
    this.cssRoot.scale.set(scale, scale, scale);

    const canvasRect = canvas.getBoundingClientRect();
    const geometry = new PlaneGeometry(canvasRect.width, canvasRect.height);
    const occlusionMaterial = new MeshPhongMaterial({
      color: "white",
      colorWrite: false,
      opacity: 0,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: AlwaysStencilFunc,
      stencilZPass: ReplaceStencilOp,
      side: DoubleSide,
    });
    const occulsionPlane = new Mesh(geometry, occlusionMaterial);
    occulsionPlane.renderOrder = 0;
    this.cssRoot.add(occulsionPlane);
  }

  init(scene: Scene | Object3D): void {
    scene.add(this.cssRoot);
  }

  update(_: number): void {}
}
