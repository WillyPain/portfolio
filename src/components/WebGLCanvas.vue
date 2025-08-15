<template>
  <div id="canvas-container"></div>
  <div v-show="loaded" class="flex flex-row">
    <div cl ass="relative terminal-panel">
      <scramble-text-label :text="`************`" color="white" />
      <scramble-text-label :text="`*WILL WORLD*`" color="yellow" />
      <scramble-text-label :text="`************`" color="white" />
      <scramble-text-label
        :text="`IF YOU HAVE A KIND SOUL PLEASE:`"
        color="#0240ff"
      />
      <ul class="pl-1 bg-black">
        <li>1. Follow rules</li>
        <li>1. Donate to needy</li>
        <li>1. Help angels</li>
        <li>1. Pass the knowledge.</li>
      </ul>
    </div>
  </div>
  <div class="fixed top-0 left-0 w-screen h-screen -z-10 p-0 m-0">
    <div class="flex flex-row">
      <div ref="col1" class="w-[200px] flex-shrink-0 text-left colly">
        <div v-for="n in 2" :key="'c1-' + n">
          <p v-for="i in 50" :key="'t1-' + i">Column 1 — Line {{ i }}</p>
        </div>
      </div>
      <div
        ref="col2"
        class="w-[200px] -ml-8 -mr-8 flex-shrink-0 text-left colly"
      >
        <div v-for="n in 2" :key="'c1-' + n">
          <p v-for="i in 50" :key="'t1-' + i">
            C:> Who doesnt love soup? {{ i }}
          </p>
        </div>
      </div>
      <div ref="col3" class="w-[200px] flex-shrink-0 text-left colly">
        <div v-for="n in 2" :key="'c1-' + n">
          <p v-for="i in 50" :key="'t1-' + i">Column 1 — Line {{ i }}</p>
        </div>
      </div>
    </div>
  </div>
  <div ref="carouselStuff">
    <scramble-text-label :text="`MUSIC`" color="white"></scramble-text-label>
    <scramble-text-label :text="`ART`" color="white"></scramble-text-label>
    <scramble-text-label :text="`LOVE`" color="white"></scramble-text-label>
    <scramble-text-label :text="`FOOD`" color="white"></scramble-text-label>
    <scramble-text-label :text="`ANGEL`" color="white"></scramble-text-label>
    <scramble-text-label :text="`GAME`" color="white"></scramble-text-label>
    <scramble-text-label :text="`CODE`" color="white"></scramble-text-label>
    <scramble-text-label :text="`DONATE`" color="white"></scramble-text-label>
    <scramble-text-label :text="`SING`" color="white"></scramble-text-label>
    <scramble-text-label :text="`LAUGH`" color="white"></scramble-text-label>
    <scramble-text-label :text="`ANIMALS`" color="white"></scramble-text-label>
    <scramble-text-label :text="`DANGER`" color="white"></scramble-text-label>
    <scramble-text-label :text="`FAMILY`" color="white"></scramble-text-label>
  </div>
  <overlay-buttons></overlay-buttons>
</template>

<script setup lang="ts">
import ScrambleTextLabel from "./ScrambleTextLabel.vue";
import { SpinningCamera } from "@/scene/SpinningCamera";
import { AnimationLoop } from "@/util/AnimationLoop";
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { ResourceLoader } from "@/util/ResourceLoader";
import { TestSceneResources } from "@/definitions";
import { AnimatedGlb } from "@/scene/AnimatedGlb";
import gsap from "gsap";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Carousel } from "@/scene/Carousel";
import OverlayButtons from "./OverlayButtons.vue";

const carouselStuff = ref<HTMLDivElement | null>(null);
const spinningCamera = new SpinningCamera();
spinningCamera.settings.enableRotation = false;
const will = new AnimatedGlb(TestSceneResources[0]);
const uniforms = reactive(will.uniforms);
let downloadCount = 0;
const loaded = ref(false);

ResourceLoader.Instance.Enqueue(
  0,
  () => {
    downloadCount++;
    if (downloadCount == TestSceneResources.length) {
      nextTick(() => {
        const children = Array.from(
          carouselStuff.value!.children
        ) as HTMLElement[];
        console.log(children);
        const carousel = new Carousel(children, 1.5, 0.5);
        loaded.value = true;
        const container = document.getElementById("canvas-container");
        container?.appendChild(AnimationLoop.Css3dRenderer.domElement);
        container?.appendChild(AnimationLoop.Renderer.domElement);
        container?.appendChild(AnimationLoop.Css2dRenderer.domElement);
        AnimationLoop.Subscribe(spinningCamera);
        AnimationLoop.Subscribe(will);
        AnimationLoop.Subscribe(carousel);
        AnimationLoop.Start();
      });
    }
  },
  ...TestSceneResources
);
ResourceLoader.Instance.LoadResources();

const col1 = ref<HTMLDivElement | null>(null);
const col2 = ref<HTMLDivElement | null>(null);
const col3 = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  AnimationLoop.Subscribe({
    update: () => stats.update(),
    init: () => null,
    cleanup: () => null,
  });

  function loopColumn(el: HTMLDivElement, speed: number) {
    const height = el.scrollHeight / 2;
    const start = speed > 0 ? 0 : -height;
    const end = speed > 0 ? -height : 0;
    gsap.fromTo(
      el,
      { y: start },
      {
        y: end,
        duration: height / Math.abs(speed),
        ease: "none",
        repeat: -1,
      }
    );
  }
  loopColumn(col1.value!, 100);
  loopColumn(col2.value!, -50);
  loopColumn(col3.value!, 50);

  document.addEventListener("mousemove", (e) => {
    gsap.to(uniforms.uMousePosition.value, {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });
});

onUnmounted(() => {
  AnimationLoop.Stop();
});
</script>

<style>
/* Full viewport canavs and place it behind UI */
#canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#canvas-container canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.terminal-panel {
  background-color: #0240ff;
  padding: 10rem;
  /* border: 0.5em solid #aaa; */
  /* box-shadow:
    0 0 0px 8px blue,
    inset 0px 0px 0px 0px blue; */
}

.colly {
  background-color: #0240ff;
}
</style>
