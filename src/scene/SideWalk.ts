import type { SceneThing } from "@/util/AnimationLoop";
import {
  AmbientLight,
  ClampToEdgeWrapping,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PointLight,
  TextureLoader,
  Uniform,
  type Scene,
} from "three";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import sidewalk from "@/assets/models/sidewalk.glb?url";
import ps1VertexShader from "@/assets/shaders/ps1-vertex-shader.glsl?raw";
import ps1FragmentShader from "@/assets/shaders/ps1-fragment-shader.glsl?raw";
import godray from "@/assets/textures/godray.png?url";

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
  uColorDepth = new Uniform(16.0);
  uDithering = new Uniform(0.2);
  uAffineIntensity = new Uniform(1);
  uPixelation = new Uniform(256);
}

export class SideWalk implements SceneThing {
  public uniforms = new Ps1ShaderUniforms();

  shaders: ThreeShader[] = [];
  root: GLTF | undefined;
  loaded = false;

  init(scene: Scene): void {
    // Load your transparent gradient texture (make sure it's PNG with alpha)
    const texture = new TextureLoader().load(godray);
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.premultiplyAlpha = false;

    // Create the material
    const godRayMaterial = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      color: 0xffeeaa,
      depthWrite: false,
      side: DoubleSide,
      alphaTest: 0.01, // Optional: kills near-zero alpha to avoid sorting issues
    });

    console.log("Will initialized.");
    const loader = new GLTFLoader();
    loader.load(
      sidewalk,
      (gltf) => {
        this.loaded = true;
        this.root = gltf;
        this.root.scene.position.y = -0.1;
        this.root.scene.add(new AmbientLight(0x6666aa, 3));
        const streetLight = new PointLight(0xffffaa, 100, 100);
        streetLight.position.y = 4;
        streetLight.position.x = 1.5;
        streetLight.position.z = -1.2;
        this.root.scene.add(streetLight);
        // gltf.scene.add(new AmbientLight(0xaaffff, 2));
        scene.add(gltf.scene);
        // add ps1 style affine shader to all materials
        gltf.scene.traverse((child) => {
          if (child instanceof Mesh) {
            const t = child.material.map;
            if (child.name === "light-cone") {
              child.material = godRayMaterial;
              return;
            }

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
    if (this.root) {
      scene.remove(this.root.scene);
    }
  }
}
