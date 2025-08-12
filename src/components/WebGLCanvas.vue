<template>
  <div class="scrollTarget"></div>

  <div id="canvas-container"></div>
  <div class="flex flex-row-reverse">
    <ShaderSlider
      v-show="loadedRef"
      id="shader-controls"
      :uniforms="uniforms"
      @update-uniforms="will.onUniformsChanged"
    />
  </div>

  <LoadingText></LoadingText>
</template>

<script setup lang="ts">
import ShaderSlider from "./ShaderSlider.vue";
import LoadingText from "./LoadingText.vue";
import { Will } from "@/scene/Will";
import { AnimationLoop } from "@/util/AnimationLoop";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { SideWalk } from "@/scene/SideWalk";
import { RigCamera } from "@/scene/RigCamera";
import gsap from "gsap";
import pcUrl from "@/assets/models/pc.glb?url";
import { Glb } from "@/scene/Glb";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { VirtualCanvas } from "@/scene/VirtualCanvas";
import { Euler } from "three";
import SplitText from "gsap/SplitText";

const pcX = 2,
  pcY = 0.2,
  pcZ = -3,
  pcRY = 2.3;

// Load in pc
const pc = new Glb(pcUrl, pcX, pcY, pcZ);
pc.root.rotateY(pcRY);

const will = new Will();
const loadedRef = ref(() => will.loaded);
const uniforms = reactive(will.uniforms);

const rig = new RigCamera();

// thank u gpt
const letterToSpecialChars: Map<string, string[]> = new Map([
  ["A", ["@", "4", "▲", "∆", "α", "Å", "λ"]],
  ["B", ["8", "3", "ß", "Þ", "β"]],
  ["C", ["(", "©", "¢", "<", "Ƈ", "Ç"]],
  ["D", ["Ð", "∂", "Ɗ"]],
  ["E", ["3", "€", "£", "Σ", "Ǝ"]],
  ["F", ["ƒ", "ϝ"]],
  ["G", ["6", "9", "&", "ɢ"]],
  ["H", ["#", "ħ", "ɦ"]],
  ["I", ["!", "1", "|", "l", "ɩ"]],
  ["J", ["_|", "¿", "ʝ"]],
  ["K", ["|<", "|{", "κ", "к"]],
  ["L", ["1", "|_", "£", "∟"]],
  ["M", ["/\\/\\", "/V", "^^", "ɱ"]],
  ["N", ["ɲ"]],
  ["O", ["0", "°", "ø", "@", "."]],
  ["P", ["|*", "|>", "ρ", "þ", "ϱ"]],
  ["Q", ["0,", "9", "(,)", "ʠ"]],
  ["R", ["®", "ʀ", "-"]],
  ["S", ["$", "5", "§", "ś", "š"]],
  ["T", ["7", "+", "†", "‡"]],
  ["U", ["µ", "ʉ"]],
  ["V", ["ʋ", "@", "^"]],
  ["W", ["v", "ɯ"]],
  ["X", ["×", "ẋ", "χ"]],
  ["Y", ["`", "¥", "ɏ"]],
  ["Z", ["2", "7", "≥", "ƶ"]],
]);

rig.lookAtTarget = () => will.root;

const dummy = { t: 0 }; // t will go from 0 to cameraPositions.length - 1
onMounted(() => {
  console.log("Refreshed");
  const container = document.getElementById("canvas-container");
  container?.appendChild(AnimationLoop.Renderer.domElement);

  const stats = new Stats();
  document.body.appendChild(stats.dom);

  container?.appendChild(AnimationLoop.CssRenderer.domElement);
  container?.appendChild(AnimationLoop.Css2dRenderer.domElement);

  // shader control animations
  gsap.from("#shader-controls", {
    y: -100,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scrollTarget",
      start: "top 1%",
      end: "top -5%",
      toggleActions: "play reverse play reverse",
    },
  });

  const inputs =
    document.querySelectorAll<HTMLInputElement>(".input-panel input");
  inputs.forEach((i) => {
    gsap.fromTo(
      i,
      {
        value: 0,
        opacity: 0,
      },
      {
        value: i.value,
        opacity: 1,
        duration: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".scrollTarget",
          start: "top 1%",
          end: "top -5%",
          toggleActions: "play reverse play reverse",
        },
        stagger: {
          from: "random",
        },
      }
    );
  });

  // virtual canvas
  const vcanvas = new VirtualCanvas(
    AnimationLoop.MiniRenderer.domElement,
    pcX,
    pcY,
    pcZ,
    new Euler(0, pcRY, 0),
    0.001
  );

  // AnimationLoop.Subscribe(spinningCamera);
  AnimationLoop.Subscribe({
    update: () => stats.update(),
    init: () => null,
    cleanup: () => null,
  });
  AnimationLoop.Subscribe(vcanvas);
  AnimationLoop.Subscribe(pc);
  AnimationLoop.Subscribe(rig);
  AnimationLoop.Subscribe(will);
  AnimationLoop.Subscribe(new SideWalk());
  AnimationLoop.Start();

  setTimeout(() => {
    const split = SplitText.create(".ocr", {
      type: "chars",
      charsClassClass: "char",
    });

    const getRandomLetter = (c: string): string => {
      const char = c.toUpperCase();
      const substituteLetters = letterToSpecialChars.get(char);
      if (substituteLetters) {
        const r = Math.floor(Math.random() * substituteLetters.length);
        return substituteLetters[r];
      }
      return "#";
    };

    split.chars.forEach((c) => {
      const character = c.textContent;
      const scrambleEffect = () => {
        if (!gsap.isTweening(c)) {
          gsap.from(c, {
            overwrite: true,
            duration: 1,
            scrambleText: {
              text: getRandomLetter(character ?? "A"),
              speed: 3,
              chars: "upperAndLowerCase",
            },
          });
        }
      };

      c.addEventListener("mouseenter", scrambleEffect);
    });
  }, 1000);

  const count = rig.dummyPoints.length;
  const tween = gsap.to(dummy, {
    t: count,
    scrollTrigger: {
      trigger: ".scrollTarget",
      start: "top top",
      end: "bottom 100%",
      scrub: 5,
    },
    onUpdate: () => {
      const index = Math.floor(dummy.t) % count;
      const nextIndex = (index + 1) % count;
      const alpha = (dummy.t % count) - index;

      if (alpha > 0.9999 && nextIndex == 0) {
        // This is some forbidden magic but it somehow works
        // Sets scroll back to top of container
        tween.pause(0);
        if (window) {
          window.scrollTo(0, 0);
        }

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
