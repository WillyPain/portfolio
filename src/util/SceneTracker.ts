import type { Object3D } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { ResourceLoader } from "./ResourceLoader";

export class SceneTracker {
  // Using a list of Object3D to handle name collisions
  objectInstances: Map<string, Object3D[]> = new Map<string, Object3D[]>();
  track(objectInstance: Object3D) {
    const instances = this.objectInstances.get(objectInstance.name);
    if (instances) {
      instances.push(objectInstance);
    } else {
      this.objectInstances.set(objectInstance.name, [objectInstance]);
    }
    objectInstance.children?.forEach(this.track.bind(this));
  }

  private static _instance: SceneTracker;
  public static get Instance(): SceneTracker {
    return (this._instance ??= new SceneTracker());
  }

  static Load(url: string): GLTF {
    const gltf = ResourceLoader.Get<GLTF>(url);
    this.Instance.track(gltf.scene);
    return gltf;
  }

  static Find(id: string): Object3D[] | undefined {
    return this.Instance.objectInstances.get(id);
  }
}
