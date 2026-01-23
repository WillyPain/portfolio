<template>
  <div id="planet_hopper_screen" class="text-yellow-300" width="1000px">
    <game-player-component
      v-if="animationLoopRunning"
      iframe-url="/planet_hopper/index.html"
      screen-id="planet_hopper_screen"
    ></game-player-component>
  </div>
  <div id="patty_whack_screen" class="text-yellow-300" width="1000px">
    <game-player-component
      v-if="animationLoopRunning"
      iframe-url="/patty_whack/index.html"
      screen-id="patty_whack_screen"
    ></game-player-component>
  </div>
  <div id="computer_screen">
    <monitor-page v-if="animationLoopRunning"></monitor-page>
  </div>
  <div id="spotify-iframe">
    <iframe
      data-testid="embed-iframe"
      style="border-radius: 12px"
      src="https://open.spotify.com/embed/album/0WaAcd3t5hKurXiQ3IqmhT?utm_source=generator"
      width="100%"
      height="100"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  </div>

  <div class="scrollTarget"></div>
  <div id="css3d"></div>
  <div id="webgl"></div>
  <div class="flex flex-row justify-center">
    <div class="relative terminal-panel flex flex-col text-center">
      <scramble-text-label
        :text="`****************`"
        color="white"
        size="3.5rem"
      />
      <scramble-text-label
        :text="`* WILL'S WORLD *`"
        color="yellow"
        size="3.5rem"
      />
      <scramble-text-label
        :text="`****************`"
        color="white"
        size="3.5rem"
      />
    </div>
  </div>
  <div ref="carouselStuff">
    <p id="apple">😼</p>
    <p>🔥</p>
    <p>👄</p>
    <p>💦</p>
    <p>😼</p>
    <p>🔥</p>
    <p>👄</p>
    <p>💦</p>
  </div>

  <overlay-buttons
    :dispose="disposeScene"
    :reload="setupScene"
  ></overlay-buttons>
</template>

<script setup lang="ts">
import MonitorPage from "./MonitorPage.vue";
import ScrambleTextLabel from "./ScrambleTextLabel.vue";
import { AnimationLoop } from "@/util/AnimationLoop";
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import {
  Ps1ShaderUniforms,
  ResourceUrls,
  TestSceneResources,
} from "@/definitions";
import { Ps1Glb } from "@/scene/Ps1Glb";
import gsap from "gsap";
import Stats from "three/examples/jsm/libs/stats.module.js";
import OverlayButtons from "./OverlayButtons.vue";
import { CameraTrack } from "@/scene/FollowCurve";
import { Skater } from "@/scene/Skater";
import { Boombox } from "@/scene/Boombox";
import GamePlayerComponent from "./GamePlayerComponent.vue";
import { CameraController } from "@/util/CameraController";
import { SceneTracker } from "@/util/SceneTracker";
import { PointLight } from "three";
import { PlaneToDecalConverter } from "@/scene/PlaneToDecalConverter";

const animationLoopRunning = AnimationLoop.Running;
const carouselStuff = ref<HTMLDivElement | null>(null);
const followCurve = new CameraTrack();
const boombox = new Boombox();
const will = new Ps1Glb(TestSceneResources[0].url);
const crib = new Ps1Glb(ResourceUrls.crib);
const sk8r = new Skater();

const cribUniforms = reactive(crib.uniforms);
const uniforms = reactive(will.uniforms);

followCurve.lookAtTarget = () => sk8r.cat.root?.scene;
const dummy = { t: 0 };
const ps1UniformDummy = { t: 0 };

onMounted(() => {
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  AnimationLoop.Subscribe({
    update: () => stats.update(),
    init: () => null,
  });

  document.addEventListener("mousemove", (e) => {
    gsap.to(uniforms.uMousePosition.value, {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  setupScene();
});

function setupScene() {
  nextTick(() => {
    document
      .getElementById("css2d")
      ?.appendChild(AnimationLoop.Css2dRenderer.domElement);
    document
      .getElementById("css3d")
      ?.appendChild(AnimationLoop.Css3dRenderer.domElement);
    document
      .getElementById("webgl")
      ?.appendChild(AnimationLoop.Renderer.domElement);

    AnimationLoop.Subscribe(CameraController.Instanace);
    AnimationLoop.Subscribe(followCurve);
    AnimationLoop.Subscribe(crib);
    AnimationLoop.Subscribe(sk8r);
    AnimationLoop.Subscribe(will);
    AnimationLoop.Subscribe(boombox);
    AnimationLoop.Subscribe(new PlaneToDecalConverter());
    AnimationLoop.Start();

    const rocket = SceneTracker.Find("Rocket")?.[0];
    const rocketLight = new PointLight(0xffffff, 1);
    rocketLight.position.setZ(4);
    rocket?.add(rocketLight);

    sk8r.cat.root?.scene.scale.multiplyScalar(2);
    sk8r.cat.root!.scene.position.z += 1;

    setupCameraMoveOnScroll();

    cribUniforms.uVertexSnap.value = 0.2;
    cribUniforms.uColorDepth.value = 1;
    cribUniforms.uPixelation.value = 1;
    const refUniforms = new Ps1ShaderUniforms();
    gsap.fromTo(
      ps1UniformDummy,
      { t: 0.1 },
      {
        t: 1,
        duration: 1.5,
        delay: 0.5,
        ease: "power2.in",
        onUpdate() {
          cribUniforms.uColorDepth.value = Math.min(
            refUniforms.uColorDepth.value * ps1UniformDummy.t,
            refUniforms.uColorDepth.value
          );
          cribUniforms.uPixelation.value = Math.min(
            refUniforms.uPixelation.value * ps1UniformDummy.t,
            refUniforms.uPixelation.value
          );
        },
      }
    );
    gsap.fromTo(
      ps1UniformDummy,
      { t: 1 },
      {
        t: 0,
        duration: 2,
        delay: 0.5,
        ease: "expo.in",
        onUpdate() {
          cribUniforms.uVertexSnap.value = Math.max(
            ps1UniformDummy.t,
            refUniforms.uVertexSnap.value
          );
          cribUniforms.uDithering.value = Math.max(
            ps1UniformDummy.t,
            refUniforms.uDithering.value
          );
        },
      }
    );
  });
}

function setupCameraMoveOnScroll() {
  gsap.to(dummy, {
    t: 1,
    scrollTrigger: {
      trigger: ".scrollTarget",
      start: "top top",
      end: "bottom 100%",
      scrub: 1,
    },
    onUpdate: () => {
      if (!followCurve.loaded) return;
      followCurve.position = dummy.t;
    },
  });
}

onUnmounted(() => {
  disposeScene();
});

function disposeScene() {
  AnimationLoop.Stop();
}
</script>

<style>
/* Full viewport canavs and place it behind UI */
#webgl,
#css3d,
#css2d {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#webgl canvas {
  width: 100%;
  height: 100%;
  display: block;
}

#webgl {
  pointer-events: none;
}

.terminal-panel {
  background-color: #0240ff;
  border: 0.5em solid #aaa;
  box-shadow:
    0 0 0px 8px blue,
    inset 0px 0px 0px 0px blue;
}

.colly {
  background-color: #0240ff;
}

.scrollTarget {
  position: absolute;
  height: 1000vh;
  width: 100px;
  top: 0;
  z-index: 0;
  scrollbar-width: none;
  overflow-y: scroll;
}
</style>
