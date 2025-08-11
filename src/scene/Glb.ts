import type { SceneThing } from "@/util/AnimationLoop";
import {
  ClampToEdgeWrapping,
  Mesh,
  NearestFilter,
  Object3D,
  Uniform,
  Vector3,
  type Scene,
} from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import ps1VertexShader from "@/assets/shaders/ps1-vertex-shader.glsl?raw";
import ps1FragmentShader from "@/assets/shaders/ps1-fragment-shader.glsl?raw";

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
  uPixelation = new Uniform(512);
}

export class Glb implements SceneThing {
  public uniforms = new Ps1ShaderUniforms();
  root = new Object3D();
  glbUrl: string;
  shaders: ThreeShader[] = [];
  initPosition: Vector3;

  constructor(glbUrl: string, x: number = 0, y: number = 0, z: number = 0) {
    this.glbUrl = glbUrl;
    this.initPosition = new Vector3(x, y, z);
    this.root.position.set(x, y, z);
  }

  init(scene: Scene): void {
    const loader = new GLTFLoader();
    loader.load(
      this.glbUrl,
      (gltf) => {
        this.root.add(gltf.scene);
        scene.add(this.root);

        // add ps1 style affine shader to all materials
        gltf.scene.traverse((child) => {
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
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  update(): void {}

  cleanup(scene: Scene): void {
    scene.remove(this.root);
  }
}
