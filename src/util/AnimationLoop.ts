import {
  Clock,
  Object3D,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type Object3DEventMap,
} from "three";
import { CameraController } from "./CameraController";
import { CSS2DRenderer, CSS3DRenderer } from "three/examples/jsm/Addons.js";

//todo: cant think of name yet
export interface AnimationLoopSubscriber {
  init(scene: Scene): void;
  update(delta: number): void;
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
  public scene: Scene = new Scene();
  public cssScene: Scene = new Scene();
  private _renderer: WebGLRenderer;
  private _css3dRenderer: CSS3DRenderer = new CSS3DRenderer();
  private _css2dRenderer: CSS2DRenderer = new CSS2DRenderer();
  private _clock: Clock = new Clock();
  private _handlers: AnimationLoopSubscriber[] = [];

  private constructor() {
    // Setup CSS3D Canvas
    this._css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    this._css3dRenderer.domElement.style.position = "absolute";
    this._css3dRenderer.domElement.style.top = "0";
    this._css3dRenderer.domElement.id = "css3d";
    // Rendering this behind WebGL so we can achieve occlude effect
    this._css3dRenderer.domElement.style.zIndex = "-1";

    // Setup WebGL Canvas
    const aspectRatio = window.innerWidth / window.innerHeight;
    // Looks great at 640x but doesn't look great with the virtual canvas...
    // Will need to tweak the grapghics later
    const canvasWidth = window.innerWidth / 2;
    this._renderer = new WebGLRenderer();
    this._renderer.setSize(canvasWidth, canvasWidth * aspectRatio, false);
    this._renderer.setClearColor(0x000000, 0.0);
    this._renderer.outputColorSpace = SRGBColorSpace;
    this._renderer.domElement.style.position = "absolute";
    this._renderer.domElement.style.imageRendering = "pixelated";
    this._renderer.domElement.style.pointerEvents = "none";
    this._renderer.domElement.style.zIndex = "1";

    // Setup CSS2D Canvas
    this._css2dRenderer.setSize(window.innerWidth, window.innerHeight);
    this._css2dRenderer.domElement.style.position = "absolute";
    this._css2dRenderer.domElement.style.top = "0";
    this._css2dRenderer.domElement.style.transformStyle = "preserve-3d";
    this._css2dRenderer.domElement.style.zIndex = "-1";
    // next the css3d renderer inside the css2d renderer... (this is getting stinky)

    // Setup pointer event handling
    this._css2dRenderer.domElement.addEventListener("mousemove", (e) => {
      this._css3dRenderer.domElement.dispatchEvent(new PointerEvent(e.type, e));
    });

    this._renderer.domElement.addEventListener("mousemove", (e) => {
      this._css3dRenderer.domElement.dispatchEvent(new PointerEvent(e.type, e));
    });

    this._css3dRenderer.domElement.addEventListener("mousemove", (e) => {
      this._css2dRenderer.domElement.style.pointerEvents = "none";
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      if (hit && hit.id !== "css3d" && hit.id !== "monitor") {
        hit?.dispatchEvent(new PointerEvent("css3d", e));
      }
      this._css2dRenderer.domElement.style.pointerEvents = "auto";
    });
  }

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

  public static Subscribe(handler: AnimationLoopSubscriber) {
    this.Instance._handlers.push(handler);
  }

  public static Start() {
    this.Instance._start();
  }

  private _start() {
    this._clock.start();
    this._handlers.forEach((h) => h.init(this.scene));
    this._renderer.setAnimationLoop(this.update.bind(this));

    //once off render
    this.update();
  }

  private update() {
    const delta = this._clock.getDelta();
    this._handlers.forEach((h) => h.update(delta));
    const camera = CameraController.MainCamera;
    camera?.updateMatrix();
    if (camera) {
      this._renderer.render(this.scene, camera);
      this._css3dRenderer.render(this.cssScene, camera);
      this._css2dRenderer.render(this.scene, camera);
    }
  }

  public static Stop() {
    this.Instance._stop();
  }

  private _stop() {
    this._handlers = [];
    this._clock.stop();

    this.dispose(this.scene.children);
    this.scene.clear();

    this.dispose(this.cssScene.children);
    this.cssScene.clear();

    this._renderer.render(this.scene, CameraController.MainCamera!);
    this._renderer.dispose();
    this._renderer.setAnimationLoop(null);

    console.log("after cleanup:", this.scene);
  }

  // lights arent being disposed of
  dispose(children: Object3D<Object3DEventMap>[]) {
    children.forEach((c) => {
      this.dispose(c.children);
      c.removeFromParent();
    });
  }
}
