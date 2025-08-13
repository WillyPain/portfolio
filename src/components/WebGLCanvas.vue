<template>
  <div id="canvas-container"></div>
  <div v-show="loaded" class="flex flex-row-reverse">
    <div class="relative">
      <scramble-text-label :text="`Welcome to my meme page.`" />
      <scramble-text-label :text="`mandi yuk`" />
      <ShaderSlider
        :uniforms="uniforms"
        @update-uniforms="will.onUniformsChanged"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ScrambleTextLabel from "./ScrambleTextLabel.vue";
import { SpinningCamera } from "@/scene/SpinningCamera";
import ShaderSlider from "./ShaderSlider.vue";
import { AnimationLoop } from "@/util/AnimationLoop";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { ResourceLoader } from "@/util/ResourceLoader";
import { TestSceneResources } from "@/definitions";
import { AnimatedGlb } from "@/scene/AnimatedGlb";
import gsap from "gsap";

const spinningCamera = new SpinningCamera();
const will = new AnimatedGlb(TestSceneResources[0]);
const uniforms = reactive(will.uniforms);

let downloadCount = 0;
const loaded = ref(false);
ResourceLoader.Instance.Enqueue(
  0,
  () => {
    downloadCount++;

    if (downloadCount == TestSceneResources.length) {
      loaded.value = true;
      const container = document.getElementById("canvas-container");
      container?.appendChild(AnimationLoop.Css3dRenderer.domElement);
      container?.appendChild(AnimationLoop.Renderer.domElement);
      container?.appendChild(AnimationLoop.Css2dRenderer.domElement);
      AnimationLoop.Subscribe(spinningCamera);
      AnimationLoop.Subscribe(will);
      AnimationLoop.Start();
    }
  },
  ...TestSceneResources
);
ResourceLoader.Instance.LoadResources();

onMounted(() => {
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
</style>
