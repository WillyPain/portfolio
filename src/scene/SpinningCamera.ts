import type { SceneThing } from "@/util/AnimationLoop";
import { CameraController } from "@/util/CameraController";
import { Camera, Object3D, PerspectiveCamera, type Scene } from "three";

export class CameraSettings {
  target?: Object3D = new Object3D();

  fov = 55;
  height = 0.5;
  distance = 3;

  rotationSpeed = 1;
  enableRotation = true;
}

export class SpinningCamera implements SceneThing {
  settings = new CameraSettings();
  camera?: Camera;

  init(scene: Scene): void {
    this.camera = new PerspectiveCamera(
      this.settings.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.y = this.settings.height;
    this.camera.position.z = this.settings.distance;

    this.settings.target = new Object3D();
    scene.add(this.settings.target);

    this.settings.target.add(this.camera);

    // this is a little odd, someting else should decide if this becomes the main camera
    // can change later
    CameraController.MainCamera = this.camera;
  }

  update(delta: number): void {
    if (this.settings.enableRotation && this.settings.target) {
      this.settings.target.rotation.y += delta * this.settings.rotationSpeed;
    }
    if (this.camera) {
      this.camera.position.z = this.settings.distance;
    }
  }

  cleanup(scene: Scene): void {
    if (this.settings.target) {
      scene.remove(this.settings.target);
    }
  }
}
