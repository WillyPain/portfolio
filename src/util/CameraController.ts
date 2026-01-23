import {
  Camera,
  AudioListener,
  Object3D,
  Scene,
  PerspectiveCamera,
  MathUtils,
} from "three";
import type { AnimationLoopSubscriber } from "./AnimationLoop";

export class CameraController implements AnimationLoopSubscriber {
  public _mainCamera?: Camera;
  public _audioListener: AudioListener = new AudioListener();

  public static _instance: CameraController;
  public static get Instanace(): CameraController {
    if (!this._instance) {
      this._instance = new CameraController();
    }
    return this._instance;
  }

  public static get MainCamera(): Camera | undefined {
    return this.Instanace._mainCamera;
  }

  public static get AudioListener(): AudioListener {
    return this.Instanace._audioListener;
  }

  private static set MainCamera(camera: Camera) {
    this.Instanace._mainCamera?.remove(this.Instanace._audioListener);
    camera.add(this.Instanace._audioListener);
    this.Instanace._mainCamera = camera;
  }

  static set CameraBehaviour(cb: CameraBehaviour) {
    this.Instanace.cameraBehaviour = cb;
  }
  static get CameraBehaviour() {
    return this.Instanace.cameraBehaviour!;
  }

  cameraMount = new Object3D();
  init(scene: Scene | Object3D): void {
    const cam = new PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000);
    cam.rotateY(MathUtils.DEG2RAD * 180);
    this.cameraMount.add(cam);
    CameraController.MainCamera = cam;
    scene.add(this.cameraMount);
  }

  cameraBehaviour?: CameraBehaviour;
  update(delta: number): void {
    this.cameraBehaviour?.updateCamera(this.cameraMount, delta);
  }
}

export interface CameraBehaviour {
  updateCamera(cameraMount: Object3D, delta: number): void;
}
