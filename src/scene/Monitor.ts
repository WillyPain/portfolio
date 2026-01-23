import type { AnimationLoopSubscriber } from "@/util/AnimationLoop";
import {
  AdditiveBlending,
  AlwaysStencilFunc,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  NoBlending,
  Object3D,
  ReplaceStencilOp,
  ShaderMaterial,
  Texture,
  Vector3,
  VideoTexture,
  type Scene,
} from "three";
import { ResourceLoader } from "@/util/ResourceLoader";
import { ResourceUrls } from "@/definitions";
import viewingAngleVertexShader from "@/assets/shaders/viewing-angle-vertex-shader.glsl?raw";
import viewingAngleFragmentShader from "@/assets/shaders/viewing-angle-fragment-shader.glsl?raw";
import { CSS3DObject } from "three/examples/jsm/Addons.js";

export class Monitor implements AnimationLoopSubscriber {
  screenLayers?: Object3D;
  iframeId: string;
  screenNormal = new Vector3();
  constructor(screenLayers: Object3D, iframeId: string) {
    this.screenLayers = screenLayers;
    this.iframeId = iframeId;
  }

  static Materials = new Map<string, Material>();
  static Material = {
    box: "box",
    video1: "video1",
    video2: "video2",
    reflection: "reflection",
    fingerprints: "fingerprints",
    occlusion: "occlusion",
    viewingAngle: "viewingAngle",
  };

  init(_: Scene | Object3D): void {
    if (Monitor.Materials.size <= 0) {
      this.initMaterials();
    }

    // Why use a map instead of having a static property for each material?
    this.getScreenLayer("layer_1").material = Monitor.Materials.get(
      Monitor.Material.occlusion
    )!;
    this.getScreenLayer("layer_1").renderOrder = 0;
    this.getScreenLayer("layer_2").material = Monitor.Materials.get(
      Monitor.Material.video1
    )!;
    this.getScreenLayer("layer_3").material = Monitor.Materials.get(
      Monitor.Material.video2
    )!;
    this.getScreenLayer("layer_4").material = Monitor.Materials.get(
      Monitor.Material.viewingAngle
    )!;
    this.getScreenLayer("layer_5").material = Monitor.Materials.get(
      Monitor.Material.reflection
    )!;
    this.getScreenLayer("layer_6").material = Monitor.Materials.get(
      Monitor.Material.fingerprints
    )!;

    this.getScreenLayer("box").material = Monitor.Materials.get(
      Monitor.Material.box
    )!;

    const iframe = document.getElementById(this.iframeId);
    if (iframe) {
      const layer1 = this.getScreenLayer("layer_2");
      const normal = layer1.geometry.attributes.normal;
      this.screenNormal = new Vector3(
        normal.getX(0),
        normal.getY(0),
        normal.getZ(0)
      );

      const points = [];
      for (let ii = 0; ii < 3; ii++) {
        points.push(
          new Vector3(
            layer1.geometry.attributes.position.getX(ii),
            layer1.geometry.attributes.position.getY(ii),
            layer1.geometry.attributes.position.getZ(ii)
          )
        );
      }

      // dont know which point is which,
      // discard longest distance (hypotenuse)
      // all screens are horizontal so width > height
      const l1 = points[0].distanceTo(points[1]);
      const l2 = points[0].distanceTo(points[2]);
      const l3 = points[1].distanceTo(points[2]);
      const distances = [l3, l2, l1].sort();
      const w = distances[1];
      const h = distances[0];
      const ratio = h / w;
      const geometryToCssScaleFactor = 1;

      // TODO: find a way to get the width from the htmlelement
      const iframeWidth = 1000;
      iframe.style.zIndex = "-1";
      iframe.style.height = `${ratio * iframeWidth}px`;
      iframe.style.width = `${iframeWidth}px`;
      const canvas = new CSS3DObject(iframe);
      canvas.rotation.copy(layer1.rotation);
      canvas.scale.setScalar((w / iframeWidth) * geometryToCssScaleFactor);
      canvas.lookAt(this.screenNormal);
      layer1.add(canvas);
    }
  }

  update(_: number): void {}

  initMaterials() {
    const crtVideoElement = ResourceLoader.Get<HTMLVideoElement>(
      ResourceUrls.vhsStaticVideo
    );
    crtVideoElement.play();
    const crtTexture = new VideoTexture(crtVideoElement);
    crtTexture.needsUpdate = true;

    const distortionVideoElement = ResourceLoader.Get<HTMLVideoElement>(
      ResourceUrls.vhsBlueVideo
    );
    distortionVideoElement.play();
    const distortionTexture = new VideoTexture(distortionVideoElement);
    distortionTexture.needsUpdate = true;

    const occlusionMaterial = new MeshPhongMaterial({
      color: "white",
      colorWrite: false,
      opacity: 0,
      // transparent: true,
      blending: NoBlending,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: AlwaysStencilFunc,
      stencilZPass: ReplaceStencilOp,
      side: DoubleSide,
    });

    const fingerPrintTexture = ResourceLoader.Get<Texture>(
      ResourceUrls.fingerprintTexture
    );
    const fingerprintMaterial = new MeshBasicMaterial({
      map: fingerPrintTexture,
      // alphaMap: fingerPrintTexture,
      blending: AdditiveBlending,
      opacity: 0.2,
      transparent: true,
    });

    const reflectionTexture = ResourceLoader.Get<Texture>(
      ResourceUrls.screenReflectionTexture
    );
    const reflectionMaterial = new MeshBasicMaterial({
      map: reflectionTexture,
      alphaMap: reflectionTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.1,
      transparent: true,
    });

    const crtMaterial = new MeshBasicMaterial({
      map: crtTexture,
      alphaMap: crtTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.5,
      transparent: true,
    });

    const distortionMaterial = new MeshBasicMaterial({
      map: distortionTexture,
      alphaMap: distortionTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.1,
      transparent: true,
    });

    const viewingAngleMaterial = new ShaderMaterial({
      vertexShader: viewingAngleVertexShader,
      fragmentShader: viewingAngleFragmentShader,
      blending: AdditiveBlending,
      side: DoubleSide,
      transparent: true,
    });

    const boxMaterial = new MeshBasicMaterial({ color: 0x111111 });

    Monitor.Materials.set(Monitor.Material.box, boxMaterial);
    Monitor.Materials.set(Monitor.Material.video1, distortionMaterial);
    Monitor.Materials.set(Monitor.Material.video2, crtMaterial);
    Monitor.Materials.set(Monitor.Material.reflection, reflectionMaterial);
    Monitor.Materials.set(Monitor.Material.fingerprints, fingerprintMaterial);
    Monitor.Materials.set(Monitor.Material.occlusion, occlusionMaterial);
    Monitor.Materials.set(Monitor.Material.viewingAngle, viewingAngleMaterial);
  }

  getScreenLayer(name: string) {
    return this.screenLayers?.children.find((c) =>
      c.name.startsWith(name)
    ) as Mesh;
  }
}
