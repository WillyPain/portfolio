import type { AnimationLoopSubscriber } from "@/util/AnimationLoop";
import {
  AdditiveBlending,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Texture,
  VideoTexture,
  type Scene,
} from "three";
import { ResourceLoader } from "@/util/ResourceLoader";
import { ResourceUrls } from "@/definitions";
import { DEG2RAD } from "three/src/math/MathUtils.js";

export class Monitor implements AnimationLoopSubscriber {
  init(scene: Scene): void {
    const glitchyVid = ResourceLoader.Get<HTMLVideoElement>(
      ResourceUrls.redScreenVideo
    );
    glitchyVid.play();

    const vid = ResourceLoader.Get<HTMLVideoElement>(ResourceUrls.screenVideo);
    vid.play();

    const glitchyTexture = new VideoTexture(glitchyVid);
    glitchyTexture.needsUpdate = true;

    const screenTexture = new VideoTexture(vid);
    screenTexture.needsUpdate = true;

    const fingerprintMaterial = new MeshBasicMaterial({
      map: ResourceLoader.Get<Texture>(ResourceUrls.fingerprintTexture),
      alphaMap: ResourceLoader.Get<Texture>(ResourceUrls.fingerprintTexture),
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.7,
      transparent: true,
    });

    const reflextionMaterial = new MeshBasicMaterial({
      map: ResourceLoader.Get<Texture>(ResourceUrls.screenReflextionTexture),
      alphaMap: ResourceLoader.Get<Texture>(
        ResourceUrls.screenReflextionTexture
      ),
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.3,
      transparent: true,
    });

    console.log("additive:", fingerprintMaterial);

    const glitchyMaterial = new MeshBasicMaterial({
      map: glitchyTexture,
      alphaMap: glitchyTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.1,
      transparent: true,
    });

    const screenMaterial = new MeshBasicMaterial({
      map: screenTexture,
      alphaMap: screenTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.05,
      transparent: true,
    });

    const geometry = new PlaneGeometry(1.1, 1);

    const fingerprintPlane = new Mesh(geometry, fingerprintMaterial);
    fingerprintPlane.position.set(0, 0.35, -1.1);

    const reflextionPlane = new Mesh(geometry, reflextionMaterial);
    reflextionPlane.position.set(0, 0.35, -1.02);

    const glitchyPlane = new Mesh(geometry, glitchyMaterial);
    glitchyPlane.position.set(0, 0.35, -1);

    const screenPlane = new Mesh(geometry, screenMaterial);
    screenPlane.position.set(0, 0.35, -1.01);

    fingerprintPlane.rotateY(180 * DEG2RAD);
    scene.add(fingerprintPlane);
    scene.add(reflextionPlane);
    scene.add(glitchyPlane);
    scene.add(screenPlane);
  }

  update(delta: number): void {}
}
