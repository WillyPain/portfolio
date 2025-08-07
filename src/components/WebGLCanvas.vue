<template>
  
  <div id="canvas-container"></div>
  <div>{{ will.loaded }}</div>

  <ShaderSlider v-show="loadedRef"
    :uniforms="uniforms" 
    @updateUniforms="will.onUniformsChanged"/>
  <!-- <InputPanel>
    <AnimationSlider :settings="animationSettings"/>
  </InputPanel> -->
</template>

<style>
/* Full viewport canavs and place it behind UI */
#canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
}
#canvas-container canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

<script setup lang="ts">
import { SpinningCamera } from '@/scene/SpinningCamera';
import ShaderSlider from './ShaderSlider.vue';
import { Will } from '@/scene/Will';
import { AnimationLoop } from '@/util/AnimationLoop';
import { onMounted, onUnmounted, reactive, ref } from 'vue';

const spinningCamera = new SpinningCamera();

const will = new Will();
const loadedRef = ref(() => will.loaded);
const uniforms = reactive(will.uniforms);

onMounted(() => {
  console.log("Refreshed");
  const container = document.getElementById('canvas-container');
  container?.appendChild(AnimationLoop.Renderer.domElement);

  AnimationLoop.Subscribe(spinningCamera);
  AnimationLoop.Subscribe(will);
  AnimationLoop.Start();
});

onUnmounted(() => {
  console.log("cleaning up.");
  AnimationLoop.Stop();
  console.log("Squeaky clean.");
});

</script>