<template>
  <div class="scrollTarget"></div>
  <div id="css2d"></div>
  <div id="css3d"></div>
  <div id="webgl"></div>
  <div v-show="loaded" class="flex flex-row justify-center">
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
    <!-- carousel stuff goes here -->
  </div>
  <div ref="monitor" class="p-0 m-0">
    <monitor-page></monitor-page>
  </div>

  <overlay-buttons></overlay-buttons>
</template>

<script setup lang="ts">
import ScrambleTextLabel from "./ScrambleTextLabel.vue";
import MonitorPage from "./MonitorPage.vue";
import { AnimationLoop } from "@/util/AnimationLoop";
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { ResourceLoader } from "@/util/ResourceLoader";
import { TestSceneResources } from "@/definitions";
import { Ps1Glb } from "@/scene/Ps1Glb";
import gsap from "gsap";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Css2dCarousel } from "@/scene/Css2dCarousel";
import OverlayButtons from "./OverlayButtons.vue";
import { FollowCurve } from "@/scene/FollowCurve";
import { AmbientLight, Euler, MathUtils } from "three";
import { VirtualCanvas } from "@/scene/VirtualCanvas";
import { Monitor } from "@/scene/Monitor";

const monitor = ref<HTMLElement | null>(null);
const carouselStuff = ref<HTMLDivElement | null>(null);
const followCurve = new FollowCurve();
const will = new Ps1Glb(TestSceneResources[0].url);
const pc = new Ps1Glb(TestSceneResources[1].url);
const uniforms = reactive(will.uniforms);
let downloadCount = 0;
const loaded = ref(false);

followCurve.lookAtTarget = () => pc.root?.scene.children[0];
const dummy = { t: 0 };

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
        const carouselSize = 8;
        const carouselSpeed = 0.5;
        const carousel = new Css2dCarousel(
          children,
          carouselSize,
          carouselSpeed
        );
        loaded.value = true;

        document
          .getElementById("css2d")
          ?.appendChild(AnimationLoop.Renderer.domElement);
        document
          .getElementById("css3d")
          ?.appendChild(AnimationLoop.Css3dRenderer.domElement);
        document
          .getElementById("webgl")
          ?.appendChild(AnimationLoop.Renderer.domElement);

        const virtualPage = new VirtualCanvas(
          monitor.value!,
          0,
          0.3,
          -0.9,
          new Euler(0, 180 * MathUtils.DEG2RAD, 0),
          0.001
        );

        AnimationLoop.Subscribe(followCurve);
        AnimationLoop.Subscribe(will);
        AnimationLoop.Subscribe(pc);
        AnimationLoop.Instance.scene.add(new AmbientLight(0xffffff, 8));
        AnimationLoop.Subscribe(carousel);
        AnimationLoop.Subscribe(virtualPage);
        AnimationLoop.Subscribe(new Monitor());
        AnimationLoop.Start();

        // shuffle me boys
        pc.root?.scene.rotateY(180 * MathUtils.DEG2RAD);
        pc.root?.scene.scale.addScalar(4);

        pc.root!.scene.position.y -= 1.55;

        will.root!.scene.scale.addScalar(4);
        will.root!.scene.position.y -= 5.1;
        will.root!.scene.position.z -= 4.8;
        setupCameraMoveOnScroll();
      });
    }
  },
  ...TestSceneResources
);
ResourceLoader.Instance.LoadResources();

onMounted(() => {
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  AnimationLoop.Subscribe({
    update: () => stats.update(),
    init: () => null,
    cleanup: () => null,
  });

  document.addEventListener("mousemove", (e) => {
    gsap.to(uniforms.uMousePosition.value, {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });
});

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
  AnimationLoop.Stop();
});
</script>

<style>
/* Full viewport canavs and place it behind UI */
#webgl,
#css3d {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#webgl canvas,
#css3d canvas {
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
