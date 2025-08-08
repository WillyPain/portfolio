import { Clock, Scene, WebGLRenderer } from "three";
import { CameraController } from "./CameraController";

//todo: cant think of name yet
export interface SceneThing {
  init(scene: Scene): void;
  update(delta: number): void;
  cleanup(scene: Scene): void;
}

export class AnimationSettings {
  framerate: number = 24;
  playbackSpeed: number = 1;
  enablePlayback: boolean = true;
  rotationSpeed: number = 0.5;
  enableRotation: boolean = true;
  cameraDistance: number = 3;
}

export class AnimationLoop {
  private constructor() {
    this._renderer.setSize(640, 480, false);
    this._renderer.setClearColor(0x000000, 0);
  }

  private _scene: Scene = new Scene();
  private _renderer: WebGLRenderer = new WebGLRenderer();
  private _clock: Clock = new Clock();
  private _handlers: SceneThing[] = [];

  public static _instance: AnimationLoop;
  public static get Instance(): AnimationLoop {
    if (!this._instance) {
      this._instance = new AnimationLoop();
    }
    return this._instance;
  }

  public static get Renderer(): WebGLRenderer {
    return this.Instance._renderer;
  }

  public static Subscribe(handler: SceneThing) {
    this.Instance._handlers.push(handler);
  }

  public static Start() {
    this.Instance._start();
  }

  private _start() {
    this._clock.start();
    this._handlers.forEach((h) => h.init(this._scene));
    this._renderer.setAnimationLoop(this.update.bind(this));
  }

  private update() {
    const delta = this._clock.getDelta();
    this._handlers.forEach((h) => h.update(delta));
    const camera = CameraController.MainCamera;
    if (camera) {
      this._renderer.render(this._scene, camera);
    }
  }

  public static Stop() {
    this.Instance._stop();
  }

  private _stop() {
    this._handlers.forEach((h) => h.cleanup(this._scene));
    this._handlers = [];
  }
}
