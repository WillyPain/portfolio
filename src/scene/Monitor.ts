import type { AnimationLoopSubscriber } from "@/util/AnimationLoop";
import {
  AdditiveBlending,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  Texture,
  VideoTexture,
  type Scene,
} from "three";
import { ResourceLoader } from "@/util/ResourceLoader";
import { ResourceUrls } from "@/definitions";
import viewingAngleVertexShader from "@/assets/shaders/viewing-angle-vertex-shader.glsl?raw";
import viewingAngleFragmentShader from "@/assets/shaders/viewing-angle-fragment-shader.glsl?raw";

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

    const glitchyMaterial = new MeshBasicMaterial({
      map: glitchyTexture,
      alphaMap: glitchyTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.03,
      transparent: true,
    });

    const screenMaterial = new MeshBasicMaterial({
      map: screenTexture,
      alphaMap: screenTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.02,
      transparent: true,
    });

    const viewingAngleMaterial = new ShaderMaterial({
      vertexShader: viewingAngleVertexShader,
      fragmentShader: viewingAngleFragmentShader,
      blending: AdditiveBlending,
      side: DoubleSide,
      transparent: true,
    });

    const geometry = new PlaneGeometry(1.25, 1);
    const planeHeight = 0.34;

    const fingerprintPlane = new Mesh(geometry, fingerprintMaterial);
    fingerprintPlane.position.set(0, planeHeight, -1.03);

    const reflextionPlane = new Mesh(geometry, reflextionMaterial);
    reflextionPlane.position.set(0, planeHeight, -1.02);

    const glitchyPlane = new Mesh(geometry, glitchyMaterial);
    glitchyPlane.position.set(0, planeHeight, -1);

    const screenPlane = new Mesh(geometry, screenMaterial);
    screenPlane.position.set(0, planeHeight, -1.01);

    const viewingAnglePlane = new Mesh(geometry, viewingAngleMaterial);
    viewingAnglePlane.position.set(0, planeHeight, -1.025);

    scene.add(fingerprintPlane);
    scene.add(reflextionPlane);
    scene.add(glitchyPlane);
    scene.add(screenPlane);
    scene.add(viewingAnglePlane);
  }

  update(delta: number): void {}
}
