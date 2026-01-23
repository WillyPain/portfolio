import {
  AnimationLoop,
  type AnimationLoopSubscriber,
} from "@/util/AnimationLoop";
import { Object3D, Vector3, type Scene } from "three";
import { SceneTracker } from "@/util/SceneTracker";
import { Monitor } from "./Monitor";
import { type CameraBehaviour } from "@/util/CameraController";

export class MonitorBuilder
  implements AnimationLoopSubscriber, CameraBehaviour
{
  monitor?: Monitor;
  root = new Object3D();
  iframeId: string;
  constructor(iframeId: string) {
    this.iframeId = iframeId;
  }

  cameraPos = new Vector3();

  init(_: Scene): void {
    const screenLayers = SceneTracker.Find(this.iframeId)?.[0];
    if (!screenLayers) {
      console.log(`No screen layers for ${this.iframeId}`);
    }
    this.monitor = new Monitor(screenLayers!, this.iframeId);

    AnimationLoop.Subscribe(this.monitor);

    this.cameraPos
      .copy(this.monitor.screenLayers!.position)
      .addScaledVector(this.monitor.screenNormal, 0.3);
  }

  updateCamera(cameraMount: Object3D, delta: number): void {
    // lerp camera to camPos and camRotation
    const tempy = new Object3D();
    tempy.position.copy(cameraMount.position);
    tempy.lookAt(this.monitor!.screenLayers!.position);

    const interpolationSpeed = delta * 1;
    cameraMount.position.lerp(this.cameraPos, interpolationSpeed);
    cameraMount.quaternion.slerp(tempy.quaternion, interpolationSpeed);
  }

  update(_: number): void {}
}
