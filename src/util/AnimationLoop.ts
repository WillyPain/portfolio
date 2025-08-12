import { Clock, Scene, WebGLRenderer } from "three";
import { CameraController } from "./CameraController";
import { CSS2DRenderer, CSS3DRenderer } from "three/examples/jsm/Addons.js";

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

    // Rendering this behind WebGL so we can achieve occlude effect
    this._css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    this._css3dRenderer.domElement.style.position = "absolute";
    this._css3dRenderer.domElement.style.top = "0";
    this._css3dRenderer.domElement.style.zIndex = "-1";

    this._css2dRenderer.setSize(window.innerWidth, window.innerHeight);
    this._css2dRenderer.domElement.style.position = "absolute";
    this._css2dRenderer.domElement.style.top = "0";
  }

  private _scene: Scene = new Scene();
  private _renderer: WebGLRenderer = new WebGLRenderer();
  private _css3dRenderer: CSS3DRenderer = new CSS3DRenderer();
  private _css2dRenderer: CSS2DRenderer = new CSS2DRenderer();
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

  public static get Css3dRenderer(): CSS3DRenderer {
    return this.Instance._css3dRenderer;
  }

  public static get Css2dRenderer(): CSS2DRenderer {
    return this.Instance._css2dRenderer;
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

    //once off render
    this.update();
  }

  private update() {
    const delta = this._clock.getDelta();
    this._handlers.forEach((h) => h.update(delta));
    const camera = CameraController.MainCamera;
    if (camera) {
      this._renderer.render(this._scene, camera);
      this._css3dRenderer.render(this._scene, camera);
      this._css2dRenderer.render(this._scene, camera);
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
