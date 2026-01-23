import {
  AnimationLoop,
  type AnimationLoopSubscriber,
} from "@/util/AnimationLoop";
import { type Scene, type Object3D, Euler, MathUtils, PointLight } from "three";
import { VirtualCanvas } from "./VirtualCanvas";
import { SceneTracker } from "@/util/SceneTracker";

export class Boombox implements AnimationLoopSubscriber {
  root?: Object3D;
  init(_: Scene): void {
    const iframe = document.getElementById("spotify-iframe");
    if (!iframe) return;

    const boombox = SceneTracker.Find("boombox")?.[0];
    let x = -2,
      y = 1,
      z = 6;
    let rotation = new Euler(0, 90 * MathUtils.DEG2RAD, 0);
    if (boombox) {
      x = boombox.position.x;
      y = boombox.position.y + 0.5;
      z = boombox.position.z;
      rotation = boombox.rotation;

      const css3dCanvas = new VirtualCanvas(iframe, x, y, z, rotation, 0.002);
      css3dCanvas.cssRoot.rotateY(90 * MathUtils.DEG2RAD);
      AnimationLoop.Subscribe(css3dCanvas);

      this.root = css3dCanvas.cssRoot;

      const spotty = new PointLight(0xffffff, 10, 1, 0.3);
      spotty.position.y += 50;
      spotty.position.z += 100;
      this.root.add(spotty);
    }
  }

  update(_: number | Object3D): void {}
}
