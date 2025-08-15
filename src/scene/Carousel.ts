import type { SceneThing } from "@/util/AnimationLoop";
import { MathUtils, Object3D, type Scene } from "three";
import { Css2DScrambleTag } from "./Css2DScrambleTag";
import { CSS2DObject, CSS3DObject } from "three/examples/jsm/Addons.js";

export class Carousel implements SceneThing {
  root: Object3D;
  horses: Object3D[];
  elements: HTMLElement[];
  size: number;
  radius: number;
  speed: number;
  constructor(elements: HTMLElement[], radius = 1, speed = 1) {
    this.root = new Object3D();
    this.root.position.setY(0.5);
    this.horses = [];
    this.elements = elements;
    this.size = elements.length;
    this.radius = radius;
    this.speed = speed;
  }

  init(scene: Scene): void {
    //configure horses evenly around circle
    const rotationStep = MathUtils.DEG2RAD * (360 / this.size);

    let ii = 0;
    for (const element of this.elements) {
      const horse = new Object3D();
      // Position horse around circle
      const angle = ii * rotationStep;
      horse.position.set(
        Math.cos(angle) * this.radius,
        Math.sin(angle) * this.radius,
        0
      );
      this.horses.push(horse);

      // new Css2DScrambleTag(horse, "h:" + ii);

      horse.add(new CSS2DObject(element));

      this.root.add(horse);
      this.root.rotateX(MathUtils.DEG2RAD * -88);
      ii++;
    }
    // new Css2DScrambleTag(this.root, "helllooooooo");
    scene.add(this.root);
  }

  update(delta: number): void {
    // implement rotation logic here
    this.root.rotateZ(delta * this.speed);
  }

  cleanup(scene: Scene): void {
    scene.remove(this.root);
  }
}
