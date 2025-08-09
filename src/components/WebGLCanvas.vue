<template>
  <div class="scrollTarget"></div>

  <div id="canvas-container"></div>
  <ShaderSlider
    v-show="loadedRef"
    :uniforms="uniforms"
    @update-uniforms="will.onUniformsChanged"
  />
  <LoadingText></LoadingText>
  <!-- <InputPanel>
    <AnimationSlider :settings="animationSettings"/>
  </InputPanel> -->
</template>

<script setup lang="ts">
// import { SpinningCamera } from "@/scene/SpinningCamera";
import ShaderSlider from "./ShaderSlider.vue";
import LoadingText from "./LoadingText.vue";
import { Will } from "@/scene/Will";
import { AnimationLoop } from "@/util/AnimationLoop";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { SideWalk } from "@/scene/SideWalk";
import { RigCamera } from "@/scene/RigCamera";
import gsap from "gsap";

// const spinningCamera = new SpinningCamera();

const will = new Will();
const loadedRef = ref(() => will.loaded);
const uniforms = reactive(will.uniforms);

const rig = new RigCamera();

rig.lookAtTarget = () => will.root?.scene;

const dummy = { t: 0 }; // t will go from 0 to cameraPositions.length - 1
onMounted(() => {
  console.log("Refreshed");
  const container = document.getElementById("canvas-container");
  container?.appendChild(AnimationLoop.Renderer.domElement);

  container?.appendChild(AnimationLoop.CssRenderer.domElement);
  container?.appendChild(AnimationLoop.Css2dRenderer.domElement);
  // AnimationLoop.Subscribe(spinningCamera);
  AnimationLoop.Subscribe(rig);
  AnimationLoop.Subscribe(will);
  AnimationLoop.Subscribe(new SideWalk());
  AnimationLoop.Start();

  const c = document.querySelector(".scrollTarget");

  const count = rig.dummyPoints.length;
  gsap.to(dummy, {
    t: count,
    scrollTrigger: {
      trigger: ".scrollTarget",
      start: "top top",
      end: "bottom 100%",
      scrub: true,
    },
    onUpdate: () => {
      const index = Math.floor(dummy.t) % count;
      const nextIndex = (index + 1) % count;
      const alpha = (dummy.t % count) - index;

      if (nextIndex == 1 && dummy.t > nextIndex && c) {
        window.scrollTo(0, 0);
        // index = 0;
        // nextIndex = 0;
        return;
      }

      // Interpolate between current and next camera position
      rig.cameraMount.position.lerpVectors(
        rig.dummyPoints[index].position,
        rig.dummyPoints[nextIndex].position,
        alpha
      );
    },
  });
});

onUnmounted(() => {
  console.log("cleaning up.");
  AnimationLoop.Stop();
  console.log("Squeaky clean.");
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
  pointer-events: none;
}
#canvas-container canvas {
  width: 100%;
  height: 100%;
  display: block;
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
