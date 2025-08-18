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

    const addPoint = (x: number, y: number, z: number) => {
      const newPoint = new Object3D();
      newPoint.position.set(x, y, z);
      this.dummyPoints.push(newPoint);
    };

    addPoint(3, 1, -4);
    addPoint(5, 4, -2);
    addPoint(3, 6, 0.5);
    addPoint(0, 7, 0);
    addPoint(-4, 1, -4);

    const sphere = new SphereGeometry(0.1, 4, 4);
    const mat = new MeshBasicMaterial({ color: 0xccffcc });
    this.points = new InstancedMesh(sphere, mat, this.dummyPoints.length);
    this.points.instanceMatrix.setUsage(DynamicDrawUsage);

    for (let ii = 0; ii < this.dummyPoints.length; ii++) {
      this.dummyPoints[ii].updateMatrix();
      this.points.setMatrixAt(ii, this.dummyPoints[ii].matrix);
    }

    const p1 = this.dummyPoints[0].position;
    this.cameraMount.position.set(p1.x, p1.y, p1.z);
    this.cameraMount.add(cam);
    this.root.add(this.cameraMount);
    this.root.add(this.points);
    scene.add(this.root);
  }

  accumulator: number = 0;
  update(): void {
    const target = this.lookAtTarget?.();
    if (target?.position) {
      const t = target.position;
      CameraController.MainCamera?.lookAt(new Vector3(t.x, t.y, t.z));
    }
  }

  cleanup(scene: Scene): void {
    if (this.root) {
      scene.remove(this.root);
    }
  }
}
