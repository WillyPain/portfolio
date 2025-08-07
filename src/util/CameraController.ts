import { Camera } from "three";

export class CameraController {
  public _mainCamera: Camera | null = null;
  
  public static _instance: CameraController;
  public static get Instanace(): CameraController {
    if (!this._instance) {
      this._instance = new CameraController;
    }
    return this._instance;
  };

  public static get MainCamera(): Camera | null {
    return this.Instanace._mainCamera;
  }

  public static set MainCamera(camera: Camera) {
    this.Instanace._mainCamera = camera;
  }
}