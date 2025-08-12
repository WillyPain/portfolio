<template>
  <div id="canvas-container"></div>

  <div class="flex flex-row-reverse">
    <div>
      <scramble-text-label :text="`Welcome to my meme page.`" />
      <scramble-text-label :text="`mandi yuk`" />
      <ShaderSlider
        v-show="loadedRef"
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
import { Will } from "@/scene/Will";
import { AnimationLoop } from "@/util/AnimationLoop";
import { onMounted, onUnmounted, reactive, ref } from "vue";

const spinningCamera = new SpinningCamera();

const will = new Will();
const loadedRef = ref(() => will.loaded);
const uniforms = reactive(will.uniforms);

onMounted(() => {
  const container = document.getElementById("canvas-container");
  container?.appendChild(AnimationLoop.Css3dRenderer.domElement);
  container?.appendChild(AnimationLoop.Renderer.domElement);
  container?.appendChild(AnimationLoop.Css2dRenderer.domElement);

  AnimationLoop.Subscribe(spinningCamera);
  AnimationLoop.Subscribe(will);
  AnimationLoop.Start();
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
