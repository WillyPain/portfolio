import type { AnimationLoopSubscriber } from "@/util/AnimationLoop";
import {
  AnimationMixer,
  ClampToEdgeWrapping,
  EqualStencilFunc,
  InterpolateDiscrete,
  KeepStencilOp,
  Mesh,
  NearestFilter,
  NoColorSpace,
  Object3D,
  ReplaceStencilOp,
  Texture,
  type Scene,
} from "three";
import { type GLTF } from "three/examples/jsm/Addons.js";
import ps1VertexShader from "@/assets/shaders/ps1-vertex-shader.glsl?raw";
import ps1FragmentShader from "@/assets/shaders/ps1-fragment-shader.glsl?raw";
import { ResourceLoader } from "@/util/ResourceLoader";
import {
  Ps1ShaderUniforms,
  ResourceUrls,
  type ThreeShader,
} from "@/definitions";
import { SceneTracker } from "@/util/SceneTracker";

export class Ps1Glb implements AnimationLoopSubscriber {
  loaded: boolean = false;
  mixer: AnimationMixer | undefined;
  root: GLTF | undefined;

  public uniforms = new Ps1ShaderUniforms();

  modelUrl: string;
  constructor(modeUrl: string) {
    this.modelUrl = modeUrl;
  }

  shaders: ThreeShader[] = [];
  public onUniformsChanged(newUniforms: Ps1ShaderUniforms) {
    if (!this) return;
    for (const shader of this.shaders) {
      for (const key in newUniforms) {
        if (shader.uniforms[key]) {
          shader.uniforms[key].value = newUniforms[key].value;
        }
      }
    }
  }

  init(scene: Scene | Object3D): void {
    this.loaded = true;
    this.root = SceneTracker.Load(this.modelUrl);
    scene.add(this.root.scene);
    // add ps1 style affine shader to all materials
    this.root.scene.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.name.startsWith("layer")) {
          return;
        }
        if (child.material.map) {
          // Make them textures crispy
          child.material.map.generateMipmaps = false;
          child.material.map.magFilter = NearestFilter;
          child.material.map.minFilter = NearestFilter;
          child.material.map.wraps = ClampToEdgeWrapping;
          child.material.map.wrapT = ClampToEdgeWrapping;
          child.material.map.anisotropy = 1;
        }

        child.material.lightMap = ResourceLoader.Get<Texture>(
          ResourceUrls.cribLightmap
        );

        if (child.geometry.attributes.uv1) {
          child.material.lightMapIntensity = 5;
          child.material.lightMap.encoding = NoColorSpace;
          child.material.lightMap.flipY = false;
          child.material.lightMap.channel = 1;
          child.material.needsUpdate = true;
          child.material.color.setScalar(1.0);
        }

        child.material.stencilRef = 2;
        child.material.stencilWrite = true;
        child.material.stencilFunc = EqualStencilFunc;
        child.material.stencilFail = KeepStencilOp;
        child.material.stencilZFail = KeepStencilOp;
        child.material.stencilZPass = ReplaceStencilOp;
        child.renderOrder = 2;

        // Hooking into threejs material before its compiled to add the custom vertex and fragment shader
        child.material.onBeforeCompile = (shader: ThreeShader) => {
          // Add PS1 uniforms
          for (const key in this.uniforms) {
            shader.uniforms[key] = this.uniforms[key];
          }

          shader.vertexShader = ps1VertexShader;
          shader.fragmentShader = ps1FragmentShader;

          // Keeping a list of shaders so we can update the materials
          this.shaders.push(shader);
        };
      }
    });

    if (this.root.animations.length > 0) {
      this.root.animations[0].tracks[0].setInterpolation(InterpolateDiscrete);
      this.mixer = new AnimationMixer(this.root.scene);
      this.root.animations.forEach((clip) => {
        this.mixer!.clipAction(clip).play();
      });
    }
  }

  accumulator = 0;
  tick = 1 / 24;
  update(delta: number): void {
    if (!this.loaded) return;
    this.accumulator += delta;
    if (this.accumulator > this.tick && true) {
      this.mixer?.update(this.accumulator);
      this.accumulator = 0;
    }
  }

  cleanup(scene: Scene): void {
    if (this.root) {
      scene.remove(this.root.scene);
    }
  }
}
