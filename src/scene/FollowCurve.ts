import type { AnimationLoopSubscriber } from "@/util/AnimationLoop";
import {
  CatmullRomCurve3,
  MathUtils,
  Object3D,
  Vector3,
  type Scene,
} from "three";
import {
  CameraController,
  type CameraBehaviour,
} from "@/util/CameraController";
import { curves } from "@/definitions";

export class CameraTrack implements AnimationLoopSubscriber, CameraBehaviour {
  cameraTrackCurve: CatmullRomCurve3 = curves.cameraTrack;
  focusPoints: CatmullRomCurve3 = curves.focusPoints;

  root: Object3D = new Object3D();
  lookAtTarget: (() => Object3D | undefined) | undefined;
  cameraMount: Object3D = new Object3D();
  loaded: boolean = false;

  currentTarget: Vector3 = new Vector3();
  _t: number = 0;
  get position(): number {
    return this._t;
  }
  set position(t: number) {
    this._t = MathUtils.clamp(t, 0, 1);
  }

  init(_: Scene): void {
    // const cam = new PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000);
    // this.cameraMount.add(cam);

    // this.root.add(this.cameraMount);
    // scene.add(this.root);

    this.loaded = true;
    CameraController.CameraBehaviour = this;
  }

  update(_: number) {}

  updateCamera(cameraParent: Object3D, delta: number): void {
    if (this.cameraTrackCurve) {
      const point = this.cameraTrackCurve.getPoint(this._t);
      cameraParent.position.copy(point);
    }

    const target =
      this.focusPoints && this._t !== 0
        ? this.getLookAtTarget()
        : this.lookAtTarget?.()?.position;
    if (target) {
      this.currentTarget.lerp(target, delta * 3);
      cameraParent.lookAt(this.currentTarget);
    }
  }

  //0 -----|------|---------|--------- 1
  //    pc    cat    arcade   speaker
  focusThreshholds = [0.3, 0.6, 0.8, 1];
  // Blender exports path the points in the correct sequence but not the correct start point
  // offset to get correct start point until we find a better way to store the path data
  focusPointIndexOffset = 2;
  getLookAtTarget() {
    return this.focusPoints.points[
      (this.focusThreshholds.findIndex((t) => this._t < t) +
        this.focusPointIndexOffset) %
        this.focusPoints.points.length
    ];
  }
}
