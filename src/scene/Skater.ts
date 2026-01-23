import { curves as Curves, ResourceUrls } from "@/definitions";
import type { AnimationLoopSubscriber } from "@/util/AnimationLoop";
import {
  type Scene,
  Object3D,
  type CatmullRomCurve3,
  Vector3,
  PositionalAudio,
} from "three";
import { Ps1Glb } from "./Ps1Glb";
import { CameraController } from "@/util/CameraController";
import { ResourceLoader } from "@/util/ResourceLoader";

const SkateState = {
  Rolling: 1,
  Grinding: 2,
};

export class Skater implements AnimationLoopSubscriber {
  curve: CatmullRomCurve3 = Curves.catTrack;
  cat = new Ps1Glb(ResourceUrls.sk8r);
  t: number = 0;
  end = 1 + 1 / this.curve.points.length;
  speed = 0.05;
  skateState = SkateState.Rolling;
  audioSource?: PositionalAudio;

  init(scene: Scene | Object3D): void {
    this.cat.init(scene);
    const tagParent = new Object3D();
    tagParent.position.y += 0.2;
    this.cat.root?.scene.add(tagParent);
    // new Css2DScrambleTag(tagParent, "Tony T");

    this.audioSource = new PositionalAudio(CameraController.AudioListener);
    this.audioSource.buffer = ResourceLoader.Get<AudioBuffer>(
      ResourceUrls.skateboardSfx
    );
    this.audioSource.loop = true;
    this.audioSource.play();
    this.cat.root?.scene.add(this.audioSource);
  }

  update(delta: number): void {
    this.t += this.speed * delta;
    if (this.t > this.end) {
      this.t = 0;
    }
    this.cat.root?.scene.position.copy(this.curve.getPoint(this.t));

    // TODO: create a cleaner state machine for this
    if (
      this.t > 0.16 &&
      this.t < 0.5 &&
      this.skateState == SkateState.Rolling &&
      this.audioSource
    ) {
      this.audioSource.stop();
      this.audioSource.setVolume(4);
      this.skateState = SkateState.Grinding;
      this.audioSource.buffer = ResourceLoader.Get<AudioBuffer>(
        ResourceUrls.skateboardGrindingSfx
      );
      this.audioSource.play();
    }
    if (
      this.t > 0.5 &&
      this.skateState == SkateState.Grinding &&
      this.audioSource
    ) {
      this.audioSource.stop();
      this.audioSource.setVolume(1);
      this.skateState = SkateState.Rolling;
      this.audioSource.buffer = ResourceLoader.Get<AudioBuffer>(
        ResourceUrls.skateboardSfx
      );
      this.audioSource.play();
    }

    // Cant get tangents between start and endpoint like u cant with position
    if (this.t < 1) {
      this.cat.root?.scene.children[0].quaternion.setFromUnitVectors(
        new Vector3(0, 0, 1),
        this.curve.getTangentAt(this.t)
      );
    }
  }
}
