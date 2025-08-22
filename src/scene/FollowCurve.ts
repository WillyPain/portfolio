import type { AnimationLoopSubscriber as AnimationLoopSubscriber } from "@/util/AnimationLoop";
import {
  CatmullRomCurve3,
  MathUtils,
  Object3D,
  PerspectiveCamera,
  Vector3,
  type Scene,
} from "three";
import heroToComputer from "@/assets/curves/hero-to-computer.json?raw";
import { CameraController } from "@/util/CameraController";

export class FollowCurve implements AnimationLoopSubscriber {
  curve: CatmullRomCurve3 | undefined;

  root: Object3D = new Object3D();
  lookAtTarget: (() => Object3D | undefined) | undefined;
  cameraMount: Object3D = new Object3D();
  dummyPoints: Vector3[] = [];
  loaded: boolean = false;

  _t: number = 0;
  get position(): number {
    return this._t;
  }
  set position(t: number) {
    this._t = MathUtils.clamp(t, 0, 1);
  }

  init(scene: Scene): void {
    const curveData = JSON.parse(heroToComputer);
    this.curve = this.createCurveFromJSON(curveData);

    const p1 = this.dummyPoints[0];
    this.cameraMount.position.set(p1.x, p1.y, p1.z);

    const cam = new PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000);
    this.cameraMount.add(cam);
    CameraController.MainCamera = cam;

    this.root.add(this.cameraMount);
    scene.add(this.root);

    this.loaded = true;
  }

  // Ganked code from https://github.com/ClassOutside/Blender_Path_To_ThreeJS/blob/main/src/curveTools/CurveMethods.js
  createCurveFromJSON(json: {
    points: Vector3[];
    closed: boolean;
  }): CatmullRomCurve3 {
    const vertices = json.points;
    const points = [];

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i].x;
      const y = vertices[i].y;
      const z = vertices[i].z;
      points.push(new Vector3(x, y, z));
    }
    this.dummyPoints = points;
    const curve = new CatmullRomCurve3(points);
    curve.closed = json.closed;

    return curve;
  }

  update(delta: number): void {
    const target = this.lookAtTarget?.();

    if (this.curve) {
      const point = this.curve.getPoint(this._t);
      this.cameraMount.position.copy(point);
    }

    if (target?.position) {
      const t = target.position;
      CameraController.MainCamera?.lookAt(new Vector3(t.x, t.y, t.z));
    }
  }
}
