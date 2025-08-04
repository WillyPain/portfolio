<script setup lang="ts">
import gsap from 'gsap';
import SplitText from 'gsap/SplitText'
import { onMounted, reactive } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AmbientLight, AnimationMixer, ClampToEdgeWrapping, Clock, DirectionalLight, InterpolateDiscrete, Mesh, NearestFilter, Object3D, PerspectiveCamera, Scene, SpotLight, WebGLRenderer } from 'three';
import ShaderSlider from './ShaderSlider.vue';
import AnimationSlider from './AnimationSlider.vue';
import InputPanel from './InputPanel.vue';
import ps1VertexShader from '@/assets/shaders/ps1-vertex-shader.glsl?raw';
import ps1FragmentShader from '@/assets/shaders/ps1-fragment-shader.glsl?raw';
import modelUrl from '@/assets/models/typing.glb?url';

gsap.registerPlugin(SplitText);

onMounted(async () => {
  await document.fonts.ready;
  configureSplitText();
  loadBackflip();
});

async function configureSplitText() {
  let split = SplitText.create(".split", {
    type: "chars",
    charsClassClass: "char",
  });

  gsap.from(".split", {
    autoAlpha: 0,
  });

  gsap.from(split.chars, {
    yPercent: "-10",
    autoAlpha: 0,

    stagger: {
      amount: 2,
      repeat: -1,
      yoyo: true,
    },
    duration: 1,
  });
}

const cameraFov = 55;
const cameraDist = 2;
const cameraHeight = 1;

const ambientLightColor = 0xffffff;
const ambientLightIntensity = 5;

async function loadBackflip() {
  if (loaded == true) return;
  loaded = true;
  const loader = new GLTFLoader();
  const scene = new Scene();
  const camera = new PerspectiveCamera(cameraFov, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = cameraDist;
  camera.position.y = cameraHeight;

  const pivot = new Object3D();
  scene.add(pivot);

  const amb = new AmbientLight(ambientLightColor, ambientLightIntensity);
  scene.add(amb);

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  const container = document.getElementById('canvas-container');
  container?.appendChild(renderer.domElement);
  let mixer: AnimationMixer;


  loader.load(modelUrl, function (gltf) {
    scene.add(gltf.scene);

    // add ps1 style affine shader to all materials
    gltf.scene.traverse(child => {
      if (child instanceof Mesh) {

        let t = child.material.map;
        if (t == null) return;
        
        // Make them textures crispy
        t.generateMipmaps = false;
        t.magFilter = NearestFilter;
        t.minFilter = NearestFilter;
        t.wraps = ClampToEdgeWrapping;
        t.wrapT = ClampToEdgeWrapping;
        t.anisotropy = 1;

        // Hooking into threejs material before its compiled to add the custom vertex and fragment shader
        child.material.onBeforeCompile = (shader: any) => {
          // Add PS1 uniforms
          for (const key in uniforms) {
            shader.uniforms[key] = (uniforms as any)[key];
          }

          shader.vertexShader = ps1VertexShader;
          shader.fragmentShader = ps1FragmentShader;

          // Keeping a list of shaders so we can update the materials
          shaders.push(shader);
        };
      }
    });

    gltf.animations[0].tracks[0].setInterpolation(InterpolateDiscrete);
    mixer = new AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });
  }, undefined, function (error) {
    console.error(error);
  });
  
  pivot.add(camera);

  const spotty = new SpotLight(0xff00ff, 5);
  spotty.position.z = 3;
  spotty.position.y = 1;
  pivot.add(spotty);


  renderer.setAnimationLoop(animate);
  const clock = new Clock();

  function animate() {
    const tick = 1/animationSettings.framerate;
    const delta = clock.getElapsedTime() * animationSettings.playbackSpeed;
    if (delta > tick && animationSettings.enablePlayback) {
      if (mixer) mixer.update(delta);
      clock.start();
    }
    
    renderer.render(scene, camera);

    if (animationSettings.enableRotation) {
      pivot.rotation.y += 0.005 * animationSettings.rotationSpeed;
    }
  }
  
  const light = new DirectionalLight(0xffffff, 3);
  light.position.set(0, 10, 10);
  scene.add(light);
}

//TODO: need to find a better way to add multiple canvases when reloading during dev
var loaded = false;

// PROPS
//todo: create types for these props
const animationSettings = reactive({
  framerate: 24,
  playbackSpeed: 1,
  enablePlayback: true,
  rotationSpeed: 0.5,
  enableRotation: true
});

let shaders: any[] = [];
function onUniformsChanged(newUniforms: any) {
  for (const shader of shaders) {
    for (const key in newUniforms) {
      if (shader.uniforms[key]) {
        shader.uniforms[key].value = newUniforms[key].value;
      }
    }
  }
}

const uniforms = reactive({
  uEnableVertexSnap: { value: true },
  uVertexSnap: { value: 0.01 },
  uColorDepth: { value: 20.0 },
  uDithering: { value: 0 },
  uAffineIntensity: { value: 1 },
  uPixelation: { value: 256 },
});

</script>

<template>
  <div class="flex flex-col h-full justify-end">
    <p class="split">"Loading . . ."</p>
    <div class="w-full p-5 flex flex-row justify-between">
      <ShaderSlider :uniforms="uniforms" @updateUniforms="onUniformsChanged"/>
      <InputPanel>
        <AnimationSlider :settings="animationSettings"/>
      </InputPanel>
    </div> 
  </div>
  <div id="canvas-container"></div>
</template>

<style scoped>

:deep(char) {
  outline: 3px dashed;
  outline-color: white;
  border-radius: 10px;
}

.split {
  visibility: hidden;
  color: #FF4032;
  font-size: 4rem;
}

.container {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

/* Full viewport canavs and place it behind UI */
#canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}
#canvas-container canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
