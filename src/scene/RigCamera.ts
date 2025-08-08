import type { SceneThing } from "@/util/AnimationLoop";
import { CameraController } from "@/util/CameraController";
import {
  DynamicDrawUsage,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  SphereGeometry,
  Vector3,
  type Scene,
} from "three";

export class RigCamera implements SceneThing {
  root: Object3D = new Object3D();
  lookAtTarget: (() => Object3D | undefined) | undefined;
  cameraMount: Object3D = new Object3D();
  dummyPoints: Object3D[] = [];
  points: InstancedMesh | undefined;

  init(scene: Scene): void {
    const cam = new PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000);
    CameraController.MainCamera = cam;

    const sphere = new SphereGeometry(0.1, 4, 4);
    const mat = new MeshBasicMaterial({ color: 0xccffcc });
    this.points = new InstancedMesh(sphere, mat, 5);
    this.points.instanceMatrix.setUsage(DynamicDrawUsage);

    for (let ii = 0; ii < 5; ii++) {
      this.dummyPoints.push(new Object3D());
    }
    this.dummyPoints[0].position.set(4, 1, -4);
    this.dummyPoints[1].position.set(4, 0, 0);
    this.dummyPoints[2].position.set(0, 5, 0.8);
    this.dummyPoints[3].position.set(-4, 2, 0);
    this.dummyPoints[4].position.set(-4, 0, -4);

    for (let ii = 0; ii < 5; ii++) {
      this.dummyPoints[ii].updateMatrix();
      this.points.setMatrixAt(ii, this.dummyPoints[ii].matrix);
    }

    this.cameraMount.add(cam);
    this.root.add(this.cameraMount);
    this.root.add(this.points);
    scene.add(this.root);
  }

  accumulator: number = 0;
  update(delta: number): void {
    const target = this.lookAtTarget?.();
    if (target?.position) {
      const t = target.position;
      CameraController.MainCamera?.lookAt(new Vector3(t.x, t.y, t.z));
    }
    this.accumulator += delta;
    for (let ii = 0; ii < 5; ii++) {
      this.dummyPoints[ii].updateMatrix();
      this.points!.setMatrixAt(ii, this.dummyPoints[ii].matrix);
    }
    this.points!.instanceMatrix.needsUpdate = true;
  }

  cleanup(scene: Scene): void {
    if (this.root) {
      scene.remove(this.root);
    }
  }
}
