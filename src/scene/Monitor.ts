import type { SceneThing } from "@/util/AnimationLoop";
import {
  AdditiveBlending,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MultiplyBlending,
  PlaneGeometry,
  Texture,
  VideoTexture,
  type Scene,
} from "three";
import brokenScreen from "@/assets/video/broken-screen.mp4?url";
import screen from "@/assets/video/screen-1.mp4?url";
import { ResourceLoader } from "@/util/ResourceLoader";
import { ResourceUrls } from "@/definitions";

export class Monitor implements SceneThing {
  init(scene: Scene): void {
    const glitchyVid = ResourceLoader.Get<HTMLVideoElement>(brokenScreen);
    glitchyVid.play();

    const vid = ResourceLoader.Get<HTMLVideoElement>(screen);
    vid.play();

    const glitchyTexture = new VideoTexture(glitchyVid);
    glitchyTexture.needsUpdate = true;

    const screenTexture = new VideoTexture(vid);
    screenTexture.needsUpdate = true;

    const fingerprintMaterial = new MeshBasicMaterial({
      map: ResourceLoader.Get<Texture>(ResourceUrls.fingerprintTexture),
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.6,
      transparent: true,
    });

    const glitchyMaterial = new MeshBasicMaterial({
      map: glitchyTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.1,
      transparent: true,
    });

    const screenMaterial = new MeshBasicMaterial({
      map: screenTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.1,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new PlaneGeometry(1.1, 0.9);

    const fingerprintPlane = new Mesh(geometry, fingerprintMaterial);
    fingerprintPlane.position.set(0, 0.35, -1.1);

    const glitchyPlane = new Mesh(geometry, glitchyMaterial);
    glitchyPlane.position.set(0, 0.35, -1.11);

    const screenPlane = new Mesh(geometry, screenMaterial);
    screenPlane.position.set(0, 0.35, -1.12);

    scene.add(fingerprintPlane);
    // scene.add(glitchyPlane);
    // scene.add(screenPlane);
  }
  update(delta: number): void {}
  cleanup(scene: Scene): void {}
}
