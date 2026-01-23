import type { AnimationLoopSubscriber } from "@/util/AnimationLoop";
import { SceneTracker } from "@/util/SceneTracker";
import { type Scene, Mesh, Object3D } from "three";
import { DecalGeometry } from "three/examples/jsm/Addons.js";
export class PlaneToDecalConverter implements AnimationLoopSubscriber {
  decals?: Object3D;
  init(_: Scene | Object3D): void {
    this.decals = SceneTracker.Find("decals")?.pop();

    // why does this not error?
    // but this does this.decals?.children?.length > 0
    console.log("where am I?");
    this.decals?.children.forEach((c) => {
      console.log("apple heaven");
      if (c instanceof Mesh) {
        const g = new DecalGeometry(c, c.position, c.rotation, c.scale);
        const m = new Mesh(g, c.material);
        c.parent?.remove(c);
        _.add(m);
      }
    });
  }

  update(_: number | Object3D): void {}
}
