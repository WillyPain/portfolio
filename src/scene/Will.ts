import type { SceneThing } from "@/util/AnimationLoop";
import {
  AnimationMixer,
  ClampToEdgeWrapping,
  InterpolateDiscrete,
  Mesh,
  NearestFilter,
  Object3D,
  Uniform,
  type Scene,
} from "three";
import { CSS2DObject, GLTFLoader } from "three/examples/jsm/Addons.js";
import ps1VertexShader from "@/assets/shaders/ps1-vertex-shader.glsl?raw";
import ps1FragmentShader from "@/assets/shaders/ps1-fragment-shader.glsl?raw";
import modelUrl from "@/assets/models/backflip_2.glb?url";

interface ThreeShader {
  vertexShader: string;
  fragmentShader: string;
  uniforms: {
    [key: string]: Uniform;
  };
}

class Ps1ShaderUniforms {
  [key: string]: Uniform;
  uEnableVertexSnap = new Uniform(true);
  uVertexSnap = new Uniform(0.01);
  uColorDepth = new Uniform(20.0);
  uDithering = new Uniform(0);
  uAffineIntensity = new Uniform(1);
  uPixelation = new Uniform(256);
}

export class Will implements SceneThing {
  loaded: boolean = false;
  mixer: AnimationMixer | undefined;
  root: Object3D = new Object3D();

  public uniforms = new Ps1ShaderUniforms();

  shaders: ThreeShader[] = [];
  public onUniformsChanged(newUniforms: Ps1ShaderUniforms) {
    // sometimes its undefined idk
    if (!this) return;
    for (const shader of this.shaders) {
      for (const key in newUniforms) {
        if (shader.uniforms[key]) {
          shader.uniforms[key].value = newUniforms[key].value;
        }
      }
    }
  }

  getTag(text: string): CSS2DObject {
    const labelDiv = document.createElement("div");
    labelDiv.textContent = text;
    labelDiv.style.color = "white";
    labelDiv.style.fontSize = "1.5rem";
    labelDiv.className = "ocr";

    return new CSS2DObject(labelDiv);
  }

  init(scene: Scene): void {
    const label = this.getTag("HEART");
    const label2 = this.getTag("LEFT FOOT");
    const label3 = this.getTag("RIGHT FOOT");

    console.log("Will initialized.");
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        this.loaded = true;
        this.root.add(gltf.scene);
        this.root.position.z = -1;
        this.root.scale.addScalar(-0.2);
        scene.add(this.root);
        // add ps1 style affine shader to all materials
        gltf.scene.traverse((child) => {
          if (child.name === "mixamorigSpine1") {
            child.add(label);
          }
          if (child.name === "mixamorigLeftFoot") {
            child.add(label2);
          }
          if (child.name === "mixamorigRightFoot") {
            child.add(label3);
          }
          if (child instanceof Mesh) {
            const t = child.material.map;
            if (t == null) return;

            // Make them textures crispy
            t.generateMipmaps = false;
            t.magFilter = NearestFilter;
            t.minFilter = NearestFilter;
            t.wraps = ClampToEdgeWrapping;
            t.wrapT = ClampToEdgeWrapping;
            t.anisotropy = 1;

            // Hooking into threejs material before its compiled to add the custom vertex and fragment shader
            child.material.onBeforeCompile = (shader: ThreeShader) => {
              // Add PS1 uniforms
              for (const key in this.uniforms) {
                shader.uniforms[key] = this.uniforms[key];
              }

              shader.vertexShader = ps1VertexShader;
              shader.fragmentShader = ps1FragmentShader;

              // Keeping a list of shaders so we can update the materials
              console.log("apple");
              this.shaders.push(shader);
            };
          }
        });

        gltf.animations[0].tracks[0].setInterpolation(InterpolateDiscrete);
        this.mixer = new AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          this.mixer!.clipAction(clip).play();
        });
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  accumulator = 0;
  update(delta: number): void {
    if (!this.loaded) return;
    //todo: try find way to avoid calculating tick size every frame
    const tick = 1 / 24;
    this.accumulator += delta;
    if (this.accumulator > tick && true) {
      this.mixer?.update(this.accumulator);
      this.accumulator = 0;
    }
  }

  cleanup(scene: Scene): void {
    console.log("Will cleanup.");
    if (this.root) {
      scene.remove(this.root);
    }
  }
}
